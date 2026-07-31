import type { SupabaseSession } from "@/lib/supabase-auth";

export type UsefulLink = { label: string; url: string };
export type SocialLinks = {
  facebook: string;
  telegram: string;
  youtube: string;
  instagram: string;
  linkedin: string;
};

export type SiteSettings = {
  usefulLinks: UsefulLink[];
  socialLinks: SocialLinks;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  usefulLinks: [
    { label: "Invest.gov.uz", url: "https://invest.gov.uz" },
    { label: "Surxonstat.uz", url: "https://surxonstat.uz" },
    { label: "E-auksion.uz", url: "https://e-auksion.uz" },
  ],
  socialLinks: {
    facebook: "",
    telegram: "",
    youtube: "",
    instagram: "",
    linkedin: "",
  },
};

const LOCAL_KEY = "surxondaryo_site_settings";

function config() {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  return { url, key };
}

function normalize(value: Partial<SiteSettings> | null | undefined): SiteSettings {
  return {
    usefulLinks: Array.isArray(value?.usefulLinks)
      ? value!.usefulLinks.filter((item) => item && item.label && item.url)
      : DEFAULT_SITE_SETTINGS.usefulLinks,
    socialLinks: {
      ...DEFAULT_SITE_SETTINGS.socialLinks,
      ...(value?.socialLinks ?? {}),
    },
  };
}

export function readLocalSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? normalize(JSON.parse(raw)) : DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function writeLocalSettings(settings: SiteSettings) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("site-settings-updated", { detail: settings }));
  }
}

export async function loadSiteSettings(): Promise<SiteSettings> {
  const { url, key } = config();
  if (!url || !key) return readLocalSettings();
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${url}/rest/v1/site_settings?id=eq.main&select=value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: controller.signal,
    });
    window.clearTimeout(timer);
    if (!response.ok) return readLocalSettings();
    const rows = (await response.json()) as Array<{ value?: Partial<SiteSettings> }>;
    const settings = normalize(rows[0]?.value);
    writeLocalSettings(settings);
    return settings;
  } catch {
    return readLocalSettings();
  }
}

export async function saveSiteSettings(settings: SiteSettings, session: SupabaseSession): Promise<void> {
  writeLocalSettings(settings);
  const { url, key } = config();
  if (!url || !key) throw new Error("Supabase муҳит ўзгарувчилари топилмади.");
  const response = await fetch(`${url}/rest/v1/site_settings?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ id: "main", value: settings, updated_at: new Date().toISOString() }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Созламаларни сақлашда хато юз берди.");
  }
}
