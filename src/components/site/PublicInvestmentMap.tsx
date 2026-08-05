import { useEffect, useRef, useState } from "react";
import { Layers3 } from "lucide-react";
import { listMapObjects, type MapObject } from "@/lib/map-content-api";
import { loadLeaflet } from "@/components/maps/leaflet-loader";

export function PublicInvestmentMap() {
  const node = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [items, setItems] = useState<MapObject[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listMapObjects(true)
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : "Харитани юклаб бўлмади."));
  }, []);

  useEffect(() => {
    if (!node.current || mapRef.current) return;

    let cancelled = false;

    void loadLeaflet(false).then((L) => {
      if (!L || cancelled || !node.current) return;

      const map = L.map(node.current, {
        center: [37.55, 67.45],
        zoom: 8,
      });

      const street = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19, attribution: "© OpenStreetMap" },
      );

      const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "Tiles © Esri" },
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

    const group = L.featureGroup();

    items.forEach((item) => {
      let layer: any = null;

      if (item.geometry) {
        layer = L.geoJSON(
          {
            type: "Feature",
            geometry: item.geometry,
            properties: {},
          },
          {
            style: {
              color: "#075aa6",
              weight: 3,
              fillColor: "#2f80ed",
              fillOpacity: 0.24,
            },
            pointToLayer: (_feature: any, latlng: any) => L.marker(latlng),
          },
        );
      } else if (item.latitude != null && item.longitude != null) {
        layer = L.marker([item.latitude, item.longitude]);
      }

      if (!layer) return;

      layer.bindPopup(`
        <div style="min-width:210px">
          ${item.image_url ? `<img src="${item.image_url}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px" />` : ""}
          <strong style="font-size:14px">${item.title_uz || "Харита объекти"}</strong>
          <div style="font-size:12px;color:#15803d;margin-top:4px">${item.category || ""}</div>
          <div style="font-size:12px;margin-top:5px">${item.address || ""}</div>
          <div style="font-size:12px;color:#64748b;margin-top:5px">${item.description_uz || ""}</div>
        </div>
      `);

      layer.addTo(group);
    });

    group.addTo(map);

    if (items.length && group.getBounds?.().isValid()) {
      map.fitBounds(group.getBounds(), { padding: [25, 25], maxZoom: 13 });
    }

    return () => {
      map.removeLayer(group);
    };
  }, [items]);

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <Layers3 className="size-5" />
        </span>
        <div>
          <h2 className="text-xl font-extrabold">Инвестиция объектлари харитаси</h2>
          <p className="text-sm text-muted-foreground">
            Оддий харита ёки спутник тасвирини танланг.
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <div
        ref={node}
        className="h-[620px] overflow-hidden rounded-2xl border border-border"
      />
    </section>
  );
}
