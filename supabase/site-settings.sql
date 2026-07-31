create table if not exists public.site_settings (
  id text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

create policy "Authenticated users can insert site settings"
on public.site_settings for insert
to authenticated
with check (true);

create policy "Authenticated users can update site settings"
on public.site_settings for update
to authenticated
using (true)
with check (true);

insert into public.site_settings (id, value)
values (
  'main',
  '{"usefulLinks":[{"label":"Invest.gov.uz","url":"https://invest.gov.uz"},{"label":"Surxonstat.uz","url":"https://surxonstat.uz"},{"label":"E-auksion.uz","url":"https://e-auksion.uz"}],"socialLinks":{"facebook":"","telegram":"","youtube":"","instagram":"","linkedin":""}}'::jsonb
)
on conflict (id) do nothing;
