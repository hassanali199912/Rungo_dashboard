import { Box } from "@mui/material";
import type { ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import RunGoHeader from "./RunGoHeader";
import RunGoFooter from "./RunGoFooter";

function isAuthPath(pathname: string) {
    const path = pathname.replace(/\/+$/, "") || "/";
    return path === "/login" || path === "/register";
}

const MainLayout = ({ children }: { children?: ReactNode }) => {
    const { pathname } = useLocation();
    const hideChrome = isAuthPath(pathname);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
            }}
        >
            {!hideChrome && <RunGoHeader />}
            <Box component="main" sx={{ flex: 1 }}>
                {children ?? <Outlet />}
            </Box>
            {!hideChrome && <RunGoFooter />}
        </Box>
    );
};

export default MainLayout;
