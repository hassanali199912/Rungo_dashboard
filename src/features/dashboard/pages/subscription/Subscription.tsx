import CreditCardOutlined from "@mui/icons-material/CreditCardOutlined";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import { renewSubscriptionSchema, type RenewSubscriptionValues } from "@/schema";
import { btnIconStartSx } from "@/styles/btnStyle";
import SectionWrapper from "../../components/SectionWrapper";
import StudioCard from "../../components/StudioCard";
import PricingPlanCard from "./PricingPlanCard";
import { STUDIO_PLANS, type StudioPlanId } from "./studioPlans";
import {
    formatRenewDate,
    loadSubscription,
    nextMonthIsoDate,
    saveSubscription,
} from "./subscriptionStorage";

const emptyCard: RenewSubscriptionValues = {
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
};

export default function Subscription() {
    const { t, i18n } = useTranslation();
    const [subscription, setSubscription] = useState(loadSubscription);
    const [pendingPlan, setPendingPlan] = useState<StudioPlanId | null>(null);

    const methods = useForm<RenewSubscriptionValues>({
        resolver: zodResolver(renewSubscriptionSchema),
        defaultValues: emptyCard,
    });

    const currentPlan = STUDIO_PLANS.find((plan) => plan.id === subscription.plan) ?? STUDIO_PLANS[1];
    const paying = pendingPlan !== null;

    const applyPlan = (planId: StudioPlanId) => {
        const next = { plan: planId, renewsAt: nextMonthIsoDate() };
        saveSubscription(next);
        setSubscription(next);
        setPendingPlan(null);
        methods.reset(emptyCard);
        showSuccessToast(
            planId === subscription.plan
                ? t("dashboard.subscription.renewed")
                : t("dashboard.subscription.switched"),
        );
    };

    const onChoosePlan = (planId: StudioPlanId) => {
        if (planId === "starter") {
            applyPlan(planId);
            return;
        }
        setPendingPlan(planId);
    };

    const onPay = () => {
        if (!pendingPlan) return;
        applyPlan(pendingPlan);
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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                        p: 2,
                        borderRadius: "1rem",
                        bgcolor: "surface.main",
                        border: "1px solid",
                        borderColor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                    }}
                >
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                                {t(`dashboard.subscription.plans.${currentPlan.id}.name`)}
                            </Typography>
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 999,
                                    bgcolor: "background.paper",
                                    color: "tertiary.main",
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}
                            >
                                {t("dashboard.subscription.status_active")}
                            </Box>
                        </Box>
                        <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>
                            {currentPlan.price === 0
                                ? t("dashboard.subscription.plans.free")
                                : t("dashboard.subscription.plans.price", { amount: currentPlan.price })}
                        </Typography>
                        <Typography sx={{ mt: 0.25, fontSize: 13, color: "text.secondary" }}>
                            {t("dashboard.subscription.renews", {
                                date: formatRenewDate(subscription.renewsAt, i18n.language),
                            })}
                        </Typography>
                    </Box>
                    {!paying && currentPlan.price > 0 ? (
                        <AppBtn
                            type="button"
                            customType="primary"
                            onClick={() => setPendingPlan(currentPlan.id)}
                            sx={{ borderRadius: 999, px: 2.25, py: 1, flexShrink: 0 }}
                        >
                            {t("dashboard.subscription.renew")}
                        </AppBtn>
                    ) : null}
                </Box>

                {paying ? (
                    <Box sx={{ mt: 2.5 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
                            {t("dashboard.subscription.payment_title")}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.25, mb: 2 }}>
                            {t("dashboard.subscription.payment_subtitle", {
                                plan: t(`dashboard.subscription.plans.${pendingPlan}.name`),
                            })}
                        </Typography>
                        <FormWrapper methods={methods} onSubmit={onPay}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25, maxWidth: 560 }}>
                                <AppFormField
                                    name="cardName"
                                    type="text"
                                    label={t("dashboard.subscription.card_name")}
                                    placeholder={t("dashboard.subscription.card_name_placeholder")}
                                />
                                <AppFormField
                                    name="cardNumber"
                                    type="text"
                                    label={t("dashboard.subscription.card_number")}
                                    placeholder={t("dashboard.subscription.card_number_placeholder")}
                                    startIcon={<CreditCardOutlined sx={{ fontSize: 18 }} />}
                                    maxLength={19}
                                />
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                        gap: 2,
                                    }}
                                >
                                    <AppFormField
                                        name="expiry"
                                        type="cardExpiry"
                                        label={t("dashboard.subscription.expiry")}
                                        placeholder={t("dashboard.subscription.expiry_placeholder")}
                                    />
                                    <AppFormField
                                        name="cvv"
                                        type="cvv"
                                        label={t("dashboard.subscription.cvv")}
                                        placeholder={t("dashboard.subscription.cvv_placeholder")}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1,
                                        justifyContent: { xs: "stretch", sm: "flex-end" },
                                    }}
                                >
                                    <AppBtn
                                        type="button"
                                        customType="outline"
                                        onClick={() => {
                                            setPendingPlan(null);
                                            methods.reset(emptyCard);
                                        }}
                                        sx={{ borderRadius: 999, px: 2.25, py: 1 }}
                                    >
                                        {t("dashboard.subscription.cancel")}
                                    </AppBtn>
                                    <AppBtn
                                        type="submit"
                                        customType="primary"
                                        startIcon={<CreditCardOutlined sx={btnIconStartSx} />}
                                        sx={{ borderRadius: 999, px: 2.25, py: 1 }}
                                    >
                                        {t("dashboard.subscription.pay")}
                                    </AppBtn>
                                </Box>
                            </Box>
                        </FormWrapper>
                    </Box>
                ) : null}
            </StudioCard>

            <StudioCard
                title={t("dashboard.subscription.plans_title")}
                subtitle={t("dashboard.subscription.plans_subtitle")}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                        gap: 2,
                        alignItems: "stretch",
                    }}
                >
                    {STUDIO_PLANS.map((plan) => (
                        <PricingPlanCard
                            key={plan.id}
                            plan={plan}
                            current={plan.id === subscription.plan}
                            onChoose={onChoosePlan}
                        />
                    ))}
                </Box>
            </StudioCard>
        </Box>
    );
}
