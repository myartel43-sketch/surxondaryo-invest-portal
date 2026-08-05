-- Employee photo storage bucket
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'staff-photos',
  'staff-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Public view staff photos" on storage.objects;
create policy "Public view staff photos"
on storage.objects
for select
to public
using (bucket_id = 'staff-photos');

drop policy if exists "Admin upload staff photos" on storage.objects;
create policy "Admin upload staff photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'staff-photos');

drop policy if exists "Admin update staff photos" on storage.objects;
create policy "Admin update staff photos"
on storage.objects
for update
to authenticated
using (bucket_id = 'staff-photos')
with check (bucket_id = 'staff-photos');

drop policy if exists "Admin delete staff photos" on storage.objects;
create policy "Admin delete staff photos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'staff-photos');
