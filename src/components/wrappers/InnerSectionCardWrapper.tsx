import { typography } from "@/styles/fontsLayout";
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface InnerSectionCardWrapperProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

export default function InnerSectionCardWrapper({
    children,
    title = "",
    subtitle = "",
}: InnerSectionCardWrapperProps) {
    return (
        <Box
            sx={{
                p: 3,
                pb: 8,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "#fff",
                minHeight: "70vh",
            }}
        >
            {title ? (
                <Typography sx={{ ...typography.font24_20, fontWeight: 700, color: "neutral.main" }}>
                    {title}
                </Typography>
            ) : null}

            {subtitle ? (
                <Typography
                    sx={{
                        ...typography.font14_14,
                        color: "text.secondary",
                        mt: title ? 1 : 0,
                        mb: 3,
                    }}
                >
                    {subtitle}
                </Typography>
            ) : title ? (
                <Box sx={{ mb: 3 }} />
            ) : null}

            {children}
        </Box>
    );
}
