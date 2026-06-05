"use client";
import { useEffect, useState } from "react";
import { Play, RefreshCw, AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { CITIES, INDUSTRIES } from "@/lib/utils";

interface ScrapeJob {
  id: number;
  cityName: string;
  industryName: string | null;
  status: string;
  totalFound: number;
  totalProcessed: number;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock size={13} style={{ color: "#f59e0b" }} />,
  running: <Loader2 size={13} style={{ color: "#3b82f6", animation: "spin 1s linear infinite" }} />,
  completed: <CheckCircle2 size={13} style={{ color: "#10b981" }} />,
  failed: <AlertCircle size={13} style={{ color: "#ef4444" }} />,
};

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  running: "#3b82f6",
  completed: "#10b981",
  failed: "#ef4444",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("Nairobi");
  const [industry, setIndustry] = useState<string>(INDUSTRIES[0].id);
  const [triggering, setTriggering] = useState(false);
  const [triggerMsg, setTriggerMsg] = useState("");

  async function fetchJobs() {
    setLoading(true);
    try {
      const res = await fetch("/api/scrape");
      const data = await res.json();
      setJobs(data.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  async function triggerScrape() {
    setTriggering(true);
    setTriggerMsg("");
    try {
      const industryName = INDUSTRIES.find(i => i.id === industry)?.name || industry;
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, industryName }),
      });
      const data = await res.json();
      if (res.ok) {
        setTriggerMsg(`✓ Job #${data.jobId} started for ${industryName} in ${city}`);
        setTimeout(fetchJobs, 2000);
      } else {
        setTriggerMsg(`✗ Error: ${data.error}`);
      }
    } finally {
      setTriggering(false);
    }
  }

  return (
    <div style={{ padding: "32px 32px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4 }}>Scrape Jobs</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Trigger and monitor data scraping jobs.</p>
        </div>
        <button onClick={fetchJobs} style={{ padding: "8px 14px", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Trigger form */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 16 }}>
          Trigger New Scrape
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label className="label">City</label>
            <select className="input" value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Industry</label>
            <select className="input" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              {INDUSTRIES.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <button
            onClick={triggerScrape}
            className="btn-primary"
            style={{ fontSize: 13, padding: "10px 18px", opacity: triggering ? 0.7 : 1 }}
            disabled={triggering}
          >
            {triggering ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {triggering ? "Starting…" : "Run Scrape"}
          </button>
        </div>
        {triggerMsg && (
          <p style={{ marginTop: 12, fontSize: 13, color: triggerMsg.startsWith("✓") ? "#34d399" : "#f87171" }}>
            {triggerMsg}
          </p>
        )}
        <p style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)" }}>
          Each job runs in the background and typically completes within 1–2 minutes.
        </p>
      </div>

      {/* Jobs table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 32 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 48, marginBottom: 8, borderRadius: 6 }} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            No scrape jobs yet. Trigger one above to get started.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>City</th>
                <th>Industry</th>
                <th>Status</th>
                <th>Found</th>
                <th>Processed</th>
                <th>Duration</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const duration =
                  job.completedAt && job.startedAt
                    ? Math.round((new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)
                    : null;
                return (
                  <tr key={job.id}>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>#{job.id}</td>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{job.cityName}</td>
                    <td>{job.industryName || "—"}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: `${statusColors[job.status] || "#888"}15`,
                          color: statusColors[job.status] || "#888",
                          border: `1px solid ${statusColors[job.status] || "#888"}25`,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {statusIcons[job.status]}
                        {job.status}
                      </span>
                    </td>
                    <td>{job.totalFound ?? "—"}</td>
                    <td>{job.totalProcessed ?? "—"}</td>
                    <td style={{ fontSize: 12 }}>{duration !== null ? `${duration}s` : "—"}</td>
                    <td style={{ fontSize: 12 }}>{new Date(job.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
