import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { businesses, users, scrapeJobs } from "@/lib/schema";
import { getSession, isAdmin } from "@/lib/auth";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalLeads,
      totalUsers,
      totalJobs,
      leadsByCity,
      leadsByIndustry,
      usersByTier,
      recentJobs,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(businesses),
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(scrapeJobs),

      db
        .select({ city: businesses.city, count: sql<number>`count(*)` })
        .from(businesses)
        .groupBy(businesses.city)
        .orderBy(sql`count(*) desc`)
        .limit(10),

      db
        .select({ industry: businesses.industryName, count: sql<number>`count(*)` })
        .from(businesses)
        .groupBy(businesses.industryName)
        .orderBy(sql`count(*) desc`)
        .limit(10),

      db
        .select({ tier: users.subscriptionTier, count: sql<number>`count(*)` })
        .from(users)
        .groupBy(users.subscriptionTier),

      db
        .select()
        .from(scrapeJobs)
        .orderBy(scrapeJobs.createdAt)
        .limit(10),
    ]);

    return NextResponse.json({
      totals: {
        leads: Number(totalLeads[0]?.count ?? 0),
        users: Number(totalUsers[0]?.count ?? 0),
        jobs: Number(totalJobs[0]?.count ?? 0),
      },
      leadsByCity,
      leadsByIndustry,
      usersByTier,
      recentJobs,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
