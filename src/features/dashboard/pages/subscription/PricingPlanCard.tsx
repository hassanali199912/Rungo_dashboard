import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import type { StudioPlan, StudioPlanId } from "./studioPlans";

type PricingPlanCardProps = {
    plan: StudioPlan;
    current: boolean;
    onChoose: (planId: StudioPlanId) => void;
};

export default function PricingPlanCard({ plan, current, onChoose }: PricingPlanCardProps) {
    const { t } = useTranslation();
    const features = Array.from({ length: plan.featureCount }, (_, index) =>
        t(`dashboard.subscription.plans.${plan.id}.feature_${index + 1}`),
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                bgcolor: "background.paper",
                borderRadius: "1rem",
                border: "1px solid",
                borderColor: (theme) =>
                    current || plan.popular
                        ? "primary.main"
                        : alpha(theme.palette.secondary.main, 0.1),
                boxShadow: (theme) => `0 2px 12px 0 ${alpha(theme.palette.secondary.main, 0.06)}`,
                p: { xs: 2, md: 2.5 },
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1 }}>
                {plan.popular ? (
                    <Box
                        sx={{
                            display: "inline-flex",
                            px: 1,
                            py: 0.25,
                            borderRadius: 999,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            fontSize: 11,
                            fontWeight: 700,
                        }}
                    >
                        {t("dashboard.subscription.plans.popular")}
                    </Box>
                ) : null}
                {current ? (
                    <Box
                        sx={{
                            display: "inline-flex",
                            px: 1,
                            py: 0.25,
                            borderRadius: 999,
                            bgcolor: "surface.main",
                            color: "tertiary.main",
                            fontSize: 11,
                            fontWeight: 700,
                        }}
                    >
                        {t("dashboard.subscription.status_active")}
                    </Box>
                ) : null}
            </Box>

            <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                {t(`dashboard.subscription.plans.${plan.id}.name`)}
            </Typography>
            <Typography sx={{ mt: 0.75, fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>
                {plan.price === 0
                    ? t("dashboard.subscription.plans.free")
                    : t("dashboard.subscription.plans.price", { amount: plan.price })}
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                {t(`dashboard.subscription.plans.${plan.id}.blurb`)}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2, mb: 2.5, flex: 1 }}>
                {features.map((feature) => (
                    <Box key={feature} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <CheckCircleOutlined sx={{ fontSize: 18, color: "primary.main", mt: 0.15 }} />
                        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{feature}</Typography>
                    </Box>
                ))}
            </Box>

            <AppBtn
                type="button"
                customType={current ? "outline" : "primary"}
                disabled={current}
                onClick={() => onChoose(plan.id)}
                sx={{ borderRadius: 999, px: 2.25, py: 1, width: "100%" }}
            >
                {current
                    ? t("dashboard.subscription.plans.current")
                    : t("dashboard.subscription.plans.choose")}
            </AppBtn>
        </Box>
    );
}
