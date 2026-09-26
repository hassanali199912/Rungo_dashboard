import Code from "@mui/icons-material/Code";
import Facebook from "@mui/icons-material/Facebook";
import GitHub from "@mui/icons-material/GitHub";
import Instagram from "@mui/icons-material/Instagram";
import LinkOutlined from "@mui/icons-material/LinkOutlined";
import LinkedIn from "@mui/icons-material/LinkedIn";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import X from "@mui/icons-material/X";
import YouTube from "@mui/icons-material/YouTube";
import { Box, Typography } from "@mui/material";
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
            linkedin: "",
            github: "",
            facebook: "",
            youtube: "",
            x: "",
            instagram: "",
        },
    });

    useEffect(() => {
        const stored = loadProfile();
        methods.reset({
            name: stored?.name || user?.name || "",
            email: stored?.email || user?.email || "",
            expertise: stored?.expertise || "",
            portfolio: stored?.portfolio || "",
            linkedin: stored?.linkedin || "",
            github: stored?.github || "",
            facebook: stored?.facebook || "",
            youtube: stored?.youtube || "",
            x: stored?.x || "",
            instagram: stored?.instagram || "",
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
            linkedin: values.linkedin,
            github: values.github,
            facebook: values.facebook,
            youtube: values.youtube,
            x: values.x,
            instagram: values.instagram,
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
                    <Typography sx={{ fontWeight: 800, fontSize: 15, mt: 0.5 }}>
                        {t("dashboard.settings.profile.social_title")}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 2,
                        }}
                    >
                        <AppFormField
                            name="linkedin"
                            type="text"
                            label={t("dashboard.settings.profile.linkedin")}
                            placeholder={t("dashboard.settings.profile.linkedin_placeholder")}
                            startIcon={<LinkedIn sx={{ fontSize: 18 }} />}
                        />
                        <AppFormField
                            name="github"
                            type="text"
                            label={t("dashboard.settings.profile.github")}
                            placeholder={t("dashboard.settings.profile.github_placeholder")}
                            startIcon={<GitHub sx={{ fontSize: 18 }} />}
                        />
                        <AppFormField
                            name="facebook"
                            type="text"
                            label={t("dashboard.settings.profile.facebook")}
                            placeholder={t("dashboard.settings.profile.facebook_placeholder")}
                            startIcon={<Facebook sx={{ fontSize: 18 }} />}
                        />
                        <AppFormField
                            name="youtube"
                            type="text"
                            label={t("dashboard.settings.profile.youtube")}
                            placeholder={t("dashboard.settings.profile.youtube_placeholder")}
                            startIcon={<YouTube sx={{ fontSize: 18 }} />}
                        />
                        <AppFormField
                            name="x"
                            type="text"
                            label={t("dashboard.settings.profile.x")}
                            placeholder={t("dashboard.settings.profile.x_placeholder")}
                            startIcon={<X sx={{ fontSize: 18 }} />}
                        />
                        <AppFormField
                            name="instagram"
                            type="text"
                            label={t("dashboard.settings.profile.instagram")}
                            placeholder={t("dashboard.settings.profile.instagram_placeholder")}
                            startIcon={<Instagram sx={{ fontSize: 18 }} />}
                        />
                    </Box>
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
