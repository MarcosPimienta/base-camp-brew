import { createClient } from "@/utils/supabase/server";
import { createAdminUser } from "@/app/actions/users";

const DEPARTMENTS = ["Antioquia","Bogotá D.C.","Valle del Cauca","Cundinamarca","Santander","Atlántico","Bolívar","Nariño","Córdoba","Tolima","Cauca","Huila","Magdalena","Boyacá","Cesar","Meta","Risaralda","Caldas","Norte de Santander","La Guajira","Sucre","Chocó","Quindío","Arauca","Putumayo","Caquetá","Casanare","Guajira","Vichada","Guainía","Vaupés","Amazonas","San Andrés y Providencia"];
const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)", color: "var(--text-primary)", padding: "0.6rem 0.75rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.3rem" };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <div style={{ padding: "2.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>USERS</h1>
      <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "2rem" }}>{profiles?.length ?? 0} registered</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>
        {/* Users table */}
        <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0.75rem", padding: "0.6rem 1rem", borderBottom: "1px solid rgba(184,154,106,0.1)", fontFamily: "var(--font-condensed)", fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <span>Name</span><span>Role</span><span>Joined</span>
          </div>
          {profiles?.map(p => (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0.75rem", padding: "0.75rem 1rem", borderBottom: "1px solid rgba(184,154,106,0.05)", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.85rem" }}>{p.first_name} {p.last_name}</p>
                <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>{p.city ?? "—"}</p>
              </div>
              <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.75rem", textTransform: "uppercase", color: p.role === "admin" ? "var(--sand-tactical)" : "var(--text-secondary)" }}>{p.role}</span>
              <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{new Date(p.created_at).toLocaleDateString("es-CO")}</span>
            </div>
          ))}
        </div>

        {/* Create user form */}
        <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)", padding: "1.5rem", position: "sticky", top: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.3rem", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>CREATE USER</h2>
          <form action={createAdminUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div><label style={labelStyle}>First Name</label><input name="first_name" required style={inputStyle} /></div>
              <div><label style={labelStyle}>Last Name</label><input name="last_name" required style={inputStyle} /></div>
            </div>
            <div><label style={labelStyle}>Email</label><input name="email" type="email" required style={inputStyle} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div><label style={labelStyle}>Cédula</label><input name="cedula_number" style={inputStyle} /></div>
              <div><label style={labelStyle}>Phone</label><input name="phone_number" style={inputStyle} /></div>
            </div>
            <div><label style={labelStyle}>Department</label>
              <select name="department" style={{ ...inputStyle, background: "var(--camo-dark)" }}>
                <option value="">—</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>City</label><input name="city" style={inputStyle} /></div>
            <div><label style={labelStyle}>Address</label><input name="address" style={inputStyle} /></div>
            <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.7rem", color: "var(--text-secondary)" }}>Default password: <strong style={{ color: "var(--sand-tactical)" }}>Amantti2026*</strong></p>
            <button type="submit" style={{ background: "var(--sand-tactical)", color: "var(--coffee-black)", border: "none", padding: "0.6rem 1.5rem", fontFamily: "var(--font-hero)", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", fontSize: "0.9rem" }}>Create User</button>
          </form>
        </div>
      </div>
    </div>
  );
}
