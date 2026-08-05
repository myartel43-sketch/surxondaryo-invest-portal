import { useMemo, useState } from "react";
import {
  Bot,
  Check,
  Clipboard,
  FilePenLine,
  Languages,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import type { SupabaseSession } from "@/lib/supabase-auth";

type Task =
  | "chat"
  | "news"
  | "project"
  | "translate"
  | "improve";

const TASKS: Array<{
  key: Task;
  label: string;
  description: string;
  icon: typeof Bot;
}> = [
  {
    key: "chat",
    label: "Савол-жавоб",
    description: "Админ ишлари бўйича маслаҳат",
    icon: MessageSquareText,
  },
  {
    key: "news",
    label: "Янгилик тайёрлаш",
    description: "Расмий янгилик матни ва сарлавҳа",
    icon: FilePenLine,
  },
  {
    key: "project",
    label: "Лойиҳа тавсифи",
    description: "Инвестиция лойиҳаси паспорти учун матн",
    icon: Sparkles,
  },
  {
    key: "translate",
    label: "5 тилга таржима",
    description: "Ўзбекча, лотин, рус, инглиз ва хитой",
    icon: Languages,
  },
  {
    key: "improve",
    label: "Матнни яхшилаш",
    description: "Имло ва расмий услубни тўғрилаш",
    icon: WandSparkles,
  },
];

function getSupabaseUrl() {
  return (
    import.meta.env.VITE_SUPABASE_URL as string | undefined
  )?.replace(/\/$/, "");
}

export function AIAssistant({
  session,
}: {
  session: SupabaseSession;
}) {
  const [task, setTask] = useState<Task>("chat");
  const [language, setLanguage] = useState("uz");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const active = useMemo(
    () => TASKS.find((item) => item.key === task) ?? TASKS[0],
    [task],
  );

  async function submit() {
    const text = input.trim();
    if (!text) {
      setError("Топшириқ ёки матнни киритинг.");
      return;
    }

    const baseUrl = getSupabaseUrl();
    if (!baseUrl) {
      setError("VITE_SUPABASE_URL киритилмаган.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch(
        `${baseUrl}/functions/v1/admin-ai`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            task,
            language,
            input: text,
          }),
        },
      );

      const data = (await response.json().catch(() => ({}))) as {
        output?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || `AI хизмати хатоси: ${response.status}`,
        );
      }

      setOutput(data.output || "");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "AI ёрдамчига уланиб бўлмади.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section
      id="ai-assistant"
      className="admin-ai overflow-hidden rounded-[28px] border border-indigo-200/60 bg-white shadow-[0_28px_80px_-42px_rgba(30,41,130,.65)]"
    >
      <div className="relative overflow-hidden bg-[linear-gradient(120deg,#111d52,#283b9d_58%,#4969d8)] p-6 text-white sm:p-8">
        <div className="absolute -right-20 -top-24 size-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
              <Bot className="size-7 text-cyan-200" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-200">
                Surxondaryo Admin AI
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                AI ёрдамчи
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                Матн тайёрлаш, таржима қилиш ва таҳрирлаш
              </p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-200">
            Фақат авторизация қилинган админ
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-slate-50/80 p-4 lg:border-b-0 lg:border-r">
          <p className="px-2 text-xs font-black uppercase tracking-[.15em] text-slate-400">
            Вазифани танланг
          </p>
          <div className="mt-3 space-y-2">
            {TASKS.map(({ key, label, description, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTask(key)}
                className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${
                  task === key
                    ? "bg-indigo-700 text-white shadow-lg shadow-indigo-700/20"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                <Icon className="mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="block text-sm font-extrabold">
                    {label}
                  </span>
                  <span
                    className={`mt-1 block text-xs leading-5 ${
                      task === key
                        ? "text-indigo-100"
                        : "text-slate-400"
                    }`}
                  >
                    {description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-950">
                {active.label}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {active.description}
              </p>
            </div>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="uz">Ўзбекча — кирилл</option>
              <option value="uzl">O‘zbekcha — lotin</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="all">Барча 5 тил</option>
            </select>
          </div>

          <label className="mt-6 block">
            <span className="text-sm font-extrabold text-slate-700">
              Топшириқ ёки бошланғич матн
            </span>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={7}
              placeholder="Масалан: Сурхондарё–Хитой бизнес форуми ҳақида расмий янгилик тайёрла..."
              className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => void submit()}
            disabled={loading}
            className="mt-4 inline-flex h-12 items-center gap-2 rounded-xl bg-indigo-700 px-6 text-sm font-extrabold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
            {loading ? "AI ишламоқда..." : "Натижа тайёрлаш"}
          </button>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-950 p-1">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[.15em] text-slate-400">
                AI натижаси
              </p>
              <button
                type="button"
                disabled={!output}
                onClick={() => void copy()}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 disabled:opacity-30"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-400" />
                ) : (
                  <Clipboard className="size-4" />
                )}
                {copied ? "Нусхаланди" : "Нусхалаш"}
              </button>
            </div>
            <pre
              data-no-runtime-translate
              className="min-h-48 whitespace-pre-wrap rounded-xl bg-[#07101f] p-5 font-sans text-sm leading-7 text-slate-100"
            >
              {output ||
                "Натижа шу ерда кўринади. AI тайёрлаган матнни нусхалаб, янгилик ёки лойиҳа формасига қўйишингиз мумкин."}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
