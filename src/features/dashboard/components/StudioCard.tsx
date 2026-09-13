import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

type StudioCardProps = {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
};

export default function StudioCard({ title, subtitle, actions, children }: StudioCardProps) {
    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                borderRadius: "1rem",
                boxShadow: (theme) => `0 2px 12px 0 ${alpha(theme.palette.secondary.main, 0.06)}`,
                p: { xs: 2, md: 2.5 },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: { xs: "stretch", sm: "flex-start" },
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1.5,
                    mb: 2.5,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 16 }}>{title}</Typography>
                    {subtitle && (
                        <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}>{subtitle}</Typography>
                    )}
                </Box>
                {actions ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignSelf: { xs: "stretch", sm: "center" } }}>
                        {actions}
                    </Box>
                ) : null}
            </Box>
            {children}
        </Box>
    );
}
