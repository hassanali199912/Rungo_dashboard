import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ElementType } from "react";

export type StatisticCardItem = {
    key: string;
    label: string;
    value: string;
    unit?: string;
    icon: ElementType;
    iconTone?: "primary" | "tertiary";
    delta?: string;
    description?: string;
    meter?: {
        value: number;
        label?: string;
    };
};

type StatisticCardsProps = {
    items: StatisticCardItem[];
};

function StatisticCard({ item }: { item: StatisticCardItem }) {
    const Icon = item.icon;
    const tone = item.iconTone ?? "primary";

    return (
        <Box
            sx={{
                bgcolor: "surface.main",
                borderRadius: "1rem",
                p: 2.25,
                minHeight: 148,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5, mb: 1.5 }}>
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "text.secondary",
                        lineHeight: 1.4,
                    }}
                >
                    {item.label}
                </Typography>
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: (theme) =>
                            alpha(tone === "tertiary" ? theme.palette.tertiary.main : theme.palette.primary.main, 0.14),
                        color: tone === "tertiary" ? "tertiary.main" : "primary.main",
                    }}
                >
                    <Icon sx={{ fontSize: 16 }} />
                </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 26, md: 30 }, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                    {item.value}
                </Typography>
                {item.unit && (
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{item.unit}</Typography>
                )}
                {item.delta && (
                    <Box
                        sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: 999,
                            bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                            color: "success.main",
                        }}
                    >
                        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{item.delta}</Typography>
                    </Box>
                )}
            </Box>

            {item.meter && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 1.75 }}>
                    <Box sx={{ flex: 1, height: 6, borderRadius: 999, bgcolor: "surface.dark", overflow: "hidden" }}>
                        <Box
                            sx={{
                                width: `${Math.min(100, Math.max(0, item.meter.value))}%`,
                                height: "100%",
                                borderRadius: 999,
                                bgcolor: "secondary.main",
                            }}
                        />
                    </Box>
                    {item.meter.label && (
                        <Typography sx={{ fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>
                            {item.meter.label}
                        </Typography>
                    )}
                </Box>
            )}

            {item.description && (
                <Typography sx={{ mt: "auto", pt: 1.25, fontSize: 13, color: "text.secondary", lineHeight: 1.45 }}>
                    {item.description}
                </Typography>
            )}
        </Box>
    );
}

export default function StatisticCards({ items }: StatisticCardsProps) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
                gap: 2,
            }}
        >
            {items.map((item) => (
                <StatisticCard key={item.key} item={item} />
            ))}
        </Box>
    );
}
