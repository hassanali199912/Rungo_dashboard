import { Box, Typography } from "@mui/material";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SERIES = [
    { label: "W1", coins: 28, previews: 42 },
    { label: "W2", coins: 48, previews: 72 },
    { label: "W3", coins: 30, previews: 38 },
    { label: "W4", coins: 36, previews: 58 },
    { label: "W8", coins: 70, previews: 86 },
    { label: "Today", coins: 96, previews: 78 },
];

export default function RevenueChart() {
    const { t, i18n } = useTranslation();
    const max = 100;
    const labels = ["W1", "W2", "W3", "W4", "W8", t("dashboard.chart_today")];

    return (
        <Box
            sx={{
                bgcolor: "surface.main",
                borderRadius: "1rem",
                p: { xs: 2, md: 2.5 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 2 }}>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
                        {t("dashboard.chart_title")}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                        {t("dashboard.chart_subtitle")}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <LegendDot color="secondary.main" label={t("dashboard.chart_coins")} />
                    <LegendDot color="tertiary.main" label={t("dashboard.chart_previews")} />
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 1.5, flex: 1, minHeight: 180, px: 1 }}>
                {SERIES.map((item, index) => (
                    <Box key={item.label} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: "100%", maxWidth: 36, height: 150, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 0.6 }}>
                            <Box
                                sx={{
                                    width: 10,
                                    height: `${(item.previews / max) * 100}%`,
                                    bgcolor: "tertiary.main",
                                    borderRadius: 999,
                                }}
                            />
                            <Box
                                sx={{
                                    width: 10,
                                    height: `${(item.coins / max) * 100}%`,
                                    bgcolor: "secondary.main",
                                    borderRadius: 999,
                                }}
                            />
                        </Box>
                        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{labels[index]}</Typography>
                    </Box>
                ))}
            </Box>

            <Box
                sx={{
                    mt: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    {t("dashboard.chart_footer")}
                </Typography>
                <Box
                    component={RouterLink}
                    to="/dashboard/earnings"
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "text.primary",
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "none",
                    }}
                >
                    {t("dashboard.chart_report")}
                    <ArrowForwardOutlined
                        sx={{ fontSize: 16, transform: i18n.dir() === "rtl" ? "scaleX(-1)" : "none" }}
                    />
                </Box>
            </Box>
        </Box>
    );
}

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{label}</Typography>
        </Box>
    );
}
