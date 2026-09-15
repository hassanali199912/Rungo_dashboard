import Code from "@mui/icons-material/Code";
import LinkOutlined from "@mui/icons-material/LinkOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import { Box } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import { useAuth } from "@/provider/AuthProvider";
import { profileSettingsSchema, type ProfileSettingsValues } from "@/schema";
import { btnIconStartSx } from "@/styles/btnStyle";
import StudioCard from "../../components/StudioCard";
import { loadProfile, saveProfile } from "./settingsStorage";

export default function ProfileSettingsCard() {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();

    const methods = useForm<ProfileSettingsValues>({
        resolver: zodResolver(profileSettingsSchema),
        defaultValues: {
            name: "",
            email: "",
            expertise: "",
            portfolio: "",
        },
    });

    useEffect(() => {
        const stored = loadProfile();
        methods.reset({
            name: stored?.name || user?.name || "",
            email: stored?.email || user?.email || "",
            expertise: stored?.expertise || "",
            portfolio: stored?.portfolio || "",
        });
    }, [methods, user]);

    const domainOptions = [
        { value: "frontend", label: t("auth.domains.frontend") },
        { value: "sports", label: t("auth.domains.sports") },
        { value: "fitness", label: t("auth.domains.fitness") },
        { value: "design", label: t("auth.domains.design") },
        { value: "business", label: t("auth.domains.business") },
        { value: "education", label: t("auth.domains.education") },
    ];

    const onSubmit = (values: ProfileSettingsValues) => {
        saveProfile({
            name: values.name,
            email: values.email,
            expertise: values.expertise,
            portfolio: values.portfolio,
        });
        updateUser({ name: values.name, email: values.email });
        showSuccessToast(t("dashboard.settings.profile.saved"));
    };

    return (
        <StudioCard title={t("dashboard.settings.profile.title")} subtitle={t("dashboard.settings.profile.subtitle")}>
            <FormWrapper methods={methods} onSubmit={onSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                    <AppFormField
                        name="avatar"
                        type="profileImage"
                        label={t("dashboard.settings.profile.avatar")}
                        showLable
                    />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 2,
                        }}
                    >
                        <AppFormField
                            name="name"
                            type="text"
                            label={t("auth.register.name")}
                            placeholder={t("auth.register.name_placeholder")}
                            startIcon={<PersonOutlined sx={{ fontSize: 18 }} />}
                        />
                        <AppFormField
                            name="email"
                            type="emailStatus"
                            label={t("auth.register.email")}
                            placeholder={t("auth.register.email_placeholder")}
                            emailStatus="verified"
                        />
                    </Box>
                    <AppFormField
                        name="expertise"
                        type="autocomplete"
                        label={t("auth.register.expertise")}
                        placeholder={t("auth.register.expertise_placeholder")}
                        options={domainOptions}
                        startIcon={<Code sx={{ fontSize: 18 }} />}
                    />
                    <AppFormField
                        name="portfolio"
                        type="text"
                        label={t("auth.register.portfolio")}
                        placeholder={t("auth.register.portfolio_placeholder")}
                        startIcon={<LinkOutlined sx={{ fontSize: 18 }} />}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <AppBtn
                            type="submit"
                            customType="primary"
                            startIcon={<SaveOutlined sx={btnIconStartSx} />}
                            sx={{ borderRadius: 999, px: 2.25, py: 1 }}
                        >
                            {t("dashboard.settings.profile.save")}
                        </AppBtn>
                    </Box>
                </Box>
            </FormWrapper>
        </StudioCard>
    );
}
