import { useMemo, useState } from "react";
import Add from "@mui/icons-material/Add";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import PlayArrowOutlined from "@mui/icons-material/PlayArrowOutlined";
import ShowChartOutlined from "@mui/icons-material/ShowChartOutlined";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ContentFilterBar from "../../components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "../../components/contentFilter.types";
import CourseCard from "../../components/courses/CourseCard";
import SectionWrapper from "../../components/SectionWrapper";
import StatisticCards, { type StatisticCardItem } from "../../components/StatisticCards";
import { countCoursesByStatus, filterCourses, getMockCourses } from "./mockCourses";

export default function Courses() {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<ContentFilterState>({
        ...defaultContentFilter,
        sort: "enrollments",
    });

    const courses = useMemo(() => getMockCourses(t), [t]);
    const scopedCourses = useMemo(() => {
        return filterCourses(courses, { ...filter, status: "all" });
    }, [courses, filter]);
    const visibleCourses = useMemo(() => filterCourses(courses, filter), [courses, filter]);
    const counts = useMemo(() => countCoursesByStatus(scopedCourses), [scopedCourses]);

    const stats: StatisticCardItem[] = [
        {
            key: "total",
            label: t("dashboard.courses.stat_total"),
            value: "12",
            icon: MenuBookOutlined,
            delta: t("dashboard.courses.stat_total_delta"),
            description: t("dashboard.courses.stat_total_hint"),
        },
        {
            key: "students",
            label: t("dashboard.courses.stat_active_students"),
            value: "24,850",
            icon: GroupsOutlined,
            iconTone: "tertiary",
            delta: t("dashboard.courses.stat_students_delta"),
            meter: { value: 72, label: t("dashboard.courses.stat_students_hint") },
        },
        {
            key: "completion",
            label: t("dashboard.courses.stat_avg_completion"),
            value: "72.4%",
            icon: ShowChartOutlined,
            delta: t("dashboard.courses.stat_completion_delta"),
            description: t("dashboard.courses.stat_completion_hint"),
        },
        {
            key: "shorts",
            label: t("dashboard.courses.stat_linked"),
            value: "148",
            icon: PlayArrowOutlined,
            description: t("dashboard.courses.stat_linked_hint"),
        },
    ];

    return (
        <SectionWrapper
            title={t("dashboard.courses.title")}
            description={t("dashboard.courses.description")}
            action={{
                label: t("dashboard.courses.create"),
                icon: Add,
                to: "/dashboard/courses/new",
            }}
        >
            <StatisticCards items={stats} />

            <Box sx={{ marginBlock: 8 }}>
                <ContentFilterBar
                    value={filter}
                    onChange={setFilter}
                    searchPlaceholder={t("dashboard.courses.filter_search")}
                    domainLabel={t("dashboard.courses.filter_domain")}
                    domainOptions={[
                        { value: "all", label: t("dashboard.courses.domain_all") },
                        { value: "ui-ux", label: t("dashboard.courses.domain_ui") },
                        { value: "code", label: t("dashboard.courses.domain_code") },
                        { value: "cooking", label: t("dashboard.courses.domain_cooking") },
                        { value: "fitness", label: t("dashboard.courses.domain_fitness") },
                    ]}
                    tierLabel={t("dashboard.courses.filter_tier")}
                    tierOptions={[
                        { value: "all", label: t("dashboard.courses.tier_all") },
                        { value: "free", label: t("dashboard.courses.tier_free") },
                        { value: "coins", label: t("dashboard.courses.tier_coins") },
                        { value: "premium", label: t("dashboard.courses.tier_premium") },
                    ]}
                    sortLabel={t("dashboard.courses.filter_sort")}
                    sortOptions={[
                        { value: "enrollments", label: t("dashboard.courses.sort_enrollments") },
                        { value: "recent", label: t("dashboard.courses.sort_recent") },
                        { value: "completion", label: t("dashboard.courses.sort_completion") },
                        { value: "lessons", label: t("dashboard.courses.sort_lessons") },
                    ]}
                    statusOptions={[
                        { value: "all", label: t("dashboard.courses.status_all"), count: counts.all },
                        { value: "published", label: t("dashboard.courses.status_published"), count: counts.published },
                        { value: "draft", label: t("dashboard.courses.status_draft"), count: counts.draft },
                        { value: "review", label: t("dashboard.courses.status_review"), count: counts.review },
                    ]}
                />
            </Box>

            {visibleCourses.length === 0 ? (
                <Typography sx={{ mt: 4, color: "text.secondary", textAlign: "center" }}>
                    {t("dashboard.courses.empty")}
                </Typography>
            ) : (
                <Box
                    sx={{
                        mt: 3,
                        display: "grid",
                        gridTemplateColumns:
                            filter.view === "list"
                                ? "1fr"
                                : { xs: "1fr", md: "1fr 1fr", xl: "repeat(3, 1fr)" },
                        gap: 3,
                    }}
                >
                    {visibleCourses.map((item) => (
                        <CourseCard key={item.id} item={item} view={filter.view} />
                    ))}
                </Box>
            )}
        </SectionWrapper>
    );
}
