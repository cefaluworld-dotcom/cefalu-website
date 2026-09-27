import "server-only";
import { auth } from "@/auth";
import { AuthError, ForbiddenError } from "@/lib/errors";

export type Role = "customer" | "moderator" | "admin";

const ROLE_RANK: Record<Role, number> = { customer: 0, moderator: 1, admin: 2 };

function parseList(value: string | undefined): string[] {
  return (value ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}

/** Role assignment: env-listed emails become admins/moderators; everyone else is a customer. */
export function roleForEmail(email: string | null | undefined): Role {
  const e = (email ?? "").toLowerCase();
  if (!e) return "customer";
  if (parseList(process.env.ADMIN_EMAILS).includes(e)) return "admin";
  if (parseList(process.env.MODERATOR_EMAILS).includes(e)) return "moderator";
  return "customer";
}

export interface Actor {
  id: string;
  email: string;
  role: Role;
  medusaToken?: string;
}

/** Requires a signed-in user of at least `minRole`. Throws AppError subclasses. */
export async function requireRole(minRole: Role = "customer"): Promise<Actor> {
  const session = await auth();
  if (!session?.user?.email || !session.user.id) throw new AuthError();
  const role = (session.user.role as Role | undefined) ?? roleForEmail(session.user.email);
  if (ROLE_RANK[role] < ROLE_RANK[minRole]) throw new ForbiddenError();
  return { id: session.user.id, email: session.user.email, role, medusaToken: session.medusaToken };
}
