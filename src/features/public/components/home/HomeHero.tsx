import { Apple, Shop, Bolt } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import HomePhonePreview from "./HomePhonePreview";

export default function HomeHero() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box component="section" id="instructor" sx={{ py: { xs: 6, md: 10 } }}>
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
                        gap: { xs: 6, lg: 8 },
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <Typography
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: "-0.03em",
                                lineHeight: 1.1,
                                fontSize: { xs: 36, md: 52, lg: 58 },
                                color: "text.primary",
                                maxWidth: 640,
                            }}
                        >
                            {t("hero.title_line_1")}
                            <Box component="span" sx={{ display: "block" }}>
                                {t("hero.title_line_2")}
                            </Box>
                        </Typography>

                        <Typography
                            sx={{
                                mt: 3,
                                maxWidth: 560,
                                color: "text.secondary",
                                fontSize: { xs: 16, md: 18 },
                                lineHeight: 1.7,
                            }}
                        >
                            {t("hero.subtitle")}
                        </Typography>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 4 }}>
                            <Button
                                onClick={() => navigate("/register")}
                                sx={{
                                    bgcolor: "secondary.main",
                                    color: "secondary.contrastText",
                                    borderRadius: 999,
                                    px: 3,
                                    py: 1.25,
                                    fontWeight: 700,
                                    "&:hover": { bgcolor: "secondary.dark" },
                                }}
                            >
                                {t("hero.become_instructor")}
                            </Button>
                            <Button
                                href="#download"
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    color: "text.primary",
                                    borderRadius: 999,
                                    px: 3,
                                    py: 1.25,
                                    fontWeight: 700,
                                    "&:hover": { bgcolor: "surface.main", borderColor: "primary.main" },
                                }}
                            >
                                {t("hero.get_the_app")}
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: { xs: 2, md: 3 },
                                mt: 4,
                                color: "text.secondary",
                            }}
                        >
                            <StoreHint icon={<Apple fontSize="small" />} label={t("hero.store_ios")} />
                            <StoreHint icon={<Shop fontSize="small" />} label={t("hero.store_android")} />
                            <StoreHint icon={<Bolt fontSize="small" />} label={t("hero.store_direct")} />
                        </Box>
                    </Box>

                    <HomePhonePreview />
                </Box>
            </Container>
        </Box>
    );
}

function StoreHint({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 13, fontWeight: 600 }}>
            {icon}
            {label}
        </Box>
    );
}
