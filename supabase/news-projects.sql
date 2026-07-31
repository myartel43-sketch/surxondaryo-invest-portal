create extension if not exists pgcrypto;

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title_uz text not null default '', title_ru text not null default '', title_en text not null default '', title_zh text not null default '',
  description_uz text not null default '', description_ru text not null default '', description_en text not null default '', description_zh text not null default '',
  published_at date not null default current_date,
  image_url text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.investment_projects (
  id uuid primary key default gen_random_uuid(),
  title_uz text not null default '', title_ru text not null default '', title_en text not null default '', title_zh text not null default '',
  description_uz text not null default '', description_ru text not null default '', description_en text not null default '', description_zh text not null default '',
  sector text not null default '', district text not null default '', amount text not null default '', jobs integer not null default 0,
  status text not null default '', image_url text not null default '', is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.news enable row level security;
alter table public.investment_projects enable row level security;

drop policy if exists "Public read published news" on public.news;
create policy "Public read published news" on public.news for select using (is_published = true or auth.role() = 'authenticated');
drop policy if exists "Admins manage news" on public.news;
create policy "Admins manage news" on public.news for all to authenticated using (true) with check (true);

drop policy if exists "Public read published projects" on public.investment_projects;
create policy "Public read published projects" on public.investment_projects for select using (is_published = true or auth.role() = 'authenticated');
drop policy if exists "Admins manage projects" on public.investment_projects;
create policy "Admins manage projects" on public.investment_projects for all to authenticated using (true) with check (true);

grant select on public.news, public.investment_projects to anon;
grant all on public.news, public.investment_projects to authenticated;
