import { FormEvent, useMemo, useState } from "react";
import {
  Bot,
  Loader2,
  Maximize2,
  MessageCircle,
  Minimize2,
  Send,
  X,
} from "lucide-react";
import { useI18n, transliterateUzbek } from "@/i18n";

const COPY = {
  title: {
    uz: "AI ёрдамчи",
    ru: "AI-помощник",
    en: "AI assistant",
    zh: "AI 助手",
  },
  subtitle: {
    uz: "Инвестиция, хизматлар ва ер майдонлари бўйича савол беринг",
    ru: "Задайте вопрос об инвестициях, услугах и земельных участках",
    en: "Ask about investments, services and land plots",
    zh: "咨询投资、服务和土地信息",
  },
  placeholder: {
    uz: "Саволингизни ёзинг...",
    ru: "Напишите ваш вопрос...",
    en: "Type your question...",
    zh: "请输入您的问题...",
  },
  welcome: {
    uz: "Ассалому алайкум! Сурхондарё вилоятининг инвестиция имкониятлари, лойиҳалари, хизматлари, ҳужжатлари ва ер майдонлари бўйича саволларингизга жавоб бераман.",
    ru: "Здравствуйте! Я отвечу на вопросы об инвестиционных возможностях, проектах, услугах, документах и земельных участках Сурхандарьинской области.",
    en: "Hello! I can answer questions about investment opportunities, projects, services, documents and land plots in Surkhandarya region.",
    zh: "您好！我可以回答有关苏尔汉河州投资机会、项目、服务、文件和土地的问题。",
  },
  error: {
    uz: "AI хизматига уланиб бўлмади.",
    ru: "Не удалось подключиться к AI-сервису.",
    en: "Could not connect to the AI service.",
    zh: "无法连接到 AI 服务。",
  },
  online: {
    uz: "Онлайн",
    ru: "Онлайн",
    en: "Online",
    zh: "在线",
  },
};

type Message = {
  role: "assistant" | "user";
  text: string;
};

function getConfig() {
  const url = (
    import.meta.env.VITE_SUPABASE_URL as
      | string
      | undefined
  )?.replace(/\/$/, "");

  const key = import.meta.env
    .VITE_SUPABASE_PUBLISHABLE_KEY as
    | string
    | undefined;

  return { url, key };
}

export function PublicAIAssistant() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] =
    useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] =
    useState(false);
  const [messages, setMessages] = useState<
    Message[]
  >([]);

  const language =
    lang === "uzl" ? "uzl" : lang;

  const tx = (
    item: Record<string, string>,
  ) => {
    if (lang === "uzl") {
      return transliterateUzbek(item.uz);
    }

    return item[lang] ?? item.uz;
  };

  const visibleMessages =
    useMemo<Message[]>(
      () =>
        messages.length
          ? messages
          : [
              {
                role: "assistant",
                text: tx(COPY.welcome),
              },
            ],
      [messages, lang],
    );

  async function submit(
    event?: FormEvent,
  ) {
    event?.preventDefault();

    const question = input.trim();

    if (!question || loading) return;

    const { url, key } = getConfig();

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: question,
      },
    ]);

    setInput("");
    setLoading(true);

    if (!url || !key) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: `${tx(COPY.error)} Supabase configuration is missing.`,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${url}/functions/v1/public-ai`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            language,
            message: question,
          }),
        },
      );

      const data = (await response
        .json()
        .catch(() => ({}))) as {
        output?: string;
        error?: string;
        code?: number;
      };

      if (!response.ok || !data.output) {
        const details =
          data.error ||
          `HTTP ${response.status}`;

        throw new Error(details);
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.output || "",
        },
      ]);
    } catch (error) {
      console.error(
        "Public AI request failed",
        error,
      );

      const details =
        error instanceof Error
          ? error.message
          : "";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: details
            ? `${tx(COPY.error)} (${details})`
            : tx(COPY.error),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3"
      data-no-runtime-translate
    >
      {open && (
        <section
          className={`overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_30px_90px_-30px_rgba(2,35,74,.7)] transition-all ${
            expanded
              ? "h-[min(760px,calc(100vh-40px))] w-[min(720px,calc(100vw-40px))]"
              : "h-[min(610px,calc(100vh-100px))] w-[min(410px,calc(100vw-30px))]"
          }`}
        >
          <header className="flex items-center justify-between gap-3 bg-[linear-gradient(120deg,#073b77,#087c82)] px-5 py-4 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/12">
                <Bot className="size-6 text-cyan-200" />
              </span>

              <div className="min-w-0">
                <h2 className="truncate font-black">
                  {tx(COPY.title)}
                </h2>

                <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-white/65">
                  <span className="size-2 rounded-full bg-emerald-300" />
                  {tx(COPY.online)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() =>
                  setExpanded(
                    (value) => !value,
                  )
                }
                className="rounded-lg p-2 text-white/75 hover:bg-white/10 hover:text-white"
                aria-label="Resize"
              >
                {expanded ? (
                  <Minimize2 className="size-4" />
                ) : (
                  <Maximize2 className="size-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-white/75 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
          </header>

          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs leading-5 text-slate-500">
            {tx(COPY.subtitle)}
          </div>

          <div className="flex h-[calc(100%-154px)] flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {visibleMessages.map(
                (message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${
                      message.role ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <p
                      className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                        message.role ===
                        "user"
                          ? "rounded-br-md bg-[#073b77] text-white"
                          : "rounded-bl-md bg-slate-100 text-slate-700"
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                ),
              )}

              {loading && (
                <div className="flex justify-start">
                  <span className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-500">
                    <Loader2 className="size-4 animate-spin" />
                    AI...
                  </span>
                </div>
              )}
            </div>

            <form
              onSubmit={submit}
              className="flex gap-2 border-t border-slate-200 bg-white p-3"
            >
              <textarea
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    void submit();
                  }
                }}
                rows={2}
                placeholder={tx(
                  COPY.placeholder,
                )}
                className="min-h-12 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !input.trim()
                }
                className="grid size-12 shrink-0 place-items-center self-end rounded-xl bg-[#073b77] text-white transition hover:bg-[#052f61] disabled:opacity-45"
              >
                {loading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Send className="size-5" />
                )}
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className="group relative grid size-16 place-items-center rounded-full bg-[linear-gradient(135deg,#073b77,#087c82)] text-white shadow-[0_16px_40px_-12px_rgba(3,59,119,.9)] transition hover:-translate-y-1 hover:scale-105"
        aria-label={tx(COPY.title)}
      >
        {open ? (
          <X className="size-7" />
        ) : (
          <MessageCircle className="size-7" />
        )}

        {!open && (
          <span className="absolute -right-0.5 -top-0.5 size-4 rounded-full border-2 border-white bg-emerald-400" />
        )}
      </button>
    </div>
  );
}
