import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminMapEditor } from "@/components/admin/AdminMapEditor";
import {
  getStoredSession,
  type SupabaseSession,
} from "@/lib/supabase-auth";

export const Route = createFileRoute("/admin/map")({
  component: AdminMapPage,
});

function AdminMapPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<SupabaseSession | null>(null);

  useEffect(() => {
    const current = getStoredSession();
    if (!current) {
      navigate({ to: "/admin/login" });
      return;
    }
    setSession(current);
  }, [navigate]);

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 text-sm font-bold text-slate-500">
        Юкланмоқда...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-extrabold">Админ харита муҳаррири</h1>
            <p className="text-xs text-slate-500">
              Объект қўшиш, чизиш, таҳрирлаш ва ўчириш
            </p>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold"
          >
            <ArrowLeft className="size-4" />
            Админ панелга қайтиш
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-7">
        <AdminMapEditor session={session} />
      </div>
    </main>
  );
}
