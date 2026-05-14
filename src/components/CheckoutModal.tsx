"use client";

import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPARTMENTS = [
  "Amazonas","Antioquia","Arauca","Atlántico","Bolívar","Boyacá","Caldas","Caquetá",
  "Casanare","Cauca","Cesar","Chocó","Córdoba","Cundinamarca","Guainía","Guaviare",
  "Huila","La Guajira","Magdalena","Meta","Nariño","Norte de Santander","Putumayo",
  "Quindío","Risaralda","San Andrés y Providencia","Santander","Sucre","Tolima",
  "Valle del Cauca","Vaupés","Vichada"
];

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", department: "", city: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatCOP = (n: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // TODO: EPAYCO_KEY — initialize ePayco and trigger payment
      // For now, we simulate a successful order creation
      await new Promise((r) => setTimeout(r, 1000));
      clearCart();
      onClose();
    } catch {
      setError("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "relative", background: "var(--camo-dark)", width: "min(600px, 95vw)",
        maxHeight: "90vh", overflowY: "auto", padding: "2rem",
        border: "1px solid rgba(184,154,106,0.2)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1.5rem", background: "none", border: "none", color: "var(--text-primary)", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
        <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "2rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
          DEPLOY ORDER
        </h2>

        {error && <p style={{ color: "#f87171", marginBottom: "1rem", fontFamily: "var(--font-condensed)" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {(["name", "email", "phone"] as const).map((field) => (
            <div key={field}>
              <label style={{ display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                {field === "name" ? "Full Name" : field === "email" ? "Email" : "Phone"}
              </label>
              <input
                name={field} type={field === "email" ? "email" : "text"} required
                value={form[field]} onChange={handleChange}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)", color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-body)", outline: "none" }}
              />
            </div>
          ))}

          <div>
            <label style={{ display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Department</label>
            <select name="department" required value={form.department} onChange={handleChange}
              style={{ width: "100%", background: "var(--camo-dark)", border: "1px solid rgba(184,154,106,0.3)", color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-body)" }}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {(["city", "address"] as const).map((field) => (
            <div key={field}>
              <label style={{ display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                {field === "city" ? "City" : "Address"}
              </label>
              <input name={field} required value={form[field]} onChange={handleChange}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)", color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-body)", outline: "none" }}
              />
            </div>
          ))}

          {/* Order summary */}
          <div style={{ borderTop: "1px solid rgba(184,154,106,0.15)", paddingTop: "1rem", marginTop: "0.5rem" }}>
            {items.map((item) => (
              <div key={`${item.id}-${item.weight}-${item.grind}`} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-condensed)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                <span>{item.name} ({item.weight}) × {item.quantity}</span>
                <span style={{ color: "var(--metal-gold)" }}>{formatCOP(item.price * item.quantity)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-hero)", fontSize: "1.2rem", borderTop: "1px solid rgba(184,154,106,0.15)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
              <span>TOTAL</span>
              <span style={{ color: "var(--metal-gold)" }}>{formatCOP(subtotal)}</span>
            </div>
          </div>

          <button type="submit" className="btn" disabled={loading} style={{ marginTop: "0.5rem" }} suppressHydrationWarning>
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
          {/* TODO: EPAYCO_KEY — render ePayco payment widget here */}
        </form>
      </div>
    </div>
  );
}
