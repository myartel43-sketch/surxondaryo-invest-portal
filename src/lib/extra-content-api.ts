import type { SupabaseSession } from "@/lib/supabase-auth";

export type StaffItem = {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  name_zh: string;
  role_uz: string;
  role_ru: string;
  role_en: string;
  role_zh: string;
  phone: string;
  email: string;
  image_url: string;
  image_fit: "cover" | "contain";
  image_scale: number;
  image_position_x: number;
  image_position_y: number;
  image_height: number;
  sort_order: number;
  is_published: boolean;
};

export type DocumentItem = {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  title_zh: string;
  file_type: string;
  document_date: string;
  file_url: string;
  is_published: boolean;
};

export type MediaItem = {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  title_zh: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  description_zh: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  is_published: boolean;
};

export type MapItem = {
  id: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  title_zh: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  description_zh: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
  image_url: string;
  is_published: boolean;
};

function cfg() {
  const url = (
    import.meta.env.VITE_SUPABASE_URL as string | undefined
  )?.replace(/\/$/, "");
  const key = import.meta.env
    .VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  if (!url || !key) {
    throw new Error(
      "Supabase муҳит ўзгарувчилари киритилмаган.",
    );
  }

  return { url, key };
}

async function req<T>(
  path: string,
  init: RequestInit = {},
  session?: SupabaseSession,
): Promise<T> {
  const { url, key } = cfg();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${
        session?.access_token || key
      }`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(
      (await response.text()) ||
        `Supabase хатоси: ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const emptyStaff = () => ({
  name_uz: "",
  name_ru: "",
  name_en: "",
  name_zh: "",
  role_uz: "",
  role_ru: "",
  role_en: "",
  role_zh: "",
  phone: "",
  email: "",
  image_url: "",
  image_fit: "cover" as const,
  image_scale: 100,
  image_position_x: 50,
  image_position_y: 15,
  image_height: 300,
  sort_order: 0,
  is_published: true,
});

export const emptyDocument = () => ({
  title_uz: "",
  title_ru: "",
  title_en: "",
  title_zh: "",
  file_type: "PDF",
  document_date: new Date().toISOString().slice(0, 10),
  file_url: "",
  is_published: true,
});

export const emptyMedia = () => ({
  title_uz: "",
  title_ru: "",
  title_en: "",
  title_zh: "",
  description_uz: "",
  description_ru: "",
  description_en: "",
  description_zh: "",
  media_type: "image",
  media_url: "",
  thumbnail_url: "",
  is_published: true,
});

export const emptyMap = () => ({
  title_uz: "",
  title_ru: "",
  title_en: "",
  title_zh: "",
  description_uz: "",
  description_ru: "",
  description_en: "",
  description_zh: "",
  latitude: 37.2242,
  longitude: 67.2783,
  address: "",
  category: "Инвестиция объекти",
  image_url: "",
  is_published: true,
});

export const listStaff = (
  published = false,
  session?: SupabaseSession,
) =>
  req<StaffItem[]>(
    `staff?select=*&order=sort_order.asc${
      published ? "&is_published=eq.true" : ""
    }`,
    {},
    session,
  );

export const listDocuments = (
  published = false,
  session?: SupabaseSession,
) =>
  req<DocumentItem[]>(
    `documents?select=*&order=document_date.desc${
      published ? "&is_published=eq.true" : ""
    }`,
    {},
    session,
  );

export const listMedia = (
  published = false,
  session?: SupabaseSession,
) =>
  req<MediaItem[]>(
    `media_items?select=*&order=created_at.desc${
      published ? "&is_published=eq.true" : ""
    }`,
    {},
    session,
  );

export const listMapItems = (
  published = false,
  session?: SupabaseSession,
) =>
  req<MapItem[]>(
    `map_objects?select=*&order=created_at.desc${
      published ? "&is_published=eq.true" : ""
    }`,
    {},
    session,
  );

export const createExtra = (
  table: string,
  item: unknown,
  session: SupabaseSession,
) =>
  req<any[]>(
    table,
    {
      method: "POST",
      body: JSON.stringify(item),
    },
    session,
  );

export const updateExtra = (
  table: string,
  id: string,
  item: unknown,
  session: SupabaseSession,
) =>
  req<any[]>(
    `${table}?id=eq.${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(item),
    },
    session,
  );

export const deleteExtra = (
  table: string,
  id: string,
  session: SupabaseSession,
) =>
  req<void>(
    `${table}?id=eq.${id}`,
    { method: "DELETE" },
    session,
  );

export const localized = (
  item: any,
  field: string,
  lang: string,
) =>
  item[`${field}_${lang}`] ||
  item[`${field}_uz`] ||
  "";
