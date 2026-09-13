import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function AuthHeroPanel() {
    const { t } = useTranslation();

    const stats = [
        { value: t("auth.panel.stat_1_value"), label: t("auth.panel.stat_1_label") },
        { value: t("auth.panel.stat_2_value"), label: t("auth.panel.stat_2_label") },
        { value: t("auth.panel.stat_3_value"), label: t("auth.panel.stat_3_label") },
    ];

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                minHeight: "100vh",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                px: { md: 7, lg: 9 },
                py: { md: 8, lg: 10 },
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background: (theme) =>
                        `radial-gradient(ellipse at 18% 22%, ${theme.palette.primary.main}66, transparent 52%),
                         radial-gradient(ellipse at 88% 78%, ${theme.palette.tertiary.main}40, transparent 48%)`,
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "secondary.main",
                    opacity: 0.42,
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    width: 280,
                    height: 280,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    opacity: 0.18,
                    filter: "blur(40px)",
                    insetInlineEnd: -40,
                    top: "18%",
                }}
            />

            <Box sx={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "secondary.contrastText",
                        opacity: 0.8,
                        mb: 2,
                    }}
                >
                    {t("auth.panel.kicker")}
                </Typography>
                <Typography
                    component="h2"
                    sx={{
                        fontWeight: 800,
                        fontSize: { md: 40, lg: 48 },
                        lineHeight: 1.15,
                        letterSpacing: "-0.03em",
                    }}
                >
                    {t("auth.panel.title")}
                </Typography>
                <Typography sx={{ mt: 2.5, fontSize: 16, lineHeight: 1.7, opacity: 0.88, maxWidth: 460 }}>
                    {t("auth.panel.body")}
                </Typography>

                <Box
                    sx={{
                        mt: 5,
                        display: "flex",
                        alignItems: "stretch",
                        gap: 2,
                        px: 2.5,
                        py: 2,
                        borderRadius: 999,
                        bgcolor: "white.main",
                        color: "text.primary",
                    }}
                >
                    {stats.map((stat, index) => (
                        <Box
                            key={stat.label}
                            sx={{
                                flex: 1,
                                textAlign: "center",
                                borderInlineEnd: index < stats.length - 1 ? "1px solid" : "none",
                                borderColor: "divider",
                                px: 1,
                            }}
                        >
                            <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em" }}>
                                {stat.value}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}>
                                {stat.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
