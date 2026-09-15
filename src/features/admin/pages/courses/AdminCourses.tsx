import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "@/components/ui/appToast";
import ContentFilterBar from "@/features/dashboard/components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "@/features/dashboard/components/contentFilter.types";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import AdminDataTable, {
    AdminTableChip,
    AdminTableText,
    type AdminTableColumn,
} from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";
import { toggleHidden } from "../../data/adminStore";
import type { AdminCourse } from "../../data/adminTypes";
import { formatCoursePrice, getMockAdminCourses } from "../../data/mockAdminCourses";

const domainLabelKey: Record<string, string> = {
    code: "dashboard.shorts.domain_code",
    "ui-ux": "dashboard.shorts.domain_ui",
    fitness: "dashboard.shorts.domain_fitness",
    cooking: "dashboard.shorts.domain_cooking",
};

export default function AdminCourses() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [tick, setTick] = useState(0);
    const courses = useMemo(() => getMockAdminCourses(t), [t, tick]);

    const visible = courses.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const matchesQuery = !q || row.title.toLowerCase().includes(q) || row.instructorName.toLowerCase().includes(q);
        const matchesDomain = filter.domain === "all" || row.domain === filter.domain;
        const matchesStatus = filter.status === "all" || (filter.status === "hidden" ? row.hidden : !row.hidden);
        return matchesQuery && matchesDomain && matchesStatus;
    });

    const columns: AdminTableColumn<AdminCourse>[] = [
        {
            id: "title",
            label: t("admin.courses.col_title"),
            render: (row) => <AdminTableText strong>{row.title}</AdminTableText>,
        },
        {
            id: "instructor",
            label: t("admin.nav.instructors"),
            render: (row) => <AdminTableText muted>{row.instructorName}</AdminTableText>,
        },
        {
            id: "domain",
            label: t("admin.people.expertise"),
            render: (row) => <AdminTableChip>{t(domainLabelKey[row.domain] ?? row.domain)}</AdminTableChip>,
        },
        {
            id: "students",
            label: t("admin.overview.learners"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.students.toLocaleString()}</AdminTableText>,
        },
        {
            id: "lessons",
            label: t("admin.courses.col_lessons"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.lessons}</AdminTableText>,
        },
        {
            id: "price",
            label: t("admin.courses.col_price"),
            render: (row) => <AdminTableText>{formatCoursePrice(row, t)}</AdminTableText>,
        },
        {
            id: "status",
            label: t("footer.status"),
            render: (row) => (
                <StatusBadge
                    status={row.hidden ? "hidden" : "visible"}
                    label={row.hidden ? t("admin.content.hidden_status") : t("admin.content.visible")}
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
                domainOptions={[
                    { value: "all", label: t("admin.people.all") },
                    { value: "code", label: t("dashboard.shorts.domain_code") },
                    { value: "ui-ux", label: t("dashboard.shorts.domain_ui") },
                    { value: "fitness", label: t("dashboard.shorts.domain_fitness") },
                    { value: "cooking", label: t("dashboard.shorts.domain_cooking") },
                ]}
                sortLabel={t("admin.people.plan")}
                sortOptions={[{ value: "plays", label: t("admin.people.all") }]}
                statusOptions={[
                    { value: "all", label: t("admin.people.all"), count: courses.length },
                    {
                        value: "visible",
                        label: t("admin.content.visible"),
                        count: courses.filter((row) => !row.hidden).length,
                    },
                    {
                        value: "hidden",
                        label: t("admin.content.hidden_status"),
                        count: courses.filter((row) => row.hidden).length,
                    },
                ]}
            />

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
                        label: row.hidden ? t("admin.content.unhide") : t("admin.content.hide"),
                        tone: row.hidden ? "success" : "danger",
                        onClick: (item) => {
                            toggleHidden("courses", item.id);
                            setTick((value) => value + 1);
                            showSuccessToast(item.hidden ? t("admin.content.shown") : t("admin.content.hidden"));
                        },
                    },
                ]}
            />
        </SectionWrapper>
    );
}
