import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { industries } from "@/lib/schema";
import { getSession, isAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const industrySchema = z.object({
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await db.select().from(industries).orderBy(industries.name);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = industrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const [industry] = await db.insert(industries).values(parsed.data).returning();
    return NextResponse.json({ data: industry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create industry" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const [updated] = await db
      .update(industries)
      .set(updates)
      .where(eq(industries.id, id))
      .returning();

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update industry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete(industries).where(eq(industries.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete industry" }, { status: 500 });
  }
}
