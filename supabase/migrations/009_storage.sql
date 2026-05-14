-- 009: Supabase Storage bucket for proposal assets
-- Run this in the Supabase SQL editor or via the Storage UI

-- Create the bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('proposal-assets', 'proposal-assets', false)
on conflict (id) do nothing;

-- Policy: admins can upload
create policy "Admins can upload proposal assets"
  on storage.objects for insert
  with check (
    bucket_id = 'proposal-assets'
    and public.is_admin()
  );

-- Policy: admins can read
create policy "Admins can read proposal assets"
  on storage.objects for select
  using (
    bucket_id = 'proposal-assets'
    and public.is_admin()
  );

-- Policy: admins can delete
create policy "Admins can delete proposal assets"
  on storage.objects for delete
  using (
    bucket_id = 'proposal-assets'
    and public.is_admin()
  );
