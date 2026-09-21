export function isAdminRole(role: string | null | undefined) {
    return role?.trim().toLowerCase() === "admin";
}

export function homePathForRole(role: string | null | undefined) {
    return isAdminRole(role) ? "/admin" : "/dashboard";
}
