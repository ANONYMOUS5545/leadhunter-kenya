"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Power, AlertCircle } from "lucide-react";
import type { Industry } from "@/lib/schema";

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchIndustries() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/industries");
      const data = await res.json();
      setIndustries(data.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchIndustries(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/industries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isActive: true }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create"); return; }
      setForm({ name: "", slug: "", description: "" });
      setShowForm(false);
      fetchIndustries();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: number, isActive: boolean) {
    await fetch("/api/admin/industries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    fetchIndustries();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this industry? This cannot be undone.")) return;
    await fetch(`/api/admin/industries?id=${id}`, { method: "DELETE" });
    fetchIndustries();
  }

  return (
    <div style={{ padding: "32px 32px 64px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4 }}>Industries</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Manage scraping target industries.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
          <Plus size={14} /> Add Industry
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 16 }}>New Industry</h2>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, marginBottom: 16, fontSize: 13, color: "#f87171" }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="label">Industry Name</label>
                <input className="input" placeholder="e.g. Restaurants & Cafés" value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                    setForm((f) => ({ ...f, name, slug }));
                  }} required />
              </div>
              <div>
                <label className="label">Slug</label>
                <input className="input" placeholder="restaurants-cafes" value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
              </div>
            </div>
            <div>
              <label className="label">Description (optional)</label>
              <input className="input" placeholder="Brief description of this industry" value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn-primary" style={{ fontSize: 13, padding: "8px 16px" }} disabled={saving}>
                {saving ? "Saving…" : "Create Industry"}
              </button>
              <button type="button" className="btn-secondary" style={{ fontSize: 13, padding: "8px 14px" }} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 32 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8, borderRadius: 6 }} />)}
          </div>
        ) : industries.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No industries yet. Add one above.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {industries.map((ind) => (
                <tr key={ind.id}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{ind.name}</td>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{ind.slug}</td>
                  <td>
                    <span className={`badge ${ind.isActive ? "badge-green" : "badge-red"}`}>
                      {ind.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>{new Date(ind.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => toggleActive(ind.id, ind.isActive)}
                        style={{ padding: "5px 10px", borderRadius: 6, background: ind.isActive ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${ind.isActive ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"}`, color: ind.isActive ? "#fbbf24" : "#34d399", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Power size={11} /> {ind.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDelete(ind.id)}
                        style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
