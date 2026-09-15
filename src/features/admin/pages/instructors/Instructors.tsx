import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "@/components/ui/appToast";
import ContentFilterBar from "@/features/dashboard/components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "@/features/dashboard/components/contentFilter.types";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import AdminDataTable, {
    AdminTableChip,
    AdminTablePersonCell,
    AdminTableText,
    type AdminTableColumn,
} from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";
import { setAccountStatus } from "../../data/adminStore";
import type { AdminInstructor } from "../../data/adminTypes";
import { getMockInstructors } from "../../data/mockInstructors";

export default function Instructors() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [tick, setTick] = useState(0);
    const instructors = useMemo(() => getMockInstructors(t), [t, tick]);

    const visible = instructors.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const matchesQuery = !q || row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q);
        const matchesStatus = filter.status === "all" || row.status === filter.status;
        const matchesPlan = filter.tier === "all" || row.plan === filter.tier;
        const matchesDomain = filter.domain === "all" || row.expertise === filter.domain;
        return matchesQuery && matchesStatus && matchesPlan && matchesDomain;
    });

    const columns: AdminTableColumn<AdminInstructor>[] = [
        {
            id: "name",
            label: t("admin.people.col_name"),
            render: (row) => <AdminTablePersonCell name={row.name} />,
        },
        {
            id: "email",
            label: t("admin.people.col_email"),
            render: (row) => <AdminTableText muted>{row.email}</AdminTableText>,
        },
        {
            id: "expertise",
            label: t("admin.people.expertise"),
            render: (row) => <AdminTableText>{t(`auth.domains.${row.expertise}`)}</AdminTableText>,
        },
        {
            id: "plan",
            label: t("admin.people.plan"),
            render: (row) => <AdminTableChip>{t(`dashboard.subscription.plans.${row.plan}.name`)}</AdminTableChip>,
        },
        {
            id: "shorts",
            label: t("admin.nav.shorts"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.shorts}</AdminTableText>,
        },
        {
            id: "courses",
            label: t("admin.nav.courses"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.courses}</AdminTableText>,
        },
        {
            id: "status",
            label: t("footer.status"),
            render: (row) => (
                <StatusBadge
                    status={row.status}
                    label={t(`admin.people.${row.status === "active" ? "active" : "suspended_status"}`)}
                />
            ),
        },
    ];

    return (
        <SectionWrapper title={t("admin.instructors.title")} description={t("admin.instructors.description")}>
            <ContentFilterBar
                value={filter}
                onChange={setFilter}
                searchPlaceholder={t("admin.instructors.search")}
                domainLabel={t("admin.people.expertise")}
                domainOptions={[
                    { value: "all", label: t("admin.people.all") },
                    { value: "frontend", label: t("auth.domains.frontend") },
                    { value: "design", label: t("auth.domains.design") },
                    { value: "fitness", label: t("auth.domains.fitness") },
                    { value: "education", label: t("auth.domains.education") },
                    { value: "business", label: t("auth.domains.business") },
                ]}
                sortLabel={t("admin.people.plan")}
                sortOptions={[{ value: "plays", label: t("admin.people.all") }]}
                statusOptions={[
                    { value: "all", label: t("admin.people.all"), count: instructors.length },
                    { value: "active", label: t("admin.people.active"), count: instructors.filter((row) => row.status === "active").length },
                    {
                        value: "suspended",
                        label: t("admin.people.suspended_status"),
                        count: instructors.filter((row) => row.status === "suspended").length,
                    },
                ]}
                tierLabel={t("admin.people.plan")}
                tierOptions={[
                    { value: "all", label: t("admin.people.all") },
                    { value: "starter", label: t("dashboard.subscription.plans.starter.name") },
                    { value: "pro", label: t("dashboard.subscription.plans.pro.name") },
                    { value: "elite", label: t("dashboard.subscription.plans.elite.name") },
                ]}
            />

            <AdminDataTable
                columns={columns}
                rows={visible}
                emptyLabel={t("admin.people.empty")}
                ariaLabel={t("admin.instructors.title")}
                getActions={(row) => [
                    {
                        key: "view",
                        label: t("admin.people.view"),
                        onClick: (item) => navigate(`/admin/instructors/${item.id}`),
                    },
                    {
                        key: "toggle",
                        label: row.status === "active" ? t("admin.people.suspend") : t("admin.people.activate"),
                        tone: row.status === "active" ? "danger" : "success",
                        onClick: (item) => {
                            const next = item.status === "active" ? "suspended" : "active";
                            setAccountStatus("instructor", item.id, next);
                            setTick((value) => value + 1);
                            showSuccessToast(
                                next === "suspended" ? t("admin.people.suspended") : t("admin.people.activated"),
                            );
                        },
                    },
                ]}
            />
        </SectionWrapper>
    );
}
