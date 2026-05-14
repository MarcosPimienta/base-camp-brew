"use server";
// Note: PLAN_PRICES and WEIGHT_MULTIPLIERS are in @/app/lib/subscriptionConstants

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function upsertSubscription(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string | null;
  const planId = formData.get("plan_id") as string;
  const weight = formData.get("weight") as string;
  const grind = formData.get("grind") as string;
  const grindLevel = formData.get("grind_level") as string | null;
  const frequency = formData.get("frequency") as string;
  const shippingState = formData.get("shipping_state") as string;
  const shippingCity = formData.get("shipping_city") as string;
  const shippingAddress = formData.get("shipping_address") as string;
  const shippingDetails = formData.get("shipping_details") as string;

  // Calculate next delivery date
  const today = new Date();
  const nextDelivery = new Date(today);
  if (frequency === "weekly") nextDelivery.setDate(today.getDate() + 7);
  else if (frequency === "bi-weekly") nextDelivery.setDate(today.getDate() + 14);
  else nextDelivery.setMonth(today.getMonth() + 1);

  const payload = {
    user_id: user.id,
    plan_id: planId,
    frequency,
    weight,
    grind,
    grind_level: grind === "ground" ? grindLevel : null,
    status: "active",
    next_delivery_date: nextDelivery.toISOString().split("T")[0],
    shipping_state: shippingState,
    shipping_city: shippingCity,
    shipping_address: shippingAddress,
    shipping_details: shippingDetails,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    // Edit mode — verify ownership (IDOR protection)
    const { data: existing } = await supabase
      .from("subscriptions").select("user_id").eq("id", id).single();
    if (!existing || existing.user_id !== user.id) redirect("/dashboard");

    await supabase.from("subscriptions").update(payload).eq("id", id);
  } else {
    await supabase.from("subscriptions").insert(payload);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?tab=overview");
}

export async function cancelSubscription(subscriptionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("subscriptions")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", subscriptionId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}

export async function updateSubscriptionStatus(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  await supabase.from("subscriptions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/subscriptions");
}


