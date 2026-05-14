import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { deleteQuote } from "@/app/actions/quotes";

const STATUS_COLORS: Record<string, string> = { draft: "#888", sent: "#3b82f6", approved: "#22c55e", rejected: "#ef4444" };
const formatCOP = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default async function AdminQuotesPage() {
  const supabase = await createClient();
  const [{ data: quotes }, { data: proposals }] = await Promise.all([
    supabase.from("quotes").select("*, clients(name)").order("created_at", { ascending: false }),
    supabase.from("proposals").select("*, clients(name)").order("created_at", { ascending: false }),
  ]);

  const PROP_STATUS_COLORS: Record<string, string> = { Borrador: "#888", Enviada: "#3b82f6", Aprobada: "#22c55e" };

  return (
    <div style={{ padding: "2.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em" }}>QUOTES & PROPOSALS</h1>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/admin/quotes/new" style={{ background: "var(--sand-tactical)", color: "var(--coffee-black)", fontFamily: "var(--font-hero)", padding: "0.6rem 1.2rem", textDecoration: "none", fontSize: "0.9rem", letterSpacing: "0.05em" }}>+ New Quote</Link>
          <Link href="/admin/quotes/proposals/new" style={{ background: "transparent", border: "1px solid rgba(184,154,106,0.4)", color: "var(--sand-tactical)", fontFamily: "var(--font-hero)", padding: "0.6rem 1.2rem", textDecoration: "none", fontSize: "0.9rem", letterSpacing: "0.05em" }}>+ New Proposal</Link>
        </div>
      </div>

      {/* Quotes */}
      <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.5rem", letterSpacing: "0.05em", marginBottom: "1rem" }}>QUOTES</h2>
      <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)", marginBottom: "2.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr", gap: "0.75rem", padding: "0.6rem 1rem", borderBottom: "1px solid rgba(184,154,106,0.1)", fontFamily: "var(--font-condensed)", fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>Title</span><span>Client</span><span>Total</span><span>Status</span><span>Actions</span>
        </div>
        {quotes?.map(q => (
          <div key={q.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr", gap: "0.75rem", padding: "0.75rem 1rem", borderBottom: "1px solid rgba(184,154,106,0.05)", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.85rem" }}>{q.title}</span>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{q.clients?.name ?? "—"}</span>
            <span style={{ fontFamily: "var(--font-hero)", color: "var(--metal-gold)", fontSize: "0.9rem" }}>{formatCOP(q.total_amount)}</span>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.7rem", textTransform: "uppercase", color: STATUS_COLORS[q.status] ?? "#888", border: `1px solid ${STATUS_COLORS[q.status] ?? "#888"}`, padding: "0.2rem 0.4rem" }}>{q.status}</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href={`/admin/quotes/${q.id}`} style={{ fontFamily: "var(--font-condensed)", fontSize: "0.7rem", color: "var(--sand-tactical)", textDecoration: "none", border: "1px solid rgba(184,154,106,0.3)", padding: "0.25rem 0.5rem" }}>View</Link>
              <form action={async () => { "use server"; await deleteQuote(q.id); }}>
                <button type="submit" style={{ background: "none", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontFamily: "var(--font-condensed)", fontSize: "0.7rem", padding: "0.25rem 0.5rem", cursor: "pointer" }}>Del</button>
              </form>
            </div>
          </div>
        ))}
        {(!quotes || quotes.length === 0) && <div style={{ padding: "2rem", textAlign: "center", fontFamily: "var(--font-condensed)", color: "var(--text-secondary)" }}>No quotes yet.</div>}
      </div>

      {/* Proposals */}
      <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.5rem", letterSpacing: "0.05em", marginBottom: "1rem" }}>PROPOSALS</h2>
      <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr", gap: "0.75rem", padding: "0.6rem 1rem", borderBottom: "1px solid rgba(184,154,106,0.1)", fontFamily: "var(--font-condensed)", fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>Title</span><span>Client</span><span>Status</span><span>Date</span>
        </div>
        {proposals?.map(p => (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr", gap: "0.75rem", padding: "0.75rem 1rem", borderBottom: "1px solid rgba(184,154,106,0.05)", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.85rem" }}>{p.title}</span>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{p.clients?.name ?? "—"}</span>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.7rem", textTransform: "uppercase", color: PROP_STATUS_COLORS[p.status] ?? "#888", border: `1px solid ${PROP_STATUS_COLORS[p.status] ?? "#888"}`, padding: "0.2rem 0.4rem" }}>{p.status}</span>
            <span style={{ fontFamily: "var(--font-condensed)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>{new Date(p.created_at).toLocaleDateString("es-CO")}</span>
          </div>
        ))}
        {(!proposals || proposals.length === 0) && <div style={{ padding: "2rem", textAlign: "center", fontFamily: "var(--font-condensed)", color: "var(--text-secondary)" }}>No proposals yet.</div>}
      </div>
    </div>
  );
}
