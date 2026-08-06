-- Add manual staff photo display settings.
-- Safe to run more than once.

alter table public.staff
  add column if not exists image_fit text
    not null default 'cover',
  add column if not exists image_scale integer
    not null default 100,
  add column if not exists image_position_x integer
    not null default 50,
  add column if not exists image_position_y integer
    not null default 15,
  add column if not exists image_height integer
    not null default 300;

alter table public.staff
  drop constraint if exists staff_image_fit_check;

alter table public.staff
  add constraint staff_image_fit_check
  check (image_fit in ('cover', 'contain'));

alter table public.staff
  drop constraint if exists staff_image_scale_check;

alter table public.staff
  add constraint staff_image_scale_check
  check (image_scale between 70 and 180);

alter table public.staff
  drop constraint if exists staff_image_position_x_check;

alter table public.staff
  add constraint staff_image_position_x_check
  check (image_position_x between 0 and 100);

alter table public.staff
  drop constraint if exists staff_image_position_y_check;

alter table public.staff
  add constraint staff_image_position_y_check
  check (image_position_y between 0 and 100);

alter table public.staff
  drop constraint if exists staff_image_height_check;

alter table public.staff
  add constraint staff_image_height_check
  check (image_height between 220 and 520);
