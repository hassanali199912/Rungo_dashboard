import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import StudioCard from "@/features/dashboard/components/StudioCard";
import type { UpdatePlatformSettingsBody } from "@/features/queryHooks/admin/types";
import { usePlatformSettings, useUpdatePlatformSettings } from "@/features/queryHooks/admin/usePlatformSettings";

type PlatformSettingsForm = {
    supportEmail: string;
    creatorSplit: number | string;
    usdPerCoin: number | string;
    maintenanceMode: boolean;
};

function apiErrorDetail(cause: unknown) {
    if (!axios.isAxiosError(cause)) return undefined;
    const message = cause.response?.data?.message;
    if (Array.isArray(message)) return message.filter((item) => typeof item === "string").join(", ");
    return typeof message === "string" ? message : undefined;
}

export default function PlatformSettingsCard() {
    const { t } = useTranslation();
    const settingsQuery = usePlatformSettings();
    const updateSettings = useUpdatePlatformSettings();
    const methods = useForm<PlatformSettingsForm>({
        defaultValues: { supportEmail: "", creatorSplit: 0, usdPerCoin: 0, maintenanceMode: false },
    });

    useEffect(() => {
        if (!settingsQuery.data) return;
        methods.reset({
            supportEmail: settingsQuery.data.supportEmail,
            creatorSplit: settingsQuery.data.creatorSplit,
            usdPerCoin: settingsQuery.data.usdPerCoin,
            maintenanceMode: settingsQuery.data.maintenanceMode,
        });
    }, [settingsQuery.data, methods]);

    const onSubmit = async (values: PlatformSettingsForm) => {
        const current = settingsQuery.data;
        if (!current) return;
        const supportEmail = values.supportEmail.trim();
        const creatorSplit = Number(values.creatorSplit);
        const usdPerCoin = Number(values.usdPerCoin);
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail);
        const splitOk = Number.isInteger(creatorSplit) && creatorSplit >= 0 && creatorSplit <= 100;
        const usdOk = Number.isFinite(usdPerCoin) && usdPerCoin >= 0;
        if (!emailOk || !splitOk || !usdOk) {
            showErrorToast(t("admin.settings.platform.invalid"));
            return;
        }

        const body: UpdatePlatformSettingsBody = {};
        if (supportEmail !== current.supportEmail) body.supportEmail = supportEmail;
        if (creatorSplit !== current.creatorSplit) body.creatorSplit = creatorSplit;
        if (usdPerCoin !== current.usdPerCoin) body.usdPerCoin = usdPerCoin;
        if (Boolean(values.maintenanceMode) !== current.maintenanceMode) body.maintenanceMode = Boolean(values.maintenanceMode);
        if (Object.keys(body).length === 0) {
            showSuccessToast(t("admin.settings.platform.saved"));
            return;
        }

        try {
            const saved = await updateSettings.mutateAsync(body);
            methods.reset({
                supportEmail: saved.supportEmail,
                creatorSplit: saved.creatorSplit,
                usdPerCoin: saved.usdPerCoin,
                maintenanceMode: saved.maintenanceMode,
            });
            showSuccessToast(t("admin.settings.platform.saved"));
        } catch (cause) {
            showErrorToast(t("admin.settings.platform.save_failed"), apiErrorDetail(cause));
        }
    };

    return (
        <StudioCard title={t("admin.settings.platform.title")} subtitle={t("admin.settings.platform.subtitle")}>
            {settingsQuery.isPending ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress aria-label={t("status.loading")} />
                </Box>
            ) : settingsQuery.isError || !settingsQuery.data ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, py: 2 }}>
                    <Typography sx={{ color: "error.main" }}>{t("admin.settings.platform.load_failed")}</Typography>
                    <AppBtn customType="primary" type="button" onClick={() => settingsQuery.refetch()} sx={{ borderRadius: 999 }}>
                        {t("status.retry")}
                    </AppBtn>
                </Box>
            ) : (
                <FormWrapper methods={methods} onSubmit={onSubmit}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25, maxWidth: 560 }}>
                        <AppFormField name="supportEmail" type="email" label={t("admin.settings.platform.support_email")} showLable />
                        <AppFormField name="creatorSplit" type="number" label={t("admin.settings.platform.creator_split")} showLable />
                        <AppFormField name="usdPerCoin" type="number" label={t("admin.settings.platform.usd_per_coin")} showLable />
                        <AppFormField name="maintenanceMode" type="checkbox" label={t("admin.settings.platform.maintenance")} />
                        <AppBtn
                            customType="primary"
                            type="submit"
                            disabled={updateSettings.isPending}
                            sx={{ borderRadius: 999, alignSelf: "flex-start" }}
                        >
                            {t("admin.settings.platform.save")}
                        </AppBtn>
                    </Box>
                </FormWrapper>
            )}
        </StudioCard>
    );
}
