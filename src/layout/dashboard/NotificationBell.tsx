import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import { Badge, Box, Button, CircularProgress, IconButton, Popover, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "@/components/ui/appToast";
import { useMarkAllNotificationsRead } from "@/features/queryHooks/notifications/useMarkAllNotificationsRead";
import { useMarkNotificationRead } from "@/features/queryHooks/notifications/useMarkNotificationRead";
import { useNotificationSocket } from "@/features/queryHooks/notifications/useNotificationSocket";
import { useNotifications } from "@/features/queryHooks/notifications/useNotifications";
import { useUnreadNotificationCount } from "@/features/queryHooks/notifications/useUnreadNotificationCount";
import type { NotificationItem } from "@/features/queryHooks/notifications/types";

function notificationPath(type: string) {
    if (type.startsWith("subscription.")) return "/dashboard/subscription";
    if (type.startsWith("account.")) return "/dashboard/settings";
    return null;
}

function formatWhen(value: string, language: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return formatDistanceToNow(date, {
        addSuffix: true,
        locale: language.startsWith("ar") ? ar : enUS,
    });
}

export default function NotificationBell() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const open = Boolean(anchor);
    const connected = useNotificationSocket(true);
    const unreadQuery = useUnreadNotificationCount(true, !connected);
    const listQuery = useNotifications(open);
    const markRead = useMarkNotificationRead();
    const markAll = useMarkAllNotificationsRead();
    const unreadCount = unreadQuery.data?.unreadCount ?? 0;
    const items = listQuery.data?.items ?? [];

    const openPanel = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
    const closePanel = () => setAnchor(null);

    const openItem = async (item: NotificationItem) => {
        const path = notificationPath(item.type);
        closePanel();
        if (!item.readAt) {
            try {
                await markRead.mutateAsync(item.id);
            } catch {
                showErrorToast(t("dashboard.notifications.read_failed"));
            }
        }
        if (path) navigate(path);
    };

    const markEverythingRead = async () => {
        try {
            await markAll.mutateAsync();
        } catch {
            showErrorToast(t("dashboard.notifications.mark_all_failed"));
        }
    };

    return (
        <>
            <IconButton aria-label={t("dashboard.notifications.label")} onClick={openPanel} sx={{ color: "text.secondary" }}>
                <Badge
                    badgeContent={unreadCount}
                    color="primary"
                    invisible={unreadCount < 1}
                    max={99}
                    sx={{
                        "& .MuiBadge-badge": {
                            fontSize: 10,
                            fontWeight: 700,
                            minWidth: 16,
                            height: 16,
                        },
                    }}
                >
                    <NotificationsNoneOutlined />
                </Badge>
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchor}
                onClose={closePanel}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 360,
                            maxWidth: "calc(100vw - 24px)",
                            borderRadius: "1rem",
                            mt: 1,
                            bgcolor: "background.paper",
                            overflow: "hidden",
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        px: 2,
                        py: 1.5,
                        borderBottom: "1px solid",
                        borderColor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                    }}
                >
                    <Typography sx={{ fontWeight: 800, fontSize: 15 }}>{t("dashboard.notifications.title")}</Typography>
                    <Button
                        onClick={markEverythingRead}
                        disabled={unreadCount < 1 || markAll.isPending}
                        sx={{ borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: "none" }}
                    >
                        {t("dashboard.notifications.mark_all")}
                    </Button>
                </Box>

                {listQuery.isPending ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress size={22} aria-label={t("status.loading")} />
                    </Box>
                ) : listQuery.isError ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, px: 2, py: 3 }}>
                        <Typography sx={{ color: "error.main", fontSize: 13, textAlign: "center" }}>
                            {t("dashboard.notifications.load_failed")}
                        </Typography>
                        <Button onClick={() => listQuery.refetch()} sx={{ borderRadius: 999, textTransform: "none" }}>
                            {t("status.retry")}
                        </Button>
                    </Box>
                ) : items.length === 0 ? (
                    <Typography sx={{ px: 2, py: 3, color: "text.secondary", fontSize: 13, textAlign: "center" }}>
                        {t("dashboard.notifications.empty")}
                    </Typography>
                ) : (
                    <Box sx={{ maxHeight: 360, overflow: "auto" }}>
                        {items.map((item) => {
                            const unread = !item.readAt;
                            return (
                                <Box
                                    key={item.id}
                                    component="button"
                                    type="button"
                                    onClick={() => openItem(item)}
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 1.25,
                                        px: 2,
                                        py: 1.5,
                                        border: 0,
                                        borderBottom: "1px solid",
                                        borderColor: (theme) => alpha(theme.palette.secondary.main, 0.06),
                                        bgcolor: unread ? (theme) => alpha(theme.palette.primary.main, 0.06) : "transparent",
                                        color: "text.primary",
                                        textAlign: "start",
                                        cursor: "pointer",
                                        "&:hover": { bgcolor: "surface.main" },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            mt: 0.7,
                                            borderRadius: "50%",
                                            flexShrink: 0,
                                            bgcolor: unread ? "primary.main" : "transparent",
                                        }}
                                    />
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: 800, lineHeight: 1.35 }}>{item.title}</Typography>
                                        <Typography
                                            sx={{
                                                mt: 0.25,
                                                fontSize: 12,
                                                color: "text.secondary",
                                                lineHeight: 1.4,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {item.body}
                                        </Typography>
                                        <Typography sx={{ mt: 0.5, fontSize: 11, color: "text.disabled" }}>
                                            {formatWhen(item.createdAt, i18n.language)}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Popover>
        </>
    );
}
