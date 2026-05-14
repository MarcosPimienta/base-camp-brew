import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateUserProfile } from "@/app/actions/profile";

const DEPARTMENTS = [
  "Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas","Caquetá",
  "Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guainía","Guaviare",
  "Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander","Putumayo",
  "Quindío","Risaralda","San Andrés y Providencia","Santander","Sucre","Tolima",
  "Valle del Cauca","Vaupés","Vichada"
];

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.75rem",
    letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.4rem",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)",
    color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-body)", outline: "none", fontSize: "1rem",
  };

  return (
    <>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
        BRIEFING
      </h1>
      <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Complete your profile to continue.
      </p>
      <form action={updateUserProfile} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>ID Number (Cédula)</label>
            <input name="cedula_number" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input name="phone_number" type="tel" style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Department</label>
          <select name="department"
            style={{ ...inputStyle, background: "var(--camo-dark)" }}>
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>City</label>
          <input name="city" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Address</label>
          <input name="address" style={inputStyle} />
        </div>
        {/* Keep first/last from existing profile */}
        <input type="hidden" name="first_name" value="" />
        <input type="hidden" name="last_name" value="" />
        <button type="submit" className="btn" style={{ width: "100%" }} suppressHydrationWarning>
          Continue to Dashboard
        </button>
      </form>
    </>
  );
}
