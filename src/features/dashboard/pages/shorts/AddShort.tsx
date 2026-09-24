import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import IosShareOutlined from "@mui/icons-material/IosShareOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import SmartphoneOutlined from "@mui/icons-material/SmartphoneOutlined";
import { Box, Button, CircularProgress, LinearProgress, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import { useTags } from "@/features/queryHooks/referenceData/useTags";
import { useCreateShort } from "@/features/queryHooks/shorts/useCreateShort";
import { useShort } from "@/features/queryHooks/shorts/useShort";
import { useUpdateShort } from "@/features/queryHooks/shorts/useUpdateShort";
import { useAuth } from "@/provider/AuthProvider";
import { updateShortSchema, type UpdateShortValues } from "@/schema";
import { btnIconSlotReset, btnIconStartSx } from "@/styles/btnStyle";
import SectionWrapper from "../../components/SectionWrapper";
import ShortFeedPreview from "../../components/shorts/ShortFeedPreview";

const SHORTS_MEDIA_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

function getShortMediaUrl(path?: string | null) {
    if (!path) return undefined;
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    return `${SHORTS_MEDIA_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

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
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { user } = useAuth();
    const tagsQuery = useTags();
    const shortQuery = useShort(id ?? "", isEdit);
    const createShort = useCreateShort();
    const updateShort = useUpdateShort();
    const [uploadProgress, setUploadProgress] = useState(0);
    const isSaving = createShort.isPending || updateShort.isPending;

    const methods = useForm<UpdateShortValues>({
        resolver: zodResolver(updateShortSchema),
        defaultValues: {
            title: "",
            summary: "",
            tags: [],
            video: undefined,
            posters: [],
        },
    });

    const title = useWatch({ control: methods.control, name: "title" });
    const video = useWatch({ control: methods.control, name: "video" });
    const creatorName = user?.name || t("dashboard.profile_name");

    useEffect(() => {
        if (!shortQuery.data) return;
        methods.reset({
            title: shortQuery.data.title,
            summary: shortQuery.data.description,
            tags: shortQuery.data.tagCodes,
            video: undefined,
            posters: [],
        });
    }, [methods, shortQuery.data]);

    useEffect(() => {
        if (!isSaving) return;

        const preventRefresh = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", preventRefresh);
        return () => window.removeEventListener("beforeunload", preventRefresh);
    }, [isSaving]);

    const polishTitle = () => {
        const next = methods.getValues("title").replace(/\s+/g, " ").trim();
        methods.setValue("title", next, { shouldValidate: true });
    };

    const saveDraft = () => {
        showSuccessToast(t("dashboard.shorts.publisher.draft_saved"));
    };

    const onSubmit = async (values: UpdateShortValues) => {
        if (!isEdit && !values.video) {
            methods.setError("video", { message: "dashboard.shorts.publisher.errors.video" });
            return;
        }

        setUploadProgress(0);

        try {
            if (isEdit && id) {
                await updateShort.mutateAsync({
                    id,
                    title: values.title,
                    description: values.summary,
                    tags: values.tags,
                    video: values.video,
                    cover: values.posters?.[0],
                    onUploadProgress: setUploadProgress,
                });
                showSuccessToast(t("dashboard.shorts.publisher.updated"));
            } else if (values.video) {
                await createShort.mutateAsync({
                    title: values.title,
                    description: values.summary,
                    tags: values.tags,
                    video: values.video,
                    cover: values.posters?.[0],
                    onUploadProgress: setUploadProgress,
                });
                showSuccessToast(t("dashboard.shorts.publisher.published"));
            }
            navigate("/dashboard/shorts");
        } catch (cause) {
            const detail = axios.isAxiosError(cause) ? cause.response?.data?.message : undefined;
            showErrorToast(
                t(
                    isEdit
                        ? "dashboard.shorts.publisher.errors.update_failed"
                        : "dashboard.shorts.publisher.errors.create_failed",
                ),
                detail,
            );
        } finally {
            setUploadProgress(0);
        }
    };

    const tagOptions = (tagsQuery.data ?? [])
        .filter((tag) => tag.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((tag) => ({
            value: tag.code,
            label: tag.label,
        }));
    const existingVideoUrl = getShortMediaUrl(shortQuery.data?.videoUrl);
    const existingCoverUrl = getShortMediaUrl(shortQuery.data?.coverUrl);

    if (isEdit && shortQuery.isPending) {
        return (
            <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
                <CircularProgress aria-label={t("status.loading")} />
            </Box>
        );
    }

    if (isEdit && shortQuery.isError) {
        return (
            <Box sx={{ minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <Typography sx={{ color: "error.main" }}>{t("dashboard.shorts.publisher.errors.load_failed")}</Typography>
                <Button onClick={() => shortQuery.refetch()} sx={{ borderRadius: 999 }}>
                    {t("status.retry")}
                </Button>
            </Box>
        );
    }

    return (
        <FormWrapper methods={methods} onSubmit={onSubmit}>
            {isSaving && (
                <Box
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="short-upload-title"
                    sx={{
                        position: "fixed",
                        inset: 0,
                        zIndex: (theme) => theme.zIndex.modal + 1,
                        display: "grid",
                        placeItems: "center",
                        p: 2,
                        bgcolor: (theme) => alpha(theme.palette.background.default, 0.72),
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <Box
                        sx={{
                            width: "min(440px, 100%)",
                            bgcolor: "background.paper",
                            borderRadius: "1rem",
                            boxShadow: (theme) => `0 18px 60px ${alpha(theme.palette.secondary.main, 0.2)}`,
                            p: { xs: 3, sm: 4 },
                            textAlign: "center",
                        }}
                    >
                        <Typography id="short-upload-title" sx={{ fontSize: 20, fontWeight: 800 }}>
                            {t("dashboard.shorts.publisher.uploading_title")}
                        </Typography>
                        <Typography sx={{ mt: 1, color: "text.secondary", lineHeight: 1.6 }}>
                            {t("dashboard.shorts.publisher.uploading_hint")}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                            aria-label={t("dashboard.shorts.publisher.uploading_progress")}
                            sx={{
                                mt: 3,
                                height: 10,
                                borderRadius: 999,
                                bgcolor: "surface.main",
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 999,
                                },
                            }}
                        />
                        <Typography sx={{ mt: 1.25, fontWeight: 800, color: "primary.main" }}>
                            {uploadProgress}%
                        </Typography>
                    </Box>
                </Box>
            )}

            <SectionWrapper
                title={t(isEdit ? "dashboard.shorts.publisher.edit_title" : "dashboard.shorts.publisher.title")}
                actions={[
                    ...(isEdit
                        ? []
                        : [
                              {
                                  label: t("dashboard.shorts.publisher.save_draft"),
                                  icon: SaveOutlined,
                                  variant: "outline" as const,
                                  onClick: saveDraft,
                                  disabled: isSaving,
                              },
                          ]),
                    {
                        label: t(
                            isEdit
                                ? "dashboard.shorts.publisher.save_changes"
                                : "dashboard.shorts.publisher.publish_feed",
                        ),
                        icon: isEdit ? SaveOutlined : IosShareOutlined,
                        type: "submit",
                        disabled: isSaving,
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
                        <ShortFeedPreview
                            title={title}
                            creatorName={creatorName}
                            video={video}
                            existingVideoUrl={existingVideoUrl}
                        />
                    </PublisherCard>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <PublisherCard
                            step="2"
                            title={t("dashboard.shorts.publisher.upload_title")}
                            subtitle={t("dashboard.shorts.publisher.upload_subtitle")}
                        >
                            {isEdit && (
                                <Typography sx={{ mb: 1.5, color: "text.secondary", fontSize: 13 }}>
                                    {t("dashboard.shorts.publisher.edit_media_hint")}
                                </Typography>
                            )}
                            <AppFormField
                                name="video"
                                type="upload"
                                label=""
                                placeholder={t("dashboard.shorts.publisher.drop_video")}
                                hint={t("dashboard.shorts.publisher.drop_hint")}
                                browseLabel={t("dashboard.shorts.publisher.browse")}
                                replaceLabel={t("dashboard.shorts.publisher.replace")}
                                accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                                existingMediaUrl={existingVideoUrl}
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
                                            startIcon={<AutoAwesomeOutlined sx={btnIconStartSx} />}
                                            sx={[
                                                btnIconSlotReset,
                                                {
                                                    borderRadius: 999,
                                                    color: "primary.main",
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                    px: 1.25,
                                                },
                                            ]}
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
                                    disabled={tagsQuery.isPending}
                                    freeSolo
                                />
                                <AppFormField
                                    name="posters"
                                    type="poster"
                                    label={t("dashboard.shorts.publisher.poster")}
                                    hint={t("dashboard.shorts.publisher.poster_hint")}
                                    accept="image/*"
                                    existingImageUrl={existingCoverUrl}
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
                            startIcon={<SmartphoneOutlined sx={btnIconStartSx} />}
                            sx={{ borderRadius: 999 }}
                        >
                            {t("dashboard.shorts.publisher.preview_student")}
                        </AppBtn>
                        <AppBtn
                            customType="primary"
                            type="submit"
                            disabled={isSaving}
                            startIcon={
                                isEdit ? (
                                    <SaveOutlined sx={btnIconStartSx} />
                                ) : (
                                    <IosShareOutlined sx={btnIconStartSx} />
                                )
                            }
                            sx={{ borderRadius: 999 }}
                        >
                            {t(
                                isEdit
                                    ? "dashboard.shorts.publisher.save_changes"
                                    : "dashboard.shorts.publisher.publish_now",
                            )}
                        </AppBtn>
                    </Box>
                </Box>
            </SectionWrapper>
        </FormWrapper>
    );
}
