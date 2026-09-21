import { useQuery } from "@tanstack/react-query";
import client, { getAccessToken, setStoredUser } from "@/config/apis";
import { authKeys } from "@/shared/query/authKeys";
import type { DashboardUser } from "./useLogin";

export function meApi() {
    return client.get<DashboardUser>("/auth/me");
}

export async function fetchMe() {
    const { data } = await meApi();
    setStoredUser(data);
    return data;
}

export function useMe(enabled = true) {
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: fetchMe,
        enabled: enabled && Boolean(getAccessToken()),
    });
}
