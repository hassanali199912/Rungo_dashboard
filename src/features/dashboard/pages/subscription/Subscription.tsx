import { Box, Button, CircularProgress, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useActiveInstructorPackages } from "@/features/queryHooks/instructorPackages/useActiveInstructorPackages";
import type { InstructorSubscription } from "@/features/queryHooks/instructorSubscriptions/types";
import { useMyInstructorSubscription } from "@/features/queryHooks/instructorSubscriptions/useMyInstructorSubscription";
import { useMyInstructorSubscriptions } from "@/features/queryHooks/instructorSubscriptions/useMyInstructorSubscriptions";
import { useSubscribeInstructor } from "@/features/queryHooks/instructorSubscriptions/useSubscribeInstructor";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import SectionWrapper from "../../components/SectionWrapper";
import StudioCard from "../../components/StudioCard";
import PricingPlanCard from "./PricingPlanCard";

const STATUS_KEYS = {
    pending: "dashboard.subscription.status_pending",
    active: "dashboard.subscription.status_active",
    expired: "dashboard.subscription.status_expired",
    cancelled: "dashboard.subscription.status_cancelled",
} as const;

function statusLabel(status: string, t: (key: string) => string) {
    const key = STATUS_KEYS[status as keyof typeof STATUS_KEYS];
    return key ? t(key) : status;
}

function statusColor(status: string) {
    if (status === "active") return "tertiary.main";
    if (status === "pending") return "primary.main";
    if (status === "cancelled") return "error.main";
    return "text.secondary";
}

function formatSubscriptionDate(value: string | null, language: string, empty: string) {
    if (!value) return empty;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return empty;
    return new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(date);
}

function SubscriptionStatus({ status }: { status: string }) {
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1,
                py: 0.25,
                borderRadius: 999,
                bgcolor: "background.paper",
                color: statusColor(status),
                fontSize: 12,
                fontWeight: 700,
            }}
        >
            {statusLabel(status, t)}
        </Box>
    );
}

function UsageMeter({ label, used, max }: { label: string; used: number; max: number }) {
    const { t } = useTranslation();
    const ratio = max > 0 ? Math.min(used / max, 1) : 0;
    return (
        <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{label}</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                    {t("dashboard.subscription.usage", { used, max })}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={ratio * 100}
                sx={{
                    height: 6,
                    borderRadius: 999,
                    bgcolor: "background.paper",
                    "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: "primary.main" },
                }}
            />
        </Box>
    );
}

export default function Subscription() {
    const { t, i18n } = useTranslation();
    const currentQuery = useMyInstructorSubscription();
    const historyQuery = useMyInstructorSubscriptions();
    const plansQuery = useActiveInstructorPackages();
    const subscribe = useSubscribeInstructor();

    const currentSubscription = currentQuery.data ?? null;
    const previousSubscriptions = (historyQuery.data ?? []).filter((item) => item.id !== currentSubscription?.id);
    const emptyDate = t("dashboard.subscription.no_date");
    const currentPackageId =
        currentSubscription && (currentSubscription.status === "active" || currentSubscription.status === "pending")
            ? currentSubscription.instructorPackageId
            : undefined;

    const onChoosePlan = async (planId: string) => {
        if (subscribe.isPending || planId === currentPackageId) return;
        try {
            await subscribe.mutateAsync(planId);
            showSuccessToast(t("dashboard.subscription.subscribed"));
        } catch (cause) {
            const status = axios.isAxiosError(cause) ? cause.response?.status : undefined;
            showErrorToast(
                t(status === 409 ? "dashboard.subscription.subscribe_exists" : "dashboard.subscription.subscribe_failed"),
            );
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SectionWrapper
                title={t("dashboard.subscription.title")}
                description={t("dashboard.subscription.description")}
            />

            <StudioCard
                title={t("dashboard.subscription.current_title")}
                subtitle={t("dashboard.subscription.current_subtitle")}
            >
                {currentQuery.isPending ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress aria-label={t("status.loading")} />
                    </Box>
                ) : currentQuery.isError ? (
                    <Box sx={{ py: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <Typography sx={{ color: "error.main", textAlign: "center" }}>
                            {t("dashboard.subscription.current_load_error")}
                        </Typography>
                        <Button onClick={() => currentQuery.refetch()} sx={{ borderRadius: 999 }}>
                            {t("status.retry")}
                        </Button>
                    </Box>
                ) : !currentSubscription ? (
                    <Typography sx={{ color: "text.secondary" }}>{t("dashboard.subscription.current_empty")}</Typography>
                ) : (
                    <CurrentSubscriptionCard subscription={currentSubscription} language={i18n.language} emptyDate={emptyDate} />
                )}
            </StudioCard>

            <StudioCard
                title={t("dashboard.subscription.history_title")}
                subtitle={t("dashboard.subscription.history_subtitle")}
            >
                {historyQuery.isPending ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress aria-label={t("status.loading")} />
                    </Box>
                ) : historyQuery.isError ? (
                    <Box sx={{ py: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <Typography sx={{ color: "error.main", textAlign: "center" }}>
                            {t("dashboard.subscription.history_load_error")}
                        </Typography>
                        <Button onClick={() => historyQuery.refetch()} sx={{ borderRadius: 999 }}>
                            {t("status.retry")}
                        </Button>
                    </Box>
                ) : previousSubscriptions.length === 0 ? (
                    <Typography sx={{ color: "text.secondary" }}>{t("dashboard.subscription.history_empty")}</Typography>
                ) : (
                    <SubscriptionHistoryTable rows={previousSubscriptions} language={i18n.language} emptyDate={emptyDate} />
                )}
            </StudioCard>

            <StudioCard
                title={t("dashboard.subscription.plans_title")}
                subtitle={t("dashboard.subscription.plans_subtitle")}
            >
                {plansQuery.isPending ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress aria-label={t("status.loading")} />
                    </Box>
                ) : plansQuery.isError ? (
                    <Box sx={{ py: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <Typography sx={{ color: "error.main", textAlign: "center" }}>
                            {t("dashboard.subscription.plans_load_error")}
                        </Typography>
                        <Button onClick={() => plansQuery.refetch()} sx={{ borderRadius: 999 }}>
                            {t("status.retry")}
                        </Button>
                    </Box>
                ) : (plansQuery.data ?? []).length === 0 ? (
                    <Typography sx={{ color: "text.secondary" }}>{t("dashboard.subscription.plans_empty")}</Typography>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(auto-fit, minmax(240px, 1fr))" },
                            gap: 2,
                            alignItems: "stretch",
                        }}
                    >
                        {(plansQuery.data ?? []).map((plan) => (
                            <PricingPlanCard
                                key={plan.id}
                                plan={plan}
                                current={plan.id === currentPackageId}
                                pending={subscribe.isPending}
                                onChoose={(planId) => void onChoosePlan(planId)}
                            />
                        ))}
                    </Box>
                )}
            </StudioCard>
        </Box>
    );
}

function CurrentSubscriptionCard({
    subscription,
    language,
    emptyDate,
}: {
    subscription: InstructorSubscription;
    language: string;
    emptyDate: string;
}) {
    const { t } = useTranslation();
    const plan = subscription.instructorPackage;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 2,
                borderRadius: "1rem",
                bgcolor: "surface.main",
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.secondary.main, 0.08),
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                    {plan?.name || t("dashboard.subscription.unknown_plan")}
                </Typography>
                <SubscriptionStatus status={subscription.status} />
            </Box>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                {plan
                    ? t("dashboard.subscription.price_amount", { amount: plan.price, currency: plan.currency })
                    : t("dashboard.subscription.unknown_plan")}
                {plan ? ` · ${t("dashboard.subscription.duration_days", { count: plan.durationDays })}` : ""}
            </Typography>
            {plan?.description ? (
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{plan.description}</Typography>
            ) : null}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <UsageMeter label={t("dashboard.subscription.col_courses")} used={subscription.coursesCreatedCount} max={subscription.maxCourses} />
                <UsageMeter label={t("dashboard.subscription.col_videos")} used={subscription.videosUploadedCount} max={subscription.maxVideos} />
            </Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                {t("dashboard.subscription.col_started")}: {formatSubscriptionDate(subscription.startedAt, language, emptyDate)}
                {" · "}
                {t("dashboard.subscription.col_expires")}: {formatSubscriptionDate(subscription.expiresAt, language, emptyDate)}
            </Typography>
        </Box>
    );
}

function SubscriptionHistoryTable({
    rows,
    language,
    emptyDate,
}: {
    rows: InstructorSubscription[];
    language: string;
    emptyDate: string;
}) {
    const { t } = useTranslation();
    const columns = [
        t("dashboard.subscription.col_plan"),
        t("dashboard.subscription.col_status"),
        t("dashboard.subscription.col_price"),
        t("dashboard.subscription.col_started"),
        t("dashboard.subscription.col_expires"),
        t("dashboard.subscription.col_courses"),
        t("dashboard.subscription.col_videos"),
    ];

    return (
        <TableContainer>
            <Table aria-label={t("dashboard.subscription.history_title")}>
                <TableHead>
                    <TableRow>
                        {columns.map((label) => (
                            <TableCell
                                key={label}
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 12,
                                    color: "text.secondary",
                                    borderBottomColor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        const plan = row.instructorPackage;
                        return (
                            <TableRow key={row.id}>
                                <TableCell sx={{ fontWeight: 700 }}>{plan?.name || t("dashboard.subscription.unknown_plan")}</TableCell>
                                <TableCell>
                                    <SubscriptionStatus status={row.status} />
                                </TableCell>
                                <TableCell>
                                    {plan
                                        ? t("dashboard.subscription.price_amount", { amount: plan.price, currency: plan.currency })
                                        : emptyDate}
                                </TableCell>
                                <TableCell>{formatSubscriptionDate(row.startedAt, language, emptyDate)}</TableCell>
                                <TableCell>{formatSubscriptionDate(row.expiresAt, language, emptyDate)}</TableCell>
                                <TableCell>{t("dashboard.subscription.usage", { used: row.coursesCreatedCount, max: row.maxCourses })}</TableCell>
                                <TableCell>{t("dashboard.subscription.usage", { used: row.videosUploadedCount, max: row.maxVideos })}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
