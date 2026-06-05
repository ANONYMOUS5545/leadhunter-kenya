"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Shield, LayoutDashboard, Building2, MapPin,
  Users, Cpu, LogOut, Database, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string | null; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== "admin") {
          router.push("/dashboard");
        } else {
          setUser(d.user);
        }
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const navItems = [
    { href: "/admin", icon: <LayoutDashboard size={15} />, label: "Overview" },
    { href: "/admin/industries", icon: <Building2 size={15} />, label: "Industries" },
    { href: "/admin/users", icon: <Users size={15} />, label: "Users" },
    { href: "/admin/jobs", icon: <Cpu size={15} />, label: "Scrape Jobs" },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #ec4899, #8b5cf6)", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: "var(--bg-card)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "20px 12px", height: "100vh", position: "sticky", top: 0 }}>
        {/* Logo */}
        <div style={{ padding: "8px 8px 20px", borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #ec4899, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={14} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "var(--text-primary)" }}>Admin Panel</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>LeadHunter KE</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={cn("nav-item", active && "active")}>
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
              </Link>
            );
          })}

          <div style={{ borderTop: "1px solid var(--border)", margin: "8px 0" }} />
          <Link href="/dashboard" className="nav-item">
            <Database size={15} />
            Back to App
          </Link>
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <div style={{ padding: "6px 12px", marginBottom: 4 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>{user.name || user.email.split("@")[0]}</p>
            <span className="badge badge-purple" style={{ marginTop: 4, display: "inline-flex" }}>Admin</span>
          </div>
          <button className="nav-item w-full" onClick={handleLogout}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
