# Admin: News and Projects

1. Upload all project files to GitHub and wait for Vercel status `Ready`.
2. Open Supabase → SQL Editor → New query.
3. Copy all SQL from `supabase/news-projects.sql` and click `Run`.
4. Open `/admin/login` and sign in.
5. In the admin panel use `Контентни бошқариш`:
   - create/edit/delete news;
   - create/edit/delete investment projects;
   - fill Uzbek, Russian, English and Chinese fields;
   - set image URL and publication status.
6. Published records automatically appear on `/news` and `/projects`.

The SQL enables RLS: public visitors can only read published content; authenticated users can manage all records.
