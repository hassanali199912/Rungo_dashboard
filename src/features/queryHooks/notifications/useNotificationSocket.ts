import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getAccessToken, onApiEvent } from "@/config/apis";
import { NOTIFICATION_LIST_PARAMS, notificationKeys } from "@/shared/query/notificationKeys";
import type { NotificationItem, NotificationPage, UnreadNotificationCount } from "./types";

function notificationSocketUrl() {
    const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
    return `${base}/notifications`;
}

function prependNotification(current: NotificationPage | undefined, item: NotificationItem): NotificationPage {
    if (current?.items.some((row) => row.id === item.id)) return current;
    if (!current) {
        return { items: [item], total: 1, page: NOTIFICATION_LIST_PARAMS.page, limit: NOTIFICATION_LIST_PARAMS.limit };
    }
    return {
        ...current,
        items: [item, ...current.items].slice(0, current.limit),
        total: current.total + 1,
    };
}

export function useNotificationSocket(enabled: boolean) {
    const queryClient = useQueryClient();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!enabled) return;
        const token = getAccessToken();
        if (!token) return;

        const socket = io(notificationSocketUrl(), {
            auth: { token },
        });

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);
        const onNew = (item: NotificationItem) => {
            queryClient.setQueryData<NotificationPage>(notificationKeys.list(NOTIFICATION_LIST_PARAMS), (current) =>
                prependNotification(current, item),
            );
        };
        const onUnread = (payload: UnreadNotificationCount) => {
            if (typeof payload?.unreadCount !== "number") return;
            queryClient.setQueryData<UnreadNotificationCount>(notificationKeys.unread(), {
                unreadCount: payload.unreadCount,
            });
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("notification:new", onNew);
        socket.on("notification:unread-count", onUnread);

        const stop = onApiEvent("unauthenticated", () => {
            socket.disconnect();
        });

        return () => {
            stop();
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("notification:new", onNew);
            socket.off("notification:unread-count", onUnread);
            socket.disconnect();
            setConnected(false);
        };
    }, [enabled, queryClient]);

    return connected;
}
