import { useState, type MouseEvent } from "react";
import {
    Avatar,
    Box,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/divTools/LanguageSwitcher";
import { useAuth } from "@/provider/AuthProvider";
import { useLogoutHook as useLogout } from "@/provider/useLogout";
import { isAdminRole } from "@/shared/auth/roles";
import DashboardBreadcrumbs from "./DashboardBreadcrumbs";

interface UserHeaderProps {
    onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: UserHeaderProps) {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const { user } = useAuth();
    const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
    const { handleLogout, loggingOut } = useLogout();

    const openProfile = (event: MouseEvent<HTMLElement>) => setProfileAnchor(event.currentTarget);
    const closeProfile = () => setProfileAnchor(null);
    const profileName = user?.name || t("dashboard.profile_name");
    const isAdmin = pathname.startsWith("/admin") || isAdminRole(user?.role);
    const settingsPath = isAdmin ? "/admin/settings" : "/dashboard/settings";
    const searchKey = isAdmin ? "admin.search" : "dashboard.search";

    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                borderBottom: "1px solid",
                borderColor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                px: { xs: 1.5, md: 3 },
                py: 1.5,
                position: "sticky",
                top: 0,
                zIndex: 5,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                {onMenuClick && (
                    <IconButton onClick={onMenuClick} sx={{ display: { md: "none" } }}>
                        <MenuOutlinedIcon />
                    </IconButton>
                )}

                <DashboardBreadcrumbs />

                <TextField
                    fullWidth
                    placeholder={t(searchKey)}
                    sx={{
                        display: { xs: "none", md: "block" },
                        maxWidth: 420,
                        flex: 1,
                        "& .MuiInputBase-root": {
                            bgcolor: "surface.main",
                            borderRadius: 999,
                            minHeight: 42,
                            fontSize: 13,
                        },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlined sx={{ fontSize: 18, color: "text.disabled" }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <LanguageSwitcher variant="inline" />
                    <IconButton sx={{ color: "text.secondary" }}>
                        <NotificationsNoneOutlined />
                    </IconButton>
                    <IconButton
                        onClick={openProfile}
                        sx={{
                            borderRadius: 999,
                            px: 1,
                            py: 0.5,
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: 13 }}>
                            {profileName.slice(0, 1)}
                        </Avatar>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, display: { xs: "none", sm: "block" } }}>
                            {profileName}
                        </Typography>
                        <KeyboardArrowDownIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                    </IconButton>
                </Box>
            </Box>
            <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={closeProfile}>
                <MenuItem component={RouterLink} to={settingsPath} onClick={closeProfile} sx={{ fontSize: 14 }}>
                    {t("dashboard.nav.settings")}
                </MenuItem>
                <MenuItem disabled={loggingOut} onClick={handleLogout} sx={{ fontSize: 14, color: "error.main" }}>
                    {t("nav.logout")}
                </MenuItem>
            </Menu>
        </Box>
    );
}
