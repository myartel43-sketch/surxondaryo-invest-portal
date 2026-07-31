# Supabase admin login setup

Add these variables in Vercel → Project → Settings → Environment Variables:

- `VITE_SUPABASE_URL` — your Supabase Project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — the public/publishable key

Select Production, Preview and Development, save, then redeploy.

Admin routes:

- `/admin/login`
- `/admin`

The secret/service-role key must never be added to Vercel frontend variables or GitHub.
