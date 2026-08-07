const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Task =
  | "chat"
  | "news"
  | "project"
  | "translate"
  | "improve";

const LANGUAGE_NAMES: Record<string, string> = {
  uz: "Uzbek in Cyrillic script",
  uzl: "Uzbek in Latin script",
  ru: "Russian",
  en: "English",
  zh: "Simplified Chinese",
  all: "five versions: Uzbek Cyrillic, Uzbek Latin, Russian, English, and Simplified Chinese",
};

function instructions(
  task: Task,
  language: string,
) {
  const target =
    LANGUAGE_NAMES[language] ??
    LANGUAGE_NAMES.uz;

  const base = [
    "You are an assistant inside the official administration panel of the Surxondaryo regional investment, industry and trade authority.",
    "Write accurately, professionally and in a formal government communication style.",
    "Never invent dates, statistics, names, agreements or legal claims.",
    "When the user's information is incomplete, preserve placeholders in square brackets instead of fabricating facts.",
    `Return the result in ${target}.`,
  ];

  const taskInstructions: Record<
    Task,
    string
  > = {
    chat:
      "Answer the administrator's question clearly and practically. Use short sections when useful.",
    news:
      "Prepare a publication-ready official news item. Include a headline, short lead, main body, and a short social media version. Do not invent facts.",
    project:
      "Prepare a structured investment project description with project name, objective, products/services, location, investment value placeholder when missing, jobs placeholder when missing, infrastructure, market potential, investor offer, and implementation status.",
    translate:
      "Translate the supplied content faithfully. Preserve figures, names, URLs, formatting, and official terminology. When all languages are requested, label every language section.",
    improve:
      "Correct grammar, spelling, clarity and official tone without changing facts or adding unsupported claims. Return the improved text and a brief list of important corrections.",
  };

  return [
    ...base,
    taskInstructions[task],
  ].join("\n");
}

async function verifyUser(
  authorization: string,
  supabaseUrl: string,
  anonKey: string,
) {
  const response = await fetch(
    `${supabaseUrl}/auth/v1/user`,
    {
      headers: {
        Authorization: authorization,
        apikey: anonKey,
      },
    },
  );

  return response.ok;
}

function extractText(data: any): string {
  const content =
    data?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part: any) =>
        typeof part?.text === "string"
          ? part.text
          : "",
      )
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  return "";
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      405,
    );
  }

  try {
    const authorization =
      request.headers.get(
        "Authorization",
      ) ?? "";

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL") ??
      "";

    const anonKey =
      Deno.env.get("SUPABASE_ANON_KEY") ??
      "";

    const apiKey =
      Deno.env.get(
        "OPENROUTER_API_KEY",
      ) ?? "";

    const model =
      Deno.env.get(
        "OPENROUTER_MODEL",
      ) ?? "openrouter/free";

    if (
      !authorization.startsWith(
        "Bearer ",
      ) ||
      !supabaseUrl ||
      !anonKey
    ) {
      return json(
        { error: "Unauthorized" },
        401,
      );
    }

    const valid = await verifyUser(
      authorization,
      supabaseUrl,
      anonKey,
    );

    if (!valid) {
      return json(
        {
          error:
            "Сессия администратора недействительна.",
        },
        401,
      );
    }

    if (!apiKey) {
      return json(
        {
          error:
            "OPENROUTER_API_KEY не добавлен в Supabase Secrets.",
        },
        500,
      );
    }

    const body =
      await request.json();

    const task = (
      [
        "chat",
        "news",
        "project",
        "translate",
        "improve",
      ].includes(body?.task)
        ? body.task
        : "chat"
    ) as Task;

    const language =
      typeof body?.language ===
      "string"
        ? body.language
        : "uz";

    const input =
      typeof body?.input === "string"
        ? body.input.trim()
        : "";

    if (
      !input ||
      input.length > 30000
    ) {
      return json(
        {
          error:
            "Матн бўш ёки рухсат этилган ҳажмдан катта.",
        },
        400,
      );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${apiKey}`,
          "Content-Type":
            "application/json",
          "X-Title":
            "Surxondaryo Investment Portal Admin",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: instructions(
                task,
                language,
              ),
            },
            {
              role: "user",
              content: input,
            },
          ],
          temperature:
            task === "translate"
              ? 0.15
              : 0.35,
          max_tokens: 5000,
        }),
      },
    );

    const data =
      await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
      console.error(
        "OpenRouter admin-ai error",
        data,
      );

      return json(
        {
          error:
            data?.error?.message ??
            "AI хизматида хато юз берди.",
          code: response.status,
        },
        response.status,
      );
    }

    const output =
      extractText(data);

    if (!output) {
      return json(
        {
          error:
            "OpenRouter бўш жавоб қайтарди.",
        },
        502,
      );
    }

    return json({
      output,
      provider: "openrouter",
      model:
        data?.model ??
        model,
    });
  } catch (error) {
    console.error(error);

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Server error",
      },
      500,
    );
  }
});
