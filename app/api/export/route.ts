import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { businesses } from "@/lib/schema";
import { getSession, canExportData } from "@/lib/auth";
import { exportBusinessesToExcel } from "@/lib/export";
import { ilike, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!canExportData(session.subscriptionTier)) {
      return NextResponse.json(
        { error: "Export requires Pro or Enterprise subscription" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "";
    const industry = searchParams.get("industry") || "";

    const conditions = [];
    if (city) conditions.push(ilike(businesses.city, city));
    if (industry) conditions.push(ilike(businesses.industryName, `%${industry}%`));
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select()
      .from(businesses)
      .where(whereClause)
      .limit(1000);

    const buffer = exportBusinessesToExcel(data);
    const uint8Array = new Uint8Array(buffer);

    const filename = `leadhunter-ke-${city || "all"}-${industry || "all"}-${Date.now()}.xlsx`;

    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": uint8Array.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
