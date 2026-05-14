import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

const formatCOP = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: quote } = await supabase.from("quotes").select("*, clients(name, email, phone, city)").eq("id", id).single();
  if (!quote) notFound();

  return (
    <div style={{ padding: "2.5rem", maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em" }}>{quote.title}</h1>
          <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginTop: "0.25rem" }}>Quote #{id.slice(0, 8).toUpperCase()}</p>
        </div>
        <span style={{ fontFamily: "var(--font-hero)", fontSize: "2rem", color: "var(--metal-gold)" }}>{formatCOP(quote.total_amount)}</span>
      </div>

      <div style={{ background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.15)", padding: "2rem" }}>
        {quote.clients && (
          <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(184,154,106,0.1)" }}>
            <h3 style={{ fontFamily: "var(--font-hero)", fontSize: "1rem", letterSpacing: "0.05em", marginBottom: "0.5rem", color: "var(--sand-tactical)" }}>CLIENT</h3>
            <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.9rem" }}>{quote.clients.name}</p>
            <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{quote.clients.email} · {quote.clients.phone}</p>
          </div>
        )}
        {quote.notes && (
          <div>
            <h3 style={{ fontFamily: "var(--font-hero)", fontSize: "1rem", letterSpacing: "0.05em", marginBottom: "0.5rem", color: "var(--sand-tactical)" }}>NOTES</h3>
            <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{quote.notes}</p>
          </div>
        )}
        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(184,154,106,0.1)", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-condensed)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          <span>Created: {new Date(quote.created_at).toLocaleDateString("es-CO")}</span>
          <span>Status: <strong style={{ color: "var(--sand-tactical)" }}>{quote.status}</strong></span>
        </div>
      </div>
    </div>
  );
}
