import type { SupabaseSession } from "@/lib/supabase-auth";

export type GeoJsonGeometry = {
  type: string;
  coordinates: unknown;
};

export type MapObject = {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  title_zh: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  description_zh: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  category: string;
  image_url: string;
  object_type: "marker" | "polyline" | "polygon" | "rectangle";
  geometry: GeoJsonGeometry | null;
  is_published: boolean;
  created_at?: string;
};

function config() {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  if (!url || !key) throw new Error("Supabase муҳит ўзгарувчилари киритилмаган.");
  return { url, key };
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  session?: SupabaseSession,
): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${session?.access_token || key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error((await response.text()) || `Supabase хатоси: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function listMapObjects(publicOnly = true, session?: SupabaseSession) {
  return request<MapObject[]>(
    `map_objects?select=*&order=created_at.desc${publicOnly ? "&is_published=eq.true" : ""}`,
    {},
    session,
  );
}

export function createMapObject(
  item: Omit<MapObject, "id" | "created_at">,
  session: SupabaseSession,
) {
  return request<MapObject[]>(
    "map_objects",
    { method: "POST", body: JSON.stringify(item) },
    session,
  );
}

export function updateMapObject(
  id: string,
  item: Partial<MapObject>,
  session: SupabaseSession,
) {
  return request<MapObject[]>(
    `map_objects?id=eq.${id}`,
    { method: "PATCH", body: JSON.stringify(item) },
    session,
  );
}

export function deleteMapObject(id: string, session: SupabaseSession) {
  return request<void>(
    `map_objects?id=eq.${id}`,
    { method: "DELETE" },
    session,
  );
}
