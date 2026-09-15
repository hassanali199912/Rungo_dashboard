import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { showSuccessToast } from "@/components/ui/appToast";
import ContentFilterBar from "@/features/dashboard/components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "@/features/dashboard/components/contentFilter.types";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import AdminDataTable, {
    AdminTableChip,
    AdminTableText,
    type AdminTableColumn,
} from "../../components/AdminDataTable";
import LessonPreviewModal from "../../components/LessonPreviewModal";
import StatusBadge from "../../components/StatusBadge";
import { toggleHidden } from "../../data/adminStore";
import type { AdminShort } from "../../data/adminTypes";
import { getMockAdminShorts } from "../../data/mockAdminShorts";

const domainLabelKey: Record<string, string> = {
    code: "dashboard.shorts.domain_code",
    "ui-ux": "dashboard.shorts.domain_ui",
    fitness: "dashboard.shorts.domain_fitness",
    cooking: "dashboard.shorts.domain_cooking",
};

export default function AdminShorts() {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [tick, setTick] = useState(0);
    const [preview, setPreview] = useState<AdminShort | null>(null);
    const shorts = useMemo(() => getMockAdminShorts(t), [t, tick]);

    const visible = shorts.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const matchesQuery = !q || row.title.toLowerCase().includes(q) || row.instructorName.toLowerCase().includes(q);
        const matchesDomain = filter.domain === "all" || row.domain === filter.domain;
        const matchesStatus = filter.status === "all" || (filter.status === "hidden" ? row.hidden : !row.hidden);
        return matchesQuery && matchesDomain && matchesStatus;
    });

    const columns: AdminTableColumn<AdminShort>[] = [
        {
            id: "title",
            label: t("admin.shorts.col_title"),
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
            id: "views",
            label: t("admin.shorts.col_views"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.views}</AdminTableText>,
        },
        {
            id: "likes",
            label: t("admin.shorts.col_likes"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.likes}</AdminTableText>,
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
        <SectionWrapper title={t("admin.shorts.title")} description={t("admin.shorts.description")}>
            <ContentFilterBar
                value={filter}
                onChange={setFilter}
                searchPlaceholder={t("admin.shorts.search")}
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
                    { value: "all", label: t("admin.people.all"), count: shorts.length },
                    {
                        value: "visible",
                        label: t("admin.content.visible"),
                        count: shorts.filter((row) => !row.hidden).length,
                    },
                    {
                        value: "hidden",
                        label: t("admin.content.hidden_status"),
                        count: shorts.filter((row) => row.hidden).length,
                    },
                ]}
            />

            <AdminDataTable
                columns={columns}
                rows={visible}
                emptyLabel={t("admin.people.empty")}
                ariaLabel={t("admin.shorts.title")}
                getActions={(row) => [
                    {
                        key: "preview",
                        label: t("admin.shorts.preview"),
                        onClick: (item) => setPreview(item),
                    },
                    {
                        key: "visibility",
                        label: row.hidden ? t("admin.content.unhide") : t("admin.content.hide"),
                        tone: row.hidden ? "success" : "danger",
                        onClick: (item) => {
                            toggleHidden("shorts", item.id);
                            setTick((value) => value + 1);
                            showSuccessToast(item.hidden ? t("admin.content.shown") : t("admin.content.hidden"));
                        },
                    },
                ]}
            />

            <LessonPreviewModal
                open={Boolean(preview)}
                title={preview?.title ?? ""}
                videoUrl={preview?.previewUrl ?? null}
                onClose={() => setPreview(null)}
                hint={t("admin.shorts.preview_hint")}
                aspectRatio="9 / 16"
                maxWidth="xs"
            />
        </SectionWrapper>
    );
}
