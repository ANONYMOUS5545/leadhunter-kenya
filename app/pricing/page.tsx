import Link from "next/link";
import { CheckCircle2, ArrowLeft, Zap, Search } from "lucide-react";

const plans = [
  {
    name: "Free Demo",
    tier: "free",
    price: "KES 0",
    period: "/month",
    features: [
      "5 sample leads",
      "Weakness analysis preview",
      "1 cold call snippet per lead",
      "5 cities browseable",
      "No export",
    ],
    notIncluded: ["Real business data", "Full contact info", "Excel export"],
    cta: "Start Free",
    href: "/auth/register",
    highlight: false,
    color: "#22d3ee",
  },
  {
    name: "Starter",
    tier: "starter",
    price: "KES 2,900",
    period: "/month",
    yearlyPrice: "KES 2,500",
    features: [
      "100 leads per month",
      "Full contact info (phone, email, website)",
      "Full weakness analysis",
      "Cold call scripts",
      "City & industry filters",
      "Basic CSV export",
      "5 city coverage",
    ],
    notIncluded: ["Excel export", "Admin dashboard"],
    cta: "Get Started",
    href: "/auth/register?plan=starter",
    highlight: false,
    color: "#60a5fa",
  },
  {
    name: "Pro",
    tier: "pro",
    price: "KES 6,900",
    period: "/month",
    yearlyPrice: "KES 5,900",
    features: [
      "500 leads per month",
      "Full contact info",
      "Full weakness analysis",
      "All cold call scripts",
      "Excel + CSV export",
      "Priority scraping queue",
      "Saved searches",
      "All 15 industries",
      "All 5 cities",
    ],
    notIncluded: ["Admin access"],
    cta: "Go Pro",
    href: "/auth/register?plan=pro",
    highlight: true,
    color: "#c084fc",
  },
  {
    name: "Enterprise",
    tier: "enterprise",
    price: "KES 18,900",
    period: "/month",
    yearlyPrice: "KES 15,900",
    features: [
      "Unlimited leads",
      "Full contact info",
      "Full weakness analysis",
      "All cold call scripts",
      "Excel + CSV export",
      "Admin dashboard",
      "White-label PDF reports",
      "REST API access",
      "Custom industries",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    href: "/auth/register?plan=enterprise",
    highlight: false,
    color: "#fbbf24",
  },
];

const faqs = [
  { q: "What is LeadHunter KE?", a: "LeadHunter KE is a B2B lead intelligence platform that scrapes publicly available data from Google, Facebook, Instagram, and other sources to find Kenyan businesses that need web design, digital marketing, or graphic design services." },
  { q: "How are weaknesses detected?", a: "Our system automatically checks each business for missing websites, non-SSL sites, non-mobile pages, inactive social media, low Google ratings, missing contact info, and more — then scores them 0–100 on online presence." },
  { q: "Can I cancel anytime?", a: "Yes. All paid plans can be cancelled at any time. You retain access until the end of your billing period." },
  { q: "Is the data real?", a: "Paid plans scrape real, publicly available business data from online directories, Google Maps, and social media. The Free Demo shows synthetic sample data to demonstrate the platform's capabilities." },
  { q: "What cold call scripts are included?", a: "Each business gets 3–5 tailored cold call suggestions including an industry-specific opener, identified pain point, value proposition, and a call-to-action — all generated based on the specific weaknesses found." },
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border)", background: "rgba(7,11,20,0.92)", backdropFilter: "blur(12px)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Search size={14} color="#fff" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--text-primary)" }}>LeadHunter KE</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeft size={13} /> Home
          </Link>
          <Link href="/auth/login" className="btn-secondary" style={{ padding: "7px 16px", fontSize: 13 }}>Sign in</Link>
          <Link href="/auth/register" className="btn-primary" style={{ padding: "7px 16px", fontSize: 13 }}>Start Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "72px 24px 56px", textAlign: "center" }}>
        <div className="badge badge-blue" style={{ display: "inline-flex", marginBottom: 16 }}>
          <Zap size={10} /> Simple pricing
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 12 }}>
          Find your plan
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto" }}>
          Start free, upgrade when you&apos;re ready. All plans include a full demo so you can see the product before paying.
        </p>
      </section>

      {/* Plans */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {plans.map((plan) => (
            <div
              key={plan.tier}
              style={{
                background: plan.highlight ? "rgba(168,85,247,0.06)" : "var(--bg-card)",
                border: plan.highlight ? "1px solid rgba(168,85,247,0.25)" : "1px solid var(--border)",
                borderRadius: 16,
                padding: 28,
                position: "relative",
                boxShadow: plan.highlight ? "0 0 48px rgba(168,85,247,0.1)" : "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {plan.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)" }}>
                  <span className="badge badge-purple">Most Popular</span>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "0.08em", textTransform: "uppercase", color: plan.color, marginBottom: 8 }}>
                  {plan.name}
                </h2>
                <div>
                  <span style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>{plan.price}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{plan.period}</span>
                </div>
                {plan.yearlyPrice && (
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                    {plan.yearlyPrice}/mo billed annually
                  </p>
                )}
              </div>

              <ul style={{ flex: 1, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                    <CheckCircle2 size={13} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-muted)", opacity: 0.5 }}>
                    <span style={{ width: 13, height: 13, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, fontSize: 10 }}>✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "11px",
                  borderRadius: 9,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: plan.highlight ? plan.color : "transparent",
                  color: plan.highlight ? "#fff" : plan.color,
                  border: plan.highlight ? "none" : `1px solid ${plan.color}30`,
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "0 24px 80px", maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 32, textAlign: "center" }}>FAQ</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {faqs.map((faq) => (
            <div key={faq.q} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
