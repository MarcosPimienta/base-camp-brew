import { createClient } from "@/utils/supabase/server";

const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b", paid: "#10b981", processing: "#3b82f6",
  shipped: "#6366f1", delivered: "#22c55e", cancelled: "#ef4444",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: orderCount },
    { count: subCount },
    { data: recentOrders },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("orders").select("*, profiles(first_name, last_name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("total_amount").in("status", ["paid", "delivered"]),
  ]);

  const totalRevenue = revenueData?.reduce((s, o) => s + (o.total_amount ?? 0), 0) ?? 0;

  const kpis = [
    { label: "Total Revenue", value: formatCOP(totalRevenue), icon: "💰" },
    { label: "Total Orders", value: orderCount ?? 0, icon: "📦" },
    { label: "Active Subscriptions", value: subCount ?? 0, icon: "🔄" },
  ];

  return (
    <div style={{ padding: "2.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
        ADMIN DASHBOARD
      </h1>
      <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "2.5rem", letterSpacing: "0.05em" }}>
        Operations overview
      </p>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{
            background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)",
            padding: "1.75rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                  {kpi.label}
                </p>
                <p style={{ fontFamily: "var(--font-hero)", fontSize: "2rem", color: "var(--metal-gold)", letterSpacing: "0.05em" }}>
                  {kpi.value}
                </p>
              </div>
              <span style={{ fontSize: "2rem" }}>{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.5rem", letterSpacing: "0.05em", marginBottom: "1rem" }}>
        RECENT ORDERS
      </h2>
      <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr", gap: "1rem", padding: "0.75rem 1.5rem", borderBottom: "1px solid rgba(184,154,106,0.1)", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>Customer</span><span>Date</span><span>Amount</span><span>Status</span>
        </div>
        {recentOrders?.map((order) => (
          <div key={order.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr", gap: "1rem", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(184,154,106,0.05)", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.9rem" }}>
              {order.profiles ? `${order.profiles.first_name} ${order.profiles.last_name}` : order.contact_email ?? "—"}
            </span>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {new Date(order.created_at).toLocaleDateString("es-CO")}
            </span>
            <span style={{ fontFamily: "var(--font-hero)", color: "var(--metal-gold)", fontSize: "0.95rem" }}>
              {formatCOP(order.total_amount)}
            </span>
            <span style={{
              fontFamily: "var(--font-condensed)", fontSize: "0.7rem", letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "0.25rem 0.5rem",
              border: `1px solid ${STATUS_COLORS[order.status] ?? "#888"}`,
              color: STATUS_COLORS[order.status] ?? "#888", display: "inline-block",
            }}>
              {order.status}
            </span>
          </div>
        ))}
        {(!recentOrders || recentOrders.length === 0) && (
          <div style={{ padding: "2rem", textAlign: "center", fontFamily: "var(--font-condensed)", color: "var(--text-secondary)" }}>
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
