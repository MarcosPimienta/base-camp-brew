-- 005: clients CRM table (B2B, not linked to auth)

create table if not exists public.clients (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  document_type   text default 'NIT' check (document_type in ('NIT', 'CC', 'CE', 'Pasaporte')),
  document_number text,
  email           text,
  phone           text,
  address         text,
  city            text,
  department      text,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.clients enable row level security;

create policy "Admins manage clients"
  on public.clients for all
  using (public.is_admin());

-- Add FK from orders to clients now that clients table exists
alter table public.orders
  add constraint orders_client_id_fkey
  foreign key (client_id) references public.clients(id) on delete set null;
