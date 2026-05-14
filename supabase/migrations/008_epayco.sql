-- 008: add ePayco reference fields to orders

alter table public.orders
  add column if not exists epayco_ref_payco text,
  add column if not exists epayco_transaction_id text,
  add column if not exists epayco_status text;
