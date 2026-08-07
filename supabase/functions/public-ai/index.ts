const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LANGUAGE_NAMES: Record<string, string> = {
  uz: "Uzbek in Cyrillic script",
  uzl: "Uzbek in Latin script",
  ru: "Russian",
  en: "English",
  zh: "Simplified Chinese",
};

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
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const openaiKey =
      Deno.env.get("OPENAI_API_KEY") ?? "";
    const model =
      Deno.env.get("OPENAI_MODEL") ?? "gpt-5";

    if (!openaiKey) {
      return json(
        {
          error:
            "OPENAI_API_KEY is not configured in Supabase Edge Function Secrets.",
        },
        500,
      );
    }

    const body = await request.json().catch(() => ({}));

    const language =
      typeof body?.language === "string" &&
      LANGUAGE_NAMES[body.language]
        ? body.language
        : "uz";

    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : typeof body?.input === "string"
          ? body.input.trim()
          : "";

    if (!message) {
      return json({ error: "Question is empty." }, 400);
    }

    if (message.length > 4000) {
      return json(
        { error: "Question is too long." },
        400,
      );
    }

    const target =
      LANGUAGE_NAMES[language] ??
      LANGUAGE_NAMES.uz;

    const instructions = [
      "You are the public AI assistant of the official Surxondaryo regional investment portal of Uzbekistan.",
      "Answer visitors clearly, politely and concisely.",
      "Only answer questions related to Surxondaryo regional investment opportunities, investment projects, industry, foreign trade, exports, services for entrepreneurs, documents, contacts, land plots, maps, and information visible on the public portal.",
      "If a user asks for private, administrative, secret, credential, API key, password, database, or internal system information, refuse briefly.",
      "Do not claim to know current database records unless the user included them in the question.",
      "Do not invent officials, statistics, dates, legal requirements, project values, phone numbers, or addresses.",
      "If exact portal data is unavailable, say that the visitor should check the relevant portal section or contact the authority.",
      `Answer in ${target}.`,
    ].join("\n");

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
          instructions,
          input: message,
        }),
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("OpenAI public-ai error", data);

      return json(
        {
          error:
            data?.error?.message ??
            "AI service returned an error.",
          code: response.status,
        },
        response.status,
      );
    }

    const output = extractOutput(data);

    if (!output) {
      return json(
        { error: "AI returned an empty response." },
        502,
      );
    }

    return json({ output });
  } catch (error) {
    console.error("public-ai server error", error);

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
