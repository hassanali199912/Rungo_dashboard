import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { notificationKeys } from "@/shared/query/notificationKeys";
import type { UnreadNotificationCount } from "./types";

export function unreadNotificationCountApi() {
    return client.get<UnreadNotificationCount>("/notifications/unread-count");
}

export async function fetchUnreadNotificationCount() {
    const { data } = await unreadNotificationCountApi();
    return data;
}

export function useUnreadNotificationCount(enabled: boolean, poll: boolean) {
    return useQuery({
        queryKey: notificationKeys.unread(),
        queryFn: fetchUnreadNotificationCount,
        enabled,
        refetchInterval: poll ? 15_000 : false,
    });
}
