import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";

const LOGO_SRC = encodeURI("/mainLogo.png");

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 3,
                py: 8,
            }}
        >
            <Box
                component="img"
                src={LOGO_SRC}
                alt={t("brand.name")}
                sx={{ width: 72, height: 72, mb: 3 }}
            />
            <Typography
                sx={{
                    color: "primary.main",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    fontSize: 13,
                    textTransform: "uppercase",
                    mb: 1,
                }}
            >
                404
            </Typography>
            <Typography
                component="h1"
                sx={{
                    fontWeight: 800,
                    fontSize: { xs: 28, md: 36 },
                    letterSpacing: "-0.03em",
                }}
            >
                {t("status.not_found_title")}
            </Typography>
            <Typography sx={{ mt: 1.5, mb: 4, color: "text.secondary", maxWidth: 420, lineHeight: 1.7 }}>
                {t("status.not_found_body")}
            </Typography>
            <AppBtn customType="primary" to="/">
                {t("status.back_home")}
            </AppBtn>
        </Box>
    );
}
