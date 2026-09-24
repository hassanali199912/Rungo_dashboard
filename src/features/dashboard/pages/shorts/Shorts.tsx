import { useMemo, useState } from "react";
import Add from "@mui/icons-material/Add";
import ShowChartOutlined from "@mui/icons-material/ShowChartOutlined";
import VideoLibraryOutlined from "@mui/icons-material/VideoLibraryOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useShortStatistics } from "@/features/queryHooks/shorts/useShortStatistics";
import { useShorts } from "@/features/queryHooks/shorts/useShorts";
import ContentFilterBar from "../../components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "../../components/contentFilter.types";
import SectionWrapper from "../../components/SectionWrapper";
import ShortCard from "../../components/shorts/ShortCard";
import type { ShortItem } from "../../components/shorts/short.types";
import StatisticCards, { type StatisticCardItem } from "../../components/StatisticCards";
import { countShortsByStatus, filterShorts } from "./mockShorts";

const SHORTS_PARAMS = { page: 1, limit: 20 } as const;
const SHORTS_MEDIA_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

function getShortMediaUrl(path: string | null) {
    if (!path) return undefined;
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    return `${SHORTS_MEDIA_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

function getShortDomain(tagCodes: string[]) {
    const tags = tagCodes.map((tag) => tag.toLowerCase());
    if (tags.some((tag) => tag.includes("ui") || tag.includes("ux") || tag.includes("design"))) return "ui-ux";
    if (tags.some((tag) => tag.includes("code") || tag.includes("program"))) return "code";
    if (tags.some((tag) => tag.includes("cook") || tag.includes("food"))) return "cooking";
    if (tags.some((tag) => tag.includes("fit") || tag.includes("sport"))) return "fitness";
    return "all";
}

export default function Shorts() {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const shortsQuery = useShorts(SHORTS_PARAMS);
    const statisticsQuery = useShortStatistics();
    const statistics = statisticsQuery.data;

    const shorts = useMemo<ShortItem[]>(
        () =>
            (shortsQuery.data?.items ?? []).map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                category: item.tagCodes[0] ?? t("dashboard.shorts.uncategorized"),
                domain: getShortDomain(item.tagCodes),
                status: item.publishedAt ? "published" : "draft",
                duration: "—",
                tags: item.tagCodes.map((tag, index) => ({
                    label: tag,
                    tone: index % 2 === 0 ? "light" : "dark",
                })),
                topics: item.tagCodes,
                plays: item.likeCount.toLocaleString(),
                playsCount: item.likeCount,
                enrollments: item.commentCount.toLocaleString(),
                enrollmentsCount: item.commentCount,
                retention: item.shareCount.toLocaleString(),
                retentionValue: item.shareCount,
                createdAt: item.createdAt,
                thumbnail: getShortMediaUrl(item.coverUrl),
                isActive: item.isActive,
                engagement: {
                    likes: item.likeCount,
                    comments: item.commentCount,
                    shares: item.shareCount,
                },
            })),
        [shortsQuery.data, t],
    );
    const scopedShorts = useMemo(() => {
        return filterShorts(shorts, { ...filter, status: "all" });
    }, [shorts, filter]);
    const visibleShorts = useMemo(() => filterShorts(shorts, filter), [shorts, filter]);
    const counts = useMemo(() => countShortsByStatus(scopedShorts), [scopedShorts]);

    const stats: StatisticCardItem[] = [
        {
            key: "total",
            label: t("dashboard.shorts.stat_total"),
            value: statistics ? statistics.totalShorts.toLocaleString() : "—",
            icon: VideoLibraryOutlined,
        },
        {
            key: "active",
            label: t("dashboard.shorts.stat_active"),
            value: statistics ? statistics.activeShorts.toLocaleString() : "—",
            icon: VisibilityOutlined,
            iconTone: "tertiary",
        },
        {
            key: "inactive",
            label: t("dashboard.shorts.stat_inactive"),
            value: statistics ? statistics.inactiveShorts.toLocaleString() : "—",
            icon: VisibilityOffOutlined,
        },
        {
            key: "engagements",
            label: t("dashboard.shorts.stat_engagements"),
            value: statistics ? statistics.totalEngagements.toLocaleString() : "—",
            icon: ShowChartOutlined,
            description: statistics
                ? t("dashboard.shorts.stat_engagement_breakdown", {
                      likes: statistics.totalLikes.toLocaleString(),
                      comments: statistics.totalComments.toLocaleString(),
                      shares: statistics.totalShares.toLocaleString(),
                  })
                : undefined,
        },
    ];

    return (
        <SectionWrapper
            title={t("dashboard.shorts.title")}
            description={t("dashboard.shorts.description")}
            action={{
                label: t("dashboard.shorts.upload"),
                icon: Add,
                to: "/dashboard/shorts/new",
            }}
        >
            <StatisticCards items={stats} loading={statisticsQuery.isPending} />

            <Box sx={{ marginBlock: 8 }}>
                <ContentFilterBar
                    value={filter}
                    onChange={setFilter}
                    searchPlaceholder={t("dashboard.shorts.filter_search")}
                    domainLabel={t("dashboard.shorts.filter_domain")}
                    domainOptions={[
                        { value: "all", label: t("dashboard.shorts.domain_all") },
                        { value: "ui-ux", label: t("dashboard.shorts.domain_ui") },
                        { value: "code", label: t("dashboard.shorts.domain_code") },
                        { value: "cooking", label: t("dashboard.shorts.domain_cooking") },
                        { value: "fitness", label: t("dashboard.shorts.domain_fitness") },
                    ]}
                    sortLabel={t("dashboard.shorts.filter_sort")}
                    sortOptions={[
                        { value: "plays", label: t("dashboard.shorts.sort_plays") },
                        { value: "recent", label: t("dashboard.shorts.sort_recent") },
                        { value: "retention", label: t("dashboard.shorts.sort_retention") },
                        { value: "enrollments", label: t("dashboard.shorts.sort_enrollments") },
                    ]}
                    statusOptions={[
                        { value: "all", label: t("dashboard.shorts.status_all"), count: counts.all },
                        { value: "published", label: t("dashboard.shorts.status_published"), count: counts.published },
                        { value: "draft", label: t("dashboard.shorts.status_draft"), count: counts.draft },
                    ]}
                />
            </Box>

            {shortsQuery.isPending ? (
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                    <CircularProgress aria-label={t("status.loading")} />
                </Box>
            ) : shortsQuery.isError ? (
                <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ color: "error.main", textAlign: "center" }}>
                        {t("dashboard.shorts.load_error")}
                    </Typography>
                    <Button onClick={() => shortsQuery.refetch()} sx={{ borderRadius: 999 }}>
                        {t("status.retry")}
                    </Button>
                </Box>
            ) : visibleShorts.length === 0 ? (
                <Typography sx={{ mt: 4, color: "text.secondary", textAlign: "center" }}>
                    {t("dashboard.shorts.empty")}
                </Typography>
            ) : (
                <Box
                    sx={{
                        mt: 3,
                        display: "grid",
                        gridTemplateColumns:
                            filter.view === "list"
                                ? "1fr"
                                : { xs: "1fr", md: "1fr 1fr", xl: "repeat(4, 1fr)" },
                        gap: 3,
                    }}
                >
                    {visibleShorts.map((item) => (
                        <ShortCard key={item.id} item={item} view={filter.view} />
                    ))}
                </Box>
            )}
        </SectionWrapper>
    );
}
