import { Box, Typography } from "@mui/material";
import type { ElementType, ReactNode } from "react";
import TrendingUp from "@mui/icons-material/TrendingUp";

type StatCardProps = {
    icon: ElementType;
    label: string;
    value: string;
    unit: string;
    delta: string;
    footer?: ReactNode;
};

export default function StatCard({ icon: Icon, label, value, unit, delta, footer }: StatCardProps) {
    return (
        <Box
            sx={{
                bgcolor: "surface.main",
                borderRadius: "1rem",
                p: 2.25,
                minHeight: 168,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "surface.main",
                        display: "grid",
                        placeItems: "center",
                        color: "text.secondary",
                    }}
                >
                    <Icon sx={{ fontSize: 18 }} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "success.main" }}>
                    <TrendingUp sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{delta}</Typography>
                </Box>
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.secondary" }}>
                {label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, mt: 0.75 }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: 26, md: 30 }, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                    {value}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{unit}</Typography>
            </Box>
            {footer ? <Box sx={{ mt: "auto", pt: 1 }}>{footer}</Box> : null}
        </Box>
    );
}
