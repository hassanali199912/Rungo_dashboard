import IosShareOutlined from "@mui/icons-material/IosShareOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm, useWatch, type DefaultValues, type Resolver } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import { useCreateCourse } from "@/features/queryHooks/courses/useCreateCourse";
import { useCourseOutline } from "@/features/queryHooks/courses/useCourseOutline";
import { useUpdateCourse, type UpdateCourseInput } from "@/features/queryHooks/courses/useUpdateCourse";
import type { CourseOutline } from "@/features/queryHooks/courses/types";
import { useTags } from "@/features/queryHooks/referenceData/useTags";
import { addCourseSchema, editCourseSchema, type AddCourseValues } from "@/schema";
import CourseCoverField from "../../components/courses/CourseCoverField";
import CurriculumBuilder from "../../components/courses/CurriculumBuilder";
import SectionWrapper from "../../components/SectionWrapper";
import StudioCard from "../../components/StudioCard";

const COURSE_MEDIA_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

function getCourseMediaUrl(path: string | null | undefined) {
    if (!path) return undefined;
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    return `${COURSE_MEDIA_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

function errorDetail(cause: unknown) {
    if (!axios.isAxiosError(cause)) return undefined;
    const message = cause.response?.data?.message;
    return typeof message === "string" ? message : undefined;
}

function changedCardFields(
    values: Pick<AddCourseValues, "title" | "description" | "tags" | "coinPrice"> & { cover?: File },
    baseline: DefaultValues<AddCourseValues> | undefined,
): Omit<UpdateCourseInput, "courseId"> {
    const changes: Omit<UpdateCourseInput, "courseId"> = {};
    if ((baseline?.title ?? "") !== values.title) changes.title = values.title;
    if ((baseline?.description ?? "") !== values.description) changes.description = values.description;

    const baseTags = baseline?.tags ?? [];
    const nextTags = values.tags ?? [];
    if (baseTags.length !== nextTags.length || baseTags.some((tag, index) => tag !== nextTags[index])) {
        changes.tags = nextTags;
    }

    if (Number(baseline?.coinPrice ?? 0) !== Number(values.coinPrice)) changes.price = Number(values.coinPrice);
    if (values.cover instanceof File && values.cover !== baseline?.cover) changes.cover = values.cover;
    return changes;
}

function outlineToForm(course: CourseOutline): AddCourseValues {
    return {
        title: course.title,
        description: course.description,
        tags: course.tagCodes ?? [],
        coinPrice: course.price,
        chapters: [...(course.chapters ?? [])]
            .sort((left, right) => left.position - right.position)
            .map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                lessons: [...(chapter.shorts ?? [])]
                    .sort((left, right) => left.position - right.position)
                    .map((lesson) => ({
                        id: lesson.id,
                        shortId: lesson.shortId,
                        title: lesson.title,
                        duration: "—",
                        access: course.price === 0 ? ("free" as const) : ("coins" as const),
                        videoUrl: lesson.videoUrl,
                    })),
            })),
    } as AddCourseValues;
}

function createDefaults(): DefaultValues<AddCourseValues> {
    return {
        title: "",
        description: "",
        tags: [],
        coinPrice: 0,
        chapters: [],
    };
}

export default function AddCourse() {
    const { courseId } = useParams();
    if (courseId) return <CourseEditor courseId={courseId} />;
    return <CourseForm />;
}

function CourseEditor({ courseId }: { courseId: string }) {
    const { t } = useTranslation();
    const outlineQuery = useCourseOutline(courseId);

    if (outlineQuery.isPending) {
        return (
            <SectionWrapper title={t("dashboard.courses.builder.edit_title")}>
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress aria-label={t("status.loading")} />
                </Box>
            </SectionWrapper>
        );
    }

    if (outlineQuery.isError || !outlineQuery.data) {
        return (
            <SectionWrapper title={t("dashboard.courses.builder.edit_title")}>
                <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ color: "error.main", textAlign: "center" }}>
                        {t("dashboard.courses.builder.errors.outline_load_error")}
                    </Typography>
                    <Button onClick={() => outlineQuery.refetch()} sx={{ borderRadius: 999 }}>
                        {t("status.retry")}
                    </Button>
                </Box>
            </SectionWrapper>
        );
    }

    return (
        <CourseForm
            courseId={courseId}
            defaultValues={outlineToForm(outlineQuery.data)}
            existingCoverUrl={getCourseMediaUrl(outlineQuery.data.coverUrl)}
            published={Boolean(outlineQuery.data.publishedAt)}
        />
    );
}

function CourseForm({
    courseId,
    defaultValues,
    existingCoverUrl,
    published = false,
}: {
    courseId?: string;
    defaultValues?: AddCourseValues;
    existingCoverUrl?: string;
    published?: boolean;
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isEdit = Boolean(courseId);
    const createCourse = useCreateCourse();
    const updateCourse = useUpdateCourse();
    const tagsQuery = useTags();
    const isSaving = createCourse.isPending || updateCourse.isPending;

    const methods = useForm<AddCourseValues>({
        resolver: (isEdit ? zodResolver(editCourseSchema) : zodResolver(addCourseSchema)) as Resolver<AddCourseValues>,
        defaultValues: defaultValues ?? createDefaults(),
    });

    const title = useWatch({ control: methods.control, name: "title" });
    const description = useWatch({ control: methods.control, name: "description" });
    const tags = useWatch({ control: methods.control, name: "tags" });
    const coinPrice = useWatch({ control: methods.control, name: "coinPrice" });
    const cover = useWatch({ control: methods.control, name: "cover" });
    const essentialsDone = [title, description].filter((value) => String(value ?? "").trim()).length;
    const { defaultValues: savedCard } = methods.formState;
    const cardChanged =
        isEdit &&
        Object.keys(
            changedCardFields(
                {
                    title: title ?? "",
                    description: description ?? "",
                    tags: tags ?? [],
                    coinPrice,
                    cover: cover instanceof File ? cover : undefined,
                },
                savedCard,
            ),
        ).length > 0;

    const tagOptions = (tagsQuery.data ?? [])
        .filter((tag) => tag.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((tag) => ({
            value: tag.code,
            label: tag.label,
        }));

    const usdHint =
        Number(coinPrice) > 0
            ? t("dashboard.courses.builder.usd_hint", { amount: (Number(coinPrice) * 0.05).toFixed(2) })
            : "";

    const onSubmit = async (values: AddCourseValues) => {
        if (isEdit && courseId) {
            const changes = changedCardFields(values, methods.formState.defaultValues);
            if (Object.keys(changes).length === 0) {
                showSuccessToast(t("dashboard.courses.builder.unchanged"));
                return;
            }
            try {
                await updateCourse.mutateAsync({ courseId, ...changes });
                methods.reset(values);
                showSuccessToast(t("dashboard.courses.builder.saved"));
            } catch (cause) {
                showErrorToast(t("dashboard.courses.builder.errors.update_failed"), errorDetail(cause));
            }
            return;
        }

        try {
            const created = await createCourse.mutateAsync({
                title: values.title,
                description: values.description,
                tags: values.tags,
                price: values.coinPrice,
                cover: values.cover,
            });
            showSuccessToast(t("dashboard.courses.builder.created"));
            navigate(`/dashboard/courses/${created.id}`);
        } catch (cause) {
            showErrorToast(t("dashboard.courses.builder.errors.create_failed"), errorDetail(cause));
        }
    };

    const setPublished = async (next: boolean) => {
        if (!courseId) return;
        try {
            await updateCourse.mutateAsync({ courseId, published: next });
            showSuccessToast(t(next ? "dashboard.courses.builder.published" : "dashboard.courses.builder.unpublished"));
        } catch (cause) {
            showErrorToast(t("dashboard.courses.builder.errors.update_failed"), errorDetail(cause));
        }
    };

    return (
        <FormWrapper methods={methods} onSubmit={onSubmit}>
            <SectionWrapper
                title={t(isEdit ? "dashboard.courses.builder.edit_title" : "dashboard.courses.builder.title")}
                description={t(isEdit ? "dashboard.courses.builder.edit_subtitle" : "dashboard.courses.builder.page_subtitle")}
                actions={
                    isEdit
                        ? [
                            {
                                label: t("dashboard.courses.builder.back_to_courses"),
                                to: "/dashboard/courses",
                                variant: "outline",
                                disabled: isSaving,
                            },
                            ...(cardChanged
                                ? [
                                    {
                                        label: t("dashboard.courses.builder.save"),
                                        icon: SaveOutlined,
                                        variant: "outline" as const,
                                        type: "submit" as const,
                                        disabled: isSaving,
                                    },
                                ]
                                : []),
                            published
                                ? {
                                    label: t("dashboard.courses.builder.unpublish"),
                                    icon: VisibilityOffOutlined,
                                    variant: "outline",
                                    onClick: () => void methods.handleSubmit(() => setPublished(false))(),
                                    disabled: isSaving,
                                }
                                : {
                                    label: t("dashboard.courses.builder.publish"),
                                    icon: IosShareOutlined,
                                    type: "button",
                                    onClick: () => void methods.handleSubmit(() => setPublished(true))(),
                                    disabled: isSaving,
                                },
                        ]
                        : [
                            {
                                label: t("dashboard.courses.builder.save_draft"),
                                icon: SaveOutlined,
                                variant: "outline",
                                onClick: () => void methods.handleSubmit(onSubmit)(),
                                disabled: isSaving,
                            },
                            {
                                label: t("dashboard.courses.builder.create"),
                                icon: IosShareOutlined,
                                type: "submit",
                                disabled: isSaving,
                            },
                        ]
                }
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: isEdit
                            ? { xs: "1fr", lg: "minmax(0, 0.92fr) minmax(0, 1.08fr)" }
                            : "2fr",
                        gap: 2.5,
                        alignItems: "start",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <StudioCard
                            title={t("dashboard.courses.builder.essentials_title")}
                            subtitle={t("dashboard.courses.builder.essentials_progress", {
                                done: essentialsDone,
                                total: 2,
                            })}
                        >
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                                <AppFormField
                                    name="title"
                                    type="text"
                                    label={t("dashboard.courses.builder.track_title")}
                                    placeholder={t("dashboard.courses.builder.track_title_placeholder")}
                                    maxLength={120}
                                />
                                <AppFormField
                                    name="description"
                                    type="textarea"
                                    label={t("dashboard.courses.builder.module_description")}
                                    placeholder={t("dashboard.courses.builder.module_description_placeholder")}
                                    minRows={4}
                                />
                                <AppFormField
                                    name="tags"
                                    type="multiAutocomplete"
                                    label={t("dashboard.courses.builder.category")}
                                    placeholder={t("dashboard.courses.builder.add_category")}
                                    options={tagOptions}
                                    disabled={tagsQuery.isPending}
                                />
                                <CourseCoverField
                                    name="cover"
                                    label={t("dashboard.courses.builder.cover")}
                                    hint={t("dashboard.courses.builder.cover_hint")}
                                    changeLabel={t("dashboard.courses.builder.change_cover")}
                                    existingImageUrl={existingCoverUrl}
                                />
                            </Box>
                        </StudioCard>

                        <StudioCard
                            title={t("dashboard.courses.builder.pricing_title")}
                            subtitle={t("dashboard.courses.builder.pricing_subtitle")}
                        >
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                                <AppFormField
                                    name="coinPrice"
                                    type="number"
                                    label={t("dashboard.courses.builder.unlock_bundle")}
                                    placeholder="150"
                                />
                                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                    {t("dashboard.courses.builder.unlock_hint")}
                                    {usdHint ? ` ${usdHint}` : ""}
                                </Typography>
                            </Box>
                        </StudioCard>
                    </Box>

                    {isEdit ? <CurriculumBuilder courseId={courseId} /> : null}
                </Box>
            </SectionWrapper>
        </FormWrapper>
    );
}
