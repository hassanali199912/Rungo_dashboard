import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import PlayCircleOutlined from "@mui/icons-material/PlayCircleOutlined";
import { Box } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SectionWrapper from "../../components/SectionWrapper";
import CompletionMeter from "../../components/overview/CompletionMeter";
import LiveTransactions from "../../components/overview/LiveTransactions";
import OverviewHero from "../../components/overview/OverviewHero";
import RevenueChart from "../../components/overview/RevenueChart";
import Sparkline from "../../components/overview/Sparkline";
import StatCard from "../../components/overview/StatCard";

export default function Overview() {
    const { t } = useTranslation();
    const [range, setRange] = useState<"7d" | "30d" | "year">("30d");

    return (
        <SectionWrapper>
            <OverviewHero range={range} onRangeChange={setRange} />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "repeat(4, 1fr)" },
                    gap: 2,
                    mb: 2,
                }}
            >
                <StatCard
                    icon={PaymentsOutlined}
                    label={t("dashboard.stat_earnings")}
                    value="48,250"
                    unit={t("dashboard.coins")}
                    delta="+18.44%"
                    footer={<Sparkline values={[18, 22, 20, 28, 26, 34, 40]} />}
                />
                <StatCard
                    icon={PlayCircleOutlined}
                    label={t("dashboard.stat_views")}
                    value="1.42M"
                    unit={t("dashboard.plays")}
                    delta="+24.2%"
                    footer={<Sparkline values={[12, 18, 16, 24, 22, 30, 36]} />}
                />
                <StatCard
                    icon={PersonOutlined}
                    label={t("dashboard.stat_students")}
                    value="38,910"
                    unit={t("dashboard.active")}
                    delta="+12.1%"
                />
                <StatCard
                    icon={CheckCircleOutlined}
                    label={t("dashboard.stat_completion")}
                    value="78.6%"
                    unit={t("dashboard.benchmark")}
                    delta="+3.2%"
                    footer={<CompletionMeter value={76} />}
                />
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", lg: "1.55fr 1fr" },
                    gap: 2,
                }}
            >
                <RevenueChart />
                <LiveTransactions />
            </Box>
        </SectionWrapper>
    );
}
