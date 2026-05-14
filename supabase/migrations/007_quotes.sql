-- 007: quotes + proposals tables + RLS

create table if not exists public.quotes (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid references public.clients(id) on delete set null,
  title        text not null,
  content      jsonb default '{}',
  status       text not null default 'draft' check (status in ('draft','sent','approved','rejected')),
  total_amount numeric(12,2) default 0,
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table if not exists public.proposals (
  id                   uuid primary key default gen_random_uuid(),
  client_id            uuid references public.clients(id) on delete set null,
  title                text not null,
  subtitle             text,
  content              jsonb default '[]',
  status               text not null default 'Borrador' check (status in ('Borrador','Enviada','Aprobada')),
  ally_logo_url        text,
  background_image_url text,
  background_opacity   numeric(3,2) default 0.3,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

alter table public.quotes enable row level security;
alter table public.proposals enable row level security;

create policy "Admins manage quotes"
  on public.quotes for all using (public.is_admin());

create policy "Admins manage proposals"
  on public.proposals for all using (public.is_admin());
