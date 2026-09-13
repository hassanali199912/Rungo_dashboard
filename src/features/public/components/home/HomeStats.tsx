import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const STATS = [
    { valueKey: "stats.views_value", labelKey: "stats.views_label" },
    { valueKey: "stats.revenue_value", labelKey: "stats.revenue_label" },
    { valueKey: "stats.focus_value", labelKey: "stats.focus_label" },
    { valueKey: "stats.payout_value", labelKey: "stats.payout_label" },
] as const;

export default function HomeStats() {
    const { t } = useTranslation();

    return (
        <Box component="section" sx={{ py: { xs: 5, md: 7 }, bgcolor: "surface.main" }}>
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
                        gap: { xs: 3, md: 4 },
                    }}
                >
                    {STATS.map((stat) => (
                        <Box key={stat.valueKey} sx={{ textAlign: { xs: "start", md: "center" } }}>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: 28, md: 36 },
                                    letterSpacing: "-0.03em",
                                    color: "text.primary",
                                }}
                            >
                                {t(stat.valueKey)}
                            </Typography>
                            <Typography sx={{ mt: 0.5, color: "text.secondary", fontSize: 14 }}>
                                {t(stat.labelKey)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
