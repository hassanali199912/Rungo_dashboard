import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const LOGO_SRC = encodeURI("/mainLogo.png");

type RunGoLoaderProps = {
    fullScreen?: boolean;
};

export default function RunGoLoader({ fullScreen = true }: RunGoLoaderProps) {
    const { t } = useTranslation();

    return (
        <Box
            role="status"
            aria-live="polite"
            aria-label={t("status.loading")}
            sx={{
                minHeight: fullScreen ? "100vh" : 240,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                bgcolor: "background.paper",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: 88,
                    height: 88,
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor: "primary.light",
                        borderTopColor: "primary.main",
                        animation: "rungoSpin 0.9s linear infinite",
                        "@keyframes rungoSpin": {
                            to: { transform: "rotate(360deg)" },
                        },
                    }}
                />
                <Box
                    component="img"
                    src={LOGO_SRC}
                    alt=""
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        animation: "rungoPulse 1.2s ease-in-out infinite",
                        "@keyframes rungoPulse": {
                            "0%, 100%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.08)" },
                        },
                    }}
                />
            </Box>
            <Typography sx={{ fontWeight: 800, letterSpacing: "-0.03em", color: "text.primary" }}>
                {t("brand.name")}
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                {t("status.loading")}
            </Typography>
        </Box>
    );
}
