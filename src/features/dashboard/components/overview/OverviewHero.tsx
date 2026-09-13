import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type RangeKey = "7d" | "30d" | "year";

type OverviewHeroProps = {
    range: RangeKey;
    onRangeChange: (range: RangeKey) => void;
};

export default function OverviewHero({ range, onRangeChange }: OverviewHeroProps) {
    const { t } = useTranslation();

    const ranges: Array<{ key: RangeKey; label: string }> = [
        { key: "7d", label: t("dashboard.range_7") },
        { key: "30d", label: t("dashboard.range_30") },
        { key: "year", label: t("dashboard.range_year") },
    ];

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
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {ranges.map((item) => {
                    const selected = range === item.key;
                    return (
                        <Button
                            key={item.key}
                            onClick={() => onRangeChange(item.key)}
                            sx={{
                                borderRadius: 999,
                                px: 1.75,
                                py: 0.75,
                                fontSize: 13,
                                fontWeight: 600,
                                color: selected ? "text.primary" : "text.secondary",
                                bgcolor: selected ? "background.paper" : "transparent",
                                border: "1px solid",
                                borderColor: selected ? "divider" : "transparent",
                                "&:hover": { bgcolor: "background.paper" },
                            }}
                        >
                            {item.label}
                        </Button>
                    );
                })}
            </Box>
        </Box>
    );
}
