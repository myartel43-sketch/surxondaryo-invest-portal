import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import {
  getStoredSession,
  isSupabaseConfigured,
  signInWithPassword,
} from "@/lib/supabase-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      {
        title: "Администратор кириши | Surxondaryo Invest",
      },
    ],
  }),
  component: AdminLoginPage,
});

const ADMIN_DESTINATION =
  "https://surxondaryo-invest-portal-six.vercel.app/admin";

function redirectToAdmin() {
  window.location.replace(ADMIN_DESTINATION);
}

function AdminLoginPage() {
  const [email, setEmail] = useState("admin@surxondaryo-invest.uz");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getStoredSession()) {
      redirectToAdmin();
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        throw new Error("Email ва паролни киритинг.");
      }

      await signInWithPassword(normalizedEmail, password);

      // Recheck that the browser received and stored the authenticated session.
      if (!getStoredSession()) {
        throw new Error(
          "Кириш тасдиқланди, лекин сессия сақланмади. Браузерда cookie ва localStorage'га рухсат беринг.",
        );
      }

      redirectToAdmin();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Киришда хато юз берди.",
      );
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_35%),linear-gradient(135deg,#eff6ff,#f8fafc_55%,#ecfdf5)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(2,45,94,.18)] lg:grid-cols-[1.05fr_.95fr]">
          <section className="hidden bg-[linear-gradient(150deg,#073b77,#075985_58%,#15803d)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <img
                src="/brand/department-logo.png"
                alt="Surxondaryo Invest"
                className="size-24 object-contain"
              />
              <p className="mt-8 text-sm font-bold uppercase tracking-[.22em] text-blue-100">
                Расмий бошқарув тизими
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight">
                Сурхондарё вилояти инвестициялар, саноат ва савдо бошқармаси
              </h1>
              <p className="mt-5 max-w-xl leading-7 text-blue-100">
                Сайт маълумотлари, лойиҳалар, янгиликлар, ходимлар ва
                ҳужжатларни хавфсиз бошқариш панели.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <ShieldCheck className="size-7" />
              <p className="text-sm">
                Кириш Supabase Authentication орқали ҳимояланган.
              </p>
            </div>
          </section>

          <section className="p-7 sm:p-10 lg:p-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700"
            >
              <ArrowLeft className="size-4" />
              Сайтга қайтиш
            </Link>

            <div className="mt-10 flex items-center gap-4 lg:hidden">
              <img
                src="/brand/department-logo.png"
                alt="Logo"
                className="size-16 object-contain"
              />
              <div>
                <p className="text-sm font-extrabold text-[#073b77]">
                  SURXONDARYO INVEST
                </p>
                <p className="text-xs text-slate-500">
                  Администратор панели
                </p>
              </div>
            </div>

            <div className="mt-10">
              <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <LockKeyhole />
              </span>
              <h2 className="mt-5 text-3xl font-extrabold text-slate-950">
                Администратор кириши
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Тўғри логин ва паролдан кейин админ панель автоматик очилади.
              </p>
            </div>

            {!isSupabaseConfigured() && (
              <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <AlertCircle className="mt-0.5 size-5 shrink-0" />
                <p>
                  Vercel муҳит ўзгарувчилари киритилмаган:
                  {" "}
                  <b>VITE_SUPABASE_URL</b>
                  {" "}
                  ва
                  {" "}
                  <b>VITE_SUPABASE_PUBLISHABLE_KEY</b>.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">
                  Пароль
                </span>
                <span className="relative mt-2 block">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    aria-label="Паролни кўрсатиш"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </span>
              </label>

              <button
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#073b77] font-bold text-white transition hover:bg-[#052d5c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn className="size-5" />
                {loading
                  ? "Кириш ва йўналтириш..."
                  : "Админ панелга кириш"}
              </button>
            </form>

            <p className="mt-7 text-center text-xs leading-5 text-slate-400">
              Киришдан кейин:
              {" "}
              {ADMIN_DESTINATION}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
