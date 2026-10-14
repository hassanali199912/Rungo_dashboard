import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { userKeys } from "@/shared/query/userKeys";
import type { AdminUserProfile } from "./types";

export function adminUserProfileApi(id: string) {
    return client.get<AdminUserProfile>(`/users/${id}/profile`);
}

export async function fetchAdminUserProfile(id: string) {
    const { data } = await adminUserProfileApi(id);
    return data;
}

export function useAdminUserProfile(id?: string) {
    return useQuery({
        queryKey: userKeys.profile(id ?? ""),
        queryFn: () => fetchAdminUserProfile(id ?? ""),
        enabled: Boolean(id),
    });
}
