export function isAdminRole(role: string | null | undefined) {
    return role === "admin";
}

export function homePathForRole(role: string | null | undefined) {
    return isAdminRole(role) ? "/admin" : "/dashboard";
}
