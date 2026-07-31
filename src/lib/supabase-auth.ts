export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: {
    id: string;
    email?: string;
    role?: string;
  };
};

const SESSION_KEY = "surxondaryo_admin_session";

function config() {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  return { url, key };
}

export function isSupabaseConfigured() {
  const { url, key } = config();
  return Boolean(url && key);
}

export function getStoredSession(): SupabaseSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as SupabaseSession;
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function signInWithPassword(email: string, password: string) {
  const { url, key } = config();
  if (!url || !key) {
    throw new Error("Supabase муҳит ўзгарувчилари киритилмаган.");
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12000);
  let response: Response;
  try {
    response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Supabase жавоб бермади. Интернет ва Vercel муҳит ўзгарувчиларини текширинг.");
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }

  const data = (await response.json()) as SupabaseSession & {
    error?: string;
    error_description?: string;
    msg?: string;
  };

  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.error || "Логин ёки пароль нотўғри.");
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }
  return data;
}

export function signOut() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY);
  }
}
