export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "VIEWER"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

const ADMIN_ROLE_RANK: Record<AdminRole, number> = {
	VIEWER: 1,
	ADMIN: 2,
	SUPER_ADMIN: 3
};

export function parseAdminRole(input: string | undefined): AdminRole {
	if (!input) {
		return "ADMIN";
	}

	if (ADMIN_ROLES.includes(input as AdminRole)) {
		return input as AdminRole;
	}

	return "ADMIN";
}

export function hasRequiredRole(currentRole: AdminRole, requiredRole: AdminRole): boolean {
	return ADMIN_ROLE_RANK[currentRole] >= ADMIN_ROLE_RANK[requiredRole];
}
