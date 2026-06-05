"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg)",
      }}
      className="grid-bg"
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "center",
            marginBottom: 36,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={16} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            LeadHunter KE
          </span>
        </Link>

        {/* Card */}
        <div
          className="card"
          style={{ padding: 32 }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
              marginBottom: 6,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>
            Sign in to access your leads dashboard.
          </p>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8,
                marginBottom: 20,
                fontSize: 13,
                color: "#f87171",
              }}
            >
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="label">Email</label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={14}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="email"
                  className="input"
                  style={{ paddingLeft: 38 }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={14}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="password"
                  className="input"
                  style={{ paddingLeft: 38 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                justifyContent: "center",
                marginTop: 4,
                padding: "12px",
                fontSize: 14,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "var(--text-muted)",
              marginTop: 20,
            }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}
            >
              Sign up free
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "rgba(6,182,212,0.06)",
            border: "1px solid rgba(6,182,212,0.15)",
            borderRadius: 10,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Demo admin:{" "}
            <span style={{ color: "#22d3ee" }}>admin@leadhunter.ke</span>
            {" / "}
            <span style={{ color: "#22d3ee" }}>Admin1234!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
