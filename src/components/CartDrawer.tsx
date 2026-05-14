"use client";

import React from "react";
import Image from "next/image";
import { useCart, itemKey } from "@/app/context/CartContext";

const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 1999, backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Drawer */}
      <aside
        style={{
          position: "fixed", top: 0, right: 0, height: "100%",
          width: "min(420px, 95vw)",
          background: "var(--camo-dark)",
          borderLeft: "1px solid rgba(184,154,106,0.2)",
          zIndex: 2000,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.77,0,0.175,1)",
          display: "flex", flexDirection: "column",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "1.5rem 1.5rem 1rem",
          borderBottom: "1px solid rgba(184,154,106,0.15)",
        }}>
          <h3 style={{ fontFamily: "var(--font-hero)", fontSize: "1.6rem", letterSpacing: "0.1em" }}>
            YOUR KIT <span style={{ color: "var(--sand-tactical)" }}>({items.reduce((s, i) => s + i.quantity, 0)})</span>
          </h3>
          <button onClick={closeCart} suppressHydrationWarning style={{
            background: "none", border: "none", color: "var(--text-primary)",
            cursor: "pointer", fontSize: "1.5rem", lineHeight: 1, padding: "4px 8px",
          }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
          {items.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "100%", gap: "1rem",
              color: "var(--text-secondary)", fontFamily: "var(--font-condensed)",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Your kit is empty</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map((item) => {
                const key = itemKey(item);
                return (
                  <div key={key} style={{
                    display: "flex", gap: "1rem", alignItems: "flex-start",
                    padding: "1rem",
                    border: "1px solid rgba(184,154,106,0.1)",
                    background: "rgba(255,255,255,0.02)",
                  }}>
                    {/* Image */}
                    <div style={{ position: "relative", width: 70, height: 70, flexShrink: 0 }}>
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-hero)", fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                        {item.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.75rem", color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
                        {item.weight} · {item.grind}{item.grindLevel ? ` · ${item.grindLevel}` : ""}
                      </p>
                      <p style={{ color: "var(--metal-gold)", fontFamily: "var(--font-hero)", marginTop: "0.25rem" }}>
                        {formatCOP(item.price)}
                      </p>
                      {/* Qty controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <button onClick={() => updateQuantity(key, item.quantity - 1)}
                          style={{ background: "rgba(184,154,106,0.15)", border: "none", color: "var(--text-primary)", width: 28, height: 28, cursor: "pointer", fontSize: "1rem", fontFamily: "var(--font-hero)" }}>
                          −
                        </button>
                        <span style={{ fontFamily: "var(--font-hero)", minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(key, item.quantity + 1)}
                          style={{ background: "rgba(184,154,106,0.15)", border: "none", color: "var(--text-primary)", width: 28, height: 28, cursor: "pointer", fontSize: "1rem", fontFamily: "var(--font-hero)" }}>
                          +
                        </button>
                        <button onClick={() => removeItem(key)}
                          style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "var(--font-condensed)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: "1.5rem",
            borderTop: "1px solid rgba(184,154,106,0.15)",
            background: "rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontFamily: "var(--font-condensed)", letterSpacing: "0.05em" }}>
              <span style={{ color: "var(--text-secondary)", textTransform: "uppercase" }}>Subtotal</span>
              <span style={{ fontFamily: "var(--font-hero)", fontSize: "1.3rem", color: "var(--metal-gold)" }}>
                {formatCOP(subtotal)}
              </span>
            </div>
            <button className="btn" style={{ width: "100%", marginBottom: "0.5rem" }} suppressHydrationWarning>
              Checkout
            </button>
            <button onClick={clearCart}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", width: "100%", fontFamily: "var(--font-condensed)", fontSize: "0.8rem", letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "center", padding: "0.5rem" }}>
              Clear Kit
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
