import { Box, Typography } from "@mui/material";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";

const LOGO_SRC = encodeURI("/mainLogo.png");

export default function AppError() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const error = useRouteError();

    const is404 = isRouteErrorResponse(error) && error.status === 404;
    const detail = isRouteErrorResponse(error)
        ? error.statusText
        : error instanceof Error
            ? error.message
            : "";

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
                bgcolor: "background.paper",
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
                {is404 ? "404" : t("status.error_code")}
            </Typography>
            <Typography
                component="h1"
                sx={{
                    fontWeight: 800,
                    fontSize: { xs: 28, md: 36 },
                    letterSpacing: "-0.03em",
                    maxWidth: 480,
                }}
            >
                {is404 ? t("status.not_found_title") : t("status.error_title")}
            </Typography>
            <Typography sx={{ mt: 1.5, mb: 4, color: "text.secondary", maxWidth: 440, lineHeight: 1.7 }}>
                {is404 ? t("status.not_found_body") : t("status.error_body")}
                {detail && !is404 ? (
                    <Box component="span" sx={{ display: "block", mt: 1, fontSize: 13 }}>
                        {detail}
                    </Box>
                ) : null}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
                <AppBtn customType="primary" to="/" reloadDocument>
                    {t("status.back_home")}
                </AppBtn>
                {!is404 && (
                    <AppBtn customType="outline" onClick={() => navigate(0)}>
                        {t("status.retry")}
                    </AppBtn>
                )}
            </Box>
        </Box>
    );
}
