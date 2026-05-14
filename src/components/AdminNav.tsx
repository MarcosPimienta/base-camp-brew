"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "⌂" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/inventory", label: "Inventory", icon: "📊" },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: "🔄" },
  { href: "/admin/users", label: "Users", icon: "👤" },
  { href: "/admin/customers", label: "Customers", icon: "🏢" },
  { href: "/admin/quotes", label: "Quotes", icon: "📄" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 220, flexShrink: 0, background: "#0d0d0d",
      borderRight: "1px solid rgba(184,154,106,0.15)",
      display: "flex", flexDirection: "column", minHeight: "100vh",
      position: "sticky", top: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid rgba(184,154,106,0.1)" }}>
        <p style={{ fontFamily: "var(--font-hero)", fontSize: "1.2rem", letterSpacing: "0.1em", color: "var(--sand-tactical)" }}>
          ADMIN
        </p>
        <p style={{ fontFamily: "var(--font-condensed)", fontSize: "0.7rem", color: "var(--text-secondary)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.2rem" }}>
          Base Camp Brew
        </p>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "1rem 0" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.75rem 1.25rem",
              color: isActive ? "var(--coffee-black)" : "var(--text-secondary)",
              background: isActive ? "var(--sand-tactical)" : "transparent",
              fontFamily: "var(--font-condensed)", fontSize: "0.85rem",
              letterSpacing: "0.05em", textTransform: "uppercase",
              textDecoration: "none", transition: "all 0.2s ease",
            }}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(184,154,106,0.1)" }}>
        <form action={logoutAction}>
          <button type="submit" style={{
            width: "100%", background: "none", border: "1px solid rgba(184,154,106,0.2)",
            color: "var(--text-secondary)", fontFamily: "var(--font-condensed)", fontSize: "0.8rem",
            letterSpacing: "0.05em", textTransform: "uppercase", padding: "0.6rem", cursor: "pointer",
            transition: "all 0.2s ease",
          }}>
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
