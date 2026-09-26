import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";
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
import AdminViewDialog, { DetailRow } from "../../components/AdminViewDialog";
import StatusBadge from "../../components/StatusBadge";
import { markInvoiceRefunded } from "../../data/adminStore";
import type { CoinInvoice } from "../../data/adminTypes";
import { getMockInvoices } from "../../data/mockInvoices";

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

type InvoiceTab = "packs" | "purchases";

type PackFormValues = {
    name: string;
    coins: number | string;
    price: number | string;
    currency: string;
    isActive: boolean;
};

export default function AdminInvoices() {
    const { t } = useTranslation();
    const [tab, setTab] = useState<InvoiceTab>("packs");
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [tick, setTick] = useState(0);
    const packagesQuery = useAdminCoinPackages();
    const createPackage = useCreateCoinPackage();
    const updatePackage = useUpdateCoinPackage();
    const deletePackage = useDeleteCoinPackage();
    const [viewing, setViewing] = useState<CoinInvoice | null>(null);
    const [editingPack, setEditingPack] = useState<CoinPackage | null>(null);
    const editMethods = useForm<PackFormValues>({
        defaultValues: { name: "", coins: 100, price: 0, currency: "EGP", isActive: true },
    });
    const invoices = useMemo(() => getMockInvoices(), [tick]);
    const packages = Array.isArray(packagesQuery.data) ? packagesQuery.data : [];

    const visible = invoices.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const matchesQuery = !q || row.id.toLowerCase().includes(q) || row.studentName.toLowerCase().includes(q);
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

    const refund = (id: string) => {
        markInvoiceRefunded(id);
        setTick((value) => value + 1);
        showSuccessToast(t("admin.invoices.refunded_toast"));
    };

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
                            { value: "paid", label: t("admin.invoices.paid"), count: invoices.filter((row) => row.status === "paid").length },
                            {
                                value: "refunded",
                                label: t("admin.invoices.refunded"),
                                count: invoices.filter((row) => row.status === "refunded").length,
                            },
                        ]}
                    />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 2 }}>
                        {visible.map((row) => (
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
                                    <Typography sx={{ fontWeight: 700 }}>{row.id}</Typography>
                                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{row.studentName}</Typography>
                                </Box>
                                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                    {row.coins} {t("dashboard.coins")} · ${row.amount.toFixed(2)}
                                </Typography>
                                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{row.date}</Typography>
                                <StatusBadge status={row.status} label={t(`admin.invoices.${row.status}`)} />
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    <AppBtn customType="outline" type="button" onClick={() => setViewing(row)} sx={{ borderRadius: 999 }}>
                                        {t("admin.people.view")}
                                    </AppBtn>
                                    <AppBtn
                                        customType="primary"
                                        type="button"
                                        disabled={row.status === "refunded"}
                                        onClick={() => refund(row.id)}
                                        sx={{ borderRadius: 999 }}
                                    >
                                        {t("admin.invoices.mark_refunded")}
                                    </AppBtn>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            <AdminViewDialog open={Boolean(viewing)} title={viewing?.id ?? ""} onClose={() => setViewing(null)}>
                {viewing ? (
                    <>
                        <DetailRow label={t("admin.invoices.student")} value={viewing.studentName} />
                        <DetailRow label={t("admin.invoices.pack")} value={`${viewing.coins} ${t("dashboard.coins")}`} />
                        <DetailRow label={t("admin.invoices.amount")} value={`$${viewing.amount.toFixed(2)}`} />
                        <DetailRow label={t("admin.invoices.date")} value={viewing.date} />
                        <DetailRow label={t("admin.invoices.status")} value={t(`admin.invoices.${viewing.status}`)} />
                    </>
                ) : null}
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
