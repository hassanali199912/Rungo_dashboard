import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type CompletionMeterProps = {
    value: number;
};

export default function CompletionMeter({ value }: CompletionMeterProps) {
    const { t } = useTranslation();

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ height: 8, borderRadius: 999, bgcolor: "surface.dark", overflow: "hidden" }}>
                <Box
                    sx={{
                        width: `${value}%`,
                        height: "100%",
                        borderRadius: 999,
                        bgcolor: "secondary.main",
                    }}
                />
            </Box>
            <Typography sx={{ mt: 1, fontSize: 12, color: "text.secondary" }}>
                {t("dashboard.completion_retention")}
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}>
                {t("dashboard.completion_peer")}
            </Typography>
        </Box>
    );
}
