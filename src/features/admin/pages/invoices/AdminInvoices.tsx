import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import ContentFilterBar from "@/features/dashboard/components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "@/features/dashboard/components/contentFilter.types";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import { useAdminCoinPackages } from "@/features/queryHooks/coinPackages/useAdminCoinPackages";
import { useCreateCoinPackage } from "@/features/queryHooks/coinPackages/useCreateCoinPackage";
import { useDeleteCoinPackage } from "@/features/queryHooks/coinPackages/useDeleteCoinPackage";
import { useUpdateCoinPackage } from "@/features/queryHooks/coinPackages/useUpdateCoinPackage";
import type { CoinPackage, CoinPackageInput } from "@/features/queryHooks/coinPackages/types";
import { useAdminInvoice } from "@/features/queryHooks/admin/useAdminInvoice";
import { useAdminInvoices } from "@/features/queryHooks/admin/useAdminInvoices";
import { useRefundAdminInvoice } from "@/features/queryHooks/admin/useRefundAdminInvoice";
import type { AdminInvoice, PaymentStatus } from "@/features/queryHooks/admin/types";
import AdminViewDialog, { DetailRow } from "../../components/AdminViewDialog";
import StatusBadge from "../../components/StatusBadge";

const TEMP_COIN_PACKAGE: CoinPackageInput = {
    name: "New package",
    coins: 100,
    price: 0,
    currency: "EGP",
    isActive: true,
};

function apiErrorDetail(cause: unknown) {
    if (!axios.isAxiosError(cause)) return undefined;
    const message = cause.response?.data?.message;
    if (Array.isArray(message)) return message.filter((item) => typeof item === "string").join(", ");
    return typeof message === "string" ? message : undefined;
}

const PAGE_LIMIT = 20;

type InvoiceTab = "packs" | "purchases";

function invoiceBadgeStatus(status: PaymentStatus): "paid" | "hidden" | "refunded" {
    if (status === "completed") return "paid";
    if (status === "pending") return "hidden";
    return "refunded";
}

type PackFormValues = {
    name: string;
    coins: number | string;
    price: number | string;
    currency: string;
    isActive: boolean;
};

export default function AdminInvoices() {
    const { t, i18n } = useTranslation();
    const [tab, setTab] = useState<InvoiceTab>("packs");
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [page, setPage] = useState(1);
    const [viewingId, setViewingId] = useState<string | null>(null);
    const packagesQuery = useAdminCoinPackages();
    const invoicesQuery = useAdminInvoices({ page, limit: PAGE_LIMIT }, tab === "purchases");
    const invoiceQuery = useAdminInvoice(viewingId ?? undefined);
    const refundInvoice = useRefundAdminInvoice();
    const createPackage = useCreateCoinPackage();
    const updatePackage = useUpdateCoinPackage();
    const deletePackage = useDeleteCoinPackage();
    const [editingPack, setEditingPack] = useState<CoinPackage | null>(null);
    const editMethods = useForm<PackFormValues>({
        defaultValues: { name: "", coins: 100, price: 0, currency: "EGP", isActive: true },
    });
    const invoicePage = invoicesQuery.data;
    const invoices = invoicePage && Array.isArray(invoicePage.items) ? invoicePage.items : [];
    const invalidInvoices = invoicesQuery.isSuccess && (!invoicePage || !Array.isArray(invoicePage.items));
    const invoiceTotal = invoicePage?.total ?? 0;
    const packages = Array.isArray(packagesQuery.data) ? packagesQuery.data : [];

    const visible = invoices.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const name = (row.displayName || row.email || "").toLowerCase();
        const matchesQuery = !q || row.id.toLowerCase().includes(q) || name.includes(q) || (row.email ?? "").toLowerCase().includes(q);
        const matchesStatus = filter.status === "all" || row.status === filter.status;
        return matchesQuery && matchesStatus;
    });

    const createTempPackage = async () => {
        try {
            await createPackage.mutateAsync(TEMP_COIN_PACKAGE);
            showSuccessToast(t("admin.invoices.package_created"));
        } catch (cause) {
            showErrorToast(t("admin.invoices.package_create_failed"), apiErrorDetail(cause));
        }
    };

    const openEdit = (pack: CoinPackage) => {
        setEditingPack(pack);
        editMethods.reset({
            name: pack.name,
            coins: pack.coins,
            price: pack.price,
            currency: pack.currency,
            isActive: pack.isActive,
        });
    };

    const saveEdit = async (values: PackFormValues) => {
        if (!editingPack) return;
        const name = values.name.trim();
        const currency = values.currency.trim();
        const coins = Number(values.coins);
        const price = Number(values.price);
        if (!name || !currency || !Number.isFinite(coins) || coins < 1 || !Number.isFinite(price) || price < 0) {
            showErrorToast(t("admin.invoices.package_edit_required"));
            return;
        }
        try {
            await updatePackage.mutateAsync({
                id: editingPack.id,
                body: {
                    name,
                    coins,
                    price,
                    currency,
                    isActive: Boolean(values.isActive),
                },
            });
            setEditingPack(null);
            showSuccessToast(t("admin.invoices.package_updated"));
        } catch (cause) {
            showErrorToast(t("admin.invoices.package_update_failed"), apiErrorDetail(cause));
        }
    };

    const removePackage = async (pack: CoinPackage) => {
        if (!window.confirm(t("admin.invoices.delete_package_confirm", { name: pack.name }))) return;
        try {
            await deletePackage.mutateAsync(pack.id);
            showSuccessToast(t("admin.invoices.package_deleted"));
        } catch (cause) {
            showErrorToast(t("admin.invoices.package_delete_failed"), apiErrorDetail(cause));
        }
    };

    const refund = async (id: string) => {
        if (refundInvoice.isPending) return;
        try {
            await refundInvoice.mutateAsync(id);
            showSuccessToast(t("admin.invoices.refunded_toast"));
        } catch (cause) {
            showErrorToast(t("admin.invoices.refund_failed"), apiErrorDetail(cause));
        }
    };

    const invoiceStatusLabel = (status: PaymentStatus) => t(`admin.invoices.status_${status}`);

    const invoiceTypeLabel = (row: AdminInvoice) => t(`admin.invoices.type_${row.type}`);

    const personLabel = (row: Pick<AdminInvoice, "displayName" | "email">) =>
        row.displayName || row.email || t("admin.instructors.not_set");

    return (
        <SectionWrapper title={t("admin.invoices.page_title")} description={t("admin.invoices.page_description")}>
            <Tabs
                value={tab}
                onChange={(_, value: InvoiceTab) => setTab(value)}
                variant="scrollable"
                allowScrollButtonsMobile
                sx={{
                    mb: 2.5,
                    minHeight: 0,
                    "& .MuiTabs-indicator": { display: "none" },
                    "& .MuiTabs-flexContainer": { gap: 1, flexWrap: "wrap" },
                    "& .MuiTab-root": {
                        minHeight: 0,
                        minWidth: 0,
                        borderRadius: 999,
                        px: 1.75,
                        py: 0.85,
                        fontSize: 13,
                        fontWeight: 700,
                        textTransform: "none",
                        color: "text.secondary",
                        bgcolor: "surface.main",
                        "&.Mui-selected": {
                            color: "secondary.contrastText",
                            bgcolor: "secondary.main",
                        },
                    },
                }}
            >
                <Tab value="packs" label={t("admin.invoices.packs_title")} disableRipple />
                <Tab value="purchases" label={t("admin.invoices.title")} disableRipple />
            </Tabs>

            {tab === "packs" ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        {t("admin.invoices.packs_subtitle")}
                    </Typography>
                    <AppBtn
                        customType="primary"
                        type="button"
                        disabled={createPackage.isPending}
                        onClick={createTempPackage}
                        sx={{ borderRadius: 999, alignSelf: "flex-start" }}
                    >
                        {t("admin.invoices.create_package")}
                    </AppBtn>
                    {packagesQuery.isPending ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress aria-label={t("status.loading")} />
                        </Box>
                    ) : packagesQuery.isError || (packagesQuery.isSuccess && !Array.isArray(packagesQuery.data)) ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 4 }}>
                            <Typography sx={{ color: "error.main", textAlign: "center" }}>
                                {t("admin.invoices.packs_load_failed")}
                            </Typography>
                            <AppBtn customType="primary" type="button" onClick={() => packagesQuery.refetch()} sx={{ borderRadius: 999 }}>
                                {t("status.retry")}
                            </AppBtn>
                        </Box>
                    ) : packages.length === 0 ? (
                        <Typography sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
                            {t("admin.invoices.packs_empty")}
                        </Typography>
                    ) : (
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 1.5, mb: 2 }}>
                            {packages.map((pack) => (
                                <Box
                                    key={pack.id}
                                    sx={{
                                        bgcolor: "surface.main",
                                        borderRadius: "1rem",
                                        p: 2,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 2,
                                        alignItems: "center",
                                    }}
                                >
                                    <Box>
                                        <Typography sx={{ fontWeight: 800 }}>{pack.name}</Typography>
                                        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                            {pack.coins} {t("dashboard.coins")} · {Number(pack.price).toFixed(2)} {pack.currency}
                                        </Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <StatusBadge
                                                status={pack.isActive ? "visible" : "hidden"}
                                                label={pack.isActive ? t("admin.content.visible") : t("admin.content.hidden_status")}
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        <AppBtn customType="outline" type="button" onClick={() => openEdit(pack)} sx={{ borderRadius: 999 }}>
                                            {t("form.edit")}
                                        </AppBtn>
                                        <AppBtn
                                            customType="outline"
                                            type="button"
                                            disabled={deletePackage.isPending && deletePackage.variables === pack.id}
                                            onClick={() => removePackage(pack)}
                                            sx={{ borderRadius: 999 }}
                                        >
                                            {t("admin.invoices.delete_package")}
                                        </AppBtn>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}

                </Box>
            ) : (
                <Box>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
                        {t("admin.invoices.description")}
                    </Typography>
                    <ContentFilterBar
                        value={filter}
                        onChange={setFilter}
                        searchPlaceholder={t("admin.invoices.search")}
                        domainLabel={t("admin.people.expertise")}
                        domainOptions={[{ value: "all", label: t("admin.people.all") }]}
                        sortLabel={t("admin.people.plan")}
                        sortOptions={[{ value: "plays", label: t("admin.people.all") }]}
                        statusOptions={[
                            { value: "all", label: t("admin.people.all"), count: invoices.length },
                            {
                                value: "completed",
                                label: t("admin.invoices.status_completed"),
                                count: invoices.filter((row) => row.status === "completed").length,
                            },
                            {
                                value: "refunded",
                                label: t("admin.invoices.status_refunded"),
                                count: invoices.filter((row) => row.status === "refunded").length,
                            },
                            {
                                value: "pending",
                                label: t("admin.invoices.status_pending"),
                                count: invoices.filter((row) => row.status === "pending").length,
                            },
                            {
                                value: "failed",
                                label: t("admin.invoices.status_failed"),
                                count: invoices.filter((row) => row.status === "failed").length,
                            },
                        ]}
                    />

                    {invoicesQuery.isPending ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                            <CircularProgress aria-label={t("status.loading")} />
                        </Box>
                    ) : invoicesQuery.isError || invalidInvoices ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 6 }}>
                            <Typography sx={{ color: "error.main", textAlign: "center" }}>{t("admin.invoices.load_failed")}</Typography>
                            <AppBtn customType="primary" type="button" onClick={() => invoicesQuery.refetch()} sx={{ borderRadius: 999 }}>
                                {t("status.retry")}
                            </AppBtn>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 2 }}>
                                {visible.length === 0 ? (
                                    <Typography sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
                                        {t("admin.people.empty")}
                                    </Typography>
                                ) : (
                                    visible.map((row) => {
                                        const date = new Date(row.createdAt);
                                        const when = Number.isNaN(date.getTime()) ? row.createdAt : date.toLocaleDateString(i18n.language);
                                        return (
                                            <Box
                                                key={row.id}
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 0.8fr 0.8fr auto" },
                                                    gap: 1.5,
                                                    alignItems: "center",
                                                    bgcolor: "surface.main",
                                                    borderRadius: "1rem",
                                                    p: 2,
                                                }}
                                            >
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700 }}>{personLabel(row)}</Typography>
                                                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{row.email || row.id}</Typography>
                                                </Box>
                                                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{invoiceTypeLabel(row)}</Typography>
                                                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                                    {row.amount} {row.currency} · {when}
                                                </Typography>
                                                <StatusBadge status={invoiceBadgeStatus(row.status)} label={invoiceStatusLabel(row.status)} />
                                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                                    <AppBtn customType="outline" type="button" onClick={() => setViewingId(row.id)} sx={{ borderRadius: 999 }}>
                                                        {t("admin.people.view")}
                                                    </AppBtn>
                                                    <AppBtn
                                                        customType="primary"
                                                        type="button"
                                                        disabled={row.status !== "completed" || refundInvoice.isPending}
                                                        onClick={() => refund(row.id)}
                                                        sx={{ borderRadius: 999 }}
                                                    >
                                                        {t("admin.invoices.mark_refunded")}
                                                    </AppBtn>
                                                </Box>
                                            </Box>
                                        );
                                    })
                                )}
                            </Box>
                            {invoiceTotal > PAGE_LIMIT ? (
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
                                        disabled={page * PAGE_LIMIT >= invoiceTotal}
                                        onClick={() => setPage((current) => current + 1)}
                                        sx={{ borderRadius: 999 }}
                                    >
                                        {t("admin.people.next")}
                                    </AppBtn>
                                </Box>
                            ) : null}
                        </>
                    )}
                </Box>
            )}

            <AdminViewDialog open={Boolean(viewingId)} title={invoiceQuery.data?.id ?? viewingId ?? ""} onClose={() => setViewingId(null)}>
                {invoiceQuery.isPending ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                        <CircularProgress size={22} aria-label={t("status.loading")} />
                    </Box>
                ) : invoiceQuery.isError || !invoiceQuery.data ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1.5 }}>
                        <Typography sx={{ color: "error.main" }}>{t("admin.invoices.load_failed")}</Typography>
                        <AppBtn customType="outline" type="button" onClick={() => invoiceQuery.refetch()} sx={{ borderRadius: 999 }}>
                            {t("status.retry")}
                        </AppBtn>
                    </Box>
                ) : (
                    <>
                        <DetailRow label={t("admin.invoices.student")} value={personLabel(invoiceQuery.data)} />
                        <DetailRow label={t("admin.invoices.type")} value={invoiceTypeLabel(invoiceQuery.data)} />
                        <DetailRow label={t("admin.invoices.reference")} value={invoiceQuery.data.referenceId} />
                        <DetailRow label={t("admin.invoices.amount")} value={`${invoiceQuery.data.amount} ${invoiceQuery.data.currency}`} />
                        <DetailRow
                            label={t("admin.invoices.date")}
                            value={new Date(invoiceQuery.data.createdAt).toLocaleDateString(i18n.language)}
                        />
                        <DetailRow label={t("admin.invoices.status")} value={invoiceStatusLabel(invoiceQuery.data.status)} />
                    </>
                )}
            </AdminViewDialog>

            <AdminViewDialog open={Boolean(editingPack)} title={t("admin.invoices.edit_pack")} onClose={() => setEditingPack(null)}>
                <FormWrapper methods={editMethods} onSubmit={saveEdit}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <AppFormField name="name" type="text" label={t("admin.invoices.pack_name")} showLable />
                        <AppFormField name="coins" type="number" label={t("admin.invoices.pack_coins")} showLable />
                        <AppFormField name="price" type="number" label={t("admin.invoices.pack_price")} showLable />
                        <AppFormField name="currency" type="text" label={t("admin.invoices.pack_currency")} showLable />
                        <AppFormField name="isActive" type="checkbox" label={t("admin.invoices.pack_active")} />
                        <AppBtn
                            customType="primary"
                            type="submit"
                            disabled={updatePackage.isPending}
                            sx={{ borderRadius: 999, alignSelf: "flex-start" }}
                        >
                            {t("admin.invoices.save_pack")}
                        </AppBtn>
                    </Box>
                </FormWrapper>
            </AdminViewDialog>
        </SectionWrapper>
    );
}
