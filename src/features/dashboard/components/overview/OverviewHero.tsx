import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import OverviewRangeControl, { type OverviewCustomRange, type OverviewRangeKey } from "./OverviewRangeControl";

type OverviewHeroProps = {
    range: OverviewRangeKey;
    customRange: OverviewCustomRange;
    onRangeChange: (range: OverviewRangeKey) => void;
    onCustomRangeChange: (range: OverviewCustomRange) => void;
};

export default function OverviewHero({ range, customRange, onRangeChange, onCustomRangeChange }: OverviewHeroProps) {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: { xs: "stretch", md: "flex-end" },
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                mb: 2.5,
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "text.secondary",
                        mb: 0.75,
                    }}
                >
                    {t("dashboard.eyebrow")}
                </Typography>
                <Typography
                    component="h1"
                    sx={{ fontWeight: 800, fontSize: { xs: 28, md: 36 }, letterSpacing: "-0.03em", lineHeight: 1.15 }}
                >
                    {t("dashboard.welcome")}
                </Typography>
            </Box>
            <OverviewRangeControl
                range={range}
                customRange={customRange}
                onRangeChange={onRangeChange}
                onCustomRangeChange={onCustomRangeChange}
            />
        </Box>
    );
}
