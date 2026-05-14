-- 003: orders + order_items tables + RLS
-- Note: client_id FK to clients added in 005_clients.sql after clients table exists

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(id) on delete set null,
  client_id       uuid,
  total_amount    numeric(12,2) not null default 0,
  status          text not null default 'pending'
                    check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  contact_email   text,
  contact_phone   text,
  shipping_info   jsonb default '{}',
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  product_id      text not null,
  product_name    text,
  weight          text,
  grind           text,
  quantity        integer not null default 1,
  price_at_time   numeric(12,2) not null,
  created_at      timestamptz default now()
);

-- RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Users see own orders"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id or public.is_admin());

create policy "Admins manage orders"
  on public.orders for all
  using (public.is_admin());

create policy "Order items visible to order owner"
  on public.order_items for select
  using (
    public.is_admin() or
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "Admins manage order items"
  on public.order_items for all
  using (public.is_admin());
