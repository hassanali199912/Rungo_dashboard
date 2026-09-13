import { useState, type MouseEvent } from "react";
import { Box, Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import NorthEast from "@mui/icons-material/NorthEast";
import ShowChartOutlined from "@mui/icons-material/ShowChartOutlined";
import { useTranslation } from "react-i18next";
import type { FilterViewMode } from "../contentFilter.types";
import type { ShortItem, ShortStatus } from "./short.types";

type ShortCardProps = {
    item: ShortItem;
    view?: FilterViewMode;
};

const statusBadgeKey: Record<ShortStatus, string> = {
    preview: "dashboard.shorts.badge_preview",
    review: "dashboard.shorts.badge_review",
    draft: "dashboard.shorts.badge_draft",
    monetized: "dashboard.shorts.badge_monetized",
};

function ShortPreview({ item }: { item: ShortItem }) {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                bgcolor: "secondary.main",
                aspectRatio: "4 / 3",
                minHeight: 180,
            }}
        >
            {item.thumbnail ? (
                <Box
                    component="img"
                    src={item.thumbnail}
                    alt=""
                    sx={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.88 }}
                />
            ) : (
                <Box sx={{ height: "100%", p: 1.75, display: "flex", flexDirection: "column", gap: 1.25 }}>
                    <Box
                        sx={{
                            height: 10,
                            width: "46%",
                            borderRadius: 999,
                            bgcolor: "neutral.light",
                        }}
                    />
                    <Box
                        sx={{
                            flex: 1,
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 1,
                        }}
                    >
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    borderRadius: 1.25,
                                    bgcolor: index % 2 === 0 ? "neutral.main" : "neutral.light",
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: (theme) =>
                        `linear-gradient(180deg, transparent 45%, ${alpha(theme.palette.secondary.main, 0.62)} 100%)`,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    top: 12,
                    insetInline: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 999,
                        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.72),
                        color: "common.white",
                    }}
                >
                    <LockOutlined sx={{ fontSize: 14 }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{t(statusBadgeKey[item.status])}</Typography>
                </Box>
                <Box
                    sx={{
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 999,
                        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.72),
                        color: "common.white",
                    }}
                >
                    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{item.duration}</Typography>
                </Box>
            </Box>

            {item.tags.length > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 12,
                        insetInline: 12,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    {item.tags.map((tag) => (
                        <Box
                            key={tag.label}
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                px: 1.25,
                                py: 0.55,
                                borderRadius: 999,
                                bgcolor: tag.tone === "light" ? "common.white" : "secondary.main",
                                color: tag.tone === "light" ? "text.primary" : "secondary.contrastText",
                            }}
                        >
                            {tag.tone === "light" && <NorthEast sx={{ fontSize: 14 }} />}
                            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{tag.label}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

function ShortMeta({ item, compact }: { item: ShortItem; compact?: boolean }) {
    const { t } = useTranslation();
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

    const openMenu = (event: MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget);
    const closeMenu = () => setMenuAnchor(null);

    const stats = [
        { key: "plays", label: t("dashboard.shorts.stat_plays"), value: item.plays },
        { key: "enrollments", label: t("dashboard.shorts.stat_enrollments"), value: item.enrollments },
        { key: "retention", label: t("dashboard.shorts.stat_retention"), value: item.retention },
    ];

    return (
        <Box sx={{ p: compact ? 2 : 2.25, display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1 }}>
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "text.secondary",
                    }}
                >
                    {item.category}
                </Typography>
                <IconButton size="small" onClick={openMenu} sx={{ color: "text.secondary" }}>
                    <MoreHoriz fontSize="small" />
                </IconButton>
                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                    <MenuItem onClick={closeMenu}>{t("dashboard.shorts.action_edit")}</MenuItem>
                    <MenuItem onClick={closeMenu}>{t("dashboard.shorts.action_stats")}</MenuItem>
                </Menu>
            </Box>

            <Typography sx={{ fontWeight: 800, fontSize: compact ? 18 : 20, letterSpacing: "-0.03em", lineHeight: 1.25 }}>
                {item.title}
            </Typography>
            <Typography
                sx={{
                    mt: 0.75,
                    color: "text.secondary",
                    fontSize: 13,
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {item.description}
            </Typography>

            <Box
                sx={{
                    mt: 2,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                    bgcolor: "surface.main",
                    borderRadius: 999,
                    px: 1.5,
                    py: 1.1,
                }}
            >
                {stats.map((stat) => (
                    <Box key={stat.key} sx={{ textAlign: "center", minWidth: 0 }}>
                        <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 600 }}>{stat.label}</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 800, mt: 0.25 }}>{stat.value}</Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 1.75 }}>
                <Button
                    startIcon={<EditOutlined sx={{ fontSize: 16 }} />}
                    sx={{
                        flex: 1,
                        borderRadius: 999,
                        bgcolor: "surface.main",
                        color: "text.primary",
                        fontWeight: 700,
                        textTransform: "none",
                        "&:hover": { bgcolor: "surface.dark" },
                    }}
                >
                    {t("dashboard.shorts.action_edit")}
                </Button>
                <Button
                    startIcon={<ShowChartOutlined sx={{ fontSize: 16 }} />}
                    sx={{
                        flex: 1,
                        borderRadius: 999,
                        bgcolor: "surface.main",
                        color: "text.primary",
                        fontWeight: 700,
                        textTransform: "none",
                        "&:hover": { bgcolor: "surface.dark" },
                    }}
                >
                    {t("dashboard.shorts.action_stats")}
                </Button>
            </Box>
        </Box>
    );
}

export default function ShortCard({ item, view = "grid" }: ShortCardProps) {
    const isList = view === "list";

    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                borderRadius: "1rem",
                boxShadow: (theme) => `0 2px 12px 0 ${alpha(theme.palette.secondary.main, 0.06)}`,
                overflow: "hidden",
                display: "flex",
                flexDirection: isList ? { xs: "column", sm: "row" } : "column",
                height: "100%",
            }}
        >
            <Box sx={{ flex: isList ? { sm: "0 0 280px" } : undefined, minWidth: 0 }}>
                <ShortPreview item={item} />
            </Box>
            <ShortMeta item={item} compact={isList} />
        </Box>
    );
}
