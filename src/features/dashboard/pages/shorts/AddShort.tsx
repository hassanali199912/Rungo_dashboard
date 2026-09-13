import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import IosShareOutlined from "@mui/icons-material/IosShareOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import SmartphoneOutlined from "@mui/icons-material/SmartphoneOutlined";
import { Box, Button, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import { useAuth } from "@/provider/AuthProvider";
import { addShortSchema, type AddShortValues } from "@/schema";
import SectionWrapper from "../../components/SectionWrapper";
import ShortFeedPreview from "../../components/shorts/ShortFeedPreview";

function PublisherCard({
    step,
    title,
    subtitle,
    children,
}: {
    step: string;
    title: string;
    subtitle: string;
    children: ReactNode;
}) {
    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                borderRadius: "1rem",
                boxShadow: (theme) => `0 2px 12px 0 ${alpha(theme.palette.secondary.main, 0.06)}`,
                p: { xs: 2, md: 2.5 },
            }}
        >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, mb: 2.5 }}>
                <Box
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: "surface.main",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 13,
                        fontWeight: 800,
                        flexShrink: 0,
                    }}
                >
                    {step}
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 16 }}>{title}</Typography>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}>{subtitle}</Typography>
                </Box>
            </Box>
            {children}
        </Box>
    );
}

export default function AddShort() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const methods = useForm<AddShortValues>({
        resolver: zodResolver(addShortSchema),
        defaultValues: {
            title: t("dashboard.shorts.publisher.default_title"),
            summary: t("dashboard.shorts.publisher.default_summary"),
            tags: ["frontend-architecture", "react", "javascript"],
            posters: [],
        },
    });

    const title = useWatch({ control: methods.control, name: "title" });
    const video = useWatch({ control: methods.control, name: "video" });
    const creatorName = user?.name || t("dashboard.profile_name");

    const polishTitle = () => {
        const next = methods.getValues("title").replace(/\s+/g, " ").trim();
        methods.setValue("title", next, { shouldValidate: true });
    };

    const saveDraft = () => {
        showSuccessToast(t("dashboard.shorts.publisher.draft_saved"));
    };

    const onSubmit = () => {
        showSuccessToast(t("dashboard.shorts.publisher.published"));
        navigate("/dashboard/shorts");
    };

    const tagOptions = [
        { value: "frontend-architecture", label: t("dashboard.shorts.publisher.tag_frontend") },
        { value: "react", label: t("dashboard.shorts.publisher.tag_react") },
        { value: "javascript", label: t("dashboard.shorts.publisher.tag_js") },
        { value: "performance", label: t("dashboard.shorts.publisher.tag_performance") },
    ];

    return (
        <FormWrapper methods={methods} onSubmit={onSubmit}>
            <SectionWrapper
                title={t("dashboard.shorts.publisher.title")}
                actions={[
                    {
                        label: t("dashboard.shorts.publisher.save_draft"),
                        icon: SaveOutlined,
                        variant: "outline",
                        onClick: saveDraft,
                    },
                    {
                        label: t("dashboard.shorts.publisher.publish_feed"),
                        icon: IosShareOutlined,
                        type: "submit",
                    },
                ]}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
                        gap: 2.5,
                        alignItems: "start",
                    }}
                >
                    <PublisherCard
                        step="1"
                        title={t("dashboard.shorts.publisher.preview_title")}
                        subtitle={t("dashboard.shorts.publisher.preview_subtitle")}
                    >
                        <ShortFeedPreview title={title} creatorName={creatorName} video={video} />
                    </PublisherCard>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <PublisherCard
                            step="2"
                            title={t("dashboard.shorts.publisher.upload_title")}
                            subtitle={t("dashboard.shorts.publisher.upload_subtitle")}
                        >
                            <AppFormField
                                name="video"
                                type="upload"
                                label=""
                                placeholder={t("dashboard.shorts.publisher.drop_video")}
                                hint={t("dashboard.shorts.publisher.drop_hint")}
                                browseLabel={t("dashboard.shorts.publisher.browse")}
                                replaceLabel={t("dashboard.shorts.publisher.replace")}
                                accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                            />
                        </PublisherCard>

                        <PublisherCard
                            step="3"
                            title={t("dashboard.shorts.publisher.meta_title")}
                            subtitle={t("dashboard.shorts.publisher.meta_subtitle")}
                        >
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                                <AppFormField
                                    name="title"
                                    type="text"
                                    label={t("dashboard.shorts.publisher.video_title")}
                                    placeholder={t("dashboard.shorts.publisher.video_title_placeholder")}
                                    maxLength={70}
                                    endAction={
                                        <Button
                                            type="button"
                                            onClick={polishTitle}
                                            startIcon={<AutoAwesomeOutlined sx={{ fontSize: 16 }} />}
                                            sx={{
                                                borderRadius: 999,
                                                color: "primary.main",
                                                fontWeight: 700,
                                                textTransform: "none",
                                                px: 1.25,
                                            }}
                                        >
                                            {t("dashboard.shorts.publisher.polish")}
                                        </Button>
                                    }
                                />
                                <AppFormField
                                    name="summary"
                                    type="textarea"
                                    label={t("dashboard.shorts.publisher.summary")}
                                    placeholder={t("dashboard.shorts.publisher.summary_placeholder")}
                                    minRows={4}
                                />
                                <AppFormField
                                    name="tags"
                                    type="multiAutocomplete"
                                    label={t("dashboard.shorts.publisher.tags")}
                                    placeholder={t("dashboard.shorts.publisher.add_tag")}
                                    options={tagOptions}
                                    freeSolo
                                />
                                <AppFormField
                                    name="posters"
                                    type="poster"
                                    label={t("dashboard.shorts.publisher.poster")}
                                    hint={t("dashboard.shorts.publisher.poster_hint")}
                                    accept="image/*"
                                />
                            </Box>
                        </PublisherCard>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        mt: 3,
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        {t("dashboard.shorts.publisher.autosave")}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <AppBtn
                            customType="outline"
                            type="button"
                            startIcon={<SmartphoneOutlined sx={{ fontSize: 18 }} />}
                            sx={{ borderRadius: 999 }}
                        >
                            {t("dashboard.shorts.publisher.preview_student")}
                        </AppBtn>
                        <AppBtn
                            customType="primary"
                            type="submit"
                            startIcon={<IosShareOutlined sx={{ fontSize: 18 }} />}
                            sx={{ borderRadius: 999 }}
                        >
                            {t("dashboard.shorts.publisher.publish_now")}
                        </AppBtn>
                    </Box>
                </Box>
            </SectionWrapper>
        </FormWrapper>
    );
}
