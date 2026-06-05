import Link from "next/link";
import { Search, AlertTriangle, PhoneCall, Download, Shield, Zap, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

const stats = [
  { value: "5", label: "Major Kenyan cities" },
  { value: "15+", label: "Industry verticals" },
  { value: "500+", label: "Leads per scrape" },
  { value: "AI", label: "Powered analysis" },
];

const features = [
  { icon: "🔍", title: "Smart Lead Discovery", desc: "Scrape Google, Facebook, Instagram & TikTok for businesses across Nairobi, Mombasa, Kisumu, Nakuru and Eldoret.", color: "#3b82f6" },
  { icon: "⚠️", title: "Online Weakness Analysis", desc: "Automatically detect missing websites, inactive social pages, poor Google ratings, no SSL certificates, and more.", color: "#f59e0b" },
  { icon: "📞", title: "Cold Call Scripts", desc: "AI-generated, industry-specific cold call openers, pain points, and value propositions tailored to each business.", color: "#10b981" },
  { icon: "📊", title: "Excel Export", desc: "Export all leads, weaknesses, and call scripts to Excel with one click. Ready for your CRM or sales team.", color: "#06b6d4" },
  { icon: "🏆", title: "Presence Score", desc: "Every business gets a 0-100 Online Presence Score so you can prioritize the weakest leads first.", color: "#8b5cf6" },
  { icon: "🛡️", title: "Admin Dashboard", desc: "Full admin panel to manage industries, cities, scraping jobs, and subscriptions at scale.", color: "#ec4899" },
];

const plans = [
  { name: "Free Demo", price: "KES 0", period: "/month", features: ["5 sample leads", "Weakness preview", "1 cold call snippet", "No export"], cta: "Start Free", href: "/auth/register", highlight: false },
  { name: "Starter", price: "KES 2,900", period: "/month", features: ["100 leads/month", "Full weakness analysis", "Cold call scripts", "City & industry filters", "CSV export"], cta: "Get Started", href: "/auth/register?plan=starter", highlight: false },
  { name: "Pro", price: "KES 6,900", period: "/month", features: ["500 leads/month", "Full analysis & scripts", "Excel + CSV export", "Priority scraping", "Saved searches"], cta: "Go Pro", href: "/auth/register?plan=pro", highlight: true },
  { name: "Enterprise", price: "KES 18,900", period: "/month", features: ["Unlimited leads", "Admin dashboard", "White-label reports", "API access", "Custom industries", "Dedicated support"], cta: "Contact Sales", href: "/auth/register?plan=enterprise", highlight: false },
];

const cities = [
  { name: "Nairobi", icon: "🏙️", count: "2,400+" },
  { name: "Mombasa", icon: "🌊", count: "780+" },
  { name: "Kisumu", icon: "🏞️", count: "560+" },
  { name: "Nakuru", icon: "🌿", count: "440+" },
  { name: "Eldoret", icon: "🏔️", count: "320+" },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border)", background: "rgba(7,11,20,0.92)", backdropFilter: "blur(12px)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={14} color="#fff" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>LeadHunter KE</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/auth/login" className="btn-secondary" style={{ padding: "7px 16px", fontSize: 13 }}>Sign in</Link>
          <Link href="/auth/register" className="btn-primary" style={{ padding: "7px 16px", fontSize: 13 }}>Start Free</Link>
        </div>
      </nav>

      <section className="grid-bg" style={{ padding: "100px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
          <div className="badge badge-cyan animate-fade-in" style={{ marginBottom: 20, display: "inline-flex" }}>
            <Zap size={10} />
            Kenya&apos;s #1 B2B Lead Intelligence Platform
          </div>
          <h1 className="animate-fade-up" style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 800, marginBottom: 24, background: "linear-gradient(135deg, #f0f4ff 0%, #8b9ab8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Find Every Business<br />That Needs Your Services
          </h1>
          <p className="animate-fade-up delay-100" style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
            Scrape, analyze, and close Kenya&apos;s highest-value B2B leads. Built for web designers, digital marketers, and graphic designers.
          </p>
          <div className="animate-fade-up delay-200" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>Start for Free <ArrowRight size={16} /></Link>
            <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 15, padding: "12px 28px" }}>View Demo</Link>
          </div>
          <div className="animate-fade-up delay-300" style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "#60a5fa", letterSpacing: "-0.03em" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 24px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 24, fontFamily: "var(--font-display)" }}>Covering Kenya&apos;s 5 Major Business Hubs</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {cities.map((c) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.count} businesses</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 16, color: "var(--text-primary)" }}>Everything you need to close more clients</h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto" }}>From lead discovery to cold call ready — in one platform.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f) => (
            <div key={f.title} className="card" style={{ padding: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${f.color}15`, border: `1px solid ${f.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, fontFamily: "var(--font-display)" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 24px", background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 12, color: "var(--text-primary)" }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>Start free. Scale as you grow.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
            {plans.map((plan) => (
              <div key={plan.name} style={{ background: plan.highlight ? "rgba(59,130,246,0.06)" : "var(--bg)", border: plan.highlight ? "1px solid rgba(59,130,246,0.3)" : "1px solid var(--border)", borderRadius: 16, padding: 24, position: "relative", boxShadow: plan.highlight ? "0 0 40px rgba(59,130,246,0.1)" : "none" }}>
                {plan.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)" }}><span className="badge badge-blue">Most Popular</span></div>}
                <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", fontFamily: "var(--font-display)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{plan.price}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                      <CheckCircle2 size={13} style={{ color: "#10b981", flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={plan.highlight ? "btn-primary" : "btn-secondary"} style={{ width: "100%", justifyContent: "center", fontSize: 13, display: "flex" }}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={12} color="#fff" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-secondary)" }}>LeadHunter KE</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>© {new Date().getFullYear()} LeadHunter KE. Built for Kenya&apos;s digital sales professionals.</p>
      </footer>
    </div>
  );
}
