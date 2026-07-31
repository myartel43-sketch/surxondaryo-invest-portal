# Update: Auth fix + full 4-language content

- Fixed `/admin/login` being wrapped by the `/admin` route by converting the dashboard route to `admin.index.tsx`.
- Added a 12-second Supabase authentication timeout and readable connection errors.
- Added localized content for Uzbek, Russian, English and Chinese.
- Localized the homepage, statistics, advantages, projects, staff, structure, land plots, export, documents, news, media, contacts, reception and investor cabinet.
- Localized the footer navigation and working hours.
- Kept Supabase variables in Vercel; no secret keys are stored in source code.
