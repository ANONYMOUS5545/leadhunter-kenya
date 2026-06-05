import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { getSession, isAdmin } from "@/lib/auth";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "25"));
    const offset = (page - 1) * limit;

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
          subscriptionTier: users.subscriptionTier,
          subscriptionExpiresAt: users.subscriptionExpiresAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(users),
    ]);

    return NextResponse.json({
      data,
      total: Number(countResult[0]?.count ?? 0),
      page,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, subscriptionTier, role, subscriptionExpiresAt } = body;
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (subscriptionTier) updates.subscriptionTier = subscriptionTier;
    if (role) updates.role = role;
    if (subscriptionExpiresAt !== undefined)
      updates.subscriptionExpiresAt = subscriptionExpiresAt
        ? new Date(subscriptionExpiresAt)
        : null;

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        subscriptionTier: users.subscriptionTier,
        role: users.role,
      });

    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
