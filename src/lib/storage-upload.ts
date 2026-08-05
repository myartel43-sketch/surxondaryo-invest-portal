import type { SupabaseSession } from "@/lib/supabase-auth";

function getConfig() {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  if (!url || !key) {
    throw new Error("Supabase муҳит ўзгарувчилари киритилмаган.");
  }

  return { url, key };
}

export async function uploadStaffPhoto(
  file: File,
  session: SupabaseSession,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Фақат JPG, PNG ёки WEBP расм танланг.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Расм ҳажми 5 МБ дан ошмаслиги керак.");
  }

  const { url, key } = getConfig();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${crypto.randomUUID()}.${extension}`;
  const objectPath = `${session.user.id}/${filename}`;

  const response = await fetch(
    `${url}/storage/v1/object/staff-photos/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: file,
    },
  );

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };

    throw new Error(
      data.message || data.error || "Расмни Supabase Storage'га юклаб бўлмади.",
    );
  }

  return `${url}/storage/v1/object/public/staff-photos/${objectPath}`;
}
