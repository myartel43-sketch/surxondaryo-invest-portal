import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bot,
  Building2,
  FileText,
  Image,
  LayoutDashboard,
  Link2,
  LogOut,
  MapPinned,
  Newspaper,
  Settings,
  Users,
  X,
} from "lucide-react";
import { signOut } from "@/lib/supabase-auth";

export type AdminModule =
  | "news"
  | "projects"
  | "staff"
  | "documents"
  | "media";

const modules = [
  { key: "news" as const, icon: Newspaper, label: "Янгиликлар" },
  { key: "projects" as const, icon: Building2, label: "Инвестиция лойиҳалари" },
  { key: "staff" as const, icon: Users, label: "Ходимлар" },
  { key: "documents" as const, icon: FileText, label: "Ҳужжатлар" },
  { key: "media" as const, icon: Image, label: "Медиа" },
];

export function AdminSidebar({
  open,
  onClose,
  active = "dashboard",
  onModule,
}: {
  open: boolean;
  onClose: () => void;
  active?: string;
  onModule?: (module: AdminModule, action: "list" | "add") => void;
}) {
  const navigate = useNavigate();

  function logout() {
    signOut();
    onClose();
    navigate({ to: "/admin/login" });
  }

  function openModule(module: AdminModule) {
    onClose();

    if (onModule) {
      onModule(module, "list");
      return;
    }

    navigate({ to: "/admin" }).then(() => {
      window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("admin:open-module", {
            detail: { module, action: "list" },
          }),
        );
      }, 150);
    });
  }

  function openAI() {
    onClose();
    navigate({ to: "/admin", hash: "ai-assistant" }).then(() => {
      window.setTimeout(() => {
        document.getElementById("ai-assistant")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 180);
    });
  }

  if (!open) return null;

  const itemClass = (selected: boolean) =>
    `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
      selected
        ? "bg-white/15 text-white"
        : "text-blue-100 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="fixed inset-0 z-[100]">
      <button aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-slate-950/60" />

      <aside className="relative flex h-full w-[320px] max-w-[88vw] flex-col bg-[linear-gradient(180deg,#073b77,#052a55)] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-white hover:bg-white/10"
          aria-label="Close"
        >
          <X />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 p-5">
          <img src="/brand/department-logo.png" className="size-12 object-contain" alt="Logo" />
          <div>
            <p className="text-sm font-extrabold text-white">SURXONDARYO</p>
            <p className="text-xs text-blue-200">ADMIN PANEL</p>
          </div>
        </div>

        <nav className="space-y-1 overflow-y-auto p-4">
          <Link to="/admin" onClick={onClose} className={itemClass(active === "dashboard")}>
            <LayoutDashboard className="size-5" />
            Dashboard
          </Link>

          <button type="button" onClick={openAI} className={itemClass(active === "ai")}>
            <Bot className="size-5" />
            AI ёрдамчи
            <span className="ms-auto rounded-full bg-cyan-300/15 px-2 py-0.5 text-[10px] font-black text-cyan-200">
              ONLINE
            </span>
          </button>

          {modules.map(({ key, icon: Icon, label }) => (
            <button key={key} type="button" onClick={() => openModule(key)} className={itemClass(active === key)}>
              <Icon className="size-5" />
              {label}
            </button>
          ))}

          <Link to="/admin/map" onClick={onClose} className={itemClass(active === "map")}>
            <MapPinned className="size-5" />
            Ер майдонлари ва харита
          </Link>

          <Link to="/admin" hash="links" onClick={onClose} className={itemClass(active === "links")}>
            <Link2 className="size-5" />
            Ҳаволалар ва иконкалар
          </Link>

          <Link to="/admin" hash="links" onClick={onClose} className={itemClass(active === "settings")}>
            <Settings className="size-5" />
            Созламалар
          </Link>
        </nav>

        <div className="mt-auto border-t border-white/10 p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-500/15"
          >
            <LogOut className="size-5" />
            Чиқиш
          </button>
        </div>
      </aside>
    </div>
  );
}
