"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createManualAdminOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const clientId = formData.get("client_id") as string | null;
  const contactEmail = formData.get("contact_email") as string;
  const contactPhone = formData.get("contact_phone") as string;
  const shippingAddress = formData.get("shipping_address") as string;
  const shippingCity = formData.get("shipping_city") as string;
  const shippingState = formData.get("shipping_state") as string;
  const notes = formData.get("notes") as string;

  const itemsJson = formData.get("items") as string;
  const items: Array<{ product_id: string; product_name: string; quantity: number; price: number }> =
    JSON.parse(itemsJson);

  const totalAmount = items.reduce((s, i) => s + i.quantity * i.price, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      client_id: clientId || null,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      shipping_info: { address: shippingAddress, city: shippingCity, state: shippingState },
      total_amount: totalAmount,
      notes,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) redirect("/admin/orders?error=Order+creation+failed");

  // Insert order items
  await supabase.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.product_name,
      quantity: i.quantity,
      price_at_time: i.price,
    }))
  );

  // Deduct inventory (salida) for each item that matches a product_code
  for (const item of items) {
    const { data: inv } = await supabase
      .from("inventory")
      .select("id, current_stock")
      .eq("product_code", item.product_id)
      .single();

    if (inv) {
      await supabase.from("inventory_movements").insert({
        inventory_id: inv.id,
        type: "salida",
        quantity: -Math.abs(item.quantity),
        reason: `Manual order ${order.id}`,
        tab_source: "orders",
        created_by: user.id,
      });
      await supabase.from("inventory")
        .update({ current_stock: Math.max(0, inv.current_stock - item.quantity), updated_at: new Date().toISOString() })
        .eq("id", inv.id);
      // Audit log
      await supabase.from("inventory_audit_logs").insert({
        admin_id: user.id,
        action_type: "CREATE",
        entity_type: "MOVEMENT",
        inventory_id: inv.id,
        details: { order_id: order.id, quantity: item.quantity },
      });
    }
  }

  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  await supabase.from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/orders");
}

export async function deleteOrder(orderId: string) {
  const supabase = await createClient();
  // Revert inventory movements associated with this order
  const { data: orderItems } = await supabase
    .from("order_items").select("*").eq("order_id", orderId);

  if (orderItems) {
    for (const item of orderItems) {
      const { data: inv } = await supabase
        .from("inventory").select("id, current_stock").eq("product_code", item.product_id).single();
      if (inv) {
        await supabase.from("inventory")
          .update({ current_stock: inv.current_stock + item.quantity, updated_at: new Date().toISOString() })
          .eq("id", inv.id);
      }
    }
  }

  await supabase.from("orders").delete().eq("id", orderId);
  revalidatePath("/admin/orders");
}
