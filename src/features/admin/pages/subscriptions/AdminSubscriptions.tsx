import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import StudioCard from "@/features/dashboard/components/StudioCard";
import { useCreateInstructorPackage } from "@/features/queryHooks/instructorPackages/useCreateInstructorPackage";
import { useDeleteInstructorPackage } from "@/features/queryHooks/instructorPackages/useDeleteInstructorPackage";
import { useInstructorPackages } from "@/features/queryHooks/instructorPackages/useInstructorPackages";
import { useUpdateInstructorPackage } from "@/features/queryHooks/instructorPackages/useUpdateInstructorPackage";
import type { InstructorPackage, InstructorPackageInput } from "@/features/queryHooks/instructorPackages/types";
import { useAdminCreateInstructorSubscription } from "@/features/queryHooks/instructorSubscriptions/useAdminCreateInstructorSubscription";
import { useAdminInstructorSubscriptions } from "@/features/queryHooks/instructorSubscriptions/useAdminInstructorSubscriptions";
import { useAdminUpdateInstructorSubscription } from "@/features/queryHooks/instructorSubscriptions/useAdminUpdateInstructorSubscription";
import type { InstructorSubscription } from "@/features/queryHooks/instructorSubscriptions/types";
import { useUsersByRole } from "@/features/queryHooks/users/useUsersByRole";

const TEMP_INSTRUCTOR_PACKAGE: InstructorPackageInput = {
    name: "New package",
    description: "Temporary package",
    price: 0,
    currency: "EGP",
    durationDays: 30,
    maxCourses: 1,
    maxVideos: 1,
    isActive: true,
};

type AddSubscriptionValues = {
    userId: string;
    instructorPackageId: string;
};

type EditSubscriptionValues = {
    instructorPackageId: string;
    status: string;
    maxCourses: number | string;
    maxVideos: number | string;
    startedAt: string;
    expiresAt: string;
};

function toDateInput(value: string | null) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

function toIsoDate(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return new Date(`${trimmed}T00:00:00.000Z`).toISOString();
}

type PlanFormValues = {
    name: string;
    description: string;
    price: number | string;
    currency: string;
    durationDays: number | string;
    maxCourses: number | string;
    maxVideos: number | string;
    isActive: boolean;
};

function apiErrorDetail(cause: unknown) {
    if (!axios.isAxiosError(cause)) return undefined;
    const message = cause.response?.data?.message;
    if (Array.isArray(message)) return message.filter((item) => typeof item === "string").join(", ");
    return typeof message === "string" ? message : undefined;
}

type SubscriptionTab = "catalog" | "instructors";

function SubscriptionEditor({
    subscription,
    packages,
    saving,
    onSave,
    onCancel,
}: {
    subscription: InstructorSubscription;
    packages: InstructorPackage[];
    saving: boolean;
    onSave: (values: EditSubscriptionValues) => Promise<unknown>;
    onCancel: () => void;
}) {
    const { t } = useTranslation();
    const methods = useForm<EditSubscriptionValues>({
        defaultValues: {
            instructorPackageId: subscription.instructorPackageId,
            status: subscription.status,
            maxCourses: subscription.maxCourses,
            maxVideos: subscription.maxVideos,
            startedAt: toDateInput(subscription.startedAt),
            expiresAt: toDateInput(subscription.expiresAt),
        },
    });

    const submit = async (values: EditSubscriptionValues) => {
        if (!values.instructorPackageId.trim() || !values.status.trim()) {
            showErrorToast(t("admin.subscriptions.subscription_edit_required"));
            return;
        }
        try {
            await onSave(values);
            showSuccessToast(t("admin.subscriptions.subscription_updated"));
        } catch (cause) {
            showErrorToast(t("admin.subscriptions.subscription_update_failed"), apiErrorDetail(cause));
        }
    };

    return (
        <FormWrapper methods={methods} onSubmit={submit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                <AppFormField
                    name="instructorPackageId"
                    type="autocomplete"
                    label={t("admin.subscriptions.subscription_package")}
                    showLable
                    options={packages.map((plan) => ({ value: plan.id, label: plan.name }))}
                />
                <AppFormField name="status" type="text" label={t("admin.subscriptions.subscription_status")} showLable />
                <AppFormField name="maxCourses" type="number" label={t("admin.subscriptions.plan_max_courses")} showLable />
                <AppFormField name="maxVideos" type="number" label={t("admin.subscriptions.plan_max_videos")} showLable />
                <AppFormField name="startedAt" type="date" label={t("admin.subscriptions.subscription_started_label")} showLable />
                <AppFormField name="expiresAt" type="date" label={t("admin.subscriptions.subscription_expires_label")} showLable />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <AppBtn customType="primary" type="submit" disabled={saving} sx={{ borderRadius: 999 }}>
                        {t("admin.subscriptions.save_subscription")}
                    </AppBtn>
                    <AppBtn customType="outline" type="button" disabled={saving} onClick={onCancel} sx={{ borderRadius: 999 }}>
                        {t("admin.subscriptions.cancel")}
                    </AppBtn>
                </Box>
            </Box>
        </FormWrapper>
    );
}

function PlanEditor({
    plan,
    saving,
    deleting,
    onSave,
    onDelete,
}: {
    plan: InstructorPackage;
    saving: boolean;
    deleting: boolean;
    onSave: (next: InstructorPackage) => Promise<unknown>;
    onDelete: (id: string) => Promise<unknown>;
}) {
    const { t } = useTranslation();
    const methods = useForm<PlanFormValues>({
        defaultValues: {
            name: plan.name,
            description: plan.description,
            price: plan.price,
            currency: plan.currency,
            durationDays: plan.durationDays,
            maxCourses: plan.maxCourses,
            maxVideos: plan.maxVideos,
            isActive: plan.isActive,
        },
    });

    const submit = async (values: PlanFormValues) => {
        const isActive = Boolean(values.isActive);
        try {
            await onSave({
                ...plan,
                name: values.name.trim() || plan.name,
                description: values.description.trim(),
                price: Number(values.price) || 0,
                currency: values.currency.trim() || "EGP",
                durationDays: Math.max(1, Number(values.durationDays) || 1),
                maxCourses: Math.max(0, Number(values.maxCourses) || 0),
                maxVideos: Math.max(0, Number(values.maxVideos) || 0),
                isActive,
            });
            showSuccessToast(t("admin.subscriptions.package_updated"));
        } catch (cause) {
            showErrorToast(t("admin.subscriptions.package_update_failed"), apiErrorDetail(cause));
        }
    };

    const remove = async () => {
        if (!window.confirm(t("admin.subscriptions.delete_package_confirm", { name: plan.name }))) return;
        try {
            await onDelete(plan.id);
            showSuccessToast(t("admin.subscriptions.package_deleted"));
        } catch (cause) {
            showErrorToast(t("admin.subscriptions.package_delete_failed"), apiErrorDetail(cause));
        }
    };

    return (
        <StudioCard
            title={plan.name}
            subtitle={t("admin.subscriptions.package_summary", {
                price: plan.price,
                currency: plan.currency,
                days: plan.durationDays,
                courses: plan.maxCourses,
                videos: plan.maxVideos,
            })}
        >
            <FormWrapper methods={methods} onSubmit={submit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <AppFormField name="name" type="text" label={t("admin.subscriptions.plan_name")} showLable />
                    <AppFormField name="description" type="textarea" label={t("admin.subscriptions.plan_description")} showLable minRows={3} />
                    <AppFormField name="price" type="number" label={t("admin.subscriptions.plan_price")} showLable />
                    <AppFormField name="currency" type="text" label={t("admin.subscriptions.plan_currency")} showLable />
                    <AppFormField name="durationDays" type="number" label={t("admin.subscriptions.plan_duration_days")} showLable />
                    <AppFormField name="maxCourses" type="number" label={t("admin.subscriptions.plan_max_courses")} showLable />
                    <AppFormField name="maxVideos" type="number" label={t("admin.subscriptions.plan_max_videos")} showLable />
                    <AppFormField name="isActive" type="checkbox" label={t("admin.subscriptions.plan_active")} />
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <AppBtn
                            customType="primary"
                            type="submit"
                            disabled={saving || deleting}
                            sx={{ borderRadius: 999 }}
                        >
                            {t("admin.subscriptions.save_plan")}
                        </AppBtn>
                        <AppBtn
                            customType="outline"
                            type="button"
                            disabled={saving || deleting}
                            onClick={remove}
                            sx={{ borderRadius: 999 }}
                        >
                            {t("admin.subscriptions.delete_package")}
                        </AppBtn>
                    </Box>
                </Box>
            </FormWrapper>
        </StudioCard>
    );
}

export default function AdminSubscriptions() {
    const { t, i18n } = useTranslation();
    const createPackage = useCreateInstructorPackage();
    const updatePackage = useUpdateInstructorPackage();
    const deletePackage = useDeleteInstructorPackage();
    const [tab, setTab] = useState<SubscriptionTab>("catalog");
    const packagesQuery = useInstructorPackages();
    const instructorsQuery = useUsersByRole("instructor", tab === "instructors");
    const subscriptionsQuery = useAdminInstructorSubscriptions();
    const createSubscription = useAdminCreateInstructorSubscription();
    const updateSubscription = useAdminUpdateInstructorSubscription();
    const [editingId, setEditingId] = useState<string | null>(null);
    const addMethods = useForm<AddSubscriptionValues>({
        defaultValues: { userId: "", instructorPackageId: "" },
    });
    const packages = Array.isArray(packagesQuery.data) ? packagesQuery.data : [];
    const instructors = Array.isArray(instructorsQuery.data) ? instructorsQuery.data : [];
    const subscriptions = Array.isArray(subscriptionsQuery.data) ? subscriptionsQuery.data : [];

    const savePlan = (next: InstructorPackage) =>
        updatePackage.mutateAsync({
            id: next.id,
            name: next.name,
            description: next.description,
            price: next.price,
            currency: next.currency,
            durationDays: next.durationDays,
            maxCourses: next.maxCourses,
            maxVideos: next.maxVideos,
            isActive: next.isActive,
        });

    const removePlan = (id: string) => deletePackage.mutateAsync(id);

    const createTempPackage = async () => {
        try {
            await createPackage.mutateAsync(TEMP_INSTRUCTOR_PACKAGE);
            showSuccessToast(t("admin.subscriptions.package_created"));
        } catch (cause) {
            showErrorToast(t("admin.subscriptions.package_create_failed"), apiErrorDetail(cause));
        }
    };

    const addSubscription = async (values: AddSubscriptionValues) => {
        const userId = values.userId.trim();
        const instructorPackageId = values.instructorPackageId.trim();
        if (!userId || !instructorPackageId) {
            showErrorToast(t("admin.subscriptions.subscription_required"));
            return;
        }
        try {
            await createSubscription.mutateAsync({ userId, instructorPackageId });
            addMethods.reset({ userId: "", instructorPackageId: "" });
            showSuccessToast(t("admin.subscriptions.subscription_created"));
        } catch (cause) {
            showErrorToast(t("admin.subscriptions.subscription_create_failed"), apiErrorDetail(cause));
        }
    };

    const saveSubscription = (id: string, values: EditSubscriptionValues) =>
        updateSubscription.mutateAsync({
            id,
            body: {
                instructorPackageId: values.instructorPackageId.trim(),
                status: values.status.trim(),
                maxCourses: Math.max(0, Number(values.maxCourses) || 0),
                maxVideos: Math.max(0, Number(values.maxVideos) || 0),
                startedAt: toIsoDate(values.startedAt),
                expiresAt: toIsoDate(values.expiresAt),
            },
        });

    const formatWhen = (value: string | null) => {
        if (!value) return t("admin.subscriptions.subscription_no_date");
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString(i18n.language);
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
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <AppBtn
                        customType="primary"
                        type="button"
                        disabled={createPackage.isPending}
                        onClick={createTempPackage}
                        sx={{ borderRadius: 999, alignSelf: "flex-start" }}
                    >
                        {t("admin.subscriptions.create_package")}
                    </AppBtn>
                    {packagesQuery.isPending ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress aria-label={t("status.loading")} />
                        </Box>
                    ) : packagesQuery.isError || (packagesQuery.isSuccess && !Array.isArray(packagesQuery.data)) ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 4 }}>
                            <Typography sx={{ color: "error.main", textAlign: "center" }}>
                                {t("admin.subscriptions.packages_load_failed")}
                            </Typography>
                            <AppBtn customType="primary" type="button" onClick={() => packagesQuery.refetch()} sx={{ borderRadius: 999 }}>
                                {t("status.retry")}
                            </AppBtn>
                        </Box>
                    ) : packages.length === 0 ? (
                        <Typography sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
                            {t("admin.subscriptions.packages_empty")}
                        </Typography>
                    ) : (
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
                            {packages.map((plan) => (
                                <PlanEditor
                                    key={`${plan.id}-${plan.updatedAt}`}
                                    plan={plan}
                                    saving={updatePackage.isPending && updatePackage.variables?.id === plan.id}
                                    deleting={deletePackage.isPending && deletePackage.variables === plan.id}
                                    onSave={savePlan}
                                    onDelete={removePlan}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        {t("admin.subscriptions.instructors_subtitle")}
                    </Typography>
                    <StudioCard
                        title={t("admin.subscriptions.add_subscription")}
                        subtitle={t("admin.subscriptions.add_subscription_subtitle")}
                    >
                        <FormWrapper methods={addMethods} onSubmit={addSubscription}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <AppFormField
                                    name="userId"
                                    type="autocomplete"
                                    label={t("admin.subscriptions.subscription_user")}
                                    showLable
                                    options={instructors.map((user) => ({
                                        value: user.id,
                                        label: user.email ? `${user.displayName} · ${user.email}` : user.displayName,
                                    }))}
                                />
                                <AppFormField
                                    name="instructorPackageId"
                                    type="autocomplete"
                                    label={t("admin.subscriptions.subscription_package")}
                                    showLable
                                    options={packages.map((plan) => ({ value: plan.id, label: plan.name }))}
                                />
                                <AppBtn
                                    customType="primary"
                                    type="submit"
                                    disabled={createSubscription.isPending}
                                    sx={{ borderRadius: 999, alignSelf: "flex-start" }}
                                >
                                    {t("admin.subscriptions.add_subscription")}
                                </AppBtn>
                            </Box>
                        </FormWrapper>
                    </StudioCard>
                    {subscriptionsQuery.isPending ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress aria-label={t("status.loading")} />
                        </Box>
                    ) : subscriptionsQuery.isError || (subscriptionsQuery.isSuccess && !Array.isArray(subscriptionsQuery.data)) ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 4 }}>
                            <Typography sx={{ color: "error.main", textAlign: "center" }}>
                                {t("admin.subscriptions.subscriptions_load_failed")}
                            </Typography>
                            <AppBtn
                                customType="primary"
                                type="button"
                                onClick={() => subscriptionsQuery.refetch()}
                                sx={{ borderRadius: 999 }}
                            >
                                {t("status.retry")}
                            </AppBtn>
                        </Box>
                    ) : subscriptions.length === 0 ? (
                        <Typography sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
                            {t("admin.subscriptions.subscriptions_empty")}
                        </Typography>
                    ) : (
                        subscriptions.map((row) => (
                            <Box
                                key={row.id}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr 0.7fr 1fr" },
                                    gap: 1.5,
                                    alignItems: "start",
                                    bgcolor: "surface.main",
                                    borderRadius: "1rem",
                                    p: 2,
                                }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                        {t("admin.subscriptions.subscription_user")}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {row.instructor?.displayName || row.userId}
                                    </Typography>
                                    {row.instructor?.email ? (
                                        <Typography sx={{ fontSize: 13, color: "text.secondary", wordBreak: "break-all" }}>
                                            {row.instructor.email}
                                        </Typography>
                                    ) : null}
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                        {t("admin.subscriptions.subscription_package")}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {row.instructorPackage?.name || row.instructorPackageId}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                        {t("admin.subscriptions.subscription_status")}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            color: row.status.toLowerCase() === "active" ? "tertiary.main" : "text.primary",
                                        }}
                                    >
                                        {row.status}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                        {t("admin.subscriptions.subscription_usage", {
                                            coursesUsed: row.coursesCreatedCount,
                                            courses: row.maxCourses,
                                            videosUsed: row.videosUploadedCount,
                                            videos: row.maxVideos,
                                        })}
                                    </Typography>
                                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                        {t("admin.subscriptions.subscription_started", { date: formatWhen(row.startedAt) })}
                                    </Typography>
                                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                        {t("admin.subscriptions.subscription_expires", { date: formatWhen(row.expiresAt) })}
                                    </Typography>
                                    <AppBtn
                                        customType="outline"
                                        type="button"
                                        onClick={() => setEditingId(editingId === row.id ? null : row.id)}
                                        sx={{ borderRadius: 999, mt: 1.25 }}
                                    >
                                        {t("admin.subscriptions.edit_subscription")}
                                    </AppBtn>
                                </Box>
                                {editingId === row.id ? (
                                    <Box sx={{ gridColumn: "1 / -1" }}>
                                        <SubscriptionEditor
                                            key={row.updatedAt}
                                            subscription={row}
                                            packages={packages}
                                            saving={updateSubscription.isPending && updateSubscription.variables?.id === row.id}
                                            onCancel={() => setEditingId(null)}
                                            onSave={async (values) => {
                                                await saveSubscription(row.id, values);
                                                setEditingId(null);
                                            }}
                                        />
                                    </Box>
                                ) : null}
                            </Box>
                        ))
                    )}
                </Box>
            )}
        </SectionWrapper>
    );
}
