-- Add an image field to map objects.
alter table public.map_objects
add column if not exists image_url text not null default '';

-- Create or update public Storage buckets.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('documents', 'documents', true, 20971520, array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'text/plain'
  ]),
  ('media', 'media', true, 104857600, array[
    'image/jpeg','image/png','image/webp',
    'video/mp4','video/webm','video/quicktime'
  ]),
  ('map-photos', 'map-photos', true, 10485760, array[
    'image/jpeg','image/png','image/webp'
  ])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read access.
drop policy if exists "Public view documents" on storage.objects;
create policy "Public view documents" on storage.objects
for select to public using (bucket_id = 'documents');

drop policy if exists "Public view media" on storage.objects;
create policy "Public view media" on storage.objects
for select to public using (bucket_id = 'media');

drop policy if exists "Public view map photos" on storage.objects;
create policy "Public view map photos" on storage.objects
for select to public using (bucket_id = 'map-photos');

-- Authenticated administrator upload access.
drop policy if exists "Admin upload documents" on storage.objects;
create policy "Admin upload documents" on storage.objects
for insert to authenticated with check (bucket_id = 'documents');

drop policy if exists "Admin upload media" on storage.objects;
create policy "Admin upload media" on storage.objects
for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "Admin upload map photos" on storage.objects;
create policy "Admin upload map photos" on storage.objects
for insert to authenticated with check (bucket_id = 'map-photos');

-- Update/delete access.
drop policy if exists "Admin update uploaded content" on storage.objects;
create policy "Admin update uploaded content" on storage.objects
for update to authenticated
using (bucket_id in ('documents','media','map-photos'))
with check (bucket_id in ('documents','media','map-photos'));

drop policy if exists "Admin delete uploaded content" on storage.objects;
create policy "Admin delete uploaded content" on storage.objects
for delete to authenticated
using (bucket_id in ('documents','media','map-photos'));
