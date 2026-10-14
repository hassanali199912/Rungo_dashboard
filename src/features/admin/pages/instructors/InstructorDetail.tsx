import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import StudioCard from "@/features/dashboard/components/StudioCard";
import { useMyCourses } from "@/features/queryHooks/courses/useMyCourses";
import { useInstructorPlanName } from "@/features/queryHooks/instructorSubscriptions/useInstructorPlanName";
import { useMajors } from "@/features/queryHooks/referenceData/useMajors";
import { useShorts } from "@/features/queryHooks/shorts/useShorts";
import { useAdminUserProfile } from "@/features/queryHooks/users/useAdminUserProfile";
import StatusBadge from "../../components/StatusBadge";
import { setAccountStatus } from "../../data/adminStore";

const LIST_PARAMS = { page: 1, limit: 20 } as const;

function isNotFound(error: unknown) {
    return axios.isAxiosError(error) && error.response?.status === 404;
}

export default function InstructorDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const profileQuery = useAdminUserProfile(id);
    const planQuery = useInstructorPlanName(id);
    const majorsQuery = useMajors(Boolean(id));
    const coursesQuery = useMyCourses({ ...LIST_PARAMS, instructorUserId: id ?? "" }, Boolean(id));
    const shortsQuery = useShorts({ ...LIST_PARAMS, instructorUserId: id ?? "", feedOnly: true }, Boolean(id));

    if (!id || (profileQuery.isError && isNotFound(profileQuery.error))) {
        return <Navigate to="/admin/instructors" replace />;
    }

    if (profileQuery.isPending) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress aria-label={t("status.loading")} />
            </Box>
        );
    }

    if (profileQuery.isError || !profileQuery.data) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 6 }}>
                <Typography sx={{ color: "error.main", textAlign: "center" }}>{t("admin.instructors.load_failed")}</Typography>
                <AppBtn customType="primary" type="button" onClick={() => profileQuery.refetch()} sx={{ borderRadius: 999 }}>
                    {t("status.retry")}
                </AppBtn>
            </Box>
        );
    }

    const profile = profileQuery.data;
    const contact = profile.email || profile.phoneNumber || t("admin.instructors.not_set");
    const expertise =
        profile.majorCode == null
            ? t("admin.instructors.not_set")
            : (majorsQuery.data?.find((item) => item.code === profile.majorCode)?.label ?? profile.majorCode);
    const courseItems = (coursesQuery.data?.items ?? []).filter((row) => row.instructorUserId === id);
    const coursesMatch = (coursesQuery.data?.items ?? []).every((row) => row.instructorUserId === id);
    const shortItems = (shortsQuery.data?.items ?? []).filter((row) => row.instructorUserId === id);
    const shortsMatch = (shortsQuery.data?.items ?? []).every((row) => row.instructorUserId === id);
    const courseTotal = coursesMatch ? (coursesQuery.data?.total ?? 0) : 0;
    const shortTotal = shortsMatch ? (shortsQuery.data?.total ?? 0) : 0;
    const planName = planQuery.isPending
        ? t("status.loading")
        : planQuery.data?.planName || t("admin.instructors.not_set");

    const toggle = () => {
        const next = profile.isActive ? "suspended" : "active";
        setAccountStatus("instructor", profile.id, next);
        showSuccessToast(next === "suspended" ? t("admin.people.suspended") : t("admin.people.activated"));
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SectionWrapper
                title={profile.displayName}
                description={contact}
                actions={[
                    {
                        label: profile.isActive ? t("admin.people.suspend") : t("admin.people.activate"),
                        onClick: toggle,
                    },
                ]}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Avatar src={profile.avatarUrl ?? undefined} sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
                        {profile.displayName.slice(0, 1)}
                    </Avatar>
                    <Box>
                        <StatusBadge
                            status={profile.isActive ? "active" : "suspended"}
                            label={t(`admin.people.${profile.isActive ? "active" : "suspended_status"}`)}
                        />
                        <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 14 }}>
                            {planName} · {expertise} · {courseTotal} {t("admin.nav.courses")} · {shortTotal} {t("admin.nav.shorts")}
                        </Typography>
                    </Box>
                </Box>
            </SectionWrapper>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                <StudioCard title={t("admin.instructors.courses_title")} subtitle={t("admin.instructors.courses_subtitle")}>
                    {coursesQuery.isError ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1.5 }}>
                            <Typography sx={{ color: "error.main" }}>{t("admin.instructors.load_failed")}</Typography>
                            <AppBtn customType="outline" type="button" onClick={() => coursesQuery.refetch()} sx={{ borderRadius: 999 }}>
                                {t("status.retry")}
                            </AppBtn>
                        </Box>
                    ) : coursesQuery.isPending || !coursesMatch ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                            <CircularProgress size={22} aria-label={t("status.loading")} />
                        </Box>
                    ) : courseItems.length === 0 ? (
                        <Typography sx={{ color: "text.secondary" }}>{t("admin.people.empty")}</Typography>
                    ) : (
                        courseItems.map((course) => (
                            <Typography key={course.id} sx={{ py: 0.75, borderBottom: "1px solid", borderColor: "divider" }}>
                                {course.title}
                            </Typography>
                        ))
                    )}
                </StudioCard>
                <StudioCard title={t("admin.instructors.shorts_title")} subtitle={t("admin.instructors.shorts_subtitle")}>
                    {shortsQuery.isError ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1.5 }}>
                            <Typography sx={{ color: "error.main" }}>{t("admin.instructors.load_failed")}</Typography>
                            <AppBtn customType="outline" type="button" onClick={() => shortsQuery.refetch()} sx={{ borderRadius: 999 }}>
                                {t("status.retry")}
                            </AppBtn>
                        </Box>
                    ) : shortsQuery.isPending || !shortsMatch ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                            <CircularProgress size={22} aria-label={t("status.loading")} />
                        </Box>
                    ) : shortItems.length === 0 ? (
                        <Typography sx={{ color: "text.secondary" }}>{t("admin.people.empty")}</Typography>
                    ) : (
                        shortItems.map((short) => (
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
