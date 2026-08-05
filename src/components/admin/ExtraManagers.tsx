import { FormEvent, useEffect, useState } from "react";
import {
  Edit3,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { SupabaseSession } from "@/lib/supabase-auth";
import { uploadStaffPhoto } from "@/lib/storage-upload";
import {
  createExtra,
  deleteExtra,
  emptyDocument,
  emptyMap,
  emptyMedia,
  emptyStaff,
  listDocuments,
  listMapItems,
  listMedia,
  listStaff,
  updateExtra,
} from "@/lib/extra-content-api";

type Mode = "staff" | "documents" | "media" | "map";

const defs = {
  staff: { label: "Ходимлар", table: "staff", empty: emptyStaff, load: listStaff },
  documents: {
    label: "Ҳужжатлар",
    table: "documents",
    empty: emptyDocument,
    load: listDocuments,
  },
  media: {
    label: "Медиа",
    table: "media_items",
    empty: emptyMedia,
    load: listMedia,
  },
  map: {
    label: "Харита объектлари",
    table: "map_objects",
    empty: emptyMap,
    load: listMapItems,
  },
} as const;

const langs = [
  ["uz", "Ўзбекча"],
  ["ru", "Русский"],
  ["en", "English"],
  ["zh", "中文"],
] as const;

const input =
  "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export function ExtraManagers({ session }: { session: SupabaseSession }) {
  const [mode, setMode] = useState<Mode>("staff");
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyStaff());
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const def = defs[mode];

  async function reload() {
    try {
      setItems((await def.load(false, session)) as any[]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Юклашда хато.");
    }
  }

  useEffect(() => {
    setForm(def.empty());
    setEditing(null);
    void reload();
  }, [mode]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (
        event as CustomEvent<{ module?: string; action?: string }>
      ).detail;
      const module = detail?.module as Mode;

      if (!module || !defs[module]) return;

      setMode(module);
      setEditing(null);
      setMessage("");

      window.setTimeout(() => {
        document
          .getElementById(
            detail.action === "add" ? "extra-editor-form" : "extra-content",
          )
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    };

    window.addEventListener("admin:open-module", handler as EventListener);
    return () =>
      window.removeEventListener("admin:open-module", handler as EventListener);
  }, []);

  function reset() {
    setForm(def.empty());
    setEditing(null);
  }

  function setValue(key: string, value: unknown) {
    setForm((current: any) => ({ ...current, [key]: value }));
  }

  async function uploadPhoto(file?: File) {
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const imageUrl = await uploadStaffPhoto(file, session);
      setValue("image_url", imageUrl);
      setMessage("Фото юкланди. Энди «Сақлаш» тугмасини босинг.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Фото юклашда хато юз берди.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      if (editing) {
        await updateExtra(def.table, editing, form, session);
      } else {
        await createExtra(def.table, form, session);
      }

      reset();
      await reload();
      setMessage("Маълумот муваффақиятли сақланди.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Сақлашда хато.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Ўчиришни тасдиқлайсизми?")) return;

    try {
      await deleteExtra(def.table, id, session);
      await reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ўчиришда хато.");
    }
  }

  return (
    <section
      id="extra-content"
      className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold">
            Қўшимча бўлимларни бошқариш
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ходимлар, ҳужжатлар, медиа ва харита объектлари.
          </p>
        </div>

        <div className="flex flex-wrap rounded-xl bg-slate-100 p-1">
          {(Object.keys(defs) as Mode[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`rounded-lg px-3 py-2 text-sm font-bold ${
                mode === key
                  ? "bg-white text-blue-700 shadow"
                  : "text-slate-600"
              }`}
            >
              {defs[key].label}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-800">
          {message}
        </p>
      )}

      <form
        id="extra-editor-form"
        onSubmit={submit}
        className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"
      >
        <div className="flex justify-between">
          <h3 className="font-extrabold">
            {editing ? "Таҳрирлаш" : "Янги маълумот"}
          </h3>

          {editing && (
            <button
              type="button"
              onClick={reset}
              className="flex gap-2 text-sm font-bold"
            >
              <X className="size-4" />
              Бекор қилиш
            </button>
          )}
        </div>

        {(mode === "staff" || mode === "media" || mode === "map") && (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {langs.map(([code, language]) => (
              <div key={code} className="rounded-xl bg-white p-4">
                <b className="text-blue-800">{language}</b>

                <label className="mt-3 block text-sm font-bold">
                  {mode === "staff" ? "Ф.И.Ш." : "Сарлавҳа"}
                  <input
                    className={input}
                    value={
                      form[
                        `${mode === "staff" ? "name" : "title"}_${code}`
                      ] || ""
                    }
                    onChange={(event) =>
                      setValue(
                        `${mode === "staff" ? "name" : "title"}_${code}`,
                        event.target.value,
                      )
                    }
                  />
                </label>

                {mode !== "staff" && (
                  <label className="mt-3 block text-sm font-bold">
                    Тавсиф
                    <textarea
                      className={input}
                      rows={3}
                      value={form[`description_${code}`] || ""}
                      onChange={(event) =>
                        setValue(`description_${code}`, event.target.value)
                      }
                    />
                  </label>
                )}

                {mode === "staff" && (
                  <label className="mt-3 block text-sm font-bold">
                    Лавозим
                    <input
                      className={input}
                      value={form[`role_${code}`] || ""}
                      onChange={(event) =>
                        setValue(`role_${code}`, event.target.value)
                      }
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        )}

        {mode === "documents" && (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {langs.map(([code, language]) => (
              <label
                key={code}
                className="block rounded-xl bg-white p-4 text-sm font-bold"
              >
                {language} — номи
                <input
                  className={input}
                  value={form[`title_${code}`] || ""}
                  onChange={(event) =>
                    setValue(`title_${code}`, event.target.value)
                  }
                />
              </label>
            ))}
          </div>
        )}

        {mode === "staff" && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-extrabold text-slate-800">
              Ходим фотографияси
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt="Ходим фотографияси"
                  className="h-36 w-28 rounded-xl border object-cover"
                />
              ) : (
                <div className="grid h-36 w-28 place-items-center rounded-xl border border-dashed border-slate-300 text-slate-400">
                  <ImagePlus />
                </div>
              )}

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={(event) =>
                    void uploadPhoto(event.target.files?.[0])
                  }
                />

                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ImagePlus className="size-4" />
                )}

                {uploading ? "Юкланмоқда..." : "Компьютердан фото танлаш"}
              </label>

              <span className="text-xs text-slate-500">
                JPG, PNG ёки WEBP. Максимал ҳажм: 5 МБ.
              </span>
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {mode === "staff" && (
            <>
              <label className="text-sm font-bold">
                Телефон
                <input
                  className={input}
                  value={form.phone || ""}
                  onChange={(event) =>
                    setValue("phone", event.target.value)
                  }
                />
              </label>

              <label className="text-sm font-bold">
                Email
                <input
                  className={input}
                  value={form.email || ""}
                  onChange={(event) =>
                    setValue("email", event.target.value)
                  }
                />
              </label>

              <label className="text-sm font-bold">
                Расм URL
                <input
                  className={input}
                  value={form.image_url || ""}
                  onChange={(event) =>
                    setValue("image_url", event.target.value)
                  }
                />
              </label>

              <label className="text-sm font-bold">
                Тартиб
                <input
                  type="number"
                  className={input}
                  value={form.sort_order || 0}
                  onChange={(event) =>
                    setValue("sort_order", Number(event.target.value))
                  }
                />
              </label>
            </>
          )}

          {mode === "documents" && (
            <>
              <label className="text-sm font-bold">
                Файл тури
                <input
                  className={input}
                  value={form.file_type || ""}
                  onChange={(event) =>
                    setValue("file_type", event.target.value)
                  }
                />
              </label>

              <label className="text-sm font-bold">
                Сана
                <input
                  type="date"
                  className={input}
                  value={form.document_date || ""}
                  onChange={(event) =>
                    setValue("document_date", event.target.value)
                  }
                />
              </label>

              <label className="text-sm font-bold md:col-span-2">
                Файл URL
                <input
                  className={input}
                  value={form.file_url || ""}
                  onChange={(event) =>
                    setValue("file_url", event.target.value)
                  }
                />
              </label>
            </>
          )}

          {mode === "media" && (
            <>
              <label className="text-sm font-bold">
                Тури
                <select
                  className={input}
                  value={form.media_type}
                  onChange={(event) =>
                    setValue("media_type", event.target.value)
                  }
                >
                  <option value="image">Расм</option>
                  <option value="video">Видео</option>
                </select>
              </label>

              <label className="text-sm font-bold">
                Медиа URL
                <input
                  className={input}
                  value={form.media_url || ""}
                  onChange={(event) =>
                    setValue("media_url", event.target.value)
                  }
                />
              </label>

              <label className="text-sm font-bold md:col-span-2">
                Превью URL
                <input
                  className={input}
                  value={form.thumbnail_url || ""}
                  onChange={(event) =>
                    setValue("thumbnail_url", event.target.value)
                  }
                />
              </label>
            </>
          )}

          {mode === "map" && (
            <>
              <label className="text-sm font-bold">
                Кенглик
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={form.latitude}
                  onChange={(event) =>
                    setValue("latitude", Number(event.target.value))
                  }
                />
              </label>

              <label className="text-sm font-bold">
                Узунлик
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={form.longitude}
                  onChange={(event) =>
                    setValue("longitude", Number(event.target.value))
                  }
                />
              </label>

              <label className="text-sm font-bold">
                Категория
                <input
                  className={input}
                  value={form.category || ""}
                  onChange={(event) =>
                    setValue("category", event.target.value)
                  }
                />
              </label>

              <label className="text-sm font-bold">
                Манзил
                <input
                  className={input}
                  value={form.address || ""}
                  onChange={(event) =>
                    setValue("address", event.target.value)
                  }
                />
              </label>
            </>
          )}

          <label className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={Boolean(form.is_published)}
              onChange={(event) =>
                setValue("is_published", event.target.checked)
              }
            />
            <b className="text-sm">Сайтда кўрсатиш</b>
          </label>
        </div>

        <button
          disabled={busy || uploading}
          className="mt-5 flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          <Save className="size-4" />
          {busy ? "Сақланмоқда..." : "Сақлаш"}
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {items.map((item: any) => (
          <article
            key={item.id}
            className="flex items-center gap-3 rounded-xl border p-4"
          >
            {mode === "staff" && item.image_url && (
              <img
                src={item.image_url}
                className="size-14 rounded-xl object-cover"
                alt=""
              />
            )}

            <div className="min-w-0 flex-1">
              <b>{item.name_uz || item.title_uz || item.address || "Маълумот"}</b>
              <p className="mt-1 truncate text-sm text-slate-500">
                {item.role_uz ||
                  item.file_url ||
                  item.media_url ||
                  item.category}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditing(item.id);
                setForm({ ...item });
              }}
              className="p-2 text-blue-700"
            >
              <Edit3 />
            </button>

            <button
              type="button"
              onClick={() => void remove(item.id)}
              className="p-2 text-red-600"
            >
              <Trash2 />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
