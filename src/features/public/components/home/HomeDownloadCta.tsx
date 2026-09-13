import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function HomeDownloadCta() {
    const { t } = useTranslation();

    return (
        <Box component="section" id="download" sx={{ px: { xs: 2, md: 3 }, pb: { xs: 6, md: 8 } }}>
            <Box
                sx={{
                    borderRadius: 5,
                    px: { xs: 3, md: 8 },
                    py: { xs: 6, md: 8 },
                    background: "linear-gradient(115deg, #FF5722 0%, #b02f00 100%)",
                    color: "primary.contrastText",
                }}
            >
                <Container maxWidth="lg" disableGutters>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1.3fr auto" },
                            gap: 4,
                            alignItems: "center",
                        }}
                    >
                        <Box>
                            <Typography
                                component="h2"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: 32, md: 44 },
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.15,
                                    maxWidth: 560,
                                }}
                            >
                                {t("cta.title")}
                            </Typography>
                            <Typography sx={{ mt: 2, maxWidth: 480, opacity: 0.92, lineHeight: 1.7 }}>
                                {t("cta.subtitle")}
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 4 }}>
                                <Button
                                    sx={{
                                        bgcolor: "common.white",
                                        color: "secondary.main",
                                        borderRadius: 999,
                                        px: 3,
                                        fontWeight: 700,
                                        "&:hover": { bgcolor: "primary.light", color: "secondary.main" },
                                    }}
                                >
                                    {t("cta.download_ios")}
                                </Button>
                                <Button
                                    sx={{
                                        bgcolor: "common.white",
                                        color: "secondary.main",
                                        borderRadius: 999,
                                        px: 3,
                                        fontWeight: 700,
                                        "&:hover": { bgcolor: "primary.light", color: "secondary.main" },
                                    }}
                                >
                                    {t("cta.download_android")}
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ textAlign: "center" }}>
                            <Box
                                sx={{
                                    width: 148,
                                    height: 148,
                                    bgcolor: "common.white",
                                    borderRadius: 3,
                                    p: 1.5,
                                    mx: "auto",
                                }}
                            >
                                <QrPlaceholder />
                            </Box>
                            <Typography sx={{ mt: 1.5, fontSize: 13, opacity: 0.9 }}>
                                {t("cta.scan")}
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

function QrPlaceholder() {
    const cells = [
        1, 1, 1, 0, 1, 0, 1, 1, 1,
        1, 0, 1, 1, 0, 1, 1, 0, 1,
        1, 1, 1, 0, 1, 0, 1, 1, 1,
        0, 0, 1, 1, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 1, 1, 0, 1, 0,
        0, 1, 1, 0, 1, 0, 1, 0, 1,
        1, 1, 1, 0, 0, 1, 1, 1, 1,
        1, 0, 1, 1, 1, 0, 1, 0, 1,
        1, 1, 1, 0, 1, 1, 0, 1, 1,
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(9, 1fr)",
                gap: "3px",
                height: "100%",
            }}
        >
            {cells.map((on, index) => (
                <Box key={index} sx={{ bgcolor: on ? "secondary.main" : "transparent" }} />
            ))}
        </Box>
    );
}
