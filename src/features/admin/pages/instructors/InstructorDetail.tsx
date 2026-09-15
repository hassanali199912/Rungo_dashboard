import { Avatar, Box, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import StudioCard from "@/features/dashboard/components/StudioCard";
import StatusBadge from "../../components/StatusBadge";
import { setAccountStatus } from "../../data/adminStore";
import { getMockAdminCourses } from "../../data/mockAdminCourses";
import { getMockAdminShorts } from "../../data/mockAdminShorts";
import { getMockInstructors } from "../../data/mockInstructors";

export default function InstructorDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [tick, setTick] = useState(0);
    const instructor = useMemo(() => getMockInstructors(t).find((row) => row.id === id), [t, id, tick]);
    const courses = useMemo(() => getMockAdminCourses(t).filter((row) => row.instructorId === id), [t, id]);
    const shorts = useMemo(() => getMockAdminShorts(t).filter((row) => row.instructorId === id), [t, id]);

    if (!instructor) {
        return <Navigate to="/admin/instructors" replace />;
    }

    const toggle = () => {
        const next = instructor.status === "active" ? "suspended" : "active";
        setAccountStatus("instructor", instructor.id, next);
        setTick((value) => value + 1);
        showSuccessToast(next === "suspended" ? t("admin.people.suspended") : t("admin.people.activated"));
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SectionWrapper
                title={instructor.name}
                description={instructor.email}
                actions={[
                    {
                        label: instructor.status === "active" ? t("admin.people.suspend") : t("admin.people.activate"),
                        onClick: toggle,
                    },
                ]}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>{instructor.name.slice(0, 1)}</Avatar>
                    <Box>
                        <StatusBadge status={instructor.status} label={t(`admin.people.${instructor.status === "active" ? "active" : "suspended_status"}`)} />
                        <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 14 }}>
                            {t(`auth.domains.${instructor.expertise}`)} · {t(`dashboard.subscription.plans.${instructor.plan}.name`)} · {instructor.shorts} {t("admin.nav.shorts")} · {instructor.courses} {t("admin.nav.courses")}
                        </Typography>
                    </Box>
                </Box>
            </SectionWrapper>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                <StudioCard title={t("admin.instructors.courses_title")} subtitle={t("admin.instructors.courses_subtitle")}>
                    {courses.length === 0 ? (
                        <Typography sx={{ color: "text.secondary" }}>{t("admin.people.empty")}</Typography>
                    ) : (
                        courses.map((course) => (
                            <Typography key={course.id} sx={{ py: 0.75, borderBottom: "1px solid", borderColor: "divider" }}>
                                {course.title}
                            </Typography>
                        ))
                    )}
                </StudioCard>
                <StudioCard title={t("admin.instructors.shorts_title")} subtitle={t("admin.instructors.shorts_subtitle")}>
                    {shorts.length === 0 ? (
                        <Typography sx={{ color: "text.secondary" }}>{t("admin.people.empty")}</Typography>
                    ) : (
                        shorts.map((short) => (
                            <Typography key={short.id} sx={{ py: 0.75, borderBottom: "1px solid", borderColor: "divider" }}>
                                {short.title}
                            </Typography>
                        ))
                    )}
                </StudioCard>
            </Box>

            <AppBtn customType="outline" to="/admin/instructors" sx={{ borderRadius: 999, alignSelf: "flex-start" }}>
                {t("admin.people.back")}
            </AppBtn>
        </Box>
    );
}
