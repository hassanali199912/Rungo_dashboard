import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const FEATURES = [
    {
        icon: <PaymentsOutlinedIcon />,
        kickerKey: "features.coin_kicker",
        titleKey: "features.coin_title",
        bodyKey: "features.coin_body",
        footKey: "features.coin_foot",
        tone: "primary.main",
    },
    {
        icon: <AutoAwesomeOutlinedIcon />,
        kickerKey: "features.feed_kicker",
        titleKey: "features.feed_title",
        bodyKey: "features.feed_body",
        footKey: "features.feed_foot",
        tone: "primary.light",
    },
    {
        icon: <QuizOutlinedIcon />,
        kickerKey: "features.quiz_kicker",
        titleKey: "features.quiz_title",
        bodyKey: "features.quiz_body",
        footKey: "features.quiz_foot",
        tone: "warning.light",
    },
] as const;

export default function HomeFeatures() {
    const { t } = useTranslation();

    return (
        <Box component="section" id="features" sx={{ py: { xs: 8, md: 10 } }}>
            <Container maxWidth="xl">
                <Typography
                    sx={{
                        textAlign: "center",
                        color: "primary.main",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        fontSize: 12,
                        textTransform: "uppercase",
                        mb: 1.5,
                    }}
                >
                    {t("features.eyebrow")}
                </Typography>
                <Typography
                    component="h2"
                    sx={{
                        textAlign: "center",
                        fontWeight: 800,
                        fontSize: { xs: 28, md: 40 },
                        letterSpacing: "-0.03em",
                        maxWidth: 640,
                        mx: "auto",
                    }}
                >
                    {t("features.title")}
                </Typography>
                <Typography
                    sx={{
                        textAlign: "center",
                        color: "text.secondary",
                        mt: 2,
                        mb: 5,
                        maxWidth: 640,
                        mx: "auto",
                        lineHeight: 1.7,
                    }}
                >
                    {t("features.subtitle")}
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                        gap: 3,
                    }}
                >
                    {FEATURES.map((feature) => (
                        <Box
                            key={feature.titleKey}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                bgcolor: "surface.main",
                                minHeight: 280,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    display: "grid",
                                    placeItems: "center",
                                    bgcolor: "background.paper",
                                    color: feature.tone,
                                    mb: 3,
                                }}
                            >
                                {feature.icon}
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "text.secondary",
                                    mb: 1,
                                }}
                            >
                                {t(feature.kickerKey)}
                            </Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: 22, mb: 1.5 }}>
                                {t(feature.titleKey)}
                            </Typography>
                            <Typography sx={{ color: "text.secondary", lineHeight: 1.7, flex: 1 }}>
                                {t(feature.bodyKey)}
                            </Typography>
                            <Typography sx={{ mt: 2, fontSize: 13, color: "text.secondary" }}>
                                {t(feature.footKey)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
