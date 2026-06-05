"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Download,
  Settings,
  LogOut,
  Shield,
  Zap,
  ChevronRight,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: {
    name?: string | null;
    email: string;
    role: string;
    subscriptionTier: string;
  };
  onLogout: () => void;
}

const tierColors: Record<string, string> = {
  free: "badge-muted",
  starter: "badge-blue",
  pro: "badge-purple",
  enterprise: "badge-amber",
};

const tierLabels: Record<string, string> = {
  free: "Free Demo",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { href: "/dashboard/leads", icon: <Search size={16} />, label: "Leads" },
    { href: "/dashboard/export", icon: <Download size={16} />, label: "Export", pro: true },
    { href: "/dashboard/settings", icon: <Settings size={16} />, label: "Settings" },
  ];

  if (user.role === "admin") {
    navItems.push({ href: "/admin", icon: <Shield size={16} />, label: "Admin Panel" });
  }

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 8px 20px",
          textDecoration: "none",
          borderBottom: "1px solid var(--border)",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Database size={16} color="#fff" />
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          LeadHunter KE
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-item", active && "active")}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.pro && user.subscriptionTier === "free" && (
                <Zap size={11} style={{ color: "#fbbf24" }} />
              )}
              {active && <ChevronRight size={13} style={{ opacity: 0.5 }} />}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: 12,
          marginTop: 12,
        }}
      >
        <div style={{ padding: "8px 12px", marginBottom: 4 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.name || user.email.split("@")[0]}
          </p>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.email}
          </p>
          <div style={{ marginTop: 6 }}>
            <span
              className={cn(
                "badge",
                tierColors[user.subscriptionTier] || "badge-blue"
              )}
            >
              {tierLabels[user.subscriptionTier] || user.subscriptionTier}
            </span>
          </div>
        </div>
        <button className="nav-item w-full" onClick={onLogout}>
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
