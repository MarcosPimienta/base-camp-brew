import { registerAction } from "@/app/actions/auth";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const { error } = await searchParams;

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.75rem",
    letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.4rem",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)",
    color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-body)", outline: "none", fontSize: "1rem",
  };

  return (
    <>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
        ENLIST
      </h1>
      <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Create your account to start your subscription.
      </p>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontFamily: "var(--font-condensed)", fontSize: "0.85rem" }}>
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={registerAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Honeypot */}
        <input name="website" type="text" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label htmlFor="reg-first" style={labelStyle}>First Name</label>
            <input id="reg-first" name="first_name" required style={inputStyle} />
          </div>
          <div>
            <label htmlFor="reg-last" style={labelStyle}>Last Name</label>
            <input id="reg-last" name="last_name" required style={inputStyle} />
          </div>
        </div>

        <div>
          <label htmlFor="reg-email" style={labelStyle}>Email</label>
          <input id="reg-email" name="email" type="email" required autoComplete="email" style={inputStyle} />
        </div>

        <div>
          <label htmlFor="reg-password" style={labelStyle}>Password</label>
          <input id="reg-password" name="password" type="password" required minLength={8} autoComplete="new-password" style={inputStyle} />
        </div>

        <button type="submit" className="btn" style={{ width: "100%", marginTop: "0.5rem" }} suppressHydrationWarning>
          Create Account
        </button>
      </form>

      <p style={{ marginTop: "2rem", fontFamily: "var(--font-condensed)", fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center" }}>
        Already enlisted?{" "}
        <Link href="/login" style={{ color: "var(--sand-tactical)" }}>Login</Link>
      </p>
    </>
  );
}
