import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material";
import type { ElementType, ReactNode } from "react";
import AppBtn from "@/components/ui/AppBtn";

export type SectionAction = {
    label: string;
    icon?: ElementType;
    onClick?: () => void;
    to?: string;
};

type SectionWrapperProps = {
    children?: ReactNode;
    title?: string;
    description?: string;
    action?: SectionAction;
    sx?: SxProps<Theme>;
};

export default function SectionWrapper({ children, title, description, action, sx }: SectionWrapperProps) {
    const ActionIcon = action?.icon;
    const showHeader = Boolean(title || description || action);

    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                borderRadius: "1rem",
                boxShadow: (theme) => `0 2px 12px 0 ${alpha(theme.palette.secondary.main, 0.06)}`,
                p: { xs: 2, md: 3 },
                ...sx,
            }}
        >
            {showHeader && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "stretch", sm: "flex-start" },
                        justifyContent: "space-between",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        mb: children ? 3 : 0,
                    }}
                >
                    <Box sx={{ minWidth: 0, maxWidth: 640 }}>
                        {title && (
                            <Typography
                                component="h1"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: 26, md: 32 },
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.2,
                                }}
                            >
                                {title}
                            </Typography>
                        )}
                        {description && (
                            <Typography sx={{ mt: title ? 0.75 : 0, color: "text.secondary", fontSize: { xs: 13, md: 14 } }}>
                                {description}
                            </Typography>
                        )}
                    </Box>

                    {action && (
                        <AppBtn
                            customType="primary"
                            to={action.to}
                            onClick={action.onClick}
                            startIcon={ActionIcon ? <ActionIcon sx={{ fontSize: 18 }} /> : undefined}
                            sx={{
                                borderRadius: 999,
                                px: 2.25,
                                py: 1,
                                flexShrink: 0,
                                alignSelf: { xs: "stretch", sm: "center" },
                                whiteSpace: "nowrap",
                            }}
                        >
                            {action.label}
                        </AppBtn>
                    )}
                </Box>
            )}
            {children}
        </Box>
    );
}
