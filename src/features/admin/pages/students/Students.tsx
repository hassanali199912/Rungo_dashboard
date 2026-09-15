import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "@/components/ui/appToast";
import ContentFilterBar from "@/features/dashboard/components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "@/features/dashboard/components/contentFilter.types";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import AdminDataTable, {
    AdminTablePersonCell,
    AdminTableText,
    type AdminTableColumn,
} from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";
import { setAccountStatus } from "../../data/adminStore";
import type { AdminStudent } from "../../data/adminTypes";
import { getMockStudents } from "../../data/mockStudents";

export default function Students() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [tick, setTick] = useState(0);
    const students = useMemo(() => getMockStudents(t), [t, tick]);

    const visible = students.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const matchesQuery = !q || row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q);
        const matchesStatus = filter.status === "all" || row.status === filter.status;
        return matchesQuery && matchesStatus;
    });

    const columns: AdminTableColumn<AdminStudent>[] = [
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
            id: "coins",
            label: t("dashboard.coins"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.coins}</AdminTableText>,
        },
        {
            id: "invoices",
            label: t("admin.nav.invoices"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.invoices}</AdminTableText>,
        },
        {
            id: "lastPurchase",
            label: t("admin.students.col_last_purchase"),
            render: (row) => <AdminTableText muted>{row.lastPurchase}</AdminTableText>,
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
        <SectionWrapper title={t("admin.students.title")} description={t("admin.students.description")}>
            <ContentFilterBar
                value={filter}
                onChange={setFilter}
                searchPlaceholder={t("admin.students.search")}
                domainLabel={t("admin.people.expertise")}
                domainOptions={[{ value: "all", label: t("admin.people.all") }]}
                sortLabel={t("admin.people.plan")}
                sortOptions={[{ value: "plays", label: t("admin.people.all") }]}
                statusOptions={[
                    { value: "all", label: t("admin.people.all"), count: students.length },
                    { value: "active", label: t("admin.people.active"), count: students.filter((row) => row.status === "active").length },
                    {
                        value: "suspended",
                        label: t("admin.people.suspended_status"),
                        count: students.filter((row) => row.status === "suspended").length,
                    },
                ]}
            />

            <AdminDataTable
                columns={columns}
                rows={visible}
                emptyLabel={t("admin.people.empty")}
                ariaLabel={t("admin.students.title")}
                getActions={(row) => [
                    {
                        key: "view",
                        label: t("admin.people.view"),
                        onClick: (item) => navigate(`/admin/students/${item.id}`),
                    },
                    {
                        key: "toggle",
                        label: row.status === "active" ? t("admin.people.suspend") : t("admin.people.activate"),
                        tone: row.status === "active" ? "danger" : "success",
                        onClick: (item) => {
                            const next = item.status === "active" ? "suspended" : "active";
                            setAccountStatus("student", item.id, next);
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
