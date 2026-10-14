import { Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import ContentFilterBar from "@/features/dashboard/components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "@/features/dashboard/components/contentFilter.types";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import type { AdminStudentListItem, StudentLastPurchase } from "@/features/queryHooks/admin/types";
import { useAdminStudents } from "@/features/queryHooks/admin/useAdminStudents";
import AdminDataTable, {
    AdminTablePersonCell,
    AdminTableText,
    type AdminTableColumn,
} from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";
import { setAccountStatus } from "../../data/adminStore";

const PAGE_LIMIT = 20;

export default function Students() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [page, setPage] = useState(1);
    const studentsQuery = useAdminStudents({ page, limit: PAGE_LIMIT });
    const pageData = studentsQuery.data;
    const students = pageData && Array.isArray(pageData.items) ? pageData.items : [];
    const invalidPage = studentsQuery.isSuccess && (!pageData || !Array.isArray(pageData.items));
    const total = pageData?.total ?? 0;

    const formatLastPurchase = (purchase: StudentLastPurchase | null) => {
        if (!purchase) return t("admin.students.no_purchase");
        const date = new Date(purchase.createdAt);
        const when = Number.isNaN(date.getTime()) ? purchase.createdAt : date.toLocaleDateString(i18n.language);
        return `${purchase.pricePaid} ${purchase.currency} · ${when}`;
    };

    const contactOf = (row: AdminStudentListItem) => row.email || row.phoneNumber || t("admin.instructors.not_set");

    const visible = students.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const contact = contactOf(row).toLowerCase();
        const matchesQuery = !q || row.displayName.toLowerCase().includes(q) || contact.includes(q);
        const status = row.isActive ? "active" : "suspended";
        const matchesStatus = filter.status === "all" || status === filter.status;
        return matchesQuery && matchesStatus;
    });

    const columns: AdminTableColumn<AdminStudentListItem>[] = [
        {
            id: "name",
            label: t("admin.people.col_name"),
            render: (row) => <AdminTablePersonCell name={row.displayName} src={row.avatarUrl} />,
        },
        {
            id: "email",
            label: t("admin.people.col_email"),
            render: (row) => <AdminTableText muted>{contactOf(row)}</AdminTableText>,
        },
        {
            id: "coins",
            label: t("dashboard.coins"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.coinBalance}</AdminTableText>,
        },
        {
            id: "invoices",
            label: t("admin.nav.invoices"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.invoiceCount}</AdminTableText>,
        },
        {
            id: "lastPurchase",
            label: t("admin.students.col_last_purchase"),
            render: (row) => <AdminTableText muted>{formatLastPurchase(row.lastPurchase)}</AdminTableText>,
        },
        {
            id: "status",
            label: t("footer.status"),
            render: (row) => (
                <StatusBadge
                    status={row.isActive ? "active" : "suspended"}
                    label={t(`admin.people.${row.isActive ? "active" : "suspended_status"}`)}
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
                    { value: "active", label: t("admin.people.active"), count: students.filter((row) => row.isActive).length },
                    {
                        value: "suspended",
                        label: t("admin.people.suspended_status"),
                        count: students.filter((row) => !row.isActive).length,
                    },
                ]}
            />

            {studentsQuery.isPending ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress aria-label={t("status.loading")} />
                </Box>
            ) : studentsQuery.isError || invalidPage ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 6 }}>
                    <Typography sx={{ color: "error.main", textAlign: "center" }}>{t("admin.students.load_failed")}</Typography>
                    <AppBtn customType="primary" type="button" onClick={() => studentsQuery.refetch()} sx={{ borderRadius: 999 }}>
                        {t("status.retry")}
                    </AppBtn>
                </Box>
            ) : (
                <>
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
                                label: row.isActive ? t("admin.people.suspend") : t("admin.people.activate"),
                                tone: row.isActive ? "danger" : "success",
                                onClick: (item) => {
                                    const next = item.isActive ? "suspended" : "active";
                                    setAccountStatus("student", item.id, next);
                                    showSuccessToast(
                                        next === "suspended" ? t("admin.people.suspended") : t("admin.people.activated"),
                                    );
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
