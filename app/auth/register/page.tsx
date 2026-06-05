"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

const planLabels: Record<string, string> = {
  starter: "Starter — KES 2,900/mo",
  pro: "Pro — KES 6,900/mo",
  enterprise: "Enterprise — KES 18,900/mo",
};

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
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
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg)" }}
      className="grid-bg"
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 32, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>LeadHunter KE</span>
        </Link>

        {plan !== "free" && (
          <div style={{ marginBottom: 16, padding: "10px 16px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#60a5fa" }}>
            <CheckCircle2 size={14} />
            Selected plan: <strong>{planLabels[plan] || plan}</strong>
          </div>
        )}

        <div className="card" style={{ padding: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 6, letterSpacing: "-0.02em" }}>Create your account</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>Start finding leads in minutes. Free forever on the demo plan.</p>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, marginBottom: 20, fontSize: 13, color: "#f87171" }}>
              <AlertCircle size={14} />{error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="label">Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input type="text" className="input" style={{ paddingLeft: 38 }} placeholder="John Kamau" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" minLength={2} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input type="email" className="input" style={{ paddingLeft: 38 }} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input type="password" className="input" style={{ paddingLeft: 38 }} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={8} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ justifyContent: "center", marginTop: 4, padding: "12px", fontSize: 14, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 20 }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 16 }}>
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
