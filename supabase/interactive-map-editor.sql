-- Geometry fields for the interactive map editor.
alter table public.map_objects
  add column if not exists object_type text not null default 'marker',
  add column if not exists geometry jsonb,
  add column if not exists image_url text not null default '';

-- Keep supported object types consistent.
alter table public.map_objects
  drop constraint if exists map_objects_object_type_check;

alter table public.map_objects
  add constraint map_objects_object_type_check
  check (object_type in ('marker', 'polyline', 'polygon', 'rectangle'));

-- Public users may only read published objects.
alter table public.map_objects enable row level security;

drop policy if exists "Public read published map objects" on public.map_objects;
create policy "Public read published map objects"
on public.map_objects
for select
to anon, authenticated
using (is_published = true or auth.role() = 'authenticated');

-- Authenticated admin may create, update and delete.
drop policy if exists "Authenticated insert map objects" on public.map_objects;
create policy "Authenticated insert map objects"
on public.map_objects
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated update map objects" on public.map_objects;
create policy "Authenticated update map objects"
on public.map_objects
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated delete map objects" on public.map_objects;
create policy "Authenticated delete map objects"
on public.map_objects
for delete
to authenticated
using (true);
