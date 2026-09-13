import { Fragment, useEffect, useMemo, useState, type MouseEvent } from "react";
import {
    Box,
    Collapse,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Popover,
    Tooltip,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ExpandLess, ExpandMore, Menu as MenuIcon } from "@mui/icons-material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { UserNavItem } from "./DashboardLayout.types";

const LOGO_SRC = encodeURI("/mainLogo.png");

interface UserSidebarProps {
    navItems: UserNavItem[];
    collapsed: boolean;
    onToggleCollapsed: () => void;
    onNavigate?: () => void;
}

function isItemActive(pathname: string, path?: string) {
    if (!path) return false;
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
}

export default function DashboardSidebar({
    navItems,
    collapsed,
    onToggleCollapsed,
    onNavigate,
}: UserSidebarProps) {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
    const [popoverChildren, setPopoverChildren] = useState<UserNavItem["children"]>([]);
    const [popoverTitle, setPopoverTitle] = useState("");

    const activeMap = useMemo(() => {
        return navItems.reduce<Record<string, boolean>>((acc, item) => {
            const selfActive = isItemActive(pathname, item.path);
            const childActive = !!item.children?.some((child) => pathname.startsWith(child.path));
            acc[item.key] = selfActive || childActive;
            return acc;
        }, {});
    }, [navItems, pathname]);

    const activeGroupKey = useMemo(() => {
        return navItems.find((item) =>
            item.children?.some((child) => pathname.startsWith(child.path)),
        )?.key ?? null;
    }, [navItems, pathname]);

    const [openGroupKey, setOpenGroupKey] = useState<string | null>(activeGroupKey);

    useEffect(() => {
        setOpenGroupKey(activeGroupKey);
    }, [activeGroupKey]);

    const closePopover = () => {
        setPopoverAnchor(null);
        setPopoverChildren([]);
        setPopoverTitle("");
    };

    const handleGroupClick = (item: UserNavItem, event: MouseEvent<HTMLElement>) => {
        if (!item.children?.length) return;

        if (collapsed) {
            setPopoverAnchor(event.currentTarget);
            setPopoverChildren(item.children);
            setPopoverTitle(t(item.labelKey, { defaultValue: item.fallbackLabel }));
            return;
        }

        setOpenGroupKey((prev) => (prev === item.key ? null : item.key));
    };

    return (
        <Box
            sx={{
                height: "100%",
                bgcolor: "background.paper",
                borderInlineEnd: "1px solid",
                borderColor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                display: "flex",
                flexDirection: "column",
                px: collapsed ? 1 : 1.5,
                py: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "space-between",
                    px: collapsed ? 0 : 1,
                    mb: 3,
                    gap: 1,
                }}
            >
                <Box
                    component={RouterLink}
                    to="/dashboard"
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        textDecoration: "none",
                        color: "text.primary",
                        minWidth: 0,
                    }}
                >
                    <Box component="img" src={LOGO_SRC} alt={t("brand.name")} sx={{ width: 32, height: 32 }} />
                    {!collapsed && (
                        <Typography sx={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.03em" }}>
                            {t("brand.name")}
                        </Typography>
                    )}
                </Box>
                <IconButton size="small" onClick={onToggleCollapsed} sx={{ display: { xs: "none", md: "inline-flex" } }}>
                    <MenuIcon fontSize="small" />
                </IconButton>
            </Box>

            <List sx={{ px: 0, py: 0, display: "flex", flexDirection: "column", gap: 0.75 }}>
                {navItems.map((item) => {
                    const isGroup = !!item.children?.length;
                    const isOpen = openGroupKey === item.key;
                    const isActive = activeMap[item.key];
                    const Icon = item.icon;
                    const label = t(item.labelKey, { defaultValue: item.fallbackLabel });

                    const row = (
                        <ListItemButton
                            component={!isGroup ? RouterLink : "button"}
                            to={!isGroup ? item.path : undefined}
                            onClick={(event: MouseEvent<HTMLElement>) => {
                                if (isGroup) {
                                    handleGroupClick(item, event);
                                } else {
                                    onNavigate?.();
                                }
                            }}
                            sx={{
                                minHeight: 46,
                                width: "100%",
                                justifyContent: collapsed ? "center" : "flex-start",
                                borderRadius: 999,
                                px: collapsed ? 1 : 1.75,
                                color: isActive ? "secondary.contrastText" : "text.secondary",
                                bgcolor: isActive ? "secondary.main" : "transparent",
                                "&:hover": {
                                    bgcolor: isActive ? "secondary.dark" : "surface.main",
                                    color: isActive ? "secondary.contrastText" : "text.primary",
                                },
                                gap: 1.25,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: collapsed ? "auto" : 28,
                                    color: "inherit",
                                }}
                            >
                                <Icon sx={{ fontSize: 20 }} />
                            </ListItemIcon>
                            {!collapsed && (
                                <>
                                    <ListItemText
                                        primary={label}
                                        slotProps={{
                                            primary: {
                                                sx: {
                                                    fontSize: 14,
                                                    fontWeight: isActive ? 700 : 500,
                                                    textAlign: "start",
                                                },
                                            },
                                        }}
                                    />
                                    {isGroup && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                                </>
                            )}
                        </ListItemButton>
                    );

                    return (
                        <Fragment key={item.key}>
                            {!collapsed && item.groptitle && (
                                <Typography
                                    sx={{
                                        pt: 2,
                                        pb: 0.5,
                                        px: 2,
                                        fontSize: 12,
                                        color: "text.disabled",
                                    }}
                                >
                                    {t(`dashboard.groups.${item.groptitle}`, {
                                        defaultValue: item.groptitle,
                                    })}
                                </Typography>
                            )}

                            {collapsed ? (
                                <Tooltip title={label} placement="right">
                                    <Box>{row}</Box>
                                </Tooltip>
                            ) : (
                                row
                            )}

                            {isGroup && !collapsed && (
                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                    <List disablePadding>
                                        {item.children?.map((child) => {
                                            const childActive = pathname.startsWith(child.path);
                                            return (
                                                <ListItemButton
                                                    key={child.key}
                                                    component={RouterLink}
                                                    to={child.path}
                                                    onClick={onNavigate}
                                                    sx={{
                                                        borderRadius: 999,
                                                        py: 0.7,
                                                        px: 3,
                                                        mb: 0.5,
                                                        ml: 1,
                                                        bgcolor: childActive ? "secondary.main" : "transparent",
                                                        color: childActive ? "secondary.contrastText" : "text.secondary",
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={t(child.labelKey, {
                                                            defaultValue: child.fallbackLabel,
                                                        })}
                                                        slotProps={{
                                                            primary: {
                                                                sx: {
                                                                    fontSize: 13,
                                                                    fontWeight: childActive ? 700 : 500,
                                                                    textAlign: "start",
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </ListItemButton>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            )}
                        </Fragment>
                    );
                })}
            </List>

            <Popover
                open={Boolean(popoverAnchor)}
                anchorEl={popoverAnchor}
                onClose={closePopover}
                anchorOrigin={{ vertical: "center", horizontal: "right" }}
                transformOrigin={{ vertical: "center", horizontal: "left" }}
            >
                <Box sx={{ minWidth: 220, p: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, px: 1, py: 1 }}>
                        {popoverTitle}
                    </Typography>
                    <List sx={{ pt: 0 }}>
                        {popoverChildren?.map((child) => (
                            <ListItemButton
                                key={child.key}
                                component={RouterLink}
                                to={child.path}
                                onClick={() => {
                                    closePopover();
                                    onNavigate?.();
                                }}
                                sx={{ borderRadius: 999 }}
                            >
                                <ListItemText
                                    primary={t(child.labelKey, { defaultValue: child.fallbackLabel })}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Popover>
        </Box>
    );
}
