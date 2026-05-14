import { createClient } from "@/utils/supabase/server";
import { updateStoreSettings, updateShippingSettings } from "@/app/actions/settings";

const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)", color: "var(--text-primary)", padding: "0.6rem 0.75rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.3rem" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("store_settings").select("*").eq("id", 1).single();

  return (
    <div style={{ padding: "2.5rem", maxWidth: 800 }}>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "2rem" }}>SETTINGS</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Store settings */}
        <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)", padding: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.3rem", letterSpacing: "0.05em", marginBottom: "1.5rem", color: "var(--sand-tactical)" }}>STORE</h2>
          <form action={updateStoreSettings} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div><label style={labelStyle}>Store Name</label><input name="store_name" defaultValue={settings?.store_name ?? ""} style={inputStyle} /></div>
            <div><label style={labelStyle}>Admin Email</label><input name="admin_email" type="email" defaultValue={settings?.admin_email ?? ""} style={inputStyle} /></div>
            <div><label style={labelStyle}>Base Currency</label>
              <select name="base_currency" defaultValue={settings?.base_currency ?? "COP"} style={{ ...inputStyle, background: "var(--camo-dark)" }}>
                <option value="COP">COP</option><option value="USD">USD</option>
              </select>
            </div>
            <button type="submit" style={{ background: "var(--sand-tactical)", color: "var(--coffee-black)", border: "none", padding: "0.6rem 1.5rem", fontFamily: "var(--font-hero)", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", fontSize: "0.9rem", alignSelf: "flex-start" }}>Save Store Settings</button>
          </form>
        </div>

        {/* Shipping settings */}
        <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)", padding: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.3rem", letterSpacing: "0.05em", marginBottom: "1.5rem", color: "var(--sand-tactical)" }}>SHIPPING</h2>
          <form action={updateShippingSettings} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div><label style={labelStyle}>Default Shipping Cost (COP)</label><input name="default_shipping_cost" type="number" step="0.01" defaultValue={settings?.default_shipping_cost ?? 15000} style={inputStyle} /></div>
            <div><label style={labelStyle}>Free Shipping Threshold (COP)</label><input name="free_shipping_threshold" type="number" step="0.01" defaultValue={settings?.free_shipping_threshold ?? 150000} style={inputStyle} /></div>
            <button type="submit" style={{ background: "var(--sand-tactical)", color: "var(--coffee-black)", border: "none", padding: "0.6rem 1.5rem", fontFamily: "var(--font-hero)", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", fontSize: "0.9rem", alignSelf: "flex-start" }}>Save Shipping Settings</button>
          </form>
        </div>
      </div>
    </div>
  );
}
