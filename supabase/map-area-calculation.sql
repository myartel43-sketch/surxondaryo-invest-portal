-- Store calculated land area.
alter table public.map_objects
  add column if not exists area_sqm numeric not null default 0,
  add column if not exists area_ha numeric not null default 0;

comment on column public.map_objects.area_sqm is 'Calculated polygon area in square metres';
comment on column public.map_objects.area_ha is 'Calculated polygon area in hectares';
