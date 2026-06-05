"use client";
import { useState, useEffect } from "react";
import { User, Mail, CreditCard, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const tierInfo: Record<string, { label: string; color: string; desc: string }> = {
  free: { label: "Free Demo", color: "#22d3ee", desc: "5 sample leads, no export" },
  starter: { label: "Starter", color: "#60a5fa", desc: "100 leads/month, CSV export" },
  pro: { label: "Pro", color: "#c084fc", desc: "500 leads/month, Excel export" },
  enterprise: { label: "Enterprise", color: "#fbbf24", desc: "Unlimited leads, all features" },
};

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string | null; email: string; role: string; subscriptionTier: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.user) setUser(d.user); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: 32 }}>
      <div className="skeleton" style={{ height: 24, width: 200, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 120, borderRadius: 12 }} />
    </div>
  );

  const tier = user?.subscriptionTier || "free";
  const info = tierInfo[tier] || tierInfo.free;

  return (
    <div style={{ padding: "32px 32px 64px", maxWidth: 640 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 6 }}>
          Settings
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Manage your account and subscription.</p>
      </div>

      {/* Account info */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <User size={16} style={{ color: "var(--text-muted)" }} />
          <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Account</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Name" value={user?.name || "—"} />
          <Field label="Email" value={user?.email || "—"} icon={<Mail size={13} />} />
          <Field label="Role" value={user?.role === "admin" ? "Administrator" : "User"} icon={<Shield size={13} />} />
        </div>
      </div>

      {/* Subscription */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <CreditCard size={16} style={{ color: "var(--text-muted)" }} />
          <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Subscription</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: `${info.color}10`, border: `1px solid ${info.color}25`, borderRadius: 10, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: info.color }}>{info.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{info.desc}</div>
          </div>
          <span className="badge" style={{ background: `${info.color}15`, color: info.color, border: `1px solid ${info.color}25` }}>Active</span>
        </div>

        {tier === "free" && (
          <div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>Unlock the full power of LeadHunter KE:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {["100–500 real leads/month", "Full contact details", "Cold call scripts", "Excel export"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                  <CheckCircle2 size={13} style={{ color: "#10b981" }} /> {f}
                </div>
              ))}
            </div>
            <Link href="/pricing" className="btn-primary" style={{ fontSize: 13, padding: "9px 18px", display: "inline-flex" }}>
              Upgrade Plan <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {tier !== "free" && (
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            To manage billing or cancel, contact <a href="mailto:billing@leadhunter.ke" style={{ color: "#60a5fa" }}>billing@leadhunter.ke</a>
          </p>
        )}
      </div>

      {/* API info for enterprise */}
      {tier === "enterprise" && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 12 }}>API Access</h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
            Your Enterprise plan includes API access. Contact support to receive your API key and documentation.
          </p>
          <a href="mailto:api@leadhunter.ke" className="btn-secondary" style={{ fontSize: 13, padding: "8px 16px", display: "inline-flex" }}>
            Request API Key
          </a>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, color: "var(--text-secondary)" }}>
        {icon && <span style={{ color: "var(--text-muted)" }}>{icon}</span>}
        {value}
      </div>
    </div>
  );
}
