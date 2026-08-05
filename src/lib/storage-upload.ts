import type { SupabaseSession } from "@/lib/supabase-auth";

export type UploadBucket =
  | "staff-photos"
  | "documents"
  | "media"
  | "map-photos";

function getConfig() {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "");
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  if (!url || !key) {
    throw new Error("Supabase муҳит ўзгарувчилари киритилмаган.");
  }

  return { url, key };
}

const limits: Record<UploadBucket, number> = {
  "staff-photos": 5 * 1024 * 1024,
  documents: 20 * 1024 * 1024,
  media: 100 * 1024 * 1024,
  "map-photos": 10 * 1024 * 1024,
};

export async function uploadPublicFile(
  bucket: UploadBucket,
  file: File,
  session: SupabaseSession,
): Promise<string> {
  if (file.size > limits[bucket]) {
    const mb = Math.round(limits[bucket] / 1024 / 1024);
    throw new Error(`Файл ҳажми ${mb} МБ дан ошмаслиги керак.`);
  }

  const { url, key } = getConfig();
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const objectPath = `${session.user.id}/${crypto.randomUUID()}.${extension}`;

  const response = await fetch(`${url}/storage/v1/object/${bucket}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: file,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };
    throw new Error(data.message || data.error || "Файлни юклаб бўлмади.");
  }

  return `${url}/storage/v1/object/public/${bucket}/${objectPath}`;
}
