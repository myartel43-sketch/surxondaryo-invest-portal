import type { SupabaseSession } from "@/lib/supabase-auth";

export type LocalizedFields = {
  title_uz: string; title_ru: string; title_en: string; title_zh: string;
  description_uz: string; description_ru: string; description_en: string; description_zh: string;
};

export type NewsItem = LocalizedFields & {
  id: string; published_at: string; image_url: string; is_published: boolean; created_at?: string;
};

export type ProjectItem = LocalizedFields & {
  id: string; sector: string; district: string; amount: string; jobs: number;
  status: string; image_url: string; is_published: boolean; created_at?: string;
};

function cfg() {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  if (!url || !key) throw new Error("Supabase муҳит ўзгарувчилари киритилмаган.");
  return { url, key };
}

async function request<T>(path: string, init: RequestInit = {}, session?: SupabaseSession): Promise<T> {
  const { url, key } = cfg();
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
    const text = await response.text();
    throw new Error(text || `Supabase хатоси: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const emptyNews = (): Omit<NewsItem, "id"> => ({
  title_uz: "", title_ru: "", title_en: "", title_zh: "",
  description_uz: "", description_ru: "", description_en: "", description_zh: "",
  published_at: new Date().toISOString().slice(0, 10), image_url: "", is_published: true,
});

export const emptyProject = (): Omit<ProjectItem, "id"> => ({
  title_uz: "", title_ru: "", title_en: "", title_zh: "",
  description_uz: "", description_ru: "", description_en: "", description_zh: "",
  sector: "", district: "", amount: "", jobs: 0, status: "", image_url: "", is_published: true,
});

export function listNews(publicOnly = false, session?: SupabaseSession) {
  const filter = publicOnly ? "&is_published=eq.true" : "";
  return request<NewsItem[]>(`news?select=*&order=published_at.desc${filter}`, {}, session);
}
export function createNews(item: Omit<NewsItem, "id">, session: SupabaseSession) {
  return request<NewsItem[]>("news", { method: "POST", body: JSON.stringify(item) }, session);
}
export function updateNews(id: string, item: Partial<NewsItem>, session: SupabaseSession) {
  return request<NewsItem[]>(`news?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(item) }, session);
}
export function deleteNews(id: string, session: SupabaseSession) {
  return request<void>(`news?id=eq.${id}`, { method: "DELETE" }, session);
}

export function listProjects(publicOnly = false, session?: SupabaseSession) {
  const filter = publicOnly ? "&is_published=eq.true" : "";
  return request<ProjectItem[]>(`investment_projects?select=*&order=created_at.desc${filter}`, {}, session);
}
export function createProject(item: Omit<ProjectItem, "id">, session: SupabaseSession) {
  return request<ProjectItem[]>("investment_projects", { method: "POST", body: JSON.stringify(item) }, session);
}
export function updateProject(id: string, item: Partial<ProjectItem>, session: SupabaseSession) {
  return request<ProjectItem[]>(`investment_projects?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(item) }, session);
}
export function deleteProject(id: string, session: SupabaseSession) {
  return request<void>(`investment_projects?id=eq.${id}`, { method: "DELETE" }, session);
}

export function pickLanguage(item: any, field: "title" | "description", lang: string): string {
  return item[`${field}_${lang}`] || item[`${field}_uz`] || "";
}
