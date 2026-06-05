import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(cents: number, currency = "KES"): string {
  return `${currency} ${(cents / 100).toLocaleString()}`;
}

export function scoreColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

export function scoreBg(score: number): string {
  if (score >= 70) return "bg-emerald-400/10 border-emerald-400/20";
  if (score >= 40) return "bg-amber-400/10 border-amber-400/20";
  return "bg-red-400/10 border-red-400/20";
}

export function scoreLabel(score: number): string {
  if (score >= 70) return "Strong";
  if (score >= 40) return "Moderate";
  return "Weak";
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export const CITIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
] as const;

export const INDUSTRIES = [
  { id: "restaurants-cafes", name: "Restaurants & Cafés" },
  { id: "hotels", name: "Hotels & Lodging" },
  { id: "salons-beauty", name: "Salons & Beauty" },
  { id: "gyms-fitness", name: "Gyms & Fitness" },
  { id: "medical-clinics", name: "Medical & Healthcare" },
  { id: "law-firms", name: "Law Firms" },
  { id: "real-estate", name: "Real Estate" },
  { id: "schools-colleges", name: "Schools & Colleges" },
  { id: "tech-startups", name: "Tech & Startups" },
  { id: "construction", name: "Construction" },
  { id: "automotive", name: "Automotive" },
  { id: "logistics", name: "Logistics & Transport" },
  { id: "events", name: "Events & Catering" },
  { id: "financial-services", name: "Financial Services" },
  { id: "retail-shops", name: "Retail & Shops" },
] as const;

export const SUBSCRIPTION_PLANS = [
  {
    tier: "free",
    name: "Demo",
    priceMonthly: 0,
    priceYearly: 0,
    leadsPerMonth: 5,
    features: [
      "5 sample leads",
      "Weakness analysis preview",
      "Cold call snippet",
      "No export",
    ],
    cta: "Start Free",
  },
  {
    tier: "starter",
    name: "Starter",
    priceMonthly: 2_900_00,
    priceYearly: 2_500_00 * 12,
    leadsPerMonth: 100,
    features: [
      "100 leads/month",
      "Full weakness analysis",
      "Cold call scripts",
      "Filter by city & industry",
      "Basic CSV export",
    ],
    cta: "Start Starter",
    popular: false,
  },
  {
    tier: "pro",
    name: "Pro",
    priceMonthly: 6_900_00,
    priceYearly: 5_900_00 * 12,
    leadsPerMonth: 500,
    features: [
      "500 leads/month",
      "Full weakness analysis",
      "Full cold call scripts",
      "Excel + CSV export",
      "Priority scraping",
      "Saved searches",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    tier: "enterprise",
    name: "Enterprise",
    priceMonthly: 18_900_00,
    priceYearly: 15_900_00 * 12,
    leadsPerMonth: -1,
    features: [
      "Unlimited leads",
      "Admin dashboard access",
      "White-label reports",
      "API access",
      "Custom industries",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
] as const;
