import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--coffee-black)" }}>
      <AdminNav />
      <main style={{ flex: 1, overflowX: "hidden" }}>
        {children}
      </main>
    </div>
  );
}
