import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  serial,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ─────────────────────────────────────────────────────────────────
export const cityEnum = pgEnum("city", [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "starter",
  "pro",
  "enterprise",
]);

export const scrapeStatusEnum = pgEnum("scrape_status", [
  "pending",
  "running",
  "completed",
  "failed",
]);

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// ─── Users ──────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").default("user").notNull(),
  subscriptionTier: subscriptionTierEnum("subscription_tier")
    .default("free")
    .notNull(),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Industries ─────────────────────────────────────────────────────────────
export const industries = pgTable("industries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Cities ─────────────────────────────────────────────────────────────────
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  county: varchar("county", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Businesses (Leads) ─────────────────────────────────────────────────────
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 500 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  industryId: integer("industry_id").references(() => industries.id),
  industryName: varchar("industry_name", { length: 255 }),

  // Contact Info
  phone: varchar("phone", { length: 100 }),
  email: varchar("email", { length: 255 }),
  website: text("website"),
  address: text("address"),

  // Social Media
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  tiktokUrl: text("tiktok_url"),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),

  // Social Stats
  facebookFollowers: integer("facebook_followers"),
  instagramFollowers: integer("instagram_followers"),
  tiktokFollowers: integer("tiktok_followers"),

  // Google/Maps Data
  googlePlaceId: varchar("google_place_id", { length: 500 }),
  googleRating: varchar("google_rating", { length: 10 }),
  googleReviewCount: integer("google_review_count"),
  googleMapsUrl: text("google_maps_url"),

  // Analysis
  weaknesses: jsonb("weaknesses").$type<string[]>().default([]),
  coldCallSuggestions: jsonb("cold_call_suggestions")
    .$type<ColdCallSuggestion[]>()
    .default([]),
  onlinePresenceScore: integer("online_presence_score").default(0),

  // Meta
  isDemo: boolean("is_demo").default(false).notNull(),
  dataSource: varchar("data_source", { length: 100 }),
  scrapeJobId: integer("scrape_job_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Scrape Jobs ─────────────────────────────────────────────────────────────
export const scrapeJobs = pgTable("scrape_jobs", {
  id: serial("id").primaryKey(),
  cityName: varchar("city_name", { length: 255 }).notNull(),
  industryId: integer("industry_id").references(() => industries.id),
  industryName: varchar("industry_name", { length: 255 }),
  status: scrapeStatusEnum("status").default("pending").notNull(),
  totalFound: integer("total_found").default(0),
  totalProcessed: integer("total_processed").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

// ─── Subscription Plans ───────────────────────────────────────────────────
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  tier: subscriptionTierEnum("tier").notNull(),
  priceMonthly: integer("price_monthly").notNull(), // in cents
  priceYearly: integer("price_yearly").notNull(), // in cents
  leadsPerMonth: integer("leads_per_month").notNull(),
  exportEnabled: boolean("export_enabled").default(false).notNull(),
  coldCallEnabled: boolean("cold_call_enabled").default(false).notNull(),
  adminAccess: boolean("admin_access").default(false).notNull(),
  features: jsonb("features").$type<string[]>().default([]),
  stripeMonthlyPriceId: varchar("stripe_monthly_price_id", { length: 255 }),
  stripeYearlyPriceId: varchar("stripe_yearly_price_id", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Relations ───────────────────────────────────────────────────────────────
export const businessRelations = relations(businesses, ({ one }) => ({
  industry: one(industries, {
    fields: [businesses.industryId],
    references: [industries.id],
  }),
  scrapeJob: one(scrapeJobs, {
    fields: [businesses.scrapeJobId],
    references: [scrapeJobs.id],
  }),
}));

export const scrapeJobRelations = relations(scrapeJobs, ({ one, many }) => ({
  industry: one(industries, {
    fields: [scrapeJobs.industryId],
    references: [industries.id],
  }),
  createdByUser: one(users, {
    fields: [scrapeJobs.createdBy],
    references: [users.id],
  }),
  businesses: many(businesses),
}));

// ─── Types ──────────────────────────────────────────────────────────────────
export interface ColdCallSuggestion {
  topic: string;
  opener: string;
  painPoint: string;
  valueProposition: string;
  callToAction: string;
}

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
export type Industry = typeof industries.$inferSelect;
export type ScrapeJob = typeof scrapeJobs.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
