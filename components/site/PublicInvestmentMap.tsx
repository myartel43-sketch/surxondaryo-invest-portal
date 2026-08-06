import { useEffect, useRef, useState } from "react";
import { Layers3, MapPinned, Satellite } from "lucide-react";
import { formatArea } from "@/lib/map-area";
import { listMapObjects, type MapObject } from "@/lib/map-content-api";
import { loadLeaflet } from "@/components/maps/leaflet-loader";
import { useI18n, transliterateUzbek } from "@/i18n";

export function PublicInvestmentMap() {
  const node = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const groupRef = useRef<any>(null);
  const [items, setItems] = useState<MapObject[]>([]);
  const [error, setError] = useState("");
  const { lang } = useI18n();

  const label = (uz: string, ru: string, en: string, zh: string) => {
    if (lang === "uzl") return transliterateUzbek(uz);
    return ({ uz, ru, en, zh } as Record<string, string>)[lang] ?? uz;
  };

  const localized = (item: MapObject, field: "title" | "description") => {
    const value =
      (item as any)[`${field}_${lang}`] ||
      (item as any)[`${field}_uz`] ||
      "";
    return lang === "uzl" ? transliterateUzbek((item as any)[`${field}_uz`] || value) : value;
  };

  useEffect(() => {
    listMapObjects(true)
      .then(setItems)
      .catch((cause) =>
        setError(cause instanceof Error ? cause.message : label("Харитани юклаб бўлмади.", "Не удалось загрузить карту.", "Unable to load the map.", "无法加载地图。")),
      );
  }, []);

  useEffect(() => {
    if (!node.current || mapRef.current) return;
    let cancelled = false;

    void loadLeaflet(false).then((L) => {
      if (!L || cancelled || !node.current) return;

      const map = L.map(node.current, {
        center: [37.55, 67.45],
        zoom: 8,
        zoomControl: true,
      });

      const street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      });

      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "Tiles © Esri" },
      );

      street.addTo(map);
      L.control.layers(
        {
          [label("Оддий харита", "Обычная карта", "Street map", "普通地图")]: street,
          [label("Спутник", "Спутник", "Satellite", "卫星地图")]: satellite,
        },
        undefined,
        { position: "topright" },
      ).addTo(map);

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
    const L = (window as any).L;
    if (!map || !L) return;

    if (groupRef.current) map.removeLayer(groupRef.current);
    const group = L.featureGroup();

    items.forEach((item) => {
      let layer: any = null;

      if (item.geometry) {
        layer = L.geoJSON(
          { type: "Feature", geometry: item.geometry, properties: {} },
          {
            style: {
              color: "#fbbf24",
              weight: 3,
              fillColor: "#10b981",
              fillOpacity: 0.28,
              dashArray: item.object_type === "polyline" ? "7 7" : undefined,
            },
            pointToLayer: (_feature: any, latlng: any) => L.marker(latlng),
          },
        );
      } else if (item.latitude != null && item.longitude != null) {
        layer = L.marker([item.latitude, item.longitude]);
      }

      if (!layer) return;

      const area = formatArea(Number(item.area_sqm || 0));
      layer.bindPopup(`
        <div style="min-width:240px;font-family:Inter,Arial,sans-serif">
          ${item.image_url ? `<img src="${item.image_url}" style="width:100%;height:140px;object-fit:cover;border-radius:12px;margin-bottom:10px">` : ""}
          <div style="font-size:11px;font-weight:800;letter-spacing:.12em;color:#0f766e;text-transform:uppercase">${item.category || ""}</div>
          <strong style="display:block;margin-top:5px;font-size:17px;color:#082f49">${localized(item, "title") || label("Ер майдони", "Земельный участок", "Land plot", "地块")}</strong>
          <div style="margin-top:8px;color:#047857;font-size:17px;font-weight:900">${label("Майдон", "Площадь", "Area", "面积")}: ${area.hectaresText} га</div>
          <div style="font-size:12px;color:#64748b">${area.squareMetersText} м²</div>
          <div style="font-size:12px;margin-top:8px;color:#334155">${item.address || ""}</div>
          <div style="font-size:12px;color:#64748b;margin-top:6px;line-height:1.55">${localized(item, "description")}</div>
        </div>
      `);
      layer.addTo(group);
    });

    group.addTo(map);
    groupRef.current = group;

    if (items.length && group.getBounds?.().isValid()) {
      map.fitBounds(group.getBounds(), { padding: [35, 35], maxZoom: 14 });
    }

    return () => {
      if (groupRef.current && map.hasLayer(groupRef.current)) {
        map.removeLayer(groupRef.current);
      }
    };
  }, [items, lang]);

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_35px_90px_-50px_rgba(2,47,88,.55)]">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[linear-gradient(120deg,#082f5d,#0b6b8f)] p-5 text-white sm:p-7">
        <div className="flex items-center gap-4">
          <span className="grid size-13 place-items-center rounded-2xl border border-white/15 bg-white/10">
            <Layers3 className="size-6 text-amber-300" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">
              {label("Бўш ер майдонлари харитаси", "Карта свободных земельных участков", "Available land plots map", "可用土地地图")}
            </h2>
            <p className="mt-1 text-sm text-white/65">
              {label(
                "Админ чизган чегаралар ва белгилаган объектлар шу ерда кўринади.",
                "Здесь отображаются границы и объекты, нанесённые администратором.",
                "Boundaries and objects drawn by the administrator are displayed here.",
                "此处显示管理员绘制的边界和标注的对象。",
              )}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold">
          <Satellite className="size-4 text-amber-300" />
          {label("Оддий + спутник", "Обычная + спутник", "Street + satellite", "普通 + 卫星")}
        </span>
      </div>

      {error && <p className="m-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}

      <div className="relative">
        <div ref={node} className="h-[660px] w-full" />
        {!items.length && !error && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-5 py-3 text-sm font-bold text-slate-600 shadow-xl backdrop-blur">
            <MapPinned className="mr-2 inline size-4 text-emerald-600" />
            {label("Ҳозирча объект қўшилмаган", "Объекты пока не добавлены", "No objects added yet", "尚未添加对象")}
          </div>
        )}
      </div>
    </section>
  );
}
