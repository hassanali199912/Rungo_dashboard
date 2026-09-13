import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LOGO_SRC = encodeURI("/mainLogo.png");

export default function MainLogoComponent() {
    const { t } = useTranslation();

    return (
        <Box
            component={RouterLink}
            to="/"
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "text.primary",
            }}
        >
            <Box
                component="img"
                aria-label={t("brand.name")}
                src={ LOGO_SRC}
                sx={{
                    width: 60,
                }}
            />
            <Typography
                component="span"
                sx={{
                    fontWeight: 800,
                    fontSize: { xs: 16, md: 18 },
                    letterSpacing: "-0.03em",
                    color: "text.primary",
                }}
            >
                {t("brand.name")}
            </Typography>
        </Box>
    );
}
