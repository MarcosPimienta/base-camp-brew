import { createClient } from "@/utils/supabase/server";
import InventoryClient from "./InventoryClient";

export default async function AdminInventoryPage() {
  const supabase = await createClient();

  const [{ data: inventory }, { data: movements }, { data: auditLogs }] = await Promise.all([
    supabase.from("inventory").select("*").order("category").order("product_name"),
    supabase.from("inventory_movements").select("*, inventory(product_name, product_code)").order("created_at", { ascending: false }).limit(500),
    supabase.from("inventory_audit_logs").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  return (
    <InventoryClient
      inventory={inventory ?? []}
      movements={movements ?? []}
      auditLogs={auditLogs ?? []}
    />
  );
}
