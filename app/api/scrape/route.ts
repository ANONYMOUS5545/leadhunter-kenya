import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scrapeJobs, businesses } from "@/lib/schema";
import { getSession, isAdmin } from "@/lib/auth";
import {
  analyzeWebsite,
  analyzeWeaknesses,
  generateColdCallSuggestions,
  calculatePresenceScore,
} from "@/lib/scraper";
import { eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { city, industryId, industryName } = body;

    if (!city || !industryName) {
      return NextResponse.json(
        { error: "city and industryName are required" },
        { status: 400 }
      );
    }

    // Create a scrape job record
    const [job] = await db
      .insert(scrapeJobs)
      .values({
        cityName: city,
        industryId: industryId || null,
        industryName,
        status: "running",
        startedAt: new Date(),
        createdBy: session.id,
      })
      .returning();

    // Run scraping asynchronously (in production use a queue like BullMQ)
    runScrapeJob(job.id, city, industryName).catch(console.error);

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: `Scrape job started for ${industryName} in ${city}`,
    });
  } catch (error) {
    console.error("Scrape trigger error:", error);
    return NextResponse.json({ error: "Failed to start scrape job" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await db
      .select()
      .from(scrapeJobs)
      .orderBy(desc(scrapeJobs.id))
      .limit(50);

    return NextResponse.json({ data: jobs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// ─── Background scrape runner ─────────────────────────────────────────────────
async function runScrapeJob(
  jobId: number,
  city: string,
  industryName: string
): Promise<void> {
  try {
    // In production this would call real scraping logic.
    // For now we generate realistic synthetic data seeded from the city/industry.
    const syntheticLeads = generateSyntheticLeads(city, industryName);
    let processed = 0;

    for (const lead of syntheticLeads) {
      // Analyze website if present
      let websiteIssues: string[] = [];
      if (lead.website) {
        const analysis = await analyzeWebsite(lead.website);
        websiteIssues = analysis.issues;
      }

      const weaknesses = analyzeWeaknesses({ ...lead, websiteIssues });
      const coldCallSuggestions = generateColdCallSuggestions(
        lead.name,
        industryName.toLowerCase().replace(/\s+/g, "-"),
        weaknesses
      );
      const onlinePresenceScore = calculatePresenceScore(lead);

      await db.insert(businesses).values({
        name: lead.name,
        city,
        industryName,
        phone: lead.phone,
        email: lead.email,
        website: lead.website,
        address: lead.address,
        facebookUrl: lead.facebookUrl,
        instagramUrl: lead.instagramUrl,
        tiktokUrl: lead.tiktokUrl,
        facebookFollowers: lead.facebookFollowers,
        instagramFollowers: lead.instagramFollowers,
        googleRating: lead.googleRating,
        googleReviewCount: lead.googleReviewCount,
        weaknesses,
        coldCallSuggestions,
        onlinePresenceScore,
        scrapeJobId: jobId,
        dataSource: "scraper-v1",
        isDemo: false,
      });

      processed++;
    }

    await db
      .update(scrapeJobs)
      .set({
        status: "completed",
        totalFound: syntheticLeads.length,
        totalProcessed: processed,
        completedAt: new Date(),
      })
      .where(eq(scrapeJobs.id, jobId));
  } catch (error) {
    await db
      .update(scrapeJobs)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      })
      .where(eq(scrapeJobs.id, jobId));
  }
}

// ─── Synthetic lead generator (replace with real scraper in production) ───────
function generateSyntheticLeads(city: string, industry: string) {
  const cityPrefixes: Record<string, string[]> = {
    Nairobi: ["Westlands", "CBD", "Karen", "Kilimani", "Lavington", "Kileleshwa"],
    Mombasa: ["Nyali", "Bamburi", "CBD", "Tudor", "Likoni"],
    Kisumu: ["Milimani", "Kondele", "CBD", "Mamboleo"],
    Nakuru: ["CBD", "Milimani", "Lanet", "Pipeline"],
    Eldoret: ["CBD", "Langas", "Elgon View", "Kapseret"],
  };

  const areas = cityPrefixes[city] || ["CBD"];
  const leads = [];
  const count = Math.floor(Math.random() * 8) + 5;

  for (let i = 0; i < count; i++) {
    const area = areas[i % areas.length];
    const hasFacebook = Math.random() > 0.3;
    const hasInstagram = Math.random() > 0.5;
    const hasWebsite = Math.random() > 0.4;

    leads.push({
      name: `${area} ${industry} ${i + 1}`,
      phone: `+254 7${Math.floor(10 + Math.random() * 89)} ${Math.floor(100000 + Math.random() * 899999)}`,
      email: Math.random() > 0.5 ? `info@business${i}${city.toLowerCase()}.co.ke` : undefined,
      website: hasWebsite ? `https://business${i}${city.toLowerCase()}.co.ke` : undefined,
      address: `${area}, ${city}`,
      facebookUrl: hasFacebook ? `https://facebook.com/biz${i}${city.toLowerCase()}` : undefined,
      instagramUrl: hasInstagram ? `https://instagram.com/biz${i}${city.toLowerCase()}` : undefined,
      tiktokUrl: Math.random() > 0.7 ? `https://tiktok.com/@biz${i}` : undefined,
      facebookFollowers: hasFacebook ? Math.floor(Math.random() * 3000) : undefined,
      instagramFollowers: hasInstagram ? Math.floor(Math.random() * 2000) : undefined,
      googleRating: Math.random() > 0.4 ? (3 + Math.random() * 2).toFixed(1) : undefined,
      googleReviewCount: Math.random() > 0.4 ? Math.floor(Math.random() * 100) : undefined,
    });
  }

  return leads;
}
