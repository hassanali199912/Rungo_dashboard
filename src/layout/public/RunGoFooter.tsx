import { Box, Container, Divider, Grid, Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import MainLogoComponent from "../../components/ui/MainLogoComponent";
import type { NavOption } from "../../shared/types/generalTypes";
import { Link as RouterLink } from "react-router-dom";

export default function RunGoFooter() {
    const { t } = useTranslation();

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "background.paper",
                py: { xs: 6, md: 8 },
                mt: "auto",
                borderTop: "1px solid",
                borderColor: "divider",
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MainLogoComponent />
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 2,
                                maxWidth: 320,
                                color: "text.secondary",
                                lineHeight: 1.7,
                            }}
                        >
                            {t("footer.brand_blurb")}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 6, md: 2.5 }}>
                        <FooterHeading>{t("footer.platform")}</FooterHeading>
                        <FooterList
                            array={[
                                { label: t("footer.video_shorts"), path: "/#features" },
                                { label: t("footer.coin_economy"), path: "/#features" },
                                { label: t("footer.curriculum"), path: "/#features" },
                            ]}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, md: 2.5 }}>
                        <FooterHeading>{t("footer.instructors")}</FooterHeading>
                        <FooterList
                            array={[
                                { label: t("footer.instructor_hub"), path: "/#instructor" },
                                { label: t("footer.payouts"), path: "/#instructor" },
                                { label: t("footer.creator_portal"), path: "/#instructor" },
                            ]}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <FooterHeading>{t("footer.get_the_app")}</FooterHeading>
                        <FooterList
                            array={[{ label: t("footer.download_stores"), path: "/#download" }]}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {t("footer.copy_right")}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {[
                            { label: t("footer.privacy"), path: "/privacy" },
                            { label: t("footer.terms"), path: "/terms" },
                            { label: t("footer.status"), path: "/status" },
                        ].map((item) => (
                            <Link
                                key={item.path}
                                component={RouterLink}
                                to={item.path}
                                underline="none"
                                sx={{
                                    color: "text.secondary",
                                    fontSize: 14,
                                    "&:hover": { color: "primary.main" },
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

function FooterHeading({ children }: { children: string }) {
    return (
        <Typography
            variant="subtitle2"
            sx={{ mb: 2, fontWeight: 700, color: "text.primary", letterSpacing: "0.04em" }}
        >
            {children}
        </Typography>
    );
}

function FooterList({ array }: { array: NavOption[] }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {array.map((item) => (
                <Link
                    component={RouterLink}
                    key={`${item.path}-${item.label}`}
                    to={item.path}
                    underline="none"
                    sx={{
                        color: "text.secondary",
                        fontSize: 15,
                        "&:hover": { color: "primary.main" },
                    }}
                >
                    {item.label}
                </Link>
            ))}
        </Box>
    );
}
