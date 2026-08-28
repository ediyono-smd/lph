import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { type roleEnum } from "@/db/schema";

export const SESSION_COOKIE_NAME = "sip_halal_session";
const SESSION_EXPIRY = "7d"; // 7 days
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "default_super_secret_sip_halal_auth_key_replace_in_prod_64char"
);

export type UserRoleType = (typeof roleEnum.enumValues)[number];

export interface SessionPayload {
  userId: string;
  email: string;
  fullName: string;
  roles: UserRoleType[];
  activeRole: UserRoleType;
  businessId?: string;
  [key: string]: unknown;
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(SECRET_KEY);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await signSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
