import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateUserProfile } from "@/app/actions/profile";
import { cancelSubscription } from "@/app/actions/subscriptions";

const DEPARTMENTS = [
  "Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas","Caquetá",
  "Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guainía","Guaviare",
  "Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander","Putumayo",
  "Quindío","Risaralda","San Andrés y Providencia","Santander","Sucre","Tolima",
  "Valle del Cauca","Vaupés","Vichada"
];

const PLAN_NAMES: Record<string, string> = {
  essential: "Essential Devotion",
  alchemy: "Alchemy & Contrast",
  curator: "Private Curation",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b", paid: "#10b981", processing: "#3b82f6",
  shipped: "#6366f1", delivered: "#22c55e", cancelled: "#ef4444",
};

interface Props {
  searchParams: Promise<{ tab?: string; success?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { tab = "overview", success } = await searchParams;

  // Fetch data
  const [{ data: profile }, { data: subscriptions }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  const activeSub = subscriptions?.find((s) => s.status === "active");

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.75rem 1.5rem",
    fontFamily: "var(--font-hero)",
    fontSize: "1rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "pointer",
    color: active ? "var(--coffee-black)" : "var(--text-secondary)",
    background: active ? "var(--sand-tactical)" : "transparent",
    border: "none",
    textDecoration: "none",
    display: "inline-block",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)",
    color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-body)", fontSize: "1rem", outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.75rem",
    letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.4rem",
  };

  const formatCOP = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ minHeight: "100vh", background: "var(--coffee-black)", paddingTop: "5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 280px", gap: "2rem", alignItems: "start" }}>

        {/* Main content */}
        <div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
            DASHBOARD
          </h1>
          <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Welcome back, {profile?.first_name ?? user.email}
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "0", borderBottom: "1px solid rgba(184,154,106,0.15)", marginBottom: "2rem" }}>
            {["overview", "orders", "profile"].map((t) => (
              <Link key={t} href={`/dashboard?tab=${t}`} style={tabStyle(tab === t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Link>
            ))}
          </div>

          {success && (
            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontFamily: "var(--font-condensed)", fontSize: "0.85rem" }}>
              Changes saved successfully.
            </div>
          )}

          {/* Overview Tab */}
          {tab === "overview" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.5rem", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                ACTIVE SUBSCRIPTION
              </h2>
              {activeSub ? (
                <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.2)", padding: "1.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                      ["Plan", PLAN_NAMES[activeSub.plan_id] ?? activeSub.plan_id],
                      ["Weight", activeSub.weight],
                      ["Grind", activeSub.grind],
                      ["Frequency", activeSub.frequency],
                      ["Next Delivery", activeSub.next_delivery_date ?? "TBD"],
                      ["Status", activeSub.status.toUpperCase()],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{label}</p>
                        <p style={{ fontFamily: "var(--font-hero)", fontSize: "1rem", letterSpacing: "0.05em" }}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Link href={`/builder?id=${activeSub.id}`} className="btn" style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>
                      Edit
                    </Link>
                    <form action={async () => {
                      "use server";
                      await cancelSubscription(activeSub.id);
                    }}>
                      <button type="submit" style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontFamily: "var(--font-hero)", padding: "0.6rem 1.5rem", cursor: "pointer", fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.1)", padding: "3rem", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                    No active subscription. Start your mission.
                  </p>
                  <Link href="/builder" className="btn">Subscribe Now</Link>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {tab === "orders" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.5rem", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                ORDER HISTORY
              </h2>
              {orders && orders.length > 0 ? (
                <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)" }}>
                  {orders.map((order, i) => (
                    <div key={order.id} style={{
                      display: "grid", gridTemplateColumns: "1fr auto auto",
                      gap: "1rem", alignItems: "center", padding: "1rem 1.5rem",
                      borderBottom: i < orders.length - 1 ? "1px solid rgba(184,154,106,0.1)" : "none",
                    }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.75rem", color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
                          {new Date(order.created_at).toLocaleDateString("es-CO")}
                        </p>
                        <p style={{ fontFamily: "var(--font-hero)", fontSize: "0.95rem", letterSpacing: "0.05em", marginTop: "0.2rem" }}>
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <span style={{
                        fontFamily: "var(--font-condensed)", fontSize: "0.7rem", letterSpacing: "0.1em",
                        textTransform: "uppercase", padding: "0.3rem 0.75rem",
                        border: `1px solid ${STATUS_COLORS[order.status] ?? "#888"}`,
                        color: STATUS_COLORS[order.status] ?? "#888",
                      }}>
                        {order.status}
                      </span>
                      <span style={{ fontFamily: "var(--font-hero)", color: "var(--metal-gold)", fontSize: "1rem" }}>
                        {formatCOP(order.total_amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.1)", padding: "3rem", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)" }}>No orders yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {tab === "profile" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.5rem", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                PROFILE
              </h2>
              <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)", padding: "2rem" }}>
                <form action={updateUserProfile} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>First Name</label>
                      <input name="first_name" defaultValue={profile?.first_name ?? ""} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name</label>
                      <input name="last_name" defaultValue={profile?.last_name ?? ""} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>ID Number</label>
                      <input name="cedula_number" defaultValue={profile?.cedula_number ?? ""} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone</label>
                      <input name="phone_number" type="tel" defaultValue={profile?.phone_number ?? ""} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Department</label>
                    <select name="department" defaultValue={profile?.department ?? ""} style={{ ...inputStyle, background: "var(--camo-dark)" }}>
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>City</label>
                      <input name="city" defaultValue={profile?.city ?? ""} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Address</label>
                      <input name="address" defaultValue={profile?.address ?? ""} style={inputStyle} />
                    </div>
                  </div>
                  <button type="submit" className="btn" suppressHydrationWarning>Save Changes</button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: "6rem" }}>
          <div style={{ background: "#1a1a1a", border: "1px solid rgba(184,154,106,0.2)", padding: "2rem" }}>
            <p style={{ fontFamily: "var(--font-hero)", fontSize: "1.1rem", letterSpacing: "0.05em", color: "var(--sand-tactical)", lineHeight: 1.5, fontStyle: "italic" }}>
              &ldquo;Coffee is the common man&apos;s gold, and like gold, it brings to every person the feeling of luxury and nobility.&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginTop: "1rem", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
              — Sheikh-Abd-al-Kadir
            </p>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Link href="/builder" style={{
              display: "block", background: "var(--sand-tactical)", color: "var(--coffee-black)",
              fontFamily: "var(--font-hero)", letterSpacing: "0.05em", textTransform: "uppercase",
              padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.9rem", textDecoration: "none",
            }}>
              {activeSub ? "Manage Subscription" : "Start Subscription"}
            </Link>
            <Link href="/#coffee" style={{
              display: "block", border: "1px solid rgba(184,154,106,0.3)", color: "var(--sand-tactical)",
              fontFamily: "var(--font-hero)", letterSpacing: "0.05em", textTransform: "uppercase",
              padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.9rem", textDecoration: "none",
            }}>
              Shop Coffee
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
