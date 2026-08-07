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
    const apiKey =
      Deno.env.get("OPENROUTER_API_KEY") ?? "";

    const model =
      Deno.env.get("OPENROUTER_MODEL") ??
      "openrouter/free";

    if (!apiKey) {
      return json(
        {
          error:
            "OPENROUTER_API_KEY is not configured in Supabase Edge Function Secrets.",
        },
        500,
      );
    }

    const body =
      await request.json().catch(() => ({}));

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
      return json(
        { error: "Question is empty." },
        400,
      );
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

    const systemPrompt = [
      "You are the public AI assistant of the official Surxondaryo regional investment portal of Uzbekistan.",
      "Answer visitors clearly, politely and concisely.",
      "Only answer questions related to Surxondaryo regional investment opportunities, investment projects, industry, foreign trade, exports, services for entrepreneurs, documents, contacts, land plots, maps, and information visible on the public portal.",
      "If a user asks for private, administrative, secret, credential, API key, password, database, or internal system information, refuse briefly.",
      "Do not invent officials, statistics, dates, legal requirements, project values, phone numbers, or addresses.",
      "If exact portal data is unavailable, say that the visitor should check the relevant portal section or contact the authority.",
      `Answer in ${target}.`,
    ].join("\n");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Title":
            "Surxondaryo Investment Portal",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.35,
          max_tokens: 1200,
        }),
      },
    );

    const data =
      await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error(
        "OpenRouter public-ai error",
        data,
      );

      return json(
        {
          error:
            data?.error?.message ??
            "OpenRouter AI service returned an error.",
          code: response.status,
        },
        response.status,
      );
    }

    const output = extractText(data);

    if (!output) {
      return json(
        {
          error:
            "OpenRouter returned an empty response.",
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
    console.error(
      "public-ai OpenRouter server error",
      error,
    );

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
