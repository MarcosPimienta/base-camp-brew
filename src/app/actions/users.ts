"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAdminUser(formData: FormData) {
  const supabase = await createAdminClient();

  const email = formData.get("email") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const cedulaNumber = formData.get("cedula_number") as string;
  const phoneNumber = formData.get("phone_number") as string;
  const department = formData.get("department") as string;
  const city = formData.get("city") as string;
  const address = formData.get("address") as string;

  // Create auth user via admin API
  const { data: authUser, error } = await supabase.auth.admin.createUser({
    email,
    password: "Amantti2026*",
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });

  if (error || !authUser.user) {
    redirect(`/admin/users?error=${encodeURIComponent(error?.message ?? "Failed")}`);
  }

  // Update profile with extra fields (trigger already created the row)
  await supabase.from("profiles").update({
    first_name: firstName,
    last_name: lastName,
    cedula_number: cedulaNumber,
    phone_number: phoneNumber,
    department,
    city,
    address,
    updated_at: new Date().toISOString(),
  }).eq("id", authUser.user.id);

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
