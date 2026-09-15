import { Box, MenuItem, Select, Tab, Tabs, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import { showSuccessToast } from "@/components/ui/appToast";
import ContentFilterBar from "@/features/dashboard/components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "@/features/dashboard/components/contentFilter.types";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import StudioCard from "@/features/dashboard/components/StudioCard";
import { STUDIO_PLAN_IDS, STUDIO_PLANS, type StudioPlanId } from "@/features/dashboard/pages/subscription/studioPlans";
import StatusBadge from "../../components/StatusBadge";
import { getCatalogPlans, saveCatalogPlans, setInstructorPlan } from "../../data/adminStore";
import type { CatalogPlan } from "../../data/adminTypes";
import { getMockInstructors } from "../../data/mockInstructors";

type PlanFormValues = {
    name: string;
    price: number | string;
    features: string;
    popular: boolean;
    active: boolean;
};

type SubscriptionTab = "catalog" | "instructors";

function PlanEditor({
    plan,
    onSave,
}: {
    plan: CatalogPlan;
    onSave: (next: CatalogPlan) => void;
}) {
    const { t } = useTranslation();
    const methods = useForm<PlanFormValues>({
        defaultValues: {
            name: plan.name,
            price: plan.price,
            features: plan.features.join("\n"),
            popular: plan.popular,
            active: plan.active,
        },
    });

    const submit = (values: PlanFormValues) => {
        onSave({
            ...plan,
            name: values.name.trim() || plan.name,
            price: Number(values.price) || 0,
            features: values.features
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            popular: Boolean(values.popular),
            active: Boolean(values.active),
        });
        showSuccessToast(t("admin.subscriptions.plan_saved"));
    };

    return (
        <StudioCard title={plan.name} subtitle={t(`dashboard.subscription.plans.${plan.id}.blurb`)}>
            <FormWrapper methods={methods} onSubmit={submit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <AppFormField name="name" type="text" label={t("admin.subscriptions.plan_name")} showLable />
                    <AppFormField name="price" type="number" label={t("admin.subscriptions.plan_price")} showLable />
                    <AppFormField name="features" type="textarea" label={t("admin.subscriptions.plan_features")} showLable minRows={4} />
                    <AppFormField name="popular" type="checkbox" label={t("admin.subscriptions.plan_popular")} />
                    <AppFormField name="active" type="checkbox" label={t("admin.subscriptions.plan_active")} />
                    <AppBtn customType="primary" type="submit" sx={{ borderRadius: 999, alignSelf: "flex-start" }}>
                        {t("admin.subscriptions.save_plan")}
                    </AppBtn>
                </Box>
            </FormWrapper>
        </StudioCard>
    );
}

export default function AdminSubscriptions() {
    const { t } = useTranslation();
    const [tab, setTab] = useState<SubscriptionTab>("catalog");
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [tick, setTick] = useState(0);
    const instructors = useMemo(() => getMockInstructors(t), [t, tick]);

    const fallbackPlans: CatalogPlan[] = STUDIO_PLANS.map((plan) => ({
        id: plan.id,
        name: t(`dashboard.subscription.plans.${plan.id}.name`),
        price: plan.price,
        popular: Boolean(plan.popular),
        features: Array.from({ length: plan.featureCount }, (_, index) =>
            t(`dashboard.subscription.plans.${plan.id}.feature_${index + 1}`),
        ),
        active: true,
    }));

    const [plans, setPlans] = useState(() => getCatalogPlans(fallbackPlans));

    const visibleInstructors = instructors.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const matchesQuery = !q || row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q);
        const matchesPlan = filter.tier === "all" || row.plan === filter.tier;
        const matchesStatus = filter.status === "all" || row.status === filter.status;
        return matchesQuery && matchesPlan && matchesStatus;
    });

    const savePlan = (next: CatalogPlan) => {
        const updated = plans.map((plan) => {
            if (plan.id === next.id) return next;
            if (next.popular) return { ...plan, popular: false };
            return plan;
        });
        setPlans(updated);
        saveCatalogPlans(updated);
    };

    const changePlan = (id: string, plan: StudioPlanId) => {
        setInstructorPlan(id, plan);
        setTick((value) => value + 1);
        showSuccessToast(t("admin.subscriptions.plan_changed"));
    };

    return (
        <SectionWrapper title={t("admin.subscriptions.title")} description={t("admin.subscriptions.description")}>
            <Tabs
                value={tab}
                onChange={(_, value: SubscriptionTab) => setTab(value)}
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
                <Tab value="catalog" label={t("admin.subscriptions.catalog_title")} disableRipple />
                <Tab value="instructors" label={t("admin.subscriptions.instructors_title")} disableRipple />
            </Tabs>

            {tab === "catalog" ? (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
                    {plans.map((plan) => (
                        <PlanEditor key={`${plan.id}-${plan.popular}-${plan.active}-${plan.price}`} plan={plan} onSave={savePlan} />
                    ))}
                </Box>
            ) : (
                <Box>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
                        {t("admin.subscriptions.instructors_subtitle")}
                    </Typography>
                    <ContentFilterBar
                        value={filter}
                        onChange={setFilter}
                        searchPlaceholder={t("admin.instructors.search")}
                        domainLabel={t("admin.people.expertise")}
                        domainOptions={[{ value: "all", label: t("admin.people.all") }]}
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
                            ...STUDIO_PLAN_IDS.map((id) => ({
                                value: id,
                                label: t(`dashboard.subscription.plans.${id}.name`),
                            })),
                        ]}
                    />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 2 }}>
                        {visibleInstructors.map((row) => (
                            <Box
                                key={row.id}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "1.3fr 1fr 0.8fr auto" },
                                    gap: 1.5,
                                    alignItems: "center",
                                    bgcolor: "surface.main",
                                    borderRadius: "1rem",
                                    p: 2,
                                }}
                            >
                                <Box>
                                    <Typography sx={{ fontWeight: 700 }}>{row.name}</Typography>
                                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{row.email}</Typography>
                                </Box>
                                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                    {t("admin.subscriptions.renews", { date: row.joinedAt })}
                                </Typography>
                                <StatusBadge
                                    status={row.status}
                                    label={t(`admin.people.${row.status === "active" ? "active" : "suspended_status"}`)}
                                />
                                <Select
                                    size="small"
                                    value={row.plan}
                                    onChange={(event) => changePlan(row.id, event.target.value as StudioPlanId)}
                                    sx={{ minWidth: 160, bgcolor: "background.paper", borderRadius: 999 }}
                                >
                                    {STUDIO_PLAN_IDS.map((id) => (
                                        <MenuItem key={id} value={id}>
                                            {t(`dashboard.subscription.plans.${id}.name`)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </SectionWrapper>
    );
}
