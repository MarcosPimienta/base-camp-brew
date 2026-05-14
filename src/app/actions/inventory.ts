"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createMovement(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const inventoryId = formData.get("inventory_id") as string;
  const type = formData.get("type") as "entrada" | "salida" | "ajuste";
  const rawQty = parseFloat(formData.get("quantity") as string);
  const quantity = type === "salida" ? -Math.abs(rawQty) : Math.abs(rawQty);
  const reason = formData.get("reason") as string;
  const lote = formData.get("lote") as string;
  const movementDate = formData.get("movement_date") as string;
  const responsable = formData.get("responsable") as string;
  const entryType = formData.get("entry_type") as string;
  const tabSource = formData.get("tab_source") as string;

  // Insert movement
  await supabase.from("inventory_movements").insert({
    inventory_id: inventoryId, type, quantity, reason, lote,
    movement_date: movementDate || new Date().toISOString().split("T")[0],
    responsable, entry_type: entryType, tab_source: tabSource, created_by: user.id,
  });

  // Update stock
  const { data: inv } = await supabase.from("inventory").select("current_stock").eq("id", inventoryId).single();
  if (inv) {
    await supabase.from("inventory")
      .update({ current_stock: inv.current_stock + quantity, updated_at: new Date().toISOString() })
      .eq("id", inventoryId);
  }

  // Audit
  await supabase.from("inventory_audit_logs").insert({
    admin_id: user.id, action_type: "CREATE", entity_type: "MOVEMENT",
    inventory_id: inventoryId, details: { type, quantity, reason },
  });

  revalidatePath("/admin/inventory");
}

export async function adjustStock(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const inventoryId = formData.get("inventory_id") as string;
  const newStock = parseFloat(formData.get("new_stock") as string);
  const reason = formData.get("reason") as string;

  const { data: inv } = await supabase.from("inventory").select("current_stock").eq("id", inventoryId).single();
  if (!inv) return;

  const delta = newStock - inv.current_stock;
  await supabase.from("inventory_movements").insert({
    inventory_id: inventoryId, type: "ajuste", quantity: delta,
    reason, tab_source: "inventario", created_by: user.id,
    movement_date: new Date().toISOString().split("T")[0],
  });
  await supabase.from("inventory").update({ current_stock: newStock, updated_at: new Date().toISOString() }).eq("id", inventoryId);
  await supabase.from("inventory_audit_logs").insert({
    admin_id: user.id, action_type: "UPDATE", entity_type: "MOVEMENT",
    inventory_id: inventoryId, details: { old_stock: inv.current_stock, new_stock: newStock, reason },
  });

  revalidatePath("/admin/inventory");
}

export async function createProdAlta(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const outputInventoryId = formData.get("output_inventory_id") as string;
  const outputQty = parseFloat(formData.get("output_quantity") as string);
  const movementDate = formData.get("movement_date") as string;
  const lote = formData.get("lote") as string;
  const materialsJson = formData.get("materials") as string;
  const materials: Array<{ inventory_id: string; quantity: number }> = JSON.parse(materialsJson || "[]");

  // Add finished product stock (entrada)
  const { data: outInv } = await supabase.from("inventory").select("current_stock").eq("id", outputInventoryId).single();
  if (outInv) {
    await supabase.from("inventory_movements").insert({
      inventory_id: outputInventoryId, type: "entrada", quantity: outputQty,
      reason: "Producción - Empaque Alta", lote, tab_source: "empaque",
      movement_date: movementDate, created_by: user.id,
    });
    await supabase.from("inventory").update({ current_stock: outInv.current_stock + outputQty, updated_at: new Date().toISOString() }).eq("id", outputInventoryId);
  }

  // Deduct packaging materials (salida)
  for (const mat of materials) {
    const { data: matInv } = await supabase.from("inventory").select("current_stock").eq("id", mat.inventory_id).single();
    if (matInv) {
      await supabase.from("inventory_movements").insert({
        inventory_id: mat.inventory_id, type: "salida", quantity: -Math.abs(mat.quantity * outputQty),
        reason: `Consumo empaque para ${outputQty} unidades`, tab_source: "empaque",
        movement_date: movementDate, created_by: user.id,
      });
      await supabase.from("inventory").update({ current_stock: Math.max(0, matInv.current_stock - Math.abs(mat.quantity * outputQty)), updated_at: new Date().toISOString() }).eq("id", mat.inventory_id);
    }
  }

  await supabase.from("inventory_audit_logs").insert({
    admin_id: user.id, action_type: "CREATE", entity_type: "MOVEMENT",
    inventory_id: outputInventoryId, details: { output_qty: outputQty, lote, materials },
  });

  revalidatePath("/admin/inventory");
}

export async function createSalida(formData: FormData) {
  return createMovement(formData);
}
