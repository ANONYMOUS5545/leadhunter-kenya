import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { businesses, industries } from "@/lib/schema";
import { getSession, canAccessFullData } from "@/lib/auth";
import { generateDemoBusinesses } from "@/lib/scraper";
import { eq, ilike, and, sql, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);

    const city = searchParams.get("city") || "";
    const industry = searchParams.get("industry") || "";
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const offset = (page - 1) * limit;
    const demo = searchParams.get("demo") === "true";

    // If demo mode or not authenticated / free tier — return demo data
    const isFullAccess = session && canAccessFullData(session.subscriptionTier);

    if (demo || !isFullAccess) {
      const demoData = generateDemoBusinesses();
      const filtered = demoData
        .filter((b) => !city || b.city === city)
        .filter((b) => !industry || b.industryName?.toLowerCase().includes(industry.toLowerCase()))
        .filter((b) => !search || b.name.toLowerCase().includes(search.toLowerCase()));

      return NextResponse.json({
        data: filtered,
        total: filtered.length,
        page: 1,
        totalPages: 1,
        isDemo: true,
      });
    }

    // Full access — query real database
    const conditions = [];
    if (city) conditions.push(ilike(businesses.city, city));
    if (industry) conditions.push(ilike(businesses.industryName, `%${industry}%`));
    if (search) conditions.push(ilike(businesses.name, `%${search}%`));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(businesses)
        .where(whereClause)
        .orderBy(desc(businesses.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(businesses)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      isDemo: false,
    });
  } catch (error) {
    console.error("Leads API error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
