"use client";
import { useEffect, useState } from "react";
import {
  Search,
  TrendingUp,
  MapPin,
  Building2,
  ArrowRight,
  AlertTriangle,
  PhoneCall,
  Zap,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { BusinessCard } from "@/components/dashboard/BusinessCard";
import { ScoreRing } from "@/components/ui/ScoreRing";
import type { Business } from "@/lib/schema";

interface DashboardData {
  data: Business[];
  total: number;
  isDemo: boolean;
}

const cityStats = [
  { city: "Nairobi", icon: "🏙️", leads: "2,400+", active: true },
  { city: "Mombasa", icon: "🌊", leads: "780+", active: true },
  { city: "Kisumu", icon: "🏞️", leads: "560+", active: true },
  { city: "Nakuru", icon: "🌿", leads: "440+", active: true },
  { city: "Eldoret", icon: "🏔️", leads: "320+", active: true },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState("free");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUserTier(d.user.subscriptionTier);
      });

    fetch("/api/leads?demo=true&limit=6")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const isFree = userTier === "free";

  return (
    <div style={{ padding: "32px 32px 64px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 6 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          Kenya&apos;s top B2B leads, analyzed and ready to close.
        </p>
      </div>

      {/* Upgrade banner (free users) */}
      {isFree && (
        <div
          className="animate-fade-in"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(6,182,212,0.08))",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Zap size={20} style={{ color: "#fbbf24" }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                You&apos;re on the Free Demo
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Viewing 5 sample leads. Upgrade to unlock 100–500+ real leads with full cold call scripts.
              </p>
            </div>
          </div>
          <Link href="/pricing" className="btn-primary" style={{ fontSize: 13, padding: "8px 16px", whiteSpace: "nowrap" }}>
            Upgrade Now <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Leads" value={isFree ? "5 (demo)" : "2,400+"} icon={<Building2 size={18} />} color="blue" />
        <StatCard label="Cities Covered" value="5" icon={<MapPin size={18} />} color="green" />
        <StatCard label="Industries" value="15+" icon={<TrendingUp size={18} />} color="purple" />
        <StatCard label="Avg Score" value="34/100" icon={<Search size={18} />} color="amber" desc="Most businesses need help" />
      </div>

      {/* City breakdown */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 14, letterSpacing: "-0.01em" }}>
          Coverage by City
        </h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {cityStats.map((c) => (
            <Link
              key={c.city}
              href={`/dashboard/leads?city=${c.city}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{c.city}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.leads} leads</div>
              </div>
              <ArrowRight size={13} style={{ color: "var(--text-muted)", marginLeft: 4 }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Sample leads */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              {isFree ? "Sample Leads" : "Recent Leads"}
            </h2>
            {isFree && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Showing demo data — <span style={{ color: "#60a5fa" }}>upgrade to see real leads</span>
              </p>
            )}
          </div>
          <Link href="/dashboard/leads" className="btn-secondary" style={{ fontSize: 13, padding: "7px 14px" }}>
            View All Leads <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card skeleton" style={{ height: 200 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {(data?.data || []).map((b, i) => (
              <BusinessCard
                key={b.id || i}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                business={b as any}
                isDemo={data?.isDemo}
                isLocked={isFree && i >= 2}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA for free users */}
      {isFree && (
        <div
          style={{
            marginTop: 36,
            padding: "32px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          <Lock size={28} style={{ color: "var(--text-muted)", margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 8 }}>
            Unlock 100–500+ Real Leads
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Get full contact details, weakness analysis, and cold call scripts for every business in Kenya&apos;s top 5 cities.
          </p>
          <Link href="/pricing" className="btn-primary" style={{ fontSize: 14, padding: "11px 24px" }}>
            See Pricing <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, desc }: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  desc?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "#60a5fa",
    green: "#34d399",
    amber: "#fbbf24",
    purple: "#c084fc",
  };
  const bgMap: Record<string, string> = {
    blue: "rgba(59,130,246,0.1)",
    green: "rgba(16,185,129,0.1)",
    amber: "rgba(245,158,11,0.1)",
    purple: "rgba(168,85,247,0.1)",
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-display)" }}>{label}</p>
          <p style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{value}</p>
          {desc && <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{desc}</p>}
        </div>
        <div style={{ padding: 9, borderRadius: 9, background: bgMap[color], color: colorMap[color] }}>{icon}</div>
      </div>
    </div>
  );
}
