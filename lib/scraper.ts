import axios from "axios";
import * as cheerio from "cheerio";
import type { ColdCallSuggestion } from "./schema";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface ScrapedBusiness {
  name: string;
  city: string;
  industryName: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  facebookFollowers?: number;
  instagramFollowers?: number;
  googleRating?: string;
  googleReviewCount?: number;
  googleMapsUrl?: string;
  googlePlaceId?: string;
  weaknesses: string[];
  coldCallSuggestions: ColdCallSuggestion[];
  onlinePresenceScore: number;
  dataSource: string;
}

// ─── Kenya Business Directories / Data Sources ─────────────────────────────
const KENYA_DIRECTORIES = [
  "https://businesslist.co.ke",
  "https://yellow.co.ke",
  "https://www.yelp.com",
];

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "restaurants-cafes": [
    "restaurant",
    "cafe",
    "bistro",
    "eatery",
    "food court",
    "fast food",
  ],
  "retail-shops": ["shop", "store", "boutique", "supermarket", "outlet"],
  hotels: ["hotel", "lodge", "guesthouse", "resort", "accommodation"],
  "salons-beauty": ["salon", "barbershop", "spa", "beauty", "nail", "hair"],
  "gyms-fitness": ["gym", "fitness", "crossfit", "yoga", "wellness center"],
  "medical-clinics": [
    "clinic",
    "hospital",
    "dental",
    "pharmacy",
    "medical center",
  ],
  "law-firms": ["law firm", "advocates", "legal", "attorneys"],
  "real-estate": ["real estate", "property", "realty", "developer"],
  "schools-colleges": ["school", "college", "academy", "institute", "tutoring"],
  "tech-startups": ["tech", "software", "IT", "digital", "startup"],
  "construction": ["construction", "contractor", "builder", "architect"],
  "automotive": ["garage", "auto", "car wash", "mechanic", "motors"],
  "logistics": ["logistics", "courier", "transport", "delivery", "freight"],
  "events": ["events", "decor", "catering", "weddings", "entertainment"],
  "financial-services": ["sacco", "insurance", "investment", "microfinance"],
};

// ─── Google Places Simulation (Real search uses SerpAPI / Apify) ─────────────
async function scrapeBusinessListKe(
  city: string,
  industry: string
): Promise<Partial<ScrapedBusiness>[]> {
  const results: Partial<ScrapedBusiness>[] = [];

  // Use free business directories available in Kenya
  const searchUrls = [
    `https://businesslist.co.ke/${city.toLowerCase()}/${industry
      .toLowerCase()
      .replace(/\s+/g, "-")}`,
    `https://yellow.co.ke/search?q=${encodeURIComponent(industry)}&loc=${encodeURIComponent(city)}`,
  ];

  for (const url of searchUrls) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      const $ = cheerio.load(response.data);

      // BusinessList.co.ke structure
      if (url.includes("businesslist")) {
        $(".business-item, .listing-item, .biz-listing").each((_, el) => {
          const name = $(el).find(".biz-name, h2, h3").first().text().trim();
          const phone = $(el)
            .find(".phone, .contact-phone, [class*='phone']")
            .first()
            .text()
            .trim();
          const address = $(el)
            .find(".address, .location, [class*='address']")
            .first()
            .text()
            .trim();
          const website = $(el).find("a[href*='http']").attr("href");

          if (name) {
            results.push({
              name,
              phone: phone || undefined,
              address: address || undefined,
              website: isExternalUrl(website) ? website : undefined,
              dataSource: "businesslist.co.ke",
            });
          }
        });
      }

      // Yellow Pages Kenya structure
      if (url.includes("yellow.co.ke")) {
        $(".listing, .result-item, .business-card").each((_, el) => {
          const name = $(el).find("h2, h3, .name").first().text().trim();
          const phone = $(el).find(".phone, .tel").first().text().trim();
          const address = $(el)
            .find(".address, .street")
            .first()
            .text()
            .trim();

          if (name) {
            results.push({
              name,
              phone: phone || undefined,
              address: address || undefined,
              dataSource: "yellow.co.ke",
            });
          }
        });
      }
    } catch {
      // Directory may be unavailable; continue gracefully
      continue;
    }
  }

  return results;
}

// ─── Website Analysis ────────────────────────────────────────────────────────
export async function analyzeWebsite(url: string): Promise<{
  hasWebsite: boolean;
  hasSSL: boolean;
  hasMobileViewport: boolean;
  hasContactForm: boolean;
  hasAboutPage: boolean;
  loadTime?: number;
  issues: string[];
}> {
  const issues: string[] = [];

  if (!url) {
    return {
      hasWebsite: false,
      hasSSL: false,
      hasMobileViewport: false,
      hasContactForm: false,
      hasAboutPage: false,
      issues: ["No website found"],
    };
  }

  try {
    const start = Date.now();
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; LeadHunterBot/1.0; +https://leadhunter.ke)",
      },
    });
    const loadTime = Date.now() - start;
    const $ = cheerio.load(response.data);

    const hasSSL = url.startsWith("https://");
    const hasMobileViewport =
      $('meta[name="viewport"]').length > 0 &&
      ($('meta[name="viewport"]').attr("content") || "").includes("width");
    const hasContactForm =
      $("form").length > 0 ||
      $("input[type='email']").length > 0 ||
      $("a[href*='contact']").length > 0;
    const hasAboutPage =
      $("a[href*='about']").length > 0 ||
      $("a:contains('About')").length > 0 ||
      $("nav a:contains('About Us')").length > 0;

    if (!hasSSL) issues.push("No SSL certificate (HTTP only)");
    if (!hasMobileViewport) issues.push("Not mobile-responsive");
    if (!hasContactForm) issues.push("No contact form or email capture");
    if (!hasAboutPage) issues.push("No About page found");
    if (loadTime > 4000) issues.push("Slow website load time");

    // Check for basic SEO
    const hasMetaDesc = $('meta[name="description"]').length > 0;
    const hasOgTags = $('meta[property^="og:"]').length > 0;
    const hasTitleTag = $("title").text().length > 5;

    if (!hasMetaDesc) issues.push("Missing meta description");
    if (!hasOgTags) issues.push("No Open Graph tags for social sharing");
    if (!hasTitleTag) issues.push("Missing or empty title tag");

    return {
      hasWebsite: true,
      hasSSL,
      hasMobileViewport,
      hasContactForm,
      hasAboutPage,
      loadTime,
      issues,
    };
  } catch {
    return {
      hasWebsite: true,
      hasSSL: url.startsWith("https://"),
      hasMobileViewport: false,
      hasContactForm: false,
      hasAboutPage: false,
      issues: ["Website unreachable or returns errors"],
    };
  }
}

// ─── Weakness Analysis Engine ────────────────────────────────────────────────
export function analyzeWeaknesses(
  business: Partial<ScrapedBusiness> & {
    websiteIssues?: string[];
    hasWebsite?: boolean;
  }
): string[] {
  const weaknesses: string[] = [];

  // Website weaknesses
  if (!business.website && !business.hasWebsite) {
    weaknesses.push("No website — missing 82% of potential online customers");
  } else if (business.websiteIssues) {
    weaknesses.push(...business.websiteIssues);
  }

  // Social media weaknesses
  if (!business.facebookUrl && !business.instagramUrl && !business.tiktokUrl) {
    weaknesses.push("No social media presence detected");
  } else {
    if (!business.facebookUrl)
      weaknesses.push("Not on Facebook (2.3M+ Kenyan users)");
    if (!business.instagramUrl)
      weaknesses.push("Not on Instagram — missing visual marketing channel");
    if (!business.tiktokUrl)
      weaknesses.push(
        "No TikTok presence — missed viral/short-video marketing"
      );

    // Check follower counts if available
    if (
      business.facebookFollowers !== undefined &&
      business.facebookFollowers < 500
    ) {
      weaknesses.push(
        `Low Facebook engagement (${business.facebookFollowers} followers)`
      );
    }
    if (
      business.instagramFollowers !== undefined &&
      business.instagramFollowers < 500
    ) {
      weaknesses.push(
        `Low Instagram following (${business.instagramFollowers} followers)`
      );
    }
  }

  // Contact info weaknesses
  if (!business.phone) {
    weaknesses.push("No phone number publicly listed");
  }
  if (!business.email) {
    weaknesses.push("No business email address visible online");
  }

  // Google / Maps weaknesses
  if (!business.googlePlaceId && !business.googleMapsUrl) {
    weaknesses.push("Not listed on Google Maps / Google Business Profile");
  }
  if (
    business.googleRating &&
    parseFloat(business.googleRating) < 4.0 &&
    (business.googleReviewCount ?? 0) > 5
  ) {
    weaknesses.push(
      `Low Google rating (${business.googleRating}★) — needs reputation management`
    );
  }
  if (
    business.googleReviewCount !== undefined &&
    business.googleReviewCount < 10
  ) {
    weaknesses.push(
      "Very few Google reviews — needs review generation strategy"
    );
  }

  return weaknesses;
}

// ─── Cold Call Suggestion Generator ─────────────────────────────────────────
export function generateColdCallSuggestions(
  businessName: string,
  industry: string,
  weaknesses: string[]
): ColdCallSuggestion[] {
  const suggestions: ColdCallSuggestion[] = [];

  const industryContext = getIndustryContext(industry);

  // Website suggestion
  if (weaknesses.some((w) => w.toLowerCase().includes("no website"))) {
    suggestions.push({
      topic: "Professional Website Development",
      opener: `Hi, I'm calling for ${businessName}. I noticed you don't have a website yet — I wanted to share how a professional site has helped similar ${industryContext.type} businesses in ${industryContext.city} increase their customer calls by over 40%.`,
      painPoint:
        "Without a website, you're invisible to the 82% of customers who search online before visiting a business.",
      valueProposition: `We build mobile-first websites specifically for ${industryContext.type} businesses in Kenya, starting from KES 25,000. Includes Google Maps integration, contact forms, and WhatsApp click-to-chat.`,
      callToAction:
        "Can I send you 3 examples of websites we've done for similar businesses this month?",
    });
  }

  // Social media suggestion
  if (weaknesses.some((w) => w.toLowerCase().includes("no social media"))) {
    suggestions.push({
      topic: "Social Media Setup & Management",
      opener: `Good morning, I'm reaching out to ${businessName}. I noticed you're not yet on Facebook or Instagram — your competitors in the area are getting strong results from social media and I'd love to show you how.`,
      painPoint:
        "Kenyan consumers increasingly discover and evaluate businesses on social media before making purchasing decisions.",
      valueProposition: `Our social media starter package sets up and manages Facebook + Instagram for ${industryContext.type} businesses, with targeted content calendars at KES 8,000/month.`,
      callToAction:
        "Would a 15-minute call this week work to walk you through what we've achieved for other businesses like yours?",
    });
  }

  // Low social following
  if (weaknesses.some((w) => w.toLowerCase().includes("low facebook"))) {
    suggestions.push({
      topic: "Social Media Growth & Engagement",
      opener: `Hi there, I help businesses like ${businessName} grow their Facebook following and turn followers into paying customers. I noticed your page has potential but isn't getting the traction it deserves.`,
      painPoint:
        "A stagnant social media page can actually hurt credibility — customers may assume the business is inactive.",
      valueProposition: `We run targeted Facebook/Instagram growth campaigns for ${industryContext.type} businesses, typically growing pages from under 500 to 2,000+ followers in 60 days.`,
      callToAction:
        "Can I show you a case study from a similar business we helped grow last quarter?",
    });
  }

  // Google Maps suggestion
  if (weaknesses.some((w) => w.toLowerCase().includes("google maps"))) {
    suggestions.push({
      topic: "Google Business Profile Optimization",
      opener: `Hello, I'm calling because ${businessName} isn't showing up when people search for ${industryContext.type} services in your area on Google Maps — and that's costing you customers every single day.`,
      painPoint:
        "Over 70% of local searches result in a store visit within 24 hours. Not appearing on Google Maps means losing those customers to competitors.",
      valueProposition:
        "We set up and optimize Google Business Profiles for local Kenyan businesses, including photo uploads, review management, and local SEO — one-time setup at KES 5,000.",
      callToAction:
        "Want me to do a quick free audit of your current Google visibility?",
    });
  }

  // Website redesign suggestion
  if (
    weaknesses.some(
      (w) =>
        w.toLowerCase().includes("not mobile") ||
        w.toLowerCase().includes("ssl")
    )
  ) {
    suggestions.push({
      topic: "Website Redesign & Modernization",
      opener: `Hi, I visited ${businessName}'s website and noticed it has some technical issues that are likely causing you to lose customers — specifically around mobile experience and security. I wanted to reach out directly.`,
      painPoint:
        "Google penalizes non-mobile websites in search rankings, and customers abandon sites without HTTPS. This is directly affecting your visibility.",
      valueProposition: `We modernize existing websites for ${industryContext.type} businesses — mobile-responsive redesigns with SSL, faster load times, and improved SEO starting at KES 15,000.`,
      callToAction:
        "I can send you a free technical audit report for your website today — would that be helpful?",
    });
  }

  // Graphic design
  suggestions.push({
    topic: "Brand Identity & Graphic Design",
    opener: `Good day, I work with ${industryContext.type} businesses in Kenya to improve their visual brand — logos, social media graphics, and marketing materials. I'd love to see if we can add value for ${businessName}.`,
    painPoint:
      "Inconsistent or outdated branding reduces trust and makes it harder to charge premium prices.",
    valueProposition: `Our brand packages for ${industryContext.type} businesses include logo design, brand guide, social media templates, and business card design — all for KES 18,000.`,
    callToAction:
      "Would you be open to a quick design consultation — no obligation, just to see what's possible?",
  });

  return suggestions.slice(0, 5); // Return top 5 most relevant
}

function getIndustryContext(industry: string): {
  type: string;
  city: string;
  searchTerms: string[];
} {
  const mappings: Record<string, { type: string; searchTerms: string[] }> = {
    "restaurants-cafes": {
      type: "restaurant/café",
      searchTerms: ["menu", "reservations", "delivery"],
    },
    hotels: {
      type: "hospitality",
      searchTerms: ["booking", "rooms", "amenities"],
    },
    "salons-beauty": {
      type: "beauty & wellness",
      searchTerms: ["appointments", "services", "pricing"],
    },
    "real-estate": {
      type: "real estate",
      searchTerms: ["listings", "properties", "agents"],
    },
    "medical-clinics": {
      type: "healthcare",
      searchTerms: ["appointments", "doctors", "services"],
    },
    default: {
      type: "local business",
      searchTerms: ["services", "contact", "booking"],
    },
  };

  const ctx = mappings[industry] || mappings.default;
  return { ...ctx, city: "Kenya" };
}

// ─── Online Presence Score ────────────────────────────────────────────────────
export function calculatePresenceScore(
  business: Partial<ScrapedBusiness> & { websiteIssues?: string[] }
): number {
  let score = 0;
  const maxScore = 100;

  // Website (30 points)
  if (business.website) {
    score += 15;
    if (business.website.startsWith("https://")) score += 10;
    if (
      business.websiteIssues &&
      business.websiteIssues.length === 0
    )
      score += 5;
  }

  // Social Media (25 points)
  if (business.facebookUrl) score += 8;
  if (business.instagramUrl) score += 8;
  if (business.tiktokUrl) score += 5;
  if (business.twitterUrl) score += 2;
  if (business.linkedinUrl) score += 2;

  // Followers (15 points)
  if ((business.facebookFollowers ?? 0) > 1000) score += 5;
  if ((business.facebookFollowers ?? 0) > 5000) score += 3;
  if ((business.instagramFollowers ?? 0) > 1000) score += 5;
  if ((business.instagramFollowers ?? 0) > 5000) score += 2;

  // Google Presence (20 points)
  if (business.googlePlaceId || business.googleMapsUrl) score += 10;
  if (business.googleRating && parseFloat(business.googleRating) >= 4.0)
    score += 5;
  if ((business.googleReviewCount ?? 0) > 20) score += 5;

  // Contact Info (10 points)
  if (business.phone) score += 5;
  if (business.email) score += 5;

  return Math.min(Math.round((score / maxScore) * 100), 100);
}

// ─── Helper ──────────────────────────────────────────────────────────────────
function isExternalUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

// ─── Demo Data Generator ─────────────────────────────────────────────────────
export function generateDemoBusinesses(): ScrapedBusiness[] {
  const demoData: ScrapedBusiness[] = [
    {
      name: "Savanna Bites Restaurant",
      city: "Nairobi",
      industryName: "Restaurants & Cafés",
      phone: "+254 712 345 678",
      email: undefined,
      website: "http://savannabites.co.ke",
      address: "Westlands, Nairobi",
      facebookUrl: "https://facebook.com/savannabites",
      instagramUrl: undefined,
      tiktokUrl: undefined,
      facebookFollowers: 234,
      googleRating: "3.8",
      googleReviewCount: 12,
      googleMapsUrl: "https://maps.google.com",
      weaknesses: [
        "Website uses HTTP (no SSL) — security risk for customers",
        "Not mobile-responsive — 70% of traffic is mobile",
        "No Instagram presence — missing key food discovery platform",
        "Low Google rating (3.8★) — needs review management strategy",
        "Only 234 Facebook followers — very low engagement",
      ],
      coldCallSuggestions: generateColdCallSuggestions(
        "Savanna Bites Restaurant",
        "restaurants-cafes",
        [
          "Website uses HTTP (no SSL)",
          "Not mobile-responsive",
          "No Instagram presence",
        ]
      ),
      onlinePresenceScore: 28,
      dataSource: "demo",
    },
    {
      name: "Coastal Waves Hotel",
      city: "Mombasa",
      industryName: "Hotels & Lodging",
      phone: "+254 723 456 789",
      email: "info@coastalwaves.co.ke",
      website: undefined,
      address: "Nyali, Mombasa",
      facebookUrl: undefined,
      instagramUrl: undefined,
      tiktokUrl: undefined,
      googleRating: undefined,
      googleReviewCount: 0,
      weaknesses: [
        "No website — invisible to 82% of online searchers",
        "No social media presence — not findable by travellers",
        "Not listed on Google Maps — losing direct bookings",
        "No online review presence — travellers can't evaluate quality",
      ],
      coldCallSuggestions: generateColdCallSuggestions(
        "Coastal Waves Hotel",
        "hotels",
        ["No website", "No social media presence"]
      ),
      onlinePresenceScore: 10,
      dataSource: "demo",
    },
    {
      name: "GlowUp Beauty Salon",
      city: "Kisumu",
      industryName: "Salons & Beauty",
      phone: "+254 733 567 890",
      email: "glowup@gmail.com",
      website: "https://glowupsalon.co.ke",
      address: "Milimani, Kisumu",
      facebookUrl: "https://facebook.com/glowupsalon",
      instagramUrl: "https://instagram.com/glowupsalon",
      tiktokUrl: undefined,
      facebookFollowers: 1840,
      instagramFollowers: 920,
      googleRating: "4.5",
      googleReviewCount: 67,
      googleMapsUrl: "https://maps.google.com",
      weaknesses: [
        "No TikTok — missing viral beauty content platform",
        "Website lacks online booking functionality",
        "No WhatsApp business integration",
      ],
      coldCallSuggestions: generateColdCallSuggestions(
        "GlowUp Beauty Salon",
        "salons-beauty",
        ["No TikTok", "Website lacks online booking"]
      ),
      onlinePresenceScore: 72,
      dataSource: "demo",
    },
    {
      name: "Nakuru Prime Properties",
      city: "Nakuru",
      industryName: "Real Estate",
      phone: "+254 744 678 901",
      email: undefined,
      website: "https://nakuruprime.co.ke",
      address: "CBD, Nakuru",
      facebookUrl: "https://facebook.com/nakuruprime",
      instagramUrl: undefined,
      tiktokUrl: undefined,
      facebookFollowers: 445,
      googleRating: "4.2",
      googleReviewCount: 8,
      googleMapsUrl: "https://maps.google.com",
      weaknesses: [
        "No Instagram — key platform for property photography",
        "Very few Google reviews (8) — reduces buyer trust",
        "No email address publicly listed",
        "Missing property search/filter on website",
      ],
      coldCallSuggestions: generateColdCallSuggestions(
        "Nakuru Prime Properties",
        "real-estate",
        [
          "No Instagram",
          "Very few Google reviews",
          "No email address publicly listed",
        ]
      ),
      onlinePresenceScore: 48,
      dataSource: "demo",
    },
    {
      name: "Eldoret Medical Clinic",
      city: "Eldoret",
      industryName: "Medical & Healthcare",
      phone: "+254 755 789 012",
      email: "eldoclinic@yahoo.com",
      website: "http://eldoretclinic.co.ke",
      address: "Uganda Road, Eldoret",
      facebookUrl: "https://facebook.com/eldoretclinic",
      instagramUrl: undefined,
      tiktokUrl: undefined,
      facebookFollowers: 312,
      googleRating: "4.0",
      googleReviewCount: 23,
      googleMapsUrl: "https://maps.google.com",
      weaknesses: [
        "Website uses HTTP — patients concerned about data security",
        "No appointment booking system online",
        "Yahoo email reduces professional credibility",
        "No Instagram for health tips & awareness content",
        "Low Facebook following (312) — limited health education reach",
      ],
      coldCallSuggestions: generateColdCallSuggestions(
        "Eldoret Medical Clinic",
        "medical-clinics",
        ["Website uses HTTP", "No appointment booking", "Yahoo email"]
      ),
      onlinePresenceScore: 38,
      dataSource: "demo",
    },
  ];

  return demoData;
}

export { INDUSTRY_KEYWORDS };
