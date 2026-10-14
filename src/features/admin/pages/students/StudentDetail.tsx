import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import StudioCard from "@/features/dashboard/components/StudioCard";
import type { CoinPurchaseStatus } from "@/features/queryHooks/admin/types";
import { useAdminCoinPurchases } from "@/features/queryHooks/admin/useAdminCoinPurchases";
import { useAdminWallet } from "@/features/queryHooks/admin/useAdminWallet";
import { useAdminUserProfile } from "@/features/queryHooks/users/useAdminUserProfile";
import StatusBadge from "../../components/StatusBadge";
import { setAccountStatus } from "../../data/adminStore";

const PAGE_LIMIT = 20;

function isNotFound(error: unknown) {
    return axios.isAxiosError(error) && error.response?.status === 404;
}

function purchaseBadgeStatus(status: CoinPurchaseStatus): "paid" | "hidden" | "refunded" {
    if (status === "completed") return "paid";
    if (status === "pending") return "hidden";
    return "refunded";
}

export default function StudentDetail() {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState(1);
    const profileQuery = useAdminUserProfile(id);
    const walletQuery = useAdminWallet(id);
    const purchasesQuery = useAdminCoinPurchases({ userId: id ?? "", page, limit: PAGE_LIMIT }, Boolean(id));

    const purchaseLabel = (status: CoinPurchaseStatus) => {
        if (status === "completed") return t("admin.students.purchase_completed");
        if (status === "pending") return t("admin.students.purchase_pending");
        return t("admin.students.purchase_failed");
    };

    if (!id || (profileQuery.isError && isNotFound(profileQuery.error))) {
        return <Navigate to="/admin/students" replace />;
    }

    if (profileQuery.isPending) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress aria-label={t("status.loading")} />
            </Box>
        );
    }

    if (profileQuery.isError || !profileQuery.data) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 6 }}>
                <Typography sx={{ color: "error.main", textAlign: "center" }}>{t("admin.students.load_failed")}</Typography>
                <AppBtn customType="primary" type="button" onClick={() => profileQuery.refetch()} sx={{ borderRadius: 999 }}>
                    {t("status.retry")}
                </AppBtn>
            </Box>
        );
    }

    const profile = profileQuery.data;
    const contact = profile.email || profile.phoneNumber || t("admin.instructors.not_set");
    const purchaseItems = purchasesQuery.data && Array.isArray(purchasesQuery.data.items) ? purchasesQuery.data.items : [];
    const purchasesMatch = purchaseItems.every((row) => row.userId === id);
    const purchases = purchasesMatch ? purchaseItems : [];
    const invalidPurchases = purchasesQuery.isSuccess && (!purchasesQuery.data || !Array.isArray(purchasesQuery.data.items));
    const invoiceTotal = purchasesMatch ? purchasesQuery.data?.total : undefined;
    const coinLabel = walletQuery.isPending
        ? t("status.loading")
        : walletQuery.isError
          ? t("admin.students.load_failed")
          : String(walletQuery.data?.balance ?? 0);
    const invoiceLabel = purchasesQuery.isPending || !purchasesMatch
        ? t("status.loading")
        : purchasesQuery.isError || invalidPurchases
          ? t("admin.students.no_purchase")
          : String(invoiceTotal ?? 0);

    const toggle = () => {
        const next = profile.isActive ? "suspended" : "active";
        setAccountStatus("student", profile.id, next);
        showSuccessToast(next === "suspended" ? t("admin.people.suspended") : t("admin.people.activated"));
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SectionWrapper
                title={profile.displayName}
                description={contact}
                actions={[
                    {
                        label: profile.isActive ? t("admin.people.suspend") : t("admin.people.activate"),
                        onClick: toggle,
                    },
                ]}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Avatar src={profile.avatarUrl ?? undefined} sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
                        {profile.displayName.slice(0, 1)}
                    </Avatar>
                    <Box>
                        <StatusBadge
                            status={profile.isActive ? "active" : "suspended"}
                            label={t(`admin.people.${profile.isActive ? "active" : "suspended_status"}`)}
                        />
                        <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 14 }}>
                            {coinLabel} {t("dashboard.coins")} · {invoiceLabel} {t("admin.nav.invoices")}
                        </Typography>
                        {walletQuery.isError ? (
                            <AppBtn customType="outline" type="button" onClick={() => walletQuery.refetch()} sx={{ borderRadius: 999, mt: 1 }}>
                                {t("status.retry")}
                            </AppBtn>
                        ) : null}
                    </Box>
                </Box>
            </SectionWrapper>

            <StudioCard title={t("admin.students.invoices_title")} subtitle={t("admin.students.invoices_subtitle")}>
                {purchasesQuery.isError || invalidPurchases ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1.5 }}>
                        <Typography sx={{ color: "error.main" }}>{t("admin.students.load_failed")}</Typography>
                        <AppBtn customType="outline" type="button" onClick={() => purchasesQuery.refetch()} sx={{ borderRadius: 999 }}>
                            {t("status.retry")}
                        </AppBtn>
                    </Box>
                ) : purchasesQuery.isPending || !purchasesMatch ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                        <CircularProgress size={22} aria-label={t("status.loading")} />
                    </Box>
                ) : purchases.length === 0 ? (
                    <Typography sx={{ color: "text.secondary" }}>{t("admin.people.empty")}</Typography>
                ) : (
                    <>
                        {purchases.map((invoice) => {
                            const date = new Date(invoice.createdAt);
                            const when = Number.isNaN(date.getTime()) ? invoice.createdAt : date.toLocaleDateString(i18n.language);
                            return (
                                <Box
                                    key={invoice.id}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 2,
                                        py: 1,
                                        borderBottom: "1px solid",
                                        borderColor: "divider",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 700 }}>{invoice.id}</Typography>
                                    <Typography sx={{ color: "text.secondary" }}>
                                        {invoice.pricePaid} {invoice.currency} · {when}
                                    </Typography>
                                    <StatusBadge status={purchaseBadgeStatus(invoice.status)} label={purchaseLabel(invoice.status)} />
                                </Box>
                            );
                        })}
                        {(invoiceTotal ?? 0) > PAGE_LIMIT ? (
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
                                    disabled={page * PAGE_LIMIT >= (invoiceTotal ?? 0)}
                                    onClick={() => setPage((current) => current + 1)}
                                    sx={{ borderRadius: 999 }}
                                >
                                    {t("admin.people.next")}
                                </AppBtn>
                            </Box>
                        ) : null}
                    </>
                )}
            </StudioCard>

            <AppBtn customType="outline" to="/admin/students" sx={{ borderRadius: 999, alignSelf: "flex-start" }}>
                {t("admin.people.back")}
            </AppBtn>
        </Box>
    );
}
