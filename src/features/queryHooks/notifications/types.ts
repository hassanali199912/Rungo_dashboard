export type NotificationItem = {
    id: string;
    type: string;
    title: string;
    body: string;
    data?: Record<string, unknown> | null;
    readAt: string | null;
    createdAt: string;
};

export type NotificationPage = {
    items: NotificationItem[];
    total: number;
    page: number;
    limit: number;
};

export type UnreadNotificationCount = {
    unreadCount: number;
};

export type MarkAllNotificationsReadResult = {
    updated: number;
};
