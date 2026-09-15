import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import ContentFilterBar from "@/features/dashboard/components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "@/features/dashboard/components/contentFilter.types";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import StudioCard from "@/features/dashboard/components/StudioCard";
import AdminViewDialog, { DetailRow } from "../../components/AdminViewDialog";
import StatusBadge from "../../components/StatusBadge";
import { markInvoiceRefunded, saveCoinPacks } from "../../data/adminStore";
import type { CoinInvoice, CoinPack } from "../../data/adminTypes";
import { getMockCoinPacks, getMockInvoices } from "../../data/mockInvoices";

type PackFormValues = {
    coins: number | string;
    price: number | string;
    bonus: number | string;
};

type InvoiceTab = "packs" | "purchases";

export default function AdminInvoices() {
    const { t } = useTranslation();
    const [tab, setTab] = useState<InvoiceTab>("packs");
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [tick, setTick] = useState(0);
    const [packs, setPacks] = useState(() => getMockCoinPacks());
    const [viewing, setViewing] = useState<CoinInvoice | null>(null);
    const [editingPack, setEditingPack] = useState<CoinPack | null>(null);
    const invoices = useMemo(() => getMockInvoices(), [tick]);
    const editMethods = useForm<PackFormValues>({
        defaultValues: { coins: 0, price: 0, bonus: 0 },
    });
    const addMethods = useForm<PackFormValues>({
        defaultValues: { coins: 100, price: 4.99, bonus: 0 },
    });

    const persistPacks = (next: CoinPack[]) => {
        setPacks(next);
        saveCoinPacks(next);
    };

    const openEdit = (pack: CoinPack) => {
        setEditingPack(pack);
        editMethods.reset({ coins: pack.coins, price: pack.price, bonus: pack.bonus });
    };

    const saveEdit = (values: PackFormValues) => {
        if (!editingPack) return;
        persistPacks(
            packs.map((pack) =>
                pack.id === editingPack.id
                    ? {
                          ...pack,
                          coins: Number(values.coins) || 0,
                          price: Number(values.price) || 0,
                          bonus: Number(values.bonus) || 0,
                      }
                    : pack,
            ),
        );
        setEditingPack(null);
        showSuccessToast(t("admin.invoices.pack_updated"));
    };

    const visible = invoices.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const matchesQuery = !q || row.id.toLowerCase().includes(q) || row.studentName.toLowerCase().includes(q);
        const matchesStatus = filter.status === "all" || row.status === filter.status;
        return matchesQuery && matchesStatus;
    });

    const addPack = (values: PackFormValues) => {
        const next: CoinPack = {
            id: `pack-${Date.now()}`,
            coins: Number(values.coins) || 0,
            price: Number(values.price) || 0,
            bonus: Number(values.bonus) || 0,
            active: true,
        };
        persistPacks([...packs, next]);
        addMethods.reset({ coins: 100, price: 4.99, bonus: 0 });
        showSuccessToast(t("admin.invoices.pack_added"));
    };

    const togglePack = (id: string) => {
        persistPacks(packs.map((pack) => (pack.id === id ? { ...pack, active: !pack.active } : pack)));
        showSuccessToast(t("admin.invoices.pack_updated"));
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
                <Box>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
                        {t("admin.invoices.packs_subtitle")}
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 1.5, mb: 2 }}>
                        {packs.map((pack) => (
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
                                    <Typography sx={{ fontWeight: 800 }}>
                                        {pack.coins} {t("dashboard.coins")}
                                    </Typography>
                                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                        ${pack.price.toFixed(2)} · +{pack.bonus} {t("admin.invoices.bonus")}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <StatusBadge
                                            status={pack.active ? "visible" : "hidden"}
                                            label={pack.active ? t("admin.content.visible") : t("admin.content.hidden_status")}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    <AppBtn customType="outline" type="button" onClick={() => openEdit(pack)} sx={{ borderRadius: 999 }}>
                                        {t("form.edit")}
                                    </AppBtn>
                                    <AppBtn customType="outline" type="button" onClick={() => togglePack(pack.id)} sx={{ borderRadius: 999 }}>
                                        {pack.active ? t("admin.content.hide") : t("admin.content.unhide")}
                                    </AppBtn>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <StudioCard title={t("admin.invoices.add_pack")} subtitle={t("admin.invoices.add_pack_subtitle")}>
                        <FormWrapper methods={addMethods} onSubmit={addPack}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr auto" },
                                    gap: 1.5,
                                    alignItems: "end",
                                }}
                            >
                                <AppFormField name="coins" type="number" label={t("admin.invoices.pack_coins")} showLable />
                                <AppFormField name="price" type="number" label={t("admin.invoices.pack_price")} showLable />
                                <AppFormField name="bonus" type="number" label={t("admin.invoices.bonus")} showLable />
                                <AppBtn customType="primary" type="submit" sx={{ borderRadius: 999, mb: 0.5 }}>
                                    {t("admin.invoices.add")}
                                </AppBtn>
                            </Box>
                        </FormWrapper>
                    </StudioCard>
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
                        <AppFormField name="coins" type="number" label={t("admin.invoices.pack_coins")} showLable />
                        <AppFormField name="price" type="number" label={t("admin.invoices.pack_price")} showLable />
                        <AppFormField name="bonus" type="number" label={t("admin.invoices.bonus")} showLable />
                        <AppBtn customType="primary" type="submit" sx={{ borderRadius: 999, alignSelf: "flex-start" }}>
                            {t("admin.invoices.save_pack")}
                        </AppBtn>
                    </Box>
                </FormWrapper>
            </AdminViewDialog>
        </SectionWrapper>
    );
}
