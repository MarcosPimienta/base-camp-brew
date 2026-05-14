import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { updateOrderStatus } from "@/app/actions/orders";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b", paid: "#10b981", processing: "#3b82f6",
  shipped: "#6366f1", delivered: "#22c55e", cancelled: "#ef4444",
};
const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(first_name, last_name), clients(name)")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "2.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>ORDERS</h1>
          <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
            {orders?.length ?? 0} total orders
          </p>
        </div>
      </div>

      <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1.5fr", gap: "1rem", padding: "0.75rem 1.5rem", borderBottom: "1px solid rgba(184,154,106,0.1)", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>Customer</span><span>Date</span><span>Amount</span><span>Status</span><span>Actions</span>
        </div>

        {orders?.map((order) => {
          const customerName = order.profiles
            ? `${order.profiles.first_name} ${order.profiles.last_name}`
            : order.clients?.name ?? order.contact_email ?? "—";

          return (
            <div key={order.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 1.5fr", gap: "1rem", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(184,154,106,0.05)", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.9rem" }}>{customerName}</span>
              <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {new Date(order.created_at).toLocaleDateString("es-CO")}
              </span>
              <span style={{ fontFamily: "var(--font-hero)", color: "var(--metal-gold)", fontSize: "0.95rem" }}>
                {formatCOP(order.total_amount)}
              </span>
              {/* Status update inline form */}
              <form action={updateOrderStatus} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="hidden" name="id" value={order.id} />
                <select name="status" defaultValue={order.status}
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${STATUS_COLORS[order.status] ?? "#888"}`, color: STATUS_COLORS[order.status] ?? "#888", padding: "0.3rem 0.5rem", fontFamily: "var(--font-condensed)", fontSize: "0.75rem", letterSpacing: "0.05em", cursor: "pointer" }}>
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="submit" style={{ background: "none", border: "1px solid rgba(184,154,106,0.3)", color: "var(--sand-tactical)", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", padding: "0.3rem 0.6rem", cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Save
                </button>
              </form>
              <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          );
        })}
        {(!orders || orders.length === 0) && (
          <div style={{ padding: "3rem", textAlign: "center", fontFamily: "var(--font-condensed)", color: "var(--text-secondary)" }}>No orders yet.</div>
        )}
      </div>
    </div>
  );
}
