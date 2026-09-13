import IosShareOutlined from "@mui/icons-material/IosShareOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import { Box, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import { showSuccessToast } from "@/components/ui/appToast";
import { addCourseSchema, type AddCourseValues } from "@/schema";
import CourseCoverField from "../../components/courses/CourseCoverField";
import CurriculumBuilder from "../../components/courses/CurriculumBuilder";
import SectionWrapper from "../../components/SectionWrapper";
import StudioCard from "../../components/StudioCard";

export default function AddCourse() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const methods = useForm<AddCourseValues>({
        resolver: zodResolver(addCourseSchema),
        defaultValues: {
            title: t("dashboard.courses.builder.default_title"),
            description: t("dashboard.courses.builder.default_description"),
            tags: ["frontend-architecture", "ux-systems"],
            coinPrice: 150,
            chapters: [
                {
                    id: crypto.randomUUID(),
                    title: t("dashboard.courses.builder.default_chapter"),
                    lessons: [
                        {
                            id: crypto.randomUUID(),
                            title: t("dashboard.courses.builder.default_lesson"),
                            duration: "2:50",
                            access: "coins",
                        },
                        {
                            id: crypto.randomUUID(),
                            title: t("dashboard.courses.builder.default_lesson_two"),
                            duration: "3:10",
                            access: "coins",
                        },
                    ],
                },
            ],
        },
    });

    const title = useWatch({ control: methods.control, name: "title" });
    const description = useWatch({ control: methods.control, name: "description" });
    const coinPrice = useWatch({ control: methods.control, name: "coinPrice" });
    const essentialsDone = [title, description].filter((value) => String(value ?? "").trim()).length;

    const tagOptions = [
        { value: "frontend-architecture", label: t("dashboard.courses.builder.tag_frontend") },
        { value: "ux-systems", label: t("dashboard.courses.builder.tag_ux") },
        { value: "code-labs", label: t("dashboard.courses.builder.tag_code") },
        { value: "kitchen-studio", label: t("dashboard.courses.builder.tag_cooking") },
    ];

    const usdHint =
        Number(coinPrice) > 0
            ? t("dashboard.courses.builder.usd_hint", { amount: (Number(coinPrice) * 0.05).toFixed(2) })
            : "";

    const saveDraft = () => {
        showSuccessToast(t("dashboard.courses.builder.draft_saved"));
    };

    const onSubmit = () => {
        showSuccessToast(t("dashboard.courses.builder.published"));
        navigate("/dashboard/courses");
    };

    return (
        <FormWrapper methods={methods} onSubmit={onSubmit}>
            <SectionWrapper
                title={t("dashboard.courses.builder.title")}
                description={t("dashboard.courses.builder.page_subtitle")}
                actions={[
                    {
                        label: t("dashboard.courses.builder.save_draft"),
                        icon: SaveOutlined,
                        variant: "outline",
                        onClick: saveDraft,
                    },
                    {
                        label: t("dashboard.courses.builder.publish"),
                        icon: IosShareOutlined,
                        type: "submit",
                    },
                ]}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.92fr) minmax(0, 1.08fr)" },
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
                                    maxLength={80}
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
                                    freeSolo
                                />
                                <CourseCoverField
                                    name="cover"
                                    label={t("dashboard.courses.builder.cover")}
                                    hint={t("dashboard.courses.builder.cover_hint")}
                                    changeLabel={t("dashboard.courses.builder.change_cover")}
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

                    <CurriculumBuilder />
                </Box>
            </SectionWrapper>
        </FormWrapper>
    );
}
