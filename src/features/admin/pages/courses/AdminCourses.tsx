import { Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBtn from "@/components/ui/AppBtn";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import ContentFilterBar from "@/features/dashboard/components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "@/features/dashboard/components/contentFilter.types";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import type { CourseListItem } from "@/features/queryHooks/courses/types";
import { useMyCourses } from "@/features/queryHooks/courses/useMyCourses";
import { useSetCoursePublished } from "@/features/queryHooks/courses/useSetCoursePublished";
import { useTags } from "@/features/queryHooks/referenceData/useTags";
import { useUsersByRole } from "@/features/queryHooks/users/useUsersByRole";
import AdminDataTable, {
    AdminTableChip,
    AdminTableText,
    type AdminTableColumn,
} from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";

const PAGE_LIMIT = 20;

export default function AdminCourses() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [page, setPage] = useState(1);
    const coursesQuery = useMyCourses({ page, limit: PAGE_LIMIT });
    const instructorsQuery = useUsersByRole("instructor");
    const tagsQuery = useTags();
    const publishCourse = useSetCoursePublished();
    const pageData = coursesQuery.data;
    const courses = pageData && Array.isArray(pageData.items) ? pageData.items : [];
    const invalidPage = coursesQuery.isSuccess && (!pageData || !Array.isArray(pageData.items));
    const total = pageData?.total ?? 0;
    const instructors = Array.isArray(instructorsQuery.data) ? instructorsQuery.data : [];
    const tags = Array.isArray(tagsQuery.data) ? tagsQuery.data : [];

    const instructorName = (row: CourseListItem) =>
        instructors.find((user) => user.id === row.instructorUserId)?.displayName || row.instructorUserId;

    const tagLabel = (code: string | undefined) => {
        if (!code) return t("admin.instructors.not_set");
        return tags.find((item) => item.code === code)?.label ?? code;
    };

    const formatPrice = (price: number) =>
        price === 0 ? t("dashboard.courses.badge_free") : t("admin.courses.price_coins", { count: price });

    const visible = courses.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const name = instructorName(row).toLowerCase();
        const matchesQuery = !q || row.title.toLowerCase().includes(q) || name.includes(q);
        const tag = row.tagCodes[0];
        const matchesDomain = filter.domain === "all" || tag === filter.domain;
        const hidden = !row.publishedAt;
        const matchesStatus = filter.status === "all" || (filter.status === "hidden" ? hidden : !hidden);
        return matchesQuery && matchesDomain && matchesStatus;
    });

    const tagOptions = Array.from(new Set(courses.map((row) => row.tagCodes[0]).filter((code): code is string => Boolean(code)))).map(
        (code) => ({ value: code, label: tagLabel(code) }),
    );

    const columns: AdminTableColumn<CourseListItem>[] = [
        {
            id: "title",
            label: t("admin.courses.col_title"),
            render: (row) => <AdminTableText strong>{row.title}</AdminTableText>,
        },
        {
            id: "instructor",
            label: t("admin.nav.instructors"),
            render: (row) => <AdminTableText muted>{instructorName(row)}</AdminTableText>,
        },
        {
            id: "domain",
            label: t("admin.people.expertise"),
            render: (row) => <AdminTableChip>{tagLabel(row.tagCodes[0])}</AdminTableChip>,
        },
        {
            id: "lessons",
            label: t("admin.courses.col_lessons"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.lessonCount}</AdminTableText>,
        },
        {
            id: "price",
            label: t("admin.courses.col_price"),
            render: (row) => <AdminTableText>{formatPrice(row.price)}</AdminTableText>,
        },
        {
            id: "status",
            label: t("footer.status"),
            render: (row) => (
                <StatusBadge
                    status={row.publishedAt ? "visible" : "hidden"}
                    label={row.publishedAt ? t("admin.content.visible") : t("admin.content.hidden_status")}
                />
            ),
        },
    ];

    return (
        <SectionWrapper title={t("admin.courses.title")} description={t("admin.courses.description")}>
            <ContentFilterBar
                value={filter}
                onChange={setFilter}
                searchPlaceholder={t("admin.courses.search")}
                domainLabel={t("admin.people.expertise")}
                domainOptions={[{ value: "all", label: t("admin.people.all") }, ...tagOptions]}
                sortLabel={t("admin.people.plan")}
                sortOptions={[{ value: "plays", label: t("admin.people.all") }]}
                statusOptions={[
                    { value: "all", label: t("admin.people.all"), count: courses.length },
                    {
                        value: "visible",
                        label: t("admin.content.visible"),
                        count: courses.filter((row) => Boolean(row.publishedAt)).length,
                    },
                    {
                        value: "hidden",
                        label: t("admin.content.hidden_status"),
                        count: courses.filter((row) => !row.publishedAt).length,
                    },
                ]}
            />

            {coursesQuery.isPending ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress aria-label={t("status.loading")} />
                </Box>
            ) : coursesQuery.isError || invalidPage ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 6 }}>
                    <Typography sx={{ color: "error.main", textAlign: "center" }}>{t("admin.instructors.load_failed")}</Typography>
                    <AppBtn customType="primary" type="button" onClick={() => coursesQuery.refetch()} sx={{ borderRadius: 999 }}>
                        {t("status.retry")}
                    </AppBtn>
                </Box>
            ) : (
                <>
                    <AdminDataTable
                        columns={columns}
                        rows={visible}
                        emptyLabel={t("admin.people.empty")}
                        ariaLabel={t("admin.courses.title")}
                        getActions={(row) => [
                            {
                                key: "view",
                                label: t("admin.people.view"),
                                onClick: (item) => navigate(`/admin/courses/${item.id}`),
                            },
                            {
                                key: "visibility",
                                label: row.publishedAt ? t("admin.content.hide") : t("admin.content.unhide"),
                                tone: row.publishedAt ? "danger" : "success",
                                onClick: async (item) => {
                                    if (publishCourse.isPending) return;
                                    const published = !item.publishedAt;
                                    try {
                                        await publishCourse.mutateAsync({ courseId: item.id, published });
                                        showSuccessToast(published ? t("admin.content.shown") : t("admin.content.hidden"));
                                    } catch {
                                        showErrorToast(t("admin.courses.publish_failed"));
                                    }
                                },
                            },
                        ]}
                    />
                    {total > PAGE_LIMIT ? (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                            <AppBtn
                                customType="outline"
                                type="button"
                                disabled={page <= 1}
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                                sx={{ borderRadius: 999 }}
                            >
                                {t("admin.people.previous")}
                            </AppBtn>
                            <AppBtn
                                customType="outline"
                                type="button"
                                disabled={page * PAGE_LIMIT >= total}
                                onClick={() => setPage((current) => current + 1)}
                                sx={{ borderRadius: 999 }}
                            >
                                {t("admin.people.next")}
                            </AppBtn>
                        </Box>
                    ) : null}
                </>
            )}
        </SectionWrapper>
    );
}
