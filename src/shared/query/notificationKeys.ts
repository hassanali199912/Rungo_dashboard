import { QUERY_ROOT } from "./queryKeys";

export type NotificationListParams = {
    page: number;
    limit: number;
};

export const NOTIFICATION_LIST_PARAMS = { page: 1, limit: 20 } as const;

export const notificationKeys = {
    all: [QUERY_ROOT, "notifications"] as const,
    lists: () => [...notificationKeys.all, "list"] as const,
    list: (params: NotificationListParams) => [...notificationKeys.lists(), params] as const,
    unread: () => [...notificationKeys.all, "unread"] as const,
};
