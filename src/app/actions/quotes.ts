"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createQuote(formData: FormData) {
  const supabase = await createClient();
  const contentJson = formData.get("content") as string;
  await supabase.from("quotes").insert({
    client_id: formData.get("client_id") || null,
    title: formData.get("title"),
    content: contentJson ? JSON.parse(contentJson) : {},
    status: "draft",
    total_amount: parseFloat((formData.get("total_amount") as string) || "0"),
    notes: formData.get("notes"),
  });
  revalidatePath("/admin/quotes");
  redirect("/admin/quotes");
}

export async function updateQuote(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const contentJson = formData.get("content") as string;
  await supabase.from("quotes").update({
    title: formData.get("title"),
    content: contentJson ? JSON.parse(contentJson) : {},
    status: formData.get("status"),
    total_amount: parseFloat((formData.get("total_amount") as string) || "0"),
    notes: formData.get("notes"),
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/admin/quotes");
  redirect("/admin/quotes");
}

export async function deleteQuote(quoteId: string) {
  const supabase = await createClient();
  await supabase.from("quotes").delete().eq("id", quoteId);
  revalidatePath("/admin/quotes");
}

export async function createProposal(formData: FormData) {
  const supabase = await createClient();
  const contentJson = formData.get("content") as string;
  await supabase.from("proposals").insert({
    client_id: formData.get("client_id") || null,
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    content: contentJson ? JSON.parse(contentJson) : [],
    status: "Borrador",
    ally_logo_url: formData.get("ally_logo_url") || null,
    background_image_url: formData.get("background_image_url") || null,
    background_opacity: parseFloat((formData.get("background_opacity") as string) || "0.3"),
  });
  revalidatePath("/admin/quotes/proposals");
  redirect("/admin/quotes/proposals");
}

export async function updateProposal(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const contentJson = formData.get("content") as string;
  await supabase.from("proposals").update({
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    content: contentJson ? JSON.parse(contentJson) : [],
    status: formData.get("status"),
    ally_logo_url: formData.get("ally_logo_url") || null,
    background_image_url: formData.get("background_image_url") || null,
    background_opacity: parseFloat((formData.get("background_opacity") as string) || "0.3"),
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/admin/quotes/proposals");
  redirect("/admin/quotes/proposals");
}

export async function deleteProposal(proposalId: string) {
  const supabase = await createClient();
  await supabase.from("proposals").delete().eq("id", proposalId);
  revalidatePath("/admin/quotes/proposals");
}

export async function getProposalAssetSignedUrl(path: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.storage.from("proposal-assets").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}
