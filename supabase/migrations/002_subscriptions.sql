-- 002: subscriptions table + RLS

create table if not exists public.subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  plan_id            text not null check (plan_id in ('essential', 'alchemy', 'curator')),
  frequency          text not null check (frequency in ('weekly', 'bi-weekly', 'monthly')),
  weight             text not null check (weight in ('250g', '500g', '2.5kg')),
  grind              text not null check (grind in ('whole', 'ground')),
  grind_level        text check (grind_level in ('espresso', 'drip', 'french-press')),
  status             text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
  next_delivery_date date,
  shipping_state     text,
  shipping_city      text,
  shipping_address   text,
  shipping_details   text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can insert own subscription"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscription"
  on public.subscriptions for update
  using (auth.uid() = user_id or public.is_admin());

create policy "Admins can delete subscriptions"
  on public.subscriptions for delete
  using (public.is_admin());
