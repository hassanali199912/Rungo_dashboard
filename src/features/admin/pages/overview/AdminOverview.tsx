import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import PlayCircleOutlined from "@mui/icons-material/PlayCircleOutlined";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import { Box, Button, Typography } from "@mui/material";
import OverviewRangeControl, {
    defaultOverviewCustomRange,
    type OverviewRangeKey,
} from "@/features/dashboard/components/overview/OverviewRangeControl";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import Sparkline from "@/features/dashboard/components/overview/Sparkline";
import StatCard from "@/features/dashboard/components/overview/StatCard";

const SERIES = [
    { label: "W1", purchases: 32, payouts: 24 },
    { label: "W2", purchases: 48, payouts: 30 },
    { label: "W3", purchases: 40, payouts: 28 },
    { label: "W4", purchases: 62, payouts: 44 },
    { label: "W8", purchases: 78, payouts: 51 },
    { label: "Today", purchases: 90, payouts: 63 },
];

const ACTIVITY = [
    { nameKey: "admin.overview.act_1_name", actionKey: "admin.overview.act_1_action", timeKey: "admin.overview.act_1_time" },
    { nameKey: "admin.overview.act_2_name", actionKey: "admin.overview.act_2_action", timeKey: "admin.overview.act_2_time" },
    { nameKey: "admin.overview.act_3_name", actionKey: "admin.overview.act_3_action", timeKey: "admin.overview.act_3_time" },
];

export default function AdminOverview() {
    const { t } = useTranslation();
    const [range, setRange] = useState<OverviewRangeKey>("30d");
    const [customRange, setCustomRange] = useState(defaultOverviewCustomRange);
    const max = 100;
    const labels = ["W1", "W2", "W3", "W4", "W8", t("dashboard.chart_today")];

    return (
        <SectionWrapper>
            <Box
                sx={{
                    display: "flex",
                    alignItems: { xs: "stretch", md: "flex-end" },
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 2.5,
                }}
            >
                <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "text.secondary", mb: 0.75 }}>
                        {t("admin.overview.eyebrow")}
                    </Typography>
                    <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 }, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                        {t("admin.overview.welcome")}
                    </Typography>
                </Box>
                <OverviewRangeControl
                    range={range}
                    customRange={customRange}
                    onRangeChange={setRange}
                    onCustomRangeChange={setCustomRange}
                />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "repeat(4, 1fr)" }, gap: 2, mb: 2 }}>
                <StatCard icon={SchoolOutlined} label={t("admin.overview.stat_instructors")} value="1,284" unit={t("admin.overview.active")} delta="+6.1%" footer={<Sparkline values={[12, 14, 13, 16, 18, 20, 22]} />} />
                <StatCard icon={GroupOutlined} label={t("admin.overview.stat_students")} value="86,420" unit={t("admin.overview.learners")} delta="+11.4%" footer={<Sparkline values={[20, 22, 21, 26, 28, 30, 34]} />} />
                <StatCard icon={PlayCircleOutlined} label={t("admin.overview.stat_shorts")} value="12.8k" unit={t("admin.overview.public")} delta="+8.2%" />
                <StatCard icon={PaymentsOutlined} label={t("admin.overview.stat_coins")} value="192,400" unit={t("dashboard.coins")} delta="+15.8%" footer={<Sparkline values={[18, 22, 20, 28, 32, 36, 40]} />} />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.55fr 1fr" }, gap: 2 }}>
                <Box sx={{ bgcolor: "surface.main", borderRadius: "1rem", p: { xs: 2, md: 2.5 }, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>{t("admin.overview.chart_title")}</Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary", mb: 2 }}>{t("admin.overview.chart_subtitle")}</Typography>
                    <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 1.5, flex: 1, minHeight: 180, px: 1 }}>
                        {SERIES.map((item, index) => (
                            <Box key={item.label} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                <Box sx={{ width: "100%", maxWidth: 36, height: 150, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 0.6 }}>
                                    <Box sx={{ width: 10, height: `${(item.purchases / max) * 100}%`, bgcolor: "tertiary.main", borderRadius: 999 }} />
                                    <Box sx={{ width: 10, height: `${(item.payouts / max) * 100}%`, bgcolor: "secondary.main", borderRadius: 999 }} />
                                </Box>
                                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{labels[index]}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ bgcolor: "surface.main", borderRadius: "1rem", p: { xs: 2, md: 2.5 }, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>{t("admin.overview.feed_title")}</Typography>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2.5 }}>{t("admin.overview.feed_subtitle")}</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                        {ACTIVITY.map((item) => (
                            <Box key={item.nameKey} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                                <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "background.paper", display: "grid", placeItems: "center", color: "text.secondary", flexShrink: 0 }}>
                                    <CheckCircleOutlined sx={{ fontSize: 18 }} />
                                </Box>
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{t(item.nameKey)}</Typography>
                                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{t(item.actionKey)}</Typography>
                                </Box>
                                <Typography sx={{ fontSize: 12, color: "text.secondary", flexShrink: 0 }}>{t(item.timeKey)}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Button component={RouterLink} to="/admin/instructors" sx={{ mt: 3, bgcolor: "background.paper", color: "text.primary", borderRadius: 999, py: 1.2, fontWeight: 700, "&:hover": { bgcolor: "surface.dark" } }}>
                        {t("admin.overview.feed_all")}
                    </Button>
                </Box>
            </Box>
        </SectionWrapper>
    );
}
