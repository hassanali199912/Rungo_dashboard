import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { userKeys } from "@/shared/query/userKeys";
import type { UserProfile } from "./types";

export function usersByRoleApi(role: string) {
    return client.get<UserProfile[]>(`/users/by-role/${role}`);
}

export async function fetchUsersByRole(role: string) {
    const { data } = await usersByRoleApi(role);
    return data;
}

export function useUsersByRole(role: string, enabled = true) {
    return useQuery({
        queryKey: userKeys.byRole(role),
        queryFn: () => fetchUsersByRole(role),
        enabled,
    });
}
