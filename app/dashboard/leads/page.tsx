"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Download, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BusinessCard } from "@/components/dashboard/BusinessCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import type { Business } from "@/lib/schema";

interface LeadsResponse {
  data: Business[];
  total: number;
  page: number;
  totalPages: number;
  isDemo: boolean;
}

function LeadsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [leads, setLeads] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState("free");

  const city = searchParams.get("city") || "";
  const industry = searchParams.get("industry") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.user) setUserTier(d.user.subscriptionTier); });
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(city && { city }),
        ...(industry && { industry }),
        ...(search && { search }),
        page: String(page),
        limit: "12",
      });
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data);
    } finally {
      setLoading(false);
    }
  }, [city, industry, search, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/dashboard/leads?${params.toString()}`);
  }

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/dashboard/leads?${params.toString()}`);
  }

  const isFree = userTier === "free";
  const canExport = ["pro", "enterprise"].includes(userTier);

  return (
    <div style={{ padding: "32px 32px 64px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4 }}>
            Leads
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            {leads ? `${leads.total.toLocaleString()} businesses found` : "Browse and filter Kenya business leads"}
          </p>
        </div>

        {canExport ? (
          <a
            href={`/api/export?${new URLSearchParams({ ...(city && { city }), ...(industry && { industry }) }).toString()}`}
            className="btn-primary"
            style={{ fontSize: 13, padding: "8px 16px" }}
          >
            <Download size={14} /> Export Excel
          </a>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/pricing" className="btn-secondary" style={{ fontSize: 13, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}>
              <Lock size={13} /> Unlock Export
            </Link>
          </div>
        )}
      </div>

      {/* Filter bar */}
      <div style={{ marginBottom: 24 }}>
        <FilterBar
          city={city}
          industry={industry}
          search={search}
          onCityChange={(v) => updateParam("city", v)}
          onIndustryChange={(v) => updateParam("industry", v)}
          onSearchChange={(v) => updateParam("search", v)}
          onRefresh={fetchLeads}
          loading={loading}
          totalResults={leads?.total}
        />
      </div>

      {/* Demo notice */}
      {leads?.isDemo && (
        <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 13, color: "#22d3ee" }}>
            🔒 Showing 5 demo leads. <strong>{leads.total}</strong> sample records available.
          </p>
          <Link href="/pricing" style={{ fontSize: 12, color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}>
            Upgrade for real data →
          </Link>
        </div>
      )}

      {/* Leads grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 220, borderRadius: 12 }} />
          ))}
        </div>
      ) : leads?.data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-secondary)", marginBottom: 6 }}>No leads found</h3>
          <p style={{ fontSize: 13 }}>Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {leads?.data.map((b, i) => (
            <BusinessCard
              key={b.id || i}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              business={b as any}
              isDemo={leads.isDemo}
              isLocked={isFree && i >= 2}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {leads && leads.totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 36 }}>
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            style={{ padding: "8px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-secondary)", cursor: page <= 1 ? "not-allowed" : "pointer", opacity: page <= 1 ? 0.4 : 1, display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}
          >
            <ChevronLeft size={14} /> Prev
          </button>

          {Array.from({ length: Math.min(5, leads.totalPages) }, (_, i) => {
            const p = Math.max(1, Math.min(page - 2, leads.totalPages - 4)) + i;
            return (
              <button
                key={p}
                onClick={() => goToPage(p)}
                style={{ padding: "8px 12px", background: p === page ? "rgba(59,130,246,0.15)" : "var(--bg-card)", border: p === page ? "1px solid rgba(59,130,246,0.3)" : "1px solid var(--border)", borderRadius: 8, color: p === page ? "#60a5fa" : "var(--text-secondary)", cursor: "pointer", fontSize: 13, fontWeight: p === page ? 700 : 400 }}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= leads.totalPages}
            style={{ padding: "8px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-secondary)", cursor: page >= leads.totalPages ? "not-allowed" : "pointer", opacity: page >= leads.totalPages ? 0.4 : 1, display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, color: "var(--text-muted)" }}>Loading leads…</div>}>
      <LeadsContent />
    </Suspense>
  );
}
