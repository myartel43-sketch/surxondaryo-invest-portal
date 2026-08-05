import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminMapEditor } from "@/components/admin/AdminMapEditor";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getStoredSession, type SupabaseSession } from "@/lib/supabase-auth";

export const Route = createFileRoute("/admin/map")({ component: AdminMapPage });

function AdminMapPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const current = getStoredSession();
    if (!current) {
      navigate({ to: "/admin/login" });
      return;
    }
    setSession(current);
  }, [navigate]);

  if (!session) {
    return <div className="grid min-h-screen place-items-center bg-slate-100 font-bold text-slate-500">Юкланмоқда...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} active="map" />

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-7">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMenuOpen(true)} className="rounded-xl border border-slate-200 p-2.5">
            <Menu />
          </button>
          <div>
            <h1 className="text-lg font-extrabold">Ер майдонлари ва харита</h1>
            <p className="text-xs text-slate-500">Ягона админ панелининг харита бўлими</p>
          </div>
        </div>
        <Link to="/admin" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold">Dashboard</Link>
      </header>

      <div className="mx-auto max-w-7xl p-4 sm:p-7">
        <AdminMapEditor session={session} />
      </div>
    </main>
  );
}
