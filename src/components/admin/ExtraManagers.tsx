import { FormEvent, useEffect, useState } from "react";
import {
  Edit3,
  FileUp,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { SupabaseSession } from "@/lib/supabase-auth";
import {
  uploadPublicFile,
  type UploadBucket,
} from "@/lib/storage-upload";
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
  staff: {
    label: "Ходимлар",
    table: "staff",
    empty: emptyStaff,
    load: listStaff,
  },
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

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-xl bg-slate-50 p-3">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
        {label}
        <b className="text-blue-700">
          {value}
          {suffix}
        </b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="mt-3 w-full accent-blue-700"
      />
    </label>
  );
}

export function ExtraManagers({
  session,
}: {
  session: SupabaseSession;
}) {
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
      setItems(
        (await def.load(false, session)) as any[],
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Юклашда хато.",
      );
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
        event as CustomEvent<{
          module?: string;
          action?: string;
        }>
      ).detail;
      const module = detail?.module as Mode;

      if (!module || !defs[module]) return;

      setMode(module);
      setEditing(null);
      setMessage("");

      window.setTimeout(() => {
        document
          .getElementById(
            detail.action === "add"
              ? "extra-editor-form"
              : "extra-content",
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 50);
    };

    window.addEventListener(
      "admin:open-module",
      handler as EventListener,
    );

    return () =>
      window.removeEventListener(
        "admin:open-module",
        handler as EventListener,
      );
  }, []);

  function setValue(key: string, value: unknown) {
    setForm((current: any) => ({
      ...current,
      [key]: value,
    }));
  }

  function reset() {
    setForm(def.empty());
    setEditing(null);
  }

  async function upload(
    bucket: UploadBucket,
    field:
      | "image_url"
      | "file_url"
      | "media_url"
      | "thumbnail_url",
    file?: File,
  ) {
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const url = await uploadPublicFile(
        bucket,
        file,
        session,
      );
      setValue(field, url);
      setMessage(
        "Файл юкланди. Энди «Сақлаш» тугмасини босинг.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Файл юклашда хато.",
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
        await updateExtra(
          def.table,
          editing,
          form,
          session,
        );
      } else {
        await createExtra(def.table, form, session);
      }

      reset();
      await reload();
      setMessage("Маълумот муваффақиятли сақланди.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Сақлашда хато.",
      );
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
      setMessage(
        error instanceof Error
          ? error.message
          : "Ўчиришда хато.",
      );
    }
  }

  const FileButton = ({
    label,
    accept,
    bucket,
    field,
  }: {
    label: string;
    accept: string;
    bucket: UploadBucket;
    field:
      | "image_url"
      | "file_url"
      | "media_url"
      | "thumbnail_url";
  }) => (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={uploading}
        onChange={(event) =>
          void upload(
            bucket,
            field,
            event.target.files?.[0],
          )
        }
      />
      {uploading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Upload className="size-4" />
      )}
      {uploading ? "Юкланмоқда..." : label}
    </label>
  );

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
            Ходимлар, ҳужжатлар, медиа ва харита
            объектлари.
          </p>
        </div>

        <div className="flex flex-wrap rounded-xl bg-slate-100 p-1">
          {(Object.keys(defs) as Mode[]).map(
            (key) => (
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
            ),
          )}
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

        {(mode === "staff" ||
          mode === "media" ||
          mode === "map") && (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {langs.map(([code, language]) => (
              <div
                key={code}
                className="rounded-xl bg-white p-4"
              >
                <b className="text-blue-800">
                  {language}
                </b>

                <label className="mt-3 block text-sm font-bold">
                  {mode === "staff"
                    ? "Ф.И.Ш."
                    : "Сарлавҳа"}
                  <input
                    className={input}
                    value={
                      form[
                        `${
                          mode === "staff"
                            ? "name"
                            : "title"
                        }_${code}`
                      ] || ""
                    }
                    onChange={(event) =>
                      setValue(
                        `${
                          mode === "staff"
                            ? "name"
                            : "title"
                        }_${code}`,
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
                      value={
                        form[`description_${code}`] ||
                        ""
                      }
                      onChange={(event) =>
                        setValue(
                          `description_${code}`,
                          event.target.value,
                        )
                      }
                    />
                  </label>
                )}

                {mode === "staff" && (
                  <label className="mt-3 block text-sm font-bold">
                    Лавозим
                    <input
                      className={input}
                      value={
                        form[`role_${code}`] || ""
                      }
                      onChange={(event) =>
                        setValue(
                          `role_${code}`,
                          event.target.value,
                        )
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
                    setValue(
                      `title_${code}`,
                      event.target.value,
                    )
                  }
                />
              </label>
            ))}
          </div>
        )}

        {mode === "staff" && (
          <div className="mt-5 rounded-2xl border bg-white p-4">
            <p className="font-extrabold">
              Ходим фотографияси ва ўлчами
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Сайтда қандай кўринишини шу ерда
              олдиндан созланг.
            </p>

            <div className="mt-5 grid gap-6 lg:grid-cols-[360px_1fr]">
              <div>
                <div
                  className="relative w-full overflow-hidden rounded-2xl border bg-slate-100"
                  style={{
                    height: `${Number(
                      form.image_height || 300,
                    )}px`,
                  }}
                >
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt=""
                      className="absolute inset-0 h-full w-full"
                      style={{
                        objectFit:
                          form.image_fit || "cover",
                        objectPosition: `${
                          Number(
                            form.image_position_x ?? 50,
                          )
                        }% ${
                          Number(
                            form.image_position_y ?? 15,
                          )
                        }%`,
                        transform: `scale(${
                          Number(
                            form.image_scale || 100,
                          ) / 100
                        })`,
                        transformOrigin: `${
                          Number(
                            form.image_position_x ?? 50,
                          )
                        }% ${
                          Number(
                            form.image_position_y ?? 15,
                          )
                        }%`,
                      }}
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-slate-400">
                      <ImagePlus className="size-10" />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <FileButton
                    label="Компьютердан фото танлаш"
                    accept="image/jpeg,image/png,image/webp"
                    bucket="staff-photos"
                    field="image_url"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setValue("image_fit", "cover");
                      setValue("image_scale", 100);
                      setValue("image_position_x", 50);
                      setValue("image_position_y", 15);
                      setValue("image_height", 300);
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    Стандарт ҳолат
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block rounded-xl bg-slate-50 p-3 text-sm font-bold">
                  Расмни жойлаш
                  <select
                    className={input}
                    value={form.image_fit || "cover"}
                    onChange={(event) =>
                      setValue(
                        "image_fit",
                        event.target.value,
                      )
                    }
                  >
                    <option value="cover">
                      Блокни тўлиқ тўлдириш
                    </option>
                    <option value="contain">
                      Расмни тўлиқ кўрсатиш
                    </option>
                  </select>
                </label>

                <RangeField
                  label="Карточка расм баландлиги"
                  value={Number(
                    form.image_height || 300,
                  )}
                  min={220}
                  max={520}
                  step={10}
                  suffix=" px"
                  onChange={(value) =>
                    setValue("image_height", value)
                  }
                />

                <RangeField
                  label="Расм масштаби"
                  value={Number(
                    form.image_scale || 100,
                  )}
                  min={70}
                  max={180}
                  suffix="%"
                  onChange={(value) =>
                    setValue("image_scale", value)
                  }
                />

                <RangeField
                  label="Чап–ўнг ҳолати"
                  value={Number(
                    form.image_position_x ?? 50,
                  )}
                  min={0}
                  max={100}
                  suffix="%"
                  onChange={(value) =>
                    setValue(
                      "image_position_x",
                      value,
                    )
                  }
                />

                <RangeField
                  label="Юқори–паст ҳолати"
                  value={Number(
                    form.image_position_y ?? 15,
                  )}
                  min={0}
                  max={100}
                  suffix="%"
                  onChange={(value) =>
                    setValue(
                      "image_position_y",
                      value,
                    )
                  }
                />

                <label className="block rounded-xl bg-slate-50 p-3 text-sm font-bold sm:col-span-2">
                  Расм URL
                  <input
                    className={input}
                    value={form.image_url || ""}
                    onChange={(event) =>
                      setValue(
                        "image_url",
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {mode === "documents" && (
          <div className="mt-5 rounded-2xl border bg-white p-4">
            <p className="font-extrabold">
              Ҳужжат файли
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <span className="grid size-16 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <FileUp />
              </span>
              <FileButton
                label="Компьютердан ҳужжат танлаш"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt"
                bucket="documents"
                field="file_url"
              />
              {form.file_url && (
                <a
                  href={form.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-blue-700 underline"
                >
                  Юкланган файлни очиш
                </a>
              )}
            </div>
          </div>
        )}

        {mode === "media" && (
          <div className="mt-5 rounded-2xl border bg-white p-4">
            <p className="font-extrabold">
              Фото ёки видео
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {form.media_type === "image" &&
                form.media_url && (
                  <img
                    src={form.media_url}
                    className="h-36 w-48 rounded-xl border object-cover"
                    alt=""
                  />
                )}
              <FileButton
                label="Компьютердан медиа танлаш"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                bucket="media"
                field="media_url"
              />
              <FileButton
                label="Превью расмини танлаш"
                accept="image/jpeg,image/png,image/webp"
                bucket="media"
                field="thumbnail_url"
              />
            </div>
          </div>
        )}

        {mode === "map" && (
          <div className="mt-5 rounded-2xl border bg-white p-4">
            <p className="font-extrabold">
              Объект фотографияси
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {form.image_url ? (
                <img
                  src={form.image_url}
                  className="h-36 w-48 rounded-xl border object-cover"
                  alt=""
                />
              ) : (
                <div className="grid h-36 w-48 place-items-center rounded-xl border border-dashed text-slate-400">
                  <ImagePlus />
                </div>
              )}
              <FileButton
                label="Компьютердан объект расмини танлаш"
                accept="image/jpeg,image/png,image/webp"
                bucket="map-photos"
                field="image_url"
              />
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
                    setValue(
                      "phone",
                      event.target.value,
                    )
                  }
                />
              </label>
              <label className="text-sm font-bold">
                Email
                <input
                  className={input}
                  value={form.email || ""}
                  onChange={(event) =>
                    setValue(
                      "email",
                      event.target.value,
                    )
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
                    setValue(
                      "sort_order",
                      Number(event.target.value),
                    )
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
                    setValue(
                      "file_type",
                      event.target.value,
                    )
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
                    setValue(
                      "document_date",
                      event.target.value,
                    )
                  }
                />
              </label>
              <label className="text-sm font-bold md:col-span-2">
                Файл URL
                <input
                  className={input}
                  value={form.file_url || ""}
                  onChange={(event) =>
                    setValue(
                      "file_url",
                      event.target.value,
                    )
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
                    setValue(
                      "media_type",
                      event.target.value,
                    )
                  }
                >
                  <option value="image">
                    Расм
                  </option>
                  <option value="video">
                    Видео
                  </option>
                </select>
              </label>
              <label className="text-sm font-bold">
                Медиа URL
                <input
                  className={input}
                  value={form.media_url || ""}
                  onChange={(event) =>
                    setValue(
                      "media_url",
                      event.target.value,
                    )
                  }
                />
              </label>
              <label className="text-sm font-bold md:col-span-2">
                Превью URL
                <input
                  className={input}
                  value={form.thumbnail_url || ""}
                  onChange={(event) =>
                    setValue(
                      "thumbnail_url",
                      event.target.value,
                    )
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
                    setValue(
                      "latitude",
                      Number(event.target.value),
                    )
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
                    setValue(
                      "longitude",
                      Number(event.target.value),
                    )
                  }
                />
              </label>
              <label className="text-sm font-bold">
                Категория
                <input
                  className={input}
                  value={form.category || ""}
                  onChange={(event) =>
                    setValue(
                      "category",
                      event.target.value,
                    )
                  }
                />
              </label>
              <label className="text-sm font-bold">
                Манзил
                <input
                  className={input}
                  value={form.address || ""}
                  onChange={(event) =>
                    setValue(
                      "address",
                      event.target.value,
                    )
                  }
                />
              </label>
              <label className="text-sm font-bold md:col-span-2">
                Расм URL
                <input
                  className={input}
                  value={form.image_url || ""}
                  onChange={(event) =>
                    setValue(
                      "image_url",
                      event.target.value,
                    )
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
                setValue(
                  "is_published",
                  event.target.checked,
                )
              }
            />
            <b className="text-sm">
              Сайтда кўрсатиш
            </b>
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
            {(item.image_url ||
              (mode === "media" &&
                item.thumbnail_url)) && (
              <img
                src={
                  item.image_url ||
                  item.thumbnail_url
                }
                className="size-14 rounded-xl object-cover"
                style={
                  mode === "staff"
                    ? {
                        objectPosition: `${
                          item.image_position_x ?? 50
                        }% ${
                          item.image_position_y ?? 15
                        }%`,
                      }
                    : undefined
                }
                alt=""
              />
            )}

            <div className="min-w-0 flex-1">
              <b>
                {item.name_uz ||
                  item.title_uz ||
                  item.address ||
                  "Маълумот"}
              </b>
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
                setForm({
                  ...emptyStaff(),
                  ...item,
                });
                window.setTimeout(() => {
                  document
                    .getElementById(
                      "extra-editor-form",
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }, 30);
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
