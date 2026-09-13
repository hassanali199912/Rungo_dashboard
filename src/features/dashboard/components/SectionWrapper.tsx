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
    type?: "button" | "submit";
    variant?: "primary" | "outline";
};

type SectionWrapperProps = {
    children?: ReactNode;
    title?: string;
    description?: string;
    action?: SectionAction;
    actions?: SectionAction[];
    sx?: SxProps<Theme>;
};

export default function SectionWrapper({ children, title, description, action, actions, sx }: SectionWrapperProps) {
    const headerActions = actions?.length ? actions : action ? [action] : [];
    const showHeader = Boolean(title || description || headerActions.length);

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

                    {headerActions.length > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                alignSelf: { xs: "stretch", sm: "center" },
                            }}
                        >
                            {headerActions.map((item) => {
                                const ActionIcon = item.icon;
                                return (
                                    <AppBtn
                                        key={item.label}
                                        customType={item.variant ?? "primary"}
                                        type={item.type ?? "button"}
                                        to={item.to}
                                        onClick={item.onClick}
                                        startIcon={ActionIcon ? <ActionIcon sx={{ fontSize: 18 }} /> : undefined}
                                        sx={{
                                            borderRadius: 999,
                                            px: 2.25,
                                            py: 1,
                                            flexShrink: 0,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {item.label}
                                    </AppBtn>
                                );
                            })}
                        </Box>
                    )}
                </Box>
            )}
            {children}
        </Box>
    );
}
