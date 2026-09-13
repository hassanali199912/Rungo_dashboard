import { useMemo, useState } from "react";
import Add from "@mui/icons-material/Add";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import PlayArrowOutlined from "@mui/icons-material/PlayArrowOutlined";
import ShowChartOutlined from "@mui/icons-material/ShowChartOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ContentFilterBar from "../../components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "../../components/contentFilter.types";
import SectionWrapper from "../../components/SectionWrapper";
import ShortCard from "../../components/shorts/ShortCard";
import StatisticCards, { type StatisticCardItem } from "../../components/StatisticCards";
import { countShortsByStatus, filterShorts, getMockShorts } from "./mockShorts";

export default function Shorts() {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);

    const shorts = useMemo(() => getMockShorts(t), [t]);
    const scopedShorts = useMemo(() => {
        return filterShorts(shorts, { ...filter, status: "all" });
    }, [shorts, filter]);
    const visibleShorts = useMemo(() => filterShorts(shorts, filter), [shorts, filter]);
    const counts = useMemo(() => countShortsByStatus(scopedShorts), [scopedShorts]);

    const stats: StatisticCardItem[] = [
        {
            key: "active",
            label: t("dashboard.shorts.stat_active"),
            value: "34",
            icon: PlayArrowOutlined,
            delta: t("dashboard.shorts.stat_active_delta"),
            description: t("dashboard.shorts.stat_active_hint"),
        },
        {
            key: "views",
            label: t("dashboard.shorts.stat_views"),
            value: "1.42M",
            icon: VisibilityOutlined,
            iconTone: "tertiary",
            delta: t("dashboard.shorts.stat_views_delta"),
            meter: { value: 54, label: t("dashboard.shorts.stat_views_hint") },
        },
        {
            key: "coins",
            label: t("dashboard.shorts.stat_coins"),
            value: "38,450",
            unit: t("dashboard.shorts.coins"),
            icon: PaymentsOutlined,
            description: t("dashboard.shorts.stat_coins_hint"),
        },
        {
            key: "conversion",
            label: t("dashboard.shorts.stat_conversion"),
            value: "18.6%",
            icon: ShowChartOutlined,
            delta: t("dashboard.shorts.stat_conversion_delta"),
            description: t("dashboard.shorts.stat_conversion_hint"),
        },
    ];

    return (
        <SectionWrapper
            title={t("dashboard.shorts.title")}
            description={t("dashboard.shorts.description")}
            action={{
                label: t("dashboard.shorts.upload"),
                icon: Add,
            }}
        >
            <StatisticCards items={stats} />

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
                        { value: "monetized", label: t("dashboard.shorts.status_monetized"), count: counts.monetized },
                        { value: "preview", label: t("dashboard.shorts.status_preview"), count: counts.preview },
                        { value: "review", label: t("dashboard.shorts.status_review"), count: counts.review },
                        { value: "draft", label: t("dashboard.shorts.status_draft"), count: counts.draft },
                    ]}
                />
            </Box>

            {visibleShorts.length === 0 ? (
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
