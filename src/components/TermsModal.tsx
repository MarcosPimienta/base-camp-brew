"use client";

import React from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "relative", background: "var(--camo-dark)", width: "min(680px, 95vw)",
        maxHeight: "85vh", overflowY: "auto", padding: "2.5rem",
        border: "1px solid rgba(184,154,106,0.2)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1.5rem", background: "none", border: "none", color: "var(--text-primary)", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
        <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "2rem", letterSpacing: "0.1em", marginBottom: "1.5rem", color: "var(--sand-tactical)" }}>
          TERMS OF SERVICE
        </h2>
        <div style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.9rem" }}>
          <h3 style={{ fontFamily: "var(--font-hero)", color: "var(--text-primary)", marginBottom: "0.5rem", marginTop: "1.5rem" }}>1. Acceptance</h3>
          <p>By purchasing from Base Camp Brew, you agree to these terms and conditions.</p>
          <h3 style={{ fontFamily: "var(--font-hero)", color: "var(--text-primary)", marginBottom: "0.5rem", marginTop: "1.5rem" }}>2. Products</h3>
          <p>All products are specialty coffee sourced from Colombian highlands. Descriptions are accurate to the best of our knowledge.</p>
          <h3 style={{ fontFamily: "var(--font-hero)", color: "var(--text-primary)", marginBottom: "0.5rem", marginTop: "1.5rem" }}>3. Subscriptions</h3>
          <p>Subscriptions can be cancelled at any time from your dashboard with no penalty. Active subscriptions are fulfilled monthly.</p>
          <h3 style={{ fontFamily: "var(--font-hero)", color: "var(--text-primary)", marginBottom: "0.5rem", marginTop: "1.5rem" }}>4. Shipping</h3>
          <p>We ship to all 32 Colombian departments. Delivery times vary by region (3–8 business days).</p>
          <h3 style={{ fontFamily: "var(--font-hero)", color: "var(--text-primary)", marginBottom: "0.5rem", marginTop: "1.5rem" }}>5. Returns</h3>
          <p>We accept returns within 7 days of delivery if the product is defective or incorrect.</p>
          <h3 style={{ fontFamily: "var(--font-hero)", color: "var(--text-primary)", marginBottom: "0.5rem", marginTop: "1.5rem" }}>6. Privacy</h3>
          <p>Your personal information is protected in accordance with Colombian data protection law (Ley 1581 de 2012).</p>
        </div>
        <button onClick={onClose} className="btn" style={{ marginTop: "2rem", width: "100%" }} suppressHydrationWarning>
          Close
        </button>
      </div>
    </div>
  );
}
