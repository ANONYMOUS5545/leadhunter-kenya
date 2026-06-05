import { cookies } from "next/headers";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "leadhunter-ke-secret-change-in-production"
);

export interface SessionUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
  subscriptionTier: string;
}

// ─── Token Management ────────────────────────────────────────────────────────
export async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

// ─── Session ─────────────────────────────────────────────────────────────────
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── Password ────────────────────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── User Lookup ──────────────────────────────────────────────────────────────
export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return user || null;
}

export async function getUserById(id: number) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user || null;
}

// ─── Access Control ───────────────────────────────────────────────────────────
export function canAccessFullData(tier: string): boolean {
  return ["starter", "pro", "enterprise"].includes(tier);
}

export function canExportData(tier: string): boolean {
  return ["pro", "enterprise"].includes(tier);
}

export function isAdmin(role: string): boolean {
  return role === "admin";
}
