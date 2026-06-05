/**
 * Database seed script
 * Run: npx tsx scripts/seed.ts
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { industries, cities, users, subscriptionPlans, businesses } from "../lib/schema";
import { generateDemoBusinesses } from "../lib/scraper";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const DEFAULT_INDUSTRIES = [
  { name: "Restaurants & Cafés", slug: "restaurants-cafes", description: "Restaurants, cafes, fast food, eateries" },
  { name: "Hotels & Lodging", slug: "hotels", description: "Hotels, lodges, guesthouses, resorts" },
  { name: "Salons & Beauty", slug: "salons-beauty", description: "Hair salons, barbershops, nail salons, spas" },
  { name: "Gyms & Fitness", slug: "gyms-fitness", description: "Gyms, fitness centers, yoga studios, CrossFit" },
  { name: "Medical & Healthcare", slug: "medical-clinics", description: "Clinics, hospitals, dentists, pharmacies" },
  { name: "Law Firms", slug: "law-firms", description: "Lawyers, advocates, legal services" },
  { name: "Real Estate", slug: "real-estate", description: "Property agents, developers, realtors" },
  { name: "Schools & Colleges", slug: "schools-colleges", description: "Schools, colleges, academies, tutoring centers" },
  { name: "Tech & Startups", slug: "tech-startups", description: "Software companies, IT firms, tech startups" },
  { name: "Construction", slug: "construction", description: "Contractors, builders, architects" },
  { name: "Automotive", slug: "automotive", description: "Garages, car washes, mechanics, auto dealers" },
  { name: "Logistics & Transport", slug: "logistics", description: "Courier, freight, transport companies" },
  { name: "Events & Catering", slug: "events", description: "Event planners, caterers, wedding vendors" },
  { name: "Financial Services", slug: "financial-services", description: "SACCOs, insurance, microfinance, investment" },
  { name: "Retail & Shops", slug: "retail-shops", description: "Retail stores, boutiques, supermarkets" },
];

const DEFAULT_CITIES = [
  { name: "Nairobi", county: "Nairobi County" },
  { name: "Mombasa", county: "Mombasa County" },
  { name: "Kisumu", county: "Kisumu County" },
  { name: "Nakuru", county: "Nakuru County" },
  { name: "Eldoret", county: "Uasin Gishu County" },
];

const DEFAULT_PLANS = [
  {
    name: "Free Demo",
    tier: "free" as const,
    priceMonthly: 0,
    priceYearly: 0,
    leadsPerMonth: 5,
    exportEnabled: false,
    coldCallEnabled: false,
    adminAccess: false,
    features: ["5 sample leads", "Weakness analysis preview", "1 cold call snippet", "No export"],
  },
  {
    name: "Starter",
    tier: "starter" as const,
    priceMonthly: 290000,
    priceYearly: 3000000,
    leadsPerMonth: 100,
    exportEnabled: true,
    coldCallEnabled: true,
    adminAccess: false,
    features: ["100 leads/month", "Full weakness analysis", "Cold call scripts", "CSV export"],
  },
  {
    name: "Pro",
    tier: "pro" as const,
    priceMonthly: 690000,
    priceYearly: 7080000,
    leadsPerMonth: 500,
    exportEnabled: true,
    coldCallEnabled: true,
    adminAccess: false,
    features: ["500 leads/month", "Full analysis", "Excel export", "Priority scraping"],
  },
  {
    name: "Enterprise",
    tier: "enterprise" as const,
    priceMonthly: 1890000,
    priceYearly: 19080000,
    leadsPerMonth: -1,
    exportEnabled: true,
    coldCallEnabled: true,
    adminAccess: true,
    features: ["Unlimited leads", "Admin dashboard", "API access", "White-label"],
  },
];

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // 1. Industries
  console.log("→ Seeding industries...");
  for (const ind of DEFAULT_INDUSTRIES) {
    await db.insert(industries).values({ ...ind, isActive: true }).onConflictDoNothing();
  }
  console.log(`  ✓ ${DEFAULT_INDUSTRIES.length} industries`);

  // 2. Cities
  console.log("→ Seeding cities...");
  for (const city of DEFAULT_CITIES) {
    await db.insert(cities).values({ ...city, isActive: true }).onConflictDoNothing();
  }
  console.log(`  ✓ ${DEFAULT_CITIES.length} cities`);

  // 3. Subscription plans
  console.log("→ Seeding subscription plans...");
  for (const plan of DEFAULT_PLANS) {
    await db.insert(subscriptionPlans).values(plan).onConflictDoNothing();
  }
  console.log(`  ✓ ${DEFAULT_PLANS.length} plans`);

  // 4. Admin user
  console.log("→ Creating admin user...");
  const passwordHash = await bcrypt.hash("Admin1234!", 12);
  await db.insert(users).values({
    email: "admin@leadhunter.ke",
    name: "LeadHunter Admin",
    passwordHash,
    role: "admin",
    subscriptionTier: "enterprise",
  }).onConflictDoNothing();
  console.log("  ✓ Admin user: admin@leadhunter.ke / Admin1234!");

  // 5. Demo businesses
  console.log("→ Seeding demo leads...");
  const demoBizs = generateDemoBusinesses();
  for (const biz of demoBizs) {
    await db.insert(businesses).values({
      name: biz.name,
      city: biz.city,
      industryName: biz.industryName,
      phone: biz.phone,
      email: biz.email,
      website: biz.website,
      address: biz.address,
      facebookUrl: biz.facebookUrl,
      instagramUrl: biz.instagramUrl,
      tiktokUrl: biz.tiktokUrl,
      facebookFollowers: biz.facebookFollowers,
      instagramFollowers: biz.instagramFollowers,
      googleRating: biz.googleRating,
      googleReviewCount: biz.googleReviewCount,
      googleMapsUrl: biz.googleMapsUrl,
      weaknesses: biz.weaknesses,
      coldCallSuggestions: biz.coldCallSuggestions,
      onlinePresenceScore: biz.onlinePresenceScore,
      isDemo: true,
      dataSource: "demo",
    }).onConflictDoNothing();
  }
  console.log(`  ✓ ${demoBizs.length} demo businesses`);

  console.log("\n✅ Seed complete!");
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
