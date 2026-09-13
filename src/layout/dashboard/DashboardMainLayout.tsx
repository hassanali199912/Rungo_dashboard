import { useState } from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { userNavItems } from "./DashbaordNavConfig";

const expandedWidth = 248;
const collapsedWidth = 84;

export default function DashboardMainLayout() {
    const theme = useTheme();
    const { i18n } = useTranslation();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleSidebar = () => {
        if (isMobile) {
            setMobileOpen((prev) => !prev);
            return;
        }
        setCollapsed((prev) => !prev);
    };

    const closeMobileSidebar = () => setMobileOpen(false);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                height: "100vh",
                display: "flex",
                bgcolor: "background.default",
                overflow: "hidden",
            }}
        >
            {!isMobile && (
                <Box
                    sx={{
                        width: collapsed ? collapsedWidth : expandedWidth,
                        transition: "width 0.2s ease",
                        flexShrink: 0,
                    }}
                >
                    <DashboardSidebar
                        navItems={userNavItems}
                        collapsed={collapsed}
                        onToggleCollapsed={toggleSidebar}
                    />
                </Box>
            )}

            <Drawer
                anchor={i18n.dir() === "rtl" ? "right" : "left"}
                open={isMobile && mobileOpen}
                onClose={closeMobileSidebar}
                slotProps={{ paper: { sx: { width: expandedWidth, bgcolor: "background.paper" } } }}
            >
                <DashboardSidebar
                    navItems={userNavItems}
                    collapsed={false}
                    onToggleCollapsed={toggleSidebar}
                    onNavigate={closeMobileSidebar}
                />
            </Drawer>

            <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <DashboardHeader onMenuClick={toggleSidebar} />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        bgcolor: "background.default",
                        p: { xs: 1.5, md: 2 },
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
