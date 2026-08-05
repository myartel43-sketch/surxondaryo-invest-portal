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

function instructions(task: Task, language: string) {
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

  const taskInstructions: Record<Task, string> = {
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

  return [...base, taskInstructions[task]].join("\n");
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

function extractOutput(data: any): string {
  if (typeof data?.output_text === "string") {
    return data.output_text;
  }

  const parts: string[] = [];

  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (
        content?.type === "output_text" &&
        typeof content?.text === "string"
      ) {
        parts.push(content.text);
      }
    }
  }

  return parts.join("\n").trim();
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    const authorization =
      request.headers.get("Authorization") ?? "";

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey =
      Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const openaiKey =
      Deno.env.get("OPENAI_API_KEY") ?? "";
    const model =
      Deno.env.get("OPENAI_MODEL") ?? "gpt-5";

    if (
      !authorization.startsWith("Bearer ") ||
      !supabaseUrl ||
      !anonKey
    ) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const valid = await verifyUser(
      authorization,
      supabaseUrl,
      anonKey,
    );

    if (!valid) {
      return new Response(
        JSON.stringify({
          error: "Сессия администратора недействительна.",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (!openaiKey) {
      return new Response(
        JSON.stringify({
          error:
            "OPENAI_API_KEY не добавлен в Supabase Secrets.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const body = await request.json();
    const task = (
      ["chat", "news", "project", "translate", "improve"]
        .includes(body?.task)
        ? body.task
        : "chat"
    ) as Task;
    const language =
      typeof body?.language === "string"
        ? body.language
        : "uz";
    const input =
      typeof body?.input === "string"
        ? body.input.trim()
        : "";

    if (!input || input.length > 30000) {
      return new Response(
        JSON.stringify({
          error:
            "Матн бўш ёки рухсат этилган ҳажмдан катта.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          store: false,
          instructions: instructions(task, language),
          input,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error", data);
      return new Response(
        JSON.stringify({
          error:
            data?.error?.message ??
            "AI хизматида хато юз берди.",
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        output: extractOutput(data),
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
