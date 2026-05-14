import { loginAction } from "@/app/actions/auth";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error, redirectTo } = await searchParams;

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-condensed)",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-secondary)",
    marginBottom: "0.4rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(184,154,106,0.3)",
    color: "var(--text-primary)",
    padding: "0.75rem 1rem",
    fontFamily: "var(--font-body)",
    outline: "none",
    fontSize: "1rem",
  };

  return (
    <>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
        LOGIN
      </h1>
      <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "2rem", letterSpacing: "0.05em" }}>
        Access your dashboard and orders.
      </p>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontFamily: "var(--font-condensed)", fontSize: "0.85rem" }}>
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={loginAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Honeypot */}
        <input name="website" type="text" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
        <input type="hidden" name="redirectTo" value={redirectTo ?? "/dashboard"} />

        <div>
          <label htmlFor="login-email" style={labelStyle}>Email</label>
          <input id="login-email" name="email" type="email" required autoComplete="email" style={inputStyle} />
        </div>

        <div>
          <label htmlFor="login-password" style={labelStyle}>Password</label>
          <input id="login-password" name="password" type="password" required autoComplete="current-password" style={inputStyle} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link href="/recovery" style={{ fontFamily: "var(--font-condensed)", fontSize: "0.8rem", color: "var(--sand-tactical)", letterSpacing: "0.05em" }}>
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn" style={{ width: "100%", marginTop: "0.5rem" }} suppressHydrationWarning>
          Login
        </button>
      </form>

      <p style={{ marginTop: "2rem", fontFamily: "var(--font-condensed)", fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "var(--sand-tactical)" }}>Register</Link>
      </p>
    </>
  );
}
