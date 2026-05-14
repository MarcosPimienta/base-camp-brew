"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createClient2(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("clients").insert({
    name: formData.get("name"),
    document_type: formData.get("document_type"),
    document_number: formData.get("document_number"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    department: formData.get("department"),
    notes: formData.get("notes"),
  });
  revalidatePath("/admin/customers");
  redirect("/admin/customers");
}

export async function updateClientAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  await supabase.from("clients").update({
    name: formData.get("name"),
    document_type: formData.get("document_type"),
    document_number: formData.get("document_number"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    department: formData.get("department"),
    notes: formData.get("notes"),
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/admin/customers");
  redirect("/admin/customers");
}

export async function deleteClient(clientId: string) {
  const supabase = await createClient();
  await supabase.from("clients").delete().eq("id", clientId);
  revalidatePath("/admin/customers");
}
