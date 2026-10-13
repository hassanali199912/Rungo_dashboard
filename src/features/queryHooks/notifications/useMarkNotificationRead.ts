import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { NOTIFICATION_LIST_PARAMS, notificationKeys } from "@/shared/query/notificationKeys";
import type { NotificationItem, NotificationPage, UnreadNotificationCount } from "./types";

export function markNotificationReadApi(id: string) {
    return client.patch<NotificationItem>(`/notifications/${id}/read`);
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await markNotificationReadApi(id);
            return data;
        },
        onMutate: (id) => {
            const page = queryClient.getQueryData<NotificationPage>(notificationKeys.list(NOTIFICATION_LIST_PARAMS));
            const wasUnread = page?.items.some((item) => item.id === id && !item.readAt) ?? false;
            return { wasUnread };
        },
        onSuccess: (item, _id, context) => {
            queryClient.setQueryData<NotificationPage>(notificationKeys.list(NOTIFICATION_LIST_PARAMS), (current) => {
                if (!current) return current;
                return {
                    ...current,
                    items: current.items.map((row) => (row.id === item.id ? item : row)),
                };
            });
            if (!context?.wasUnread) return;
            queryClient.setQueryData<UnreadNotificationCount>(notificationKeys.unread(), (current) => ({
                unreadCount: Math.max(0, (current?.unreadCount ?? 1) - 1),
            }));
        },
    });
}
