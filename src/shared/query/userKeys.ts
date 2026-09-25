import { QUERY_ROOT } from "./queryKeys";

export const userKeys = {
    all: [QUERY_ROOT, "users"] as const,
    byRole: (role: string) => [...userKeys.all, "by-role", role] as const,
};
