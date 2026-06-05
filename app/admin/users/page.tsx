"use client";
import { useEffect, useState } from "react";
import { Search, Shield, ChevronDown } from "lucide-react";

interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
  subscriptionTier: string;
  subscriptionExpiresAt: string | null;
  createdAt: string;
}

const tierBadge: Record<string, string> = {
  free: "badge-cyan",
  starter: "badge-blue",
  pro: "badge-purple",
  enterprise: "badge-amber",
};

const roleBadge: Record<string, string> = {
  user: "badge-muted",
  admin: "badge-red",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTier, setEditTier] = useState("");

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.data || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function updateUser(id: number, tier: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, subscriptionTier: tier }),
    });
    setEditingId(null);
    fetchUsers();
  }

  return (
    <div style={{ padding: "32px 32px 64px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4 }}>Users</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{total} registered users</p>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 32 }}>
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8, borderRadius: 6 }} />)}
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No users yet.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Plan</th>
                <th>Joined</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>{u.name || "—"}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{u.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${roleBadge[u.role] || "badge-blue"}`}>
                      {u.role === "admin" && <Shield size={9} />}
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {editingId === u.id ? (
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <select
                          className="input"
                          style={{ width: "auto", padding: "4px 8px", fontSize: 12 }}
                          value={editTier}
                          onChange={(e) => setEditTier(e.target.value)}
                        >
                          <option value="free">Free</option>
                          <option value="starter">Starter</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                        <button
                          onClick={() => updateUser(u.id, editTier)}
                          style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", cursor: "pointer", fontSize: 11 }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", fontSize: 11 }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className={`badge ${tierBadge[u.subscriptionTier] || "badge-blue"}`}>
                        {u.subscriptionTier}
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {editingId !== u.id && (
                      <button
                        onClick={() => { setEditingId(u.id); setEditTier(u.subscriptionTier); }}
                        style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <ChevronDown size={11} /> Change Plan
                      </button>
                    )}
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
