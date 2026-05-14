-- 004: store_settings singleton + seed

create table if not exists public.store_settings (
  id                       integer primary key default 1 check (id = 1),
  store_name               text not null default 'Base Camp Brew',
  admin_email              text not null default 'admin@basecampbrew.com',
  base_currency            text not null default 'COP',
  default_shipping_cost    numeric(12,2) default 15000,
  free_shipping_threshold  numeric(12,2) default 150000,
  updated_at               timestamptz default now()
);

-- Seed default row
insert into public.store_settings (id) values (1)
on conflict (id) do nothing;

alter table public.store_settings enable row level security;

create policy "Anyone can read settings"
  on public.store_settings for select using (true);

create policy "Admins can update settings"
  on public.store_settings for update using (public.is_admin());
