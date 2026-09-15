import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import PlayArrowOutlined from "@mui/icons-material/PlayArrowOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import { Avatar, Box, Collapse, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { Navigate, Link as RouterLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import StudioCard from "@/features/dashboard/components/StudioCard";
import LessonPreviewModal from "../../components/LessonPreviewModal";
import StatusBadge from "../../components/StatusBadge";
import { toggleHidden } from "../../data/adminStore";
import type { AdminCourseLesson } from "../../data/adminTypes";
import { getMockAdminCourseDetail } from "../../data/mockAdminCourseDetail";
import { formatCoursePrice } from "../../data/mockAdminCourses";

const domainLabelKey: Record<string, string> = {
    code: "dashboard.shorts.domain_code",
    "ui-ux": "dashboard.shorts.domain_ui",
    fitness: "dashboard.shorts.domain_fitness",
    cooking: "dashboard.shorts.domain_cooking",
};

const coverToneSx = {
    code: {
        background: (theme: { palette: { secondary: { main: string }; primary: { main: string } } }) =>
            `linear-gradient(145deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
    },
    design: {
        background: (theme: { palette: { tertiary: { main: string; dark?: string }; secondary: { main: string } } }) =>
            `linear-gradient(145deg, ${theme.palette.secondary.main} 0%, ${theme.palette.tertiary.main} 100%)`,
    },
    fitness: {
        background: (theme: { palette: { primary: { main: string; dark: string } } }) =>
            `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    },
    cooking: {
        background: (theme: { palette: { primary: { main: string }; tertiary: { main: string } } }) =>
            `linear-gradient(145deg, ${theme.palette.tertiary.main} 0%, ${theme.palette.primary.main} 100%)`,
    },
} as const;

export default function AdminCourseDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [tick, setTick] = useState(0);
    const [openChapter, setOpenChapter] = useState(0);
    const [preview, setPreview] = useState<AdminCourseLesson | null>(null);
    const course = useMemo(() => (id ? getMockAdminCourseDetail(id, t) : null), [id, t, tick]);

    if (!course) {
        return <Navigate to="/admin/courses" replace />;
    }

    const hide = () => {
        toggleHidden("courses", course.id);
        setTick((value) => value + 1);
        showSuccessToast(course.hidden ? t("admin.content.shown") : t("admin.content.hidden"));
    };

    const stats = [
        {
            icon: GroupsOutlined,
            label: t("admin.courses.detail.stat_students"),
            value: course.students.toLocaleString(),
            unit: t("admin.overview.learners"),
        },
        {
            icon: MenuBookOutlined,
            label: t("admin.courses.detail.stat_lessons"),
            value: String(course.lessons),
            unit: t("admin.courses.detail.lessons_unit"),
        },
        {
            icon: PaymentsOutlined,
            label: t("admin.courses.detail.stat_price"),
            value: formatCoursePrice(course, t),
            unit: t("admin.courses.detail.price_unit"),
        },
        {
            icon: TrendingUpOutlined,
            label: t("admin.courses.detail.stat_completion"),
            value: `${course.completion}%`,
            unit: t("admin.courses.detail.completion_unit"),
        },
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SectionWrapper
                title={course.title}
                description={t(domainLabelKey[course.domain] ?? course.domain)}
                actions={[
                    {
                        label: course.hidden ? t("admin.content.unhide") : t("admin.content.hide"),
                        onClick: hide,
                    },
                ]}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
                    <StatusBadge
                        status={course.hidden ? "hidden" : "visible"}
                        label={course.hidden ? t("admin.content.hidden_status") : t("admin.content.visible")}
                    />
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        {course.duration} · {course.revenueCoins.toLocaleString()} {t("dashboard.coins")}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "repeat(4, 1fr)" },
                        gap: 1.5,
                    }}
                >
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Box
                                key={stat.label}
                                sx={{
                                    bgcolor: "surface.main",
                                    borderRadius: "1rem",
                                    p: 2,
                                    minHeight: 112,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Box
                                        sx={{
                                            width: 34,
                                            height: 34,
                                            borderRadius: "50%",
                                            bgcolor: "background.paper",
                                            display: "grid",
                                            placeItems: "center",
                                            color: "text.secondary",
                                        }}
                                    >
                                        <Icon sx={{ fontSize: 18 }} />
                                    </Box>
                                    <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 700 }}>
                                        {stat.unit}
                                    </Typography>
                                </Box>
                                <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 600 }}>
                                    {stat.label}
                                </Typography>
                                <Typography sx={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.03em" }}>
                                    {stat.value}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </SectionWrapper>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.35fr 0.85fr" }, gap: 2 }}>
                <StudioCard title={t("admin.courses.detail.info_title")} subtitle={t("admin.courses.detail.info_subtitle")}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "220px 1fr" }, gap: 2 }}>
                        <Box
                            sx={{
                                borderRadius: "1rem",
                                aspectRatio: "16 / 10",
                                ...coverToneSx[course.coverTone],
                                position: "relative",
                                overflow: "hidden",
                                minHeight: 140,
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    background: (theme) =>
                                        `linear-gradient(180deg, transparent 35%, ${alpha(theme.palette.secondary.main, 0.72)} 100%)`,
                                }}
                            />
                            <Typography
                                sx={{
                                    position: "absolute",
                                    left: 14,
                                    right: 14,
                                    bottom: 14,
                                    color: "secondary.contrastText",
                                    fontWeight: 800,
                                    fontSize: 15,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {course.title}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            <Typography sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.6 }}>
                                {course.description}
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                <Box
                                    sx={{
                                        px: 1.1,
                                        py: 0.4,
                                        borderRadius: 999,
                                        bgcolor: "surface.main",
                                        fontSize: 12,
                                        fontWeight: 700,
                                    }}
                                >
                                    {t(domainLabelKey[course.domain] ?? course.domain)}
                                </Box>
                                <Box
                                    sx={{
                                        px: 1.1,
                                        py: 0.4,
                                        borderRadius: 999,
                                        bgcolor: "surface.main",
                                        fontSize: 12,
                                        fontWeight: 700,
                                    }}
                                >
                                    {formatCoursePrice(course, t)}
                                </Box>
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        px: 1.1,
                                        py: 0.4,
                                        borderRadius: 999,
                                        bgcolor: "surface.main",
                                        fontSize: 12,
                                        fontWeight: 700,
                                    }}
                                >
                                    <ScheduleOutlined sx={{ fontSize: 14 }} />
                                    {course.duration}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </StudioCard>

                <StudioCard
                    title={t("admin.courses.detail.instructor_title")}
                    subtitle={t("admin.courses.detail.instructor_subtitle")}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 52, height: 52, bgcolor: "primary.main", fontWeight: 700 }}>
                            {course.instructorName.slice(0, 1)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                component={RouterLink}
                                to={`/admin/instructors/${course.instructorId}`}
                                sx={{
                                    fontWeight: 800,
                                    fontSize: 16,
                                    color: "text.primary",
                                    textDecoration: "none",
                                    "&:hover": { color: "primary.main" },
                                }}
                            >
                                {course.instructorName}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{course.instructorEmail}</Typography>
                            <Typography sx={{ mt: 0.5, fontSize: 13, fontWeight: 600 }}>
                                {t(`auth.domains.${course.instructorExpertise}`)}
                            </Typography>
                        </Box>
                    </Box>
                </StudioCard>
            </Box>

            <StudioCard title={t("admin.courses.detail.curriculum_title")} subtitle={t("admin.courses.detail.curriculum_subtitle")}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                    {course.chapters.map((chapter, index) => {
                        const open = openChapter === index;
                        return (
                            <Box
                                key={chapter.id}
                                sx={{
                                    borderRadius: "1rem",
                                    bgcolor: "surface.main",
                                    border: "1px solid",
                                    borderColor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    component="button"
                                    type="button"
                                    onClick={() => setOpenChapter(open ? -1 : index)}
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 1.5,
                                        p: 1.75,
                                        border: 0,
                                        bgcolor: "transparent",
                                        cursor: "pointer",
                                        textAlign: "start",
                                        color: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    <Box>
                                        <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                                            {t("admin.courses.detail.chapter_label", { index: index + 1 })} · {chapter.title}
                                        </Typography>
                                        <Typography sx={{ mt: 0.35, fontSize: 13, color: "text.secondary" }}>
                                            {t("admin.courses.detail.chapter_lessons", { count: chapter.lessons.length })}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.secondary" }}>
                                        {open ? "−" : "+"}
                                    </Typography>
                                </Box>
                                <Collapse in={open}>
                                    <Box sx={{ px: 1.75, pb: 1.75, display: "flex", flexDirection: "column", gap: 1 }}>
                                        {chapter.lessons.map((lesson, lessonIndex) => (
                                            <Box
                                                key={lesson.id}
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
                                                    gap: 1,
                                                    alignItems: "center",
                                                    bgcolor: "background.paper",
                                                    borderRadius: "0.85rem",
                                                    p: 1.25,
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                                                    <Box
                                                        sx={{
                                                            width: 34,
                                                            height: 34,
                                                            borderRadius: "50%",
                                                            bgcolor: "surface.main",
                                                            display: "grid",
                                                            placeItems: "center",
                                                            color: "text.secondary",
                                                            flexShrink: 0,
                                                            fontSize: 12,
                                                            fontWeight: 800,
                                                        }}
                                                    >
                                                        {lessonIndex + 1}
                                                    </Box>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                                                            {lesson.title}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                                            {lesson.duration}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <AppBtn
                                                    customType="outline"
                                                    type="button"
                                                    startIcon={<PlayArrowOutlined sx={{ fontSize: 16 }} />}
                                                    onClick={() => setPreview(lesson)}
                                                    sx={{ borderRadius: 999, justifySelf: { xs: "stretch", sm: "center" } }}
                                                >
                                                    {t("admin.courses.detail.preview")}
                                                </AppBtn>
                                            </Box>
                                        ))}
                                    </Box>
                                </Collapse>
                            </Box>
                        );
                    })}
                </Box>
            </StudioCard>

            <AppBtn customType="outline" to="/admin/courses" sx={{ borderRadius: 999, alignSelf: "flex-start" }}>
                {t("admin.people.back")}
            </AppBtn>

            <LessonPreviewModal
                open={Boolean(preview)}
                title={preview?.title ?? ""}
                videoUrl={preview?.previewUrl ?? null}
                onClose={() => setPreview(null)}
            />
        </Box>
    );
}
