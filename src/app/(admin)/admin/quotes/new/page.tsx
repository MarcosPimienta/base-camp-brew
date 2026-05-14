import { createClient } from "@/utils/supabase/server";
import { createQuote } from "@/app/actions/quotes";

const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)", color: "var(--text-primary)", padding: "0.6rem 0.75rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.3rem" };

export default async function NewQuotePage() {
  const supabase = await createClient();
  const { data: clients } = await supabase.from("clients").select("id, name").order("name");

  return (
    <div style={{ padding: "2.5rem", maxWidth: 800 }}>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "2rem" }}>NEW QUOTE</h1>
      <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)", padding: "2rem" }}>
        <form action={createQuote} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div><label style={labelStyle}>Title</label><input name="title" required style={inputStyle} /></div>
          <div><label style={labelStyle}>Client</label>
            <select name="client_id" style={{ ...inputStyle, background: "var(--camo-dark)" }}>
              <option value="">No client selected</option>
              {clients?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Total Amount (COP)</label><input name="total_amount" type="number" step="0.01" style={inputStyle} /></div>
          <div><label style={labelStyle}>Notes</label><textarea name="notes" rows={4} style={{ ...inputStyle, resize: "vertical" }} /></div>
          <button type="submit" style={{ background: "var(--sand-tactical)", color: "var(--coffee-black)", border: "none", padding: "0.75rem 2rem", fontFamily: "var(--font-hero)", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", fontSize: "1rem", alignSelf: "flex-start" }}>Create Quote</button>
        </form>
      </div>
    </div>
  );
}
