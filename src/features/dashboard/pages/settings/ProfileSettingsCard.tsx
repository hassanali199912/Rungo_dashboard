import Code from "@mui/icons-material/Code";
import Facebook from "@mui/icons-material/Facebook";
import GitHub from "@mui/icons-material/GitHub";
import Instagram from "@mui/icons-material/Instagram";
import LinkedIn from "@mui/icons-material/LinkedIn";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import X from "@mui/icons-material/X";
import YouTube from "@mui/icons-material/YouTube";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import type { InstructorProfile } from "@/features/queryHooks/profile/types";
import { useMyProfile } from "@/features/queryHooks/profile/useMyProfile";
import { useUpdateProfile } from "@/features/queryHooks/profile/useUpdateProfile";
import { useMajors } from "@/features/queryHooks/referenceData/useMajors";
import { useAuth } from "@/provider/AuthProvider";
import { profileSettingsSchema, type ProfileSettingsValues } from "@/schema";
import { btnIconStartSx } from "@/styles/btnStyle";
import StudioCard from "../../components/StudioCard";

const MEDIA_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

function mediaUrl(path: string | null | undefined) {
    if (!path) return "";
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    return `${MEDIA_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

function errorDetail(cause: unknown) {
    if (!axios.isAxiosError(cause)) return undefined;
    const message = cause.response?.data?.message;
    return typeof message === "string" ? message : undefined;
}

function toForm(profile: InstructorProfile): ProfileSettingsValues {
    return {
        avatar: mediaUrl(profile.avatarUrl),
        name: profile.displayName ?? "",
        email: profile.email ?? "",
        expertise: profile.majorCode ?? "",
        bio: profile.bio ?? "",
        linkedin: profile.linkedinUrl ?? "",
        github: profile.githubUrl ?? "",
        facebook: profile.facebookUrl ?? "",
        youtube: profile.youtubeUrl ?? "",
        x: profile.twitterUrl ?? "",
        instagram: profile.instagramUrl ?? "",
    };
}

export default function ProfileSettingsCard() {
    const { t } = useTranslation();
    const { updateUser } = useAuth();
    const profileQuery = useMyProfile();
    const updateProfile = useUpdateProfile();
    const majorsQuery = useMajors();

    const methods = useForm<ProfileSettingsValues>({
        resolver: zodResolver(profileSettingsSchema) as Resolver<ProfileSettingsValues>,
        defaultValues: {
            name: "",
            email: "",
            expertise: "",
            bio: "",
            linkedin: "",
            github: "",
            facebook: "",
            youtube: "",
            x: "",
            instagram: "",
        },
    });

    useEffect(() => {
        if (!profileQuery.data) return;
        methods.reset(toForm(profileQuery.data));
    }, [methods, profileQuery.data]);

    const majorOptions = (majorsQuery.data ?? [])
        .filter((major) => major.isActive)
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((major) => ({
            value: major.code,
            label: major.label,
        }));

    const onSubmit = async (values: ProfileSettingsValues) => {
        try {
            const saved = await updateProfile.mutateAsync({
                displayName: values.name.trim(),
                bio: values.bio.trim(),
                majorCode: values.expertise,
                twitterUrl: values.x.trim(),
                instagramUrl: values.instagram.trim(),
                facebookUrl: values.facebook.trim(),
                linkedinUrl: values.linkedin.trim(),
                youtubeUrl: values.youtube.trim(),
                githubUrl: values.github.trim(),
                avatar: values.avatar instanceof File ? values.avatar : undefined,
            });
            methods.reset(toForm(saved));
            updateUser({
                name: saved.displayName,
                avatarUrl: mediaUrl(saved.avatarUrl) || null,
            });
            showSuccessToast(t("dashboard.settings.profile.saved"));
        } catch (cause) {
            showErrorToast(t("dashboard.settings.errors.profile_save"), errorDetail(cause));
        }
    };

    return (
        <StudioCard title={t("dashboard.settings.profile.title")} subtitle={t("dashboard.settings.profile.subtitle")}>
            {profileQuery.isPending ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress aria-label={t("status.loading")} />
                </Box>
            ) : profileQuery.isError ? (
                <Box sx={{ py: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ color: "error.main", textAlign: "center" }}>
                        {t("dashboard.settings.errors.profile_load")}
                    </Typography>
                    <Button onClick={() => profileQuery.refetch()} sx={{ borderRadius: 999 }}>
                        {t("status.retry")}
                    </Button>
                </Box>
            ) : (
                <FormWrapper methods={methods} onSubmit={onSubmit}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                        <AppFormField
                            name="avatar"
                            type="profileImage"
                            label={t("dashboard.settings.profile.avatar")}
                            showLable
                            disabled={updateProfile.isPending}
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
                                maxLength={100}
                                disabled={updateProfile.isPending}
                            />
                            <AppFormField
                                name="email"
                                type="email"
                                label={t("auth.register.email")}
                                placeholder={t("auth.register.email_placeholder")}
                                disabled
                            />
                        </Box>
                        <AppFormField
                            name="expertise"
                            type="autocomplete"
                            label={t("auth.register.expertise")}
                            placeholder={t("auth.register.expertise_placeholder")}
                            options={majorOptions}
                            startIcon={<Code sx={{ fontSize: 18 }} />}
                            disabled={updateProfile.isPending || majorsQuery.isPending}
                        />
                        <AppFormField
                            name="bio"
                            type="textarea"
                            label={t("dashboard.settings.profile.bio")}
                            placeholder={t("dashboard.settings.profile.bio_placeholder")}
                            minRows={4}
                            disabled={updateProfile.isPending}
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
                                disabled={updateProfile.isPending}
                            />
                            <AppFormField
                                name="github"
                                type="text"
                                label={t("dashboard.settings.profile.github")}
                                placeholder={t("dashboard.settings.profile.github_placeholder")}
                                startIcon={<GitHub sx={{ fontSize: 18 }} />}
                                disabled={updateProfile.isPending}
                            />
                            <AppFormField
                                name="facebook"
                                type="text"
                                label={t("dashboard.settings.profile.facebook")}
                                placeholder={t("dashboard.settings.profile.facebook_placeholder")}
                                startIcon={<Facebook sx={{ fontSize: 18 }} />}
                                disabled={updateProfile.isPending}
                            />
                            <AppFormField
                                name="youtube"
                                type="text"
                                label={t("dashboard.settings.profile.youtube")}
                                placeholder={t("dashboard.settings.profile.youtube_placeholder")}
                                startIcon={<YouTube sx={{ fontSize: 18 }} />}
                                disabled={updateProfile.isPending}
                            />
                            <AppFormField
                                name="x"
                                type="text"
                                label={t("dashboard.settings.profile.x")}
                                placeholder={t("dashboard.settings.profile.x_placeholder")}
                                startIcon={<X sx={{ fontSize: 18 }} />}
                                disabled={updateProfile.isPending}
                            />
                            <AppFormField
                                name="instagram"
                                type="text"
                                label={t("dashboard.settings.profile.instagram")}
                                placeholder={t("dashboard.settings.profile.instagram_placeholder")}
                                startIcon={<Instagram sx={{ fontSize: 18 }} />}
                                disabled={updateProfile.isPending}
                            />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <AppBtn
                                type="submit"
                                customType="primary"
                                disabled={updateProfile.isPending}
                                startIcon={<SaveOutlined sx={btnIconStartSx} />}
                                sx={{ borderRadius: 999, px: 2.25, py: 1 }}
                            >
                                {t("dashboard.settings.profile.save")}
                            </AppBtn>
                        </Box>
                    </Box>
                </FormWrapper>
            )}
        </StudioCard>
    );
}
