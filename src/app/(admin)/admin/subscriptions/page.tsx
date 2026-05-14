import { createClient } from "@/utils/supabase/server";
import { updateSubscriptionStatus } from "@/app/actions/subscriptions";

const PLAN_NAMES: Record<string, string> = { essential: "Essential Devotion", alchemy: "Alchemy & Contrast", curator: "Private Curation" };
const STATUS_COLORS: Record<string, string> = { active: "#22c55e", paused: "#f59e0b", cancelled: "#ef4444" };

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient();
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("*, profiles(first_name, last_name, cedula_number)")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "2.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>SUBSCRIPTIONS</h1>
      <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "2rem" }}>{subs?.length ?? 0} total</p>
      <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1.5fr", gap: "0.75rem", padding: "0.6rem 1rem", borderBottom: "1px solid rgba(184,154,106,0.1)", fontFamily: "var(--font-condensed)", fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>Customer</span><span>Plan</span><span>Frequency</span><span>Weight</span><span>Next Delivery</span><span>Status</span>
        </div>
        {subs?.map(sub => (
          <div key={sub.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1.5fr", gap: "0.75rem", padding: "0.75rem 1rem", borderBottom: "1px solid rgba(184,154,106,0.05)", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.85rem" }}>
              {sub.profiles ? `${sub.profiles.first_name} ${sub.profiles.last_name}` : "—"}
            </span>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.8rem" }}>{PLAN_NAMES[sub.plan_id] ?? sub.plan_id}</span>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{sub.frequency}</span>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.8rem" }}>{sub.weight}</span>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{sub.next_delivery_date ?? "—"}</span>
            <form action={updateSubscriptionStatus} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input type="hidden" name="id" value={sub.id} />
              <select name="status" defaultValue={sub.status} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${STATUS_COLORS[sub.status] ?? "#888"}`, color: STATUS_COLORS[sub.status] ?? "#888", padding: "0.3rem 0.5rem", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", cursor: "pointer" }}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button type="submit" style={{ background: "none", border: "1px solid rgba(184,154,106,0.3)", color: "var(--sand-tactical)", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", padding: "0.3rem 0.6rem", cursor: "pointer", textTransform: "uppercase" }}>Save</button>
            </form>
          </div>
        ))}
        {(!subs || subs.length === 0) && <div style={{ padding: "3rem", textAlign: "center", fontFamily: "var(--font-condensed)", color: "var(--text-secondary)" }}>No subscriptions yet.</div>}
      </div>
    </div>
  );
}
