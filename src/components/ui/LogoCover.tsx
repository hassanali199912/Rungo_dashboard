import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const LOGO_SRC = encodeURI("/mainLogo.png");

export default function LogoCover() {
    const { t } = useTranslation();

    return (
        <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <Box
                component="img"
                src={LOGO_SRC}
                alt={t("brand.name")}
                sx={{ width: "46%", maxWidth: 140, height: "auto", objectFit: "contain" }}
            />
        </Box>
    );
}
