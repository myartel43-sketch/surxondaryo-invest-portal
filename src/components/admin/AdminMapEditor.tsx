import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Loader2,
  MapPinned,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import type { SupabaseSession } from "@/lib/supabase-auth";
import { uploadPublicFile } from "@/lib/storage-upload";
import {
  createMapObject,
  deleteMapObject,
  listMapObjects,
  updateMapObject,
  type MapObject,
} from "@/lib/map-content-api";
import { loadLeaflet } from "@/components/maps/leaflet-loader";

const initialForm = {
  title_uz: "",
  title_ru: "",
  title_en: "",
  title_zh: "",
  description_uz: "",
  description_ru: "",
  description_en: "",
  description_zh: "",
  latitude: null as number | null,
  longitude: null as number | null,
  address: "",
  category: "Инвестиция объекти",
  image_url: "",
  object_type: "marker" as MapObject["object_type"],
  geometry: null as MapObject["geometry"],
  is_published: true,
};

const input =
  "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export function AdminMapEditor({ session }: { session: SupabaseSession }) {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const drawnRef = useRef<any>(null);
  const objectLayersRef = useRef<Map<string, any>>(new Map());

  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState<MapObject[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const setValue = (key: string, value: unknown) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function reload() {
    try {
      setItems(await listMapObjects(false, session));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Харитани юклашда хато.");
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;

    let cancelled = false;

    void loadLeaflet(true).then((L) => {
      if (!L || cancelled || !mapNode.current) return;

      const map = L.map(mapNode.current, {
        center: [37.55, 67.45],
        zoom: 8,
      });

      const street = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "© OpenStreetMap",
        },
      );

      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          attribution: "Tiles © Esri",
        },
      );

      street.addTo(map);
      L.control.layers(
        {
          "Оддий харита": street,
          "Спутник": satellite,
        },
        undefined,
        { position: "topright" },
      ).addTo(map);

      const drawn = new L.FeatureGroup();
      map.addLayer(drawn);
      drawnRef.current = drawn;

      const drawControl = new L.Control.Draw({
        position: "topright",
        draw: {
          marker: true,
          polyline: true,
          polygon: {
            allowIntersection: false,
            showArea: true,
          },
          rectangle: true,
          circle: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawn,
          edit: true,
          remove: true,
        },
      });

      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, (event: any) => {
        drawn.clearLayers();
        const layer = event.layer;
        drawn.addLayer(layer);

        const geo = layer.toGeoJSON();
        const bounds = layer.getBounds?.();
        const center = bounds
          ? bounds.getCenter()
          : layer.getLatLng?.();

        const typeMap: Record<string, MapObject["object_type"]> = {
          marker: "marker",
          polyline: "polyline",
          polygon: "polygon",
          rectangle: "rectangle",
        };

        setForm((current) => ({
          ...current,
          object_type: typeMap[event.layerType] || "polygon",
          geometry: geo.geometry,
          latitude: center?.lat ?? null,
          longitude: center?.lng ?? null,
        }));

        setMessage("Объект чизилди. Маълумотларни тўлдириб, «Сақлаш» тугмасини босинг.");
      });

      map.on(L.Draw.Event.EDITED, (event: any) => {
        event.layers.eachLayer((layer: any) => {
          const geo = layer.toGeoJSON();
          const bounds = layer.getBounds?.();
          const center = bounds ? bounds.getCenter() : layer.getLatLng?.();
          setForm((current) => ({
            ...current,
            geometry: geo.geometry,
            latitude: center?.lat ?? current.latitude,
            longitude: center?.lng ?? current.longitude,
          }));
        });
      });

      map.on(L.Draw.Event.DELETED, () => {
        setForm((current) => ({
          ...current,
          geometry: null,
          latitude: null,
          longitude: null,
        }));
      });

      mapRef.current = map;
      window.setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!map || !L) return;

    objectLayersRef.current.forEach((layer) => map.removeLayer(layer));
    objectLayersRef.current.clear();

    items.forEach((item) => {
      let layer: any = null;

      if (item.geometry) {
        const geoLayer = L.geoJSON({
          type: "Feature",
          geometry: item.geometry,
          properties: {},
        }, {
          style: {
            color: "#0b63ce",
            weight: 3,
            fillColor: "#2f80ed",
            fillOpacity: 0.22,
          },
          pointToLayer: (_feature: any, latlng: any) =>
            L.marker(latlng),
        });
        layer = geoLayer;
      } else if (item.latitude != null && item.longitude != null) {
        layer = L.marker([item.latitude, item.longitude]);
      }

      if (!layer) return;

      const popup = `
        <div style="min-width:180px">
          ${item.image_url ? `<img src="${item.image_url}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px" />` : ""}
          <strong>${item.title_uz || "Харита объекти"}</strong>
          <div style="font-size:12px;color:#64748b;margin-top:4px">${item.category || ""}</div>
          <div style="font-size:12px;margin-top:4px">${item.address || ""}</div>
        </div>
      `;

      layer.bindPopup(popup).addTo(map);
      objectLayersRef.current.set(item.id, layer);
    });
  }, [items]);

  function reset() {
    setEditingId(null);
    setForm(initialForm);
    drawnRef.current?.clearLayers();
  }

  function editItem(item: MapObject) {
    setEditingId(item.id);
    setForm({
      title_uz: item.title_uz || "",
      title_ru: item.title_ru || "",
      title_en: item.title_en || "",
      title_zh: item.title_zh || "",
      description_uz: item.description_uz || "",
      description_ru: item.description_ru || "",
      description_en: item.description_en || "",
      description_zh: item.description_zh || "",
      latitude: item.latitude,
      longitude: item.longitude,
      address: item.address || "",
      category: item.category || "",
      image_url: item.image_url || "",
      object_type: item.object_type || "marker",
      geometry: item.geometry,
      is_published: item.is_published,
    });

    const L = window.L;
    if (!L || !drawnRef.current) return;

    drawnRef.current.clearLayers();

    if (item.geometry) {
      const geoLayer = L.geoJSON({
        type: "Feature",
        geometry: item.geometry,
        properties: {},
      });
      geoLayer.eachLayer((layer: any) => drawnRef.current.addLayer(layer));
      const bounds = geoLayer.getBounds();
      if (bounds.isValid()) mapRef.current?.fitBounds(bounds, { padding: [30, 30] });
    } else if (item.latitude != null && item.longitude != null) {
      const marker = L.marker([item.latitude, item.longitude]);
      drawnRef.current.addLayer(marker);
      mapRef.current?.setView([item.latitude, item.longitude], 14);
    }

    document.getElementById("map-object-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const url = await uploadPublicFile("map-photos", file, session);
      setValue("image_url", url);
      setMessage("Расм юкланди.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Расм юклашда хато.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (!form.geometry && (form.latitude == null || form.longitude == null)) {
      setMessage("Аввал харитада нуқта, чизиқ, полигон ёки тўртбурчак чизинг.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      if (editingId) {
        await updateMapObject(editingId, form, session);
      } else {
        await createMapObject(form, session);
      }

      await reload();
      reset();
      setMessage("Харита объекти сақланди.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Сақлашда хато.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: MapObject) {
    if (!confirm(`«${item.title_uz || "Объект"}»ни ўчиришни тасдиқлайсизми?`)) return;
    try {
      await deleteMapObject(item.id, session);
      await reload();
      if (editingId === item.id) reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ўчиришда хато.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950">
              Харита объектларини бошқариш
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Харитада нуқта, чизиқ, полигон ёки тўртбурчак чизинг. Оддий ва спутник қатламлари мавжуд.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <MapPinned className="size-4" />
            Фақат админ учун
          </span>
        </div>

        {message && (
          <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-800">
            {message}
          </p>
        )}

        <div
          ref={mapNode}
          className="mt-6 h-[560px] overflow-hidden rounded-2xl border border-slate-200"
        />
      </section>

      <form
        id="map-object-form"
        onSubmit={submit}
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold">
            {editingId ? "Объектни таҳрирлаш" : "Янги объект маълумотлари"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold"
            >
              Янги объект
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {[
            ["uz", "Ўзбекча"],
            ["ru", "Русский"],
            ["en", "English"],
            ["zh", "中文"],
          ].map(([code, label]) => (
            <div key={code} className="rounded-2xl bg-slate-50 p-4">
              <p className="font-extrabold text-blue-800">{label}</p>
              <label className="mt-3 block text-sm font-bold">
                Номи
                <input
                  className={input}
                  value={(form as any)[`title_${code}`]}
                  onChange={(event) => setValue(`title_${code}`, event.target.value)}
                />
              </label>
              <label className="mt-3 block text-sm font-bold">
                Тавсиф
                <textarea
                  rows={3}
                  className={input}
                  value={(form as any)[`description_${code}`]}
                  onChange={(event) =>
                    setValue(`description_${code}`, event.target.value)
                  }
                />
              </label>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm font-bold">
            Категория
            <input
              className={input}
              value={form.category}
              onChange={(event) => setValue("category", event.target.value)}
            />
          </label>
          <label className="text-sm font-bold">
            Манзил
            <input
              className={input}
              value={form.address}
              onChange={(event) => setValue("address", event.target.value)}
            />
          </label>
          <label className="text-sm font-bold">
            Кенглик
            <input
              readOnly
              className={input}
              value={form.latitude ?? ""}
            />
          </label>
          <label className="text-sm font-bold">
            Узунлик
            <input
              readOnly
              className={input}
              value={form.longitude ?? ""}
            />
          </label>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 p-4">
          <p className="font-extrabold">Объект расми</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {form.image_url ? (
              <img
                src={form.image_url}
                alt=""
                className="h-32 w-48 rounded-xl border object-cover"
              />
            ) : (
              <div className="grid h-32 w-48 place-items-center rounded-xl border border-dashed text-slate-400">
                <ImagePlus />
              </div>
            )}

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(event) => void uploadImage(event.target.files?.[0])}
              />
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {uploading ? "Юкланмоқда..." : "Компьютердан расм танлаш"}
            </label>

            <label className="flex items-center gap-3 rounded-xl border px-4 py-3">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(event) =>
                  setValue("is_published", event.target.checked)
                }
              />
              <b className="text-sm">Сайтда кўрсатиш</b>
            </label>
          </div>
        </div>

        <button
          disabled={busy || uploading}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          <Save className="size-4" />
          {busy ? "Сақланмоқда..." : "Сақлаш"}
        </button>
      </form>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-xl font-extrabold">Сақланган объектлар</h2>
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 p-4"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt=""
                  className="size-16 rounded-xl object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-extrabold">{item.title_uz || "Номсиз объект"}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.category} · {item.object_type}
                </p>
              </div>
              <button
                type="button"
                onClick={() => editItem(item)}
                className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700"
              >
                Таҳрирлаш
              </button>
              <button
                type="button"
                onClick={() => void remove(item)}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600"
              >
                <Trash2 className="size-4" />
                Ўчириш
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
