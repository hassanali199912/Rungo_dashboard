import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import PlayCircleOutlined from "@mui/icons-material/PlayCircleOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import type { UserNavItem } from "./DashboardLayout.types";

export const userNavItems: UserNavItem[] = [
    {
        key: "dashboard",
        labelKey: "dashboard.nav.dashboard",
        fallbackLabel: "Dashboard",
        path: "/dashboard",
        icon: GridViewOutlined,
    },
    {
        key: "shorts",
        labelKey: "dashboard.nav.shorts",
        fallbackLabel: "Shorts",
        path: "/dashboard/shorts",
        icon: PlayCircleOutlined,
    },
    {
        key: "courses",
        labelKey: "dashboard.nav.courses",
        fallbackLabel: "Courses",
        path: "/dashboard/courses",
        icon: MenuBookOutlined,
    },
    {
        key: "earnings",
        labelKey: "dashboard.nav.earnings",
        fallbackLabel: "Coin Earnings",
        path: "/dashboard/earnings",
        icon: PaymentsOutlined,
    },
    {
        key: "settings",
        labelKey: "dashboard.nav.settings",
        fallbackLabel: "Settings",
        path: "/dashboard/settings",
        icon: SettingsOutlined,
    },
];
