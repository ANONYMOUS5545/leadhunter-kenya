"use client";
import { useEffect, useState } from "react";
import { Building2, Users, Cpu, TrendingUp, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface AdminStats {
  totals: { leads: number; users: number; jobs: number };
  leadsByCity: { city: string; count: number }[];
  leadsByIndustry: { industry: string; count: number }[];
  usersByTier: { tier: string; count: number }[];
  recentJobs: Array<{ id: number; cityName: string; industryName: string; status: string; totalFound: number; createdAt: string }>;
}

const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  running: "#3b82f6",
  completed: "#10b981",
  failed: "#ef4444",
};

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs");
      const data = await res.json();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 12 }} />)}
        </div>
        <div className="skeleton" style={{ height: 300, borderRadius: 12 }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 32px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4 }}>Admin Overview</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Platform health and usage statistics.</p>
        </div>
        <button onClick={fetchStats} className="btn-secondary" style={{ fontSize: 13, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Totals */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon={<Building2 size={18} />} label="Total Leads" value={(stats?.totals.leads || 0).toLocaleString()} color="blue" />
        <StatCard icon={<Users size={18} />} label="Total Users" value={(stats?.totals.users || 0).toLocaleString()} color="green" />
        <StatCard icon={<Cpu size={18} />} label="Scrape Jobs" value={(stats?.totals.jobs || 0).toLocaleString()} color="purple" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Leads by city */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 16 }}>Leads by City</h2>
          {stats?.leadsByCity && stats.leadsByCity.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.leadsByCity.map(d => ({ name: d.city, value: Number(d.count) }))}>
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  itemStyle={{ color: "#60a5fa" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.leadsByCity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No leads data yet" />
          )}
        </div>

        {/* Users by tier */}
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 16 }}>Users by Tier</h2>
          {stats?.usersByTier && stats.usersByTier.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.usersByTier.map(d => ({ name: d.tier, value: Number(d.count) }))}>
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  itemStyle={{ color: "#10b981" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.usersByTier.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No user data yet" />
          )}
        </div>
      </div>

      {/* Recent jobs */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 16 }}>Recent Scrape Jobs</h2>
        {!stats?.recentJobs || stats.recentJobs.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "24px 0" }}>No scrape jobs yet. Go to Scrape Jobs to run one.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Found</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentJobs.map((job) => (
                <tr key={job.id}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{job.cityName}</td>
                  <td>{job.industryName || "—"}</td>
                  <td>
                    <span className="badge" style={{ background: `${statusColors[job.status] || "#888"}15`, color: statusColors[job.status] || "#888", border: `1px solid ${statusColors[job.status] || "#888"}25` }}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.totalFound ?? "—"}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = { blue: "#60a5fa", green: "#34d399", purple: "#c084fc" };
  const bgMap: Record<string, string> = { blue: "rgba(59,130,246,0.1)", green: "rgba(16,185,129,0.1)", purple: "rgba(168,85,247,0.1)" };
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-display)" }}>{label}</p>
          <p style={{ fontSize: 26, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{value}</p>
        </div>
        <div style={{ padding: 9, borderRadius: 9, background: bgMap[color], color: colorMap[color] }}>{icon}</div>
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>{label}</div>;
}
