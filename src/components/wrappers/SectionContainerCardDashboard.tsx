import { typography } from "@/styles/fontsLayout"
import AddIcon from "@mui/icons-material/Add"
import { MoreHoriz } from "@mui/icons-material"
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import { useState, type MouseEvent, type ReactNode } from "react"
import AppBtn from "../ui/AppBtn"
import { BtnLayout } from "@/styles/btnStyle"
import type { ActionLable, MultibleActionWithIcon } from "@/shared/types/generalTypes"

interface SectionContainerCardDashboardProps {
    children: ReactNode,
    variant?: "withBg" | "noBg",
    title?: string,
    addAction?: ActionLable;
    subAction?: ActionLable;
    multibleSubAction?: MultibleActionWithIcon[];
    menuOptions?: ActionLable[];
}

const SectionContainerCardDashboard = ({
    children,
    variant = "withBg",
    title = "",
    addAction,
    subAction,
    menuOptions = [],
    multibleSubAction
}: SectionContainerCardDashboardProps) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(menuAnchorEl);

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
    };

    return (
        <Box
            sx={{
                bgcolor: variant === "withBg" ? "surface.light" : "transparent",
                borderRadius: 3,
                minHeight: "100%",
                p: {
                    lg: "32px",
                    md: "24px",
                    xs: "4px"
                },
                paddingInlineEnd: {
                    lg: "40px",
                    md: "32px",
                    xs: "0px"
                }
            }}
        >
            {(title || addAction || subAction || menuOptions.length > 0) && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: { xs: "flex-start", sm: "space-between" },
                        gap: { xs: 2, md: 1.5 },
                        paddingBlockEnd: { xs: "16px", md: "24px" },
                        width: "100%",
                    }}
                >
                    <Typography
                        sx={{
                            ...typography.font24_16,
                            flex: { xs: "unset", sm: 1 },
                            width: "100%",
                            mb: { xs: 1.5, sm: 0 },
                            textAlign: { xs: "start", sm: "inherit" },
                        }}
                    >
                        {title}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: { xs: 1, sm: 1.5 },
                            width: { xs: "100%", sm: "auto" },
                            justifyContent: { xs: "flex-start", sm: "flex-end" },
                        }}
                    >
                        {addAction && (
                            <AppBtn
                                customType="primary"
                                startIcon={
                                    <AddIcon
                                        sx={{
                                            marginInlineEnd: {
                                                lg: "10px",
                                                md: "8px",
                                                xs: "6px",
                                            },
                                        }}
                                    />
                                }
                                onClick={addAction.onClick}
                                sx={{
                                    ...BtnLayout.btnMainStyle,
                                    width: { xs: "100%", sm: "auto" },
                                }}
                                fullWidth={true}
                            >
                                {addAction.label}
                            </AppBtn>
                        )}
                        {subAction && (
                            <AppBtn
                                customType="outline"
                                onClick={subAction.onClick}
                                {...(subAction.icon && { startIcon: subAction.icon })}
                                                           sx={{
                                    ...BtnLayout.btnMainStyle,
                                    width: { xs: "100%", sm: "auto" },
                                }}
                                fullWidth={true}
                            >
                                {subAction.label}
                            </AppBtn>
                        )}
                        {multibleSubAction &&
                            multibleSubAction.map((btn, index) => (
                                <AppBtn
                                    key={`${btn.label}-${index}`}
                                    customType={btn.customType ? btn.customType : "outline"}
                                    startIcon={btn.icon && btn.icon}
                                    onClick={btn.onClick}
                                    sx={{
                                        ...BtnLayout.btnMainStyle,
                                        width: { xs: "100%", sm: "auto" },
                                    }}
                                    fullWidth={true}
                                >
                                    {btn.label}
                                </AppBtn>
                            ))}

                        {menuOptions.length > 0 && (
                            <>
                                <IconButton
                                    onClick={handleOpenMenu}
                                    sx={{
                                        width: { xs: "40px", sm: "auto" },
                                        minWidth: "40px",
                                        mx: { xs: 0, sm: 0.5 },
                                    }}
                                >
                                    <MoreHoriz />
                                </IconButton>
                                <Menu
                                    anchorEl={menuAnchorEl}
                                    open={isMenuOpen}
                                    onClose={handleCloseMenu}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    {menuOptions.map((option) => (
                                        <MenuItem
                                            key={option.label}
                                            onClick={() => {
                                                handleCloseMenu();
                                                option.onClick();
                                            }}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}
                    </Box>
                </Box>
            )}

            {children}
        </Box>
    )
}

export default SectionContainerCardDashboard