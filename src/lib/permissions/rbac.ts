import { getSession, type SessionPayload, type UserRoleType } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export function getDefaultDashboardRoute(role: UserRoleType): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
    case "VERIFIER":
    case "LEADER":
      return "/admin";
    case "MENTOR":
      return "/mentor";
    case "AUDITOR":
      return "/auditor";
    case "BUSINESS_OWNER":
    default:
      return "/dashboard";
  }
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  return getSession();
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: UserRoleType[]): Promise<SessionPayload> {
  const session = await requireAuth();
  
  // SUPER_ADMIN has access everywhere
  if (session.roles.includes("SUPER_ADMIN")) {
    return session;
  }

  const hasAllowedRole = session.roles.some((r) => allowedRoles.includes(r));
  if (!hasAllowedRole) {
    redirect(getDefaultDashboardRoute(session.activeRole));
  }

  return session;
}

export function hasRole(session: SessionPayload | null, role: UserRoleType): boolean {
  if (!session) return false;
  if (session.roles.includes("SUPER_ADMIN")) return true;
  return session.roles.includes(role);
}
