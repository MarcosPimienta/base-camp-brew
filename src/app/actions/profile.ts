"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      cedula_number: formData.get("cedula_number"),
      phone_number: formData.get("phone_number"),
      department: formData.get("department"),
      city: formData.get("city"),
      address: formData.get("address"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) redirect("/dashboard?tab=profile&error=Update+failed");
  revalidatePath("/dashboard");
  redirect("/dashboard?tab=profile&success=1");
}
