import LockOutlined from "@mui/icons-material/LockOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import { Box } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import { passwordSettingsSchema, type PasswordSettingsValues } from "@/schema";
import { btnIconStartSx } from "@/styles/btnStyle";
import StudioCard from "../../components/StudioCard";

export default function PasswordSettingsCard() {
    const { t } = useTranslation();

    const methods = useForm<PasswordSettingsValues>({
        resolver: zodResolver(passwordSettingsSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = () => {
        methods.reset({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        showSuccessToast(t("dashboard.settings.password.saved"));
    };

    return (
        <StudioCard title={t("dashboard.settings.password.title")} subtitle={t("dashboard.settings.password.subtitle")}>
            <FormWrapper methods={methods} onSubmit={onSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25, maxWidth: 520 }}>
                    <AppFormField
                        name="currentPassword"
                        type="password"
                        label={t("dashboard.settings.password.current")}
                        placeholder={t("dashboard.settings.password.current_placeholder")}
                        startIcon={<LockOutlined sx={{ fontSize: 18 }} />}
                    />
                    <AppFormField
                        name="newPassword"
                        type="passwordWithBar"
                        label={t("dashboard.settings.password.next")}
                        placeholder={t("dashboard.settings.password.next_placeholder")}
                        startIcon={<LockOutlined sx={{ fontSize: 18 }} />}
                    />
                    <AppFormField
                        name="confirmPassword"
                        type="password"
                        label={t("dashboard.settings.password.confirm")}
                        placeholder={t("dashboard.settings.password.confirm_placeholder")}
                        startIcon={<LockOutlined sx={{ fontSize: 18 }} />}
                    />
                    <Box sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-end" } }}>
                        <AppBtn
                            type="submit"
                            customType="primary"
                            startIcon={<SaveOutlined sx={btnIconStartSx} />}
                            sx={{ borderRadius: 999, px: 2.25, py: 1 }}
                        >
                            {t("dashboard.settings.password.save")}
                        </AppBtn>
                    </Box>
                </Box>
            </FormWrapper>
        </StudioCard>
    );
}
