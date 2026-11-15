function normalizeRole(role: string | null | undefined) {
    return role?.trim().toLowerCase() ?? "";
}

export function isAdminRole(role: string | null | undefined) {
    return normalizeRole(role) === "admin";
}

export function isAssistantRole(role: string | null | undefined) {
    return normalizeRole(role) === "assistant";
}

export function isStaffRole(role: string | null | undefined) {
    return isAdminRole(role) || isAssistantRole(role);
}

export function homePathForRole(role: string | null | undefined) {
    return isStaffRole(role) ? "/admin" : "/dashboard";
}
