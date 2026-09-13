import { useState, type MouseEvent } from "react";
import { Box, Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import PlayArrowOutlined from "@mui/icons-material/PlayArrowOutlined";
import { useTranslation } from "react-i18next";
import { btnIconSlotReset, btnIconStartSx } from "@/styles/btnStyle";
import type { FilterViewMode } from "../contentFilter.types";
import type { CourseItem, CoursePricing, CourseStatus } from "./course.types";

type CourseCardProps = {
    item: CourseItem;
    view?: FilterViewMode;
};

const statusBadgeKey: Record<CourseStatus, string> = {
    published: "dashboard.courses.badge_published",
    draft: "dashboard.courses.badge_draft",
    review: "dashboard.courses.badge_review",
};

const pricingBadgeKey: Record<CoursePricing, string> = {
    free: "dashboard.courses.badge_free",
    coins: "dashboard.courses.badge_coins",
    premium: "dashboard.courses.badge_premium",
};

function CoursePreview({ item }: { item: CourseItem }) {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                bgcolor: "secondary.main",
                aspectRatio: "16 / 10",
                minHeight: 168,
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
                <Box sx={{ height: "100%", p: 1.75, display: "flex", flexDirection: "column", gap: 1 }}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                height: 18,
                                width: `${92 - index * 10}%`,
                                borderRadius: 999,
                                bgcolor: index % 2 === 0 ? "neutral.main" : "neutral.light",
                            }}
                        />
                    ))}
                    <Box sx={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.75, mt: 0.5 }}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    borderRadius: 1.25,
                                    bgcolor: index === 1 ? "primary.main" : "neutral.light",
                                    opacity: index === 1 ? 0.85 : 0.55,
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
                        `linear-gradient(180deg, transparent 42%, ${alpha(theme.palette.secondary.main, 0.62)} 100%)`,
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
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 999,
                        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.72),
                        color: "common.white",
                    }}
                >
                    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{t(statusBadgeKey[item.status])}</Typography>
                </Box>
                <Box
                    sx={{
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 999,
                        bgcolor: item.pricing === "premium" ? "primary.main" : (theme) => alpha(theme.palette.common.white, 0.92),
                        color: item.pricing === "premium" ? "primary.contrastText" : "text.primary",
                    }}
                >
                    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{t(pricingBadgeKey[item.pricing])}</Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    bottom: 12,
                    insetInline: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Box
                    sx={{
                        px: 1.25,
                        py: 0.55,
                        borderRadius: 999,
                        bgcolor: "common.white",
                        color: "text.primary",
                    }}
                >
                    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                        {t("dashboard.courses.lessons_count", { count: item.lessons })}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        px: 1.25,
                        py: 0.55,
                        borderRadius: 999,
                        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.72),
                        color: "common.white",
                    }}
                >
                    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{item.duration}</Typography>
                </Box>
            </Box>
        </Box>
    );
}

function CourseMeta({ item, compact }: { item: CourseItem; compact?: boolean }) {
    const { t } = useTranslation();
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

    const openMenu = (event: MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget);
    const closeMenu = () => setMenuAnchor(null);

    const stats = [
        { key: "students", label: t("dashboard.courses.stat_students"), value: item.students },
        { key: "lessons", label: t("dashboard.courses.stat_lessons"), value: String(item.lessons) },
        { key: "completion", label: t("dashboard.courses.stat_completion"), value: item.completion },
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
                    <MenuItem onClick={closeMenu}>{t("dashboard.courses.action_edit")}</MenuItem>
                    <MenuItem onClick={closeMenu}>{t("dashboard.courses.action_curriculum")}</MenuItem>
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1.25, color: "text.secondary" }}>
                <PlayArrowOutlined sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                    {t("dashboard.courses.linked_shorts_count", { count: item.shorts })}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 1.75 }}>
                <Button
                    startIcon={<EditOutlined sx={btnIconStartSx} />}
                    sx={[
                        btnIconSlotReset,
                        {
                            flex: 1,
                            borderRadius: 999,
                            bgcolor: "surface.main",
                            color: "text.primary",
                            fontWeight: 700,
                            textTransform: "none",
                            "&:hover": { bgcolor: "surface.dark" },
                        },
                    ]}
                >
                    {t("dashboard.courses.action_edit")}
                </Button>
                <Button
                    startIcon={<AccountTreeOutlined sx={btnIconStartSx} />}
                    sx={[
                        btnIconSlotReset,
                        {
                            flex: 1,
                            borderRadius: 999,
                            bgcolor: "surface.main",
                            color: "text.primary",
                            fontWeight: 700,
                            textTransform: "none",
                            "&:hover": { bgcolor: "surface.dark" },
                        },
                    ]}
                >
                    {t("dashboard.courses.action_curriculum")}
                </Button>
            </Box>
        </Box>
    );
}

export default function CourseCard({ item, view = "grid" }: CourseCardProps) {
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
                <CoursePreview item={item} />
            </Box>
            <CourseMeta item={item} compact={isList} />
        </Box>
    );
}
