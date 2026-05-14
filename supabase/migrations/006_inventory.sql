-- 006: inventory tables + audit logs + RLS + seed SKUs

-- Core inventory
create table if not exists public.inventory (
  id            uuid primary key default gen_random_uuid(),
  product_code  text not null unique,
  product_name  text not null,
  category      text not null check (category in ('cafe','empaque','accesorio')),
  unit          text not null default 'unidad',
  current_stock numeric(12,3) not null default 0,
  min_stock     numeric(12,3) not null default 0,
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Movement log
create table if not exists public.inventory_movements (
  id             uuid primary key default gen_random_uuid(),
  inventory_id   uuid not null references public.inventory(id) on delete cascade,
  type           text not null check (type in ('entrada','salida','ajuste')),
  quantity       numeric(12,3) not null,
  reason         text,
  lote           text,
  movement_date  date not null default current_date,
  responsable    text,
  entry_type     text,
  tab_source     text,
  created_by     uuid references auth.users(id) on delete set null,
  created_at     timestamptz default now()
);

-- Audit log
create table if not exists public.inventory_audit_logs (
  id           uuid primary key default gen_random_uuid(),
  admin_id     uuid references auth.users(id) on delete set null,
  action_type  text not null check (action_type in ('CREATE','UPDATE','DELETE')),
  entity_type  text not null,
  entity_id    uuid,
  inventory_id uuid references public.inventory(id) on delete set null,
  details      jsonb default '{}',
  created_at   timestamptz default now()
);

-- RLS
alter table public.inventory enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.inventory_audit_logs enable row level security;

create policy "Admins manage inventory"
  on public.inventory for all using (public.is_admin());

create policy "Admins manage movements"
  on public.inventory_movements for all using (public.is_admin());

create policy "Admins read audit logs"
  on public.inventory_audit_logs for select using (public.is_admin());

create policy "Admins insert audit logs"
  on public.inventory_audit_logs for insert with check (public.is_admin());

-- Seed finished-product SKUs (no raw/process SKUs)
insert into public.inventory (product_code, product_name, category, unit, min_stock) values
  ('CAFT-125G',  'Café Tostado 125g',   'cafe',     'unidad', 10),
  ('CAFT-250G',  'Café Tostado 250g',   'cafe',     'unidad', 10),
  ('CAFT-500G',  'Café Tostado 500g',   'cafe',     'unidad', 10),
  ('CAFT-2K5',   'Café Tostado 2.5kg',  'cafe',     'unidad', 5),
  ('CAFT-001',   'Café Tostado kg',     'cafe',     'kg',     5),
  ('EMP-BOLSA',  'Bolsa Empaque',       'empaque',  'unidad', 50),
  ('ETQ-CAFE',   'Etiqueta Café',       'empaque',  'unidad', 50),
  ('STK-AMT',    'Stickers',            'empaque',  'unidad', 50),
  ('SACF-001',   'Sacos de fique',      'empaque',  'unidad', 10),
  ('POC-001',    'Pocillo',             'accesorio','unidad', 5)
on conflict (product_code) do nothing;
