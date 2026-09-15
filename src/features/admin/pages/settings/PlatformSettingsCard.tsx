import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import StudioCard from "@/features/dashboard/components/StudioCard";
import { getPlatformSettings, savePlatformSettings } from "../../data/adminStore";
import type { PlatformSettings } from "../../data/adminTypes";

export default function PlatformSettingsCard() {
    const { t } = useTranslation();
    const methods = useForm<PlatformSettings>({
        defaultValues: getPlatformSettings(),
    });

    const onSubmit = (values: PlatformSettings) => {
        savePlatformSettings({
            supportEmail: values.supportEmail,
            creatorSplit: Number(values.creatorSplit) || 0,
            usdPerCoin: Number(values.usdPerCoin) || 0,
            maintenance: Boolean(values.maintenance),
        });
        showSuccessToast(t("admin.settings.platform.saved"));
    };

    return (
        <StudioCard title={t("admin.settings.platform.title")} subtitle={t("admin.settings.platform.subtitle")}>
            <FormWrapper methods={methods} onSubmit={onSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25, maxWidth: 560 }}>
                    <AppFormField name="supportEmail" type="email" label={t("admin.settings.platform.support_email")} showLable />
                    <AppFormField name="creatorSplit" type="number" label={t("admin.settings.platform.creator_split")} showLable />
                    <AppFormField name="usdPerCoin" type="number" label={t("admin.settings.platform.usd_per_coin")} showLable />
                    <AppFormField name="maintenance" type="checkbox" label={t("admin.settings.platform.maintenance")} />
                    <AppBtn customType="primary" type="submit" sx={{ borderRadius: 999, alignSelf: "flex-start" }}>
                        {t("admin.settings.platform.save")}
                    </AppBtn>
                </Box>
            </FormWrapper>
        </StudioCard>
    );
}
