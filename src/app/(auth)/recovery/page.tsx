import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RecoveryPage() {
  async function recoveryAction(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const email = formData.get("email") as string;
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/update-password`,
    });
    redirect("/login?error=Check+your+email+for+a+recovery+link");
  }

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-condensed)", fontSize: "0.75rem",
    letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: "0.4rem",
  };

  return (
    <>
      <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "2.5rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
        RECOVERY
      </h1>
      <p style={{ fontFamily: "var(--font-condensed)", color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Enter your email to receive a password reset link.
      </p>
      <form action={recoveryAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label htmlFor="rec-email" style={labelStyle}>Email</label>
          <input id="rec-email" name="email" type="email" required
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,154,106,0.3)", color: "var(--text-primary)", padding: "0.75rem 1rem", fontFamily: "var(--font-body)", outline: "none", fontSize: "1rem" }}
          />
        </div>
        <button type="submit" className="btn" style={{ width: "100%" }} suppressHydrationWarning>
          Send Recovery Link
        </button>
      </form>
    </>
  );
}
