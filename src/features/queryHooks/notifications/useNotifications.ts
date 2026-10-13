import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { NOTIFICATION_LIST_PARAMS, notificationKeys, type NotificationListParams } from "@/shared/query/notificationKeys";
import type { NotificationPage } from "./types";

export function notificationsApi(params: NotificationListParams) {
    return client.get<NotificationPage>("/notifications", { params });
}

export async function fetchNotifications(params: NotificationListParams) {
    const { data } = await notificationsApi(params);
    return data;
}

export function useNotifications(enabled: boolean) {
    return useQuery({
        queryKey: notificationKeys.list(NOTIFICATION_LIST_PARAMS),
        queryFn: () => fetchNotifications(NOTIFICATION_LIST_PARAMS),
        enabled,
    });
}
