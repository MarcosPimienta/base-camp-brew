import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--coffee-black)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 480,
        background: "var(--camo-dark)",
        border: "1px solid rgba(184,154,106,0.15)",
        padding: "3rem 2.5rem",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
      }}>
        {children}
      </div>
    </div>
  );
}
