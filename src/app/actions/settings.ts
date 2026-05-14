"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("store_settings").update({
    store_name: formData.get("store_name"),
    admin_email: formData.get("admin_email"),
    base_currency: formData.get("base_currency"),
    updated_at: new Date().toISOString(),
  }).eq("id", 1);
  revalidatePath("/admin/settings");
}

export async function updateShippingSettings(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("store_settings").update({
    default_shipping_cost: parseFloat(formData.get("default_shipping_cost") as string),
    free_shipping_threshold: parseFloat(formData.get("free_shipping_threshold") as string),
    updated_at: new Date().toISOString(),
  }).eq("id", 1);
  revalidatePath("/admin/settings");
}
