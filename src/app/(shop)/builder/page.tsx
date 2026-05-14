import { Suspense } from "react";
import BuilderContent from "./BuilderContent";

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh", background: "var(--coffee-black)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-condensed)", color: "var(--text-secondary)",
        letterSpacing: "0.1em", textTransform: "uppercase",
      }}>
        Loading...
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
