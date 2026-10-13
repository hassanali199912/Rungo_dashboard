import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { NOTIFICATION_LIST_PARAMS, notificationKeys } from "@/shared/query/notificationKeys";
import type { MarkAllNotificationsReadResult, NotificationPage, UnreadNotificationCount } from "./types";

export function markAllNotificationsReadApi() {
    return client.patch<MarkAllNotificationsReadResult>("/notifications/read-all");
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await markAllNotificationsReadApi();
            return data;
        },
        onSuccess: () => {
            const readAt = new Date().toISOString();
            queryClient.setQueryData<NotificationPage>(notificationKeys.list(NOTIFICATION_LIST_PARAMS), (current) => {
                if (!current) return current;
                return {
                    ...current,
                    items: current.items.map((item) => (item.readAt ? item : { ...item, readAt })),
                };
            });
            queryClient.setQueryData<UnreadNotificationCount>(notificationKeys.unread(), { unreadCount: 0 });
        },
    });
}
