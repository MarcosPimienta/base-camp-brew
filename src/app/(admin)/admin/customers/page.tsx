import { createClient } from "@/utils/supabase/server";
import { createClient2 } from "@/app/actions/clients";

const DOCUMENT_TYPES = ["NIT", "CC", "CE", "Pasaporte"];
const DEPARTMENTS = ["Antioquia","Bogotá D.C.","Valle del Cauca","Cundinamarca","Santander","Atlántico","Bolívar","Nariño","Córdoba","Tolima","Huila","Magdalena","Boyacá","Meta","Risaralda","Caldas","Norte de Santander","La Guajira","Sucre","Chocó","Quindío","Arauca","Putumayo","Caquetá","Casanare","Vichada","Guainía","Vaupés","Amazonas","San Andrés y Providencia","Cauca","Cesar","Guaviare"];
const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)", color: "var(--text-primary)", padding: "0.6rem 0.75rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.3rem" };

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*, orders(id)")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "2.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>B2B CUSTOMERS</h1>
      <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "2rem" }}>{clients?.length ?? 0} clients</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>
        <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr", gap: "0.75rem", padding: "0.6rem 1rem", borderBottom: "1px solid rgba(184,154,106,0.1)", fontFamily: "var(--font-condensed)", fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <span>Name</span><span>Contact</span><span>City</span><span>Orders</span>
          </div>
          {clients?.map(c => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr", gap: "0.75rem", padding: "0.75rem 1rem", borderBottom: "1px solid rgba(184,154,106,0.05)", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.85rem" }}>{c.name}</p>
                <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.7rem", color: "var(--text-secondary)" }}>{c.document_type} {c.document_number}</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.8rem" }}>{c.email ?? "—"}</p>
                <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{c.phone ?? "—"}</p>
              </div>
              <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{c.city ?? "—"}</span>
              <span style={{ fontFamily: "var(--font-hero)", color: "var(--metal-gold)", fontSize: "0.95rem" }}>{Array.isArray(c.orders) ? c.orders.length : 0}</span>
            </div>
          ))}
          {(!clients || clients.length === 0) && <div style={{ padding: "3rem", textAlign: "center", fontFamily: "var(--font-condensed)", color: "var(--text-secondary)" }}>No clients yet.</div>}
        </div>

        {/* Create client form */}
        <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)", padding: "1.5rem", position: "sticky", top: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.3rem", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>ADD CLIENT</h2>
          <form action={createClient2} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div><label style={labelStyle}>Company Name</label><input name="name" required style={inputStyle} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div><label style={labelStyle}>Document Type</label>
                <select name="document_type" style={{ ...inputStyle, background: "var(--camo-dark)" }}>
                  {DOCUMENT_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Document #</label><input name="document_number" style={inputStyle} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div><label style={labelStyle}>Email</label><input name="email" type="email" style={inputStyle} /></div>
              <div><label style={labelStyle}>Phone</label><input name="phone" style={inputStyle} /></div>
            </div>
            <div><label style={labelStyle}>Department</label>
              <select name="department" style={{ ...inputStyle, background: "var(--camo-dark)" }}>
                <option value="">—</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div><label style={labelStyle}>City</label><input name="city" style={inputStyle} /></div>
              <div><label style={labelStyle}>Address</label><input name="address" style={inputStyle} /></div>
            </div>
            <div><label style={labelStyle}>Notes</label><input name="notes" style={inputStyle} /></div>
            <button type="submit" style={{ background: "var(--sand-tactical)", color: "var(--coffee-black)", border: "none", padding: "0.6rem 1.5rem", fontFamily: "var(--font-hero)", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", fontSize: "0.9rem" }}>Add Client</button>
          </form>
        </div>
      </div>
    </div>
  );
}
