"use client";
import { useState, useEffect } from "react";
import { Download, FileSpreadsheet, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CITIES, INDUSTRIES } from "@/lib/utils";

export default function ExportPage() {
  const [userTier, setUserTier] = useState("free");
  const [city, setCity] = useState("");
  const [industry, setIndustry] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.user) setUserTier(d.user.subscriptionTier); });
  }, []);

  const canExport = ["pro", "enterprise"].includes(userTier);

  async function handleExport() {
    setDownloading(true);
    try {
      const params = new URLSearchParams({ ...(city && { city }), ...(industry && { industry }) });
      const res = await fetch(`/api/export?${params}`);
      if (!res.ok) { alert("Export failed. Please try again."); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leadhunter-ke-${city || "all"}-${industry || "all"}-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div style={{ padding: "32px 32px 64px", maxWidth: 700 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 6 }}>
          Export Leads
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          Download your leads as Excel with full contact info, weaknesses, and cold call scripts.
        </p>
      </div>

      {!canExport ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, textAlign: "center" }}>
          <Lock size={36} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 8 }}>
            Export requires Pro or Enterprise
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 400, margin: "0 auto 24px", lineHeight: 1.6 }}>
            Upgrade to Pro (KES 6,900/mo) or Enterprise to export leads to Excel with all weaknesses and cold call scripts included.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320, margin: "0 auto" }}>
            {["Full Excel & CSV export", "Cold call scripts included", "Up to 500 leads/export", "Weakness analysis rows"].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                <CheckCircle2 size={14} style={{ color: "#10b981", flexShrink: 0 }} /> {f}
              </div>
            ))}
          </div>
          <Link href="/pricing" className="btn-primary" style={{ display: "inline-flex", marginTop: 24, fontSize: 14, padding: "11px 24px" }}>
            Upgrade to Pro <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Export options */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 16 }}>
              Export Options
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label className="label">Filter by City</label>
                <select className="input" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">All Cities</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Filter by Industry</label>
                <select className="input" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option value="">All Industries</option>
                  {INDUSTRIES.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="btn-primary"
              style={{ fontSize: 14, padding: "11px 24px", opacity: downloading ? 0.7 : 1 }}
              disabled={downloading}
            >
              <Download size={15} />
              {downloading ? "Preparing download…" : "Download Excel File"}
            </button>
          </div>

          {/* What's included */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 14 }}>
              What&apos;s included in the export
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                "Business name & city", "Phone & email", "Website URL", "Social media links",
                "Follower counts", "Google rating & reviews", "Online presence score",
                "Full weakness list", "Cold call topic & opener", "Pain points",
                "Value propositions", "Call-to-action scripts",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)", padding: "4px 0" }}>
                  <FileSpreadsheet size={12} style={{ color: "#10b981", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
