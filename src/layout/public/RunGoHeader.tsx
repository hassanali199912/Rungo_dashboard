import { useEffect, useState, type MouseEvent } from "react";
import {
    Box,
    Button,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import MainLogoComponent from "../../components/ui/MainLogoComponent";
import AppBtn from "../../components/ui/AppBtn";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MenuIcon from "@mui/icons-material/Menu";
import useWindowSize from "../../shared/hooks/useWindowSize";
import { useAuth } from "../../provider/AuthProvider";
import { useLogout } from "@/provider/useLogout";
import LanguageSwitcher from "../../components/divTools/LanguageSwitcher";

type NavLinkItem =
    | { label: string; path: string }
    | { label: string; path: string; hash: string };

function isNavLinkActive(link: NavLinkItem, pathname: string, hash: string) {
    if ("hash" in link && link.hash) {
        return pathname === link.path && hash === `#${link.hash}`;
    }
    return pathname === link.path && !hash;
}

function routerLinkTo(link: NavLinkItem) {
    if ("hash" in link && link.hash) {
        return { pathname: link.path, hash: link.hash };
    }
    return link.path;
}

export default function RunGoHeader() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { width } = useWindowSize();
    const { isAuthenticated } = useAuth();
    const { handleLogout, loggingOut } = useLogout();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);

    const isCompact = width < 1024;

    useEffect(() => {
        if (!isCompact) setMobileOpen(false);
    }, [isCompact]);

    const navLinks: NavLinkItem[] = [
        { label: t("nav.features"), path: "/", hash: "features" },
        { label: t("nav.instructor_hub"), path: "/", hash: "instructor" },
        { label: t("nav.app_download"), path: "/", hash: "download" },
    ];

    const scrollToHashTarget = (id: string) => {
        requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    const handleHashNavClick = (e: MouseEvent, link: NavLinkItem) => {
        if (!("hash" in link) || !link.hash) return;
        if (location.pathname !== link.path) return;
        e.preventDefault();
        navigate({ pathname: link.path, hash: link.hash }, { replace: true });
        scrollToHashTarget(link.hash);
    };

    return (
        <Box
            component="header"
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 1100,
                bgcolor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
            }}
        >
            <Container maxWidth="xl">
                <Box
                    component="nav"
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.5,
                        gap: 1,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {isCompact && (
                            <IconButton color="inherit" onClick={() => setMobileOpen((open) => !open)}>
                                <MenuIcon />
                            </IconButton>
                        )}
                        <MainLogoComponent />
                    </Box>

                    {!isCompact && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                flex: 1,
                                justifyContent: "center",
                            }}
                        >
                            {navLinks.map((link) => {
                                const to = routerLinkTo(link);
                                const toKey = typeof to === "string" ? to : `${to.pathname}#${to.hash}`;
                                const isActive = isNavLinkActive(link, location.pathname, location.hash);
                                const isHovered = hovered === toKey;

                                return (
                                    <Button
                                        key={toKey}
                                        component={RouterLink}
                                        to={to}
                                        onClick={(e) => handleHashNavClick(e, link)}
                                        onMouseEnter={() => setHovered(toKey)}
                                        onMouseLeave={() => setHovered(null)}
                                        disableRipple
                                        sx={{
                                            position: "relative",
                                            color: isActive ? "primary.main" : "text.secondary",
                                            fontWeight: isActive ? 700 : 500,
                                            px: 2,
                                            py: 1,
                                            minWidth: "auto",
                                            borderRadius: 999,
                                            "&:hover": { bgcolor: "transparent", color: "text.primary" },
                                        }}
                                    >
                                        {link.label}
                                        <Box
                                            component="span"
                                            sx={{
                                                position: "absolute",
                                                bottom: 4,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                height: "2px",
                                                width: isActive || isHovered ? "55%" : "0%",
                                                bgcolor: "primary.main",
                                                borderRadius: "4px",
                                                transition: "width 0.25s ease",
                                            }}
                                        />
                                    </Button>
                                );
                            })}
                        </Box>
                    )}

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {isAuthenticated ? (
                            <>
                                <AppBtn customType="outline" to="/dashboard">
                                    {t("nav.dashboard")}
                                </AppBtn>
                                {!isCompact && (
                                    <AppBtn customType="primary" disabled={loggingOut} onClick={handleLogout}>
                                        {t("nav.logout")}
                                    </AppBtn>
                                )}
                            </>
                        ) : (
                            <>
                                {!isCompact && (
                                    <Button
                                        onClick={() => navigate("/login")}
                                        sx={{
                                            color: "text.primary",
                                            fontWeight: 600,
                                            borderRadius: 999,
                                            "&:hover": { bgcolor: "surface.main" },
                                        }}
                                    >
                                        {t("nav.sign_in")}
                                    </Button>
                                )}
                                <Button
                                    onClick={() => navigate("/register")}
                                    sx={{
                                        bgcolor: "secondary.main",
                                        color: "secondary.contrastText",
                                        borderRadius: 999,
                                        px: 2.5,
                                        fontWeight: 700,
                                        "&:hover": { bgcolor: "secondary.dark" },
                                    }}
                                >
                                    {t("nav.get_started")}
                                </Button>
                            </>
                        )}
                        <LanguageSwitcher variant="inline" />
                    </Box>

                    {isCompact && (
                        <Box
                            sx={{
                                width: "100%",
                                overflow: "hidden",
                                maxHeight: mobileOpen ? "80vh" : 0,
                                opacity: mobileOpen ? 1 : 0,
                                pointerEvents: mobileOpen ? "auto" : "none",
                                transition: "max-height 0.3s ease, opacity 0.3s ease",
                            }}
                        >
                            <List sx={{ py: 1 }}>
                                {navLinks.map((item) => (
                                    <ListItem key={item.label} disablePadding>
                                        <ListItemButton
                                            component={RouterLink}
                                            to={routerLinkTo(item)}
                                            onClick={(e) => {
                                                setMobileOpen(false);
                                                handleHashNavClick(e, item);
                                            }}
                                            sx={{
                                                py: 0.75,
                                                px: 2,
                                                color: isNavLinkActive(item, location.pathname, location.hash)
                                                    ? "primary.main"
                                                    : "text.primary",
                                                textAlign: i18n.dir() === "rtl" ? "right" : "left",
                                            }}
                                        >
                                            <ListItemText primary={item.label} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                                {!isAuthenticated && (
                                    <ListItem>
                                        <AppBtn customType="outline" fullWidth onClick={() => navigate("/login")}>
                                            {t("nav.sign_in")}
                                        </AppBtn>
                                    </ListItem>
                                )}
                            </List>
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
