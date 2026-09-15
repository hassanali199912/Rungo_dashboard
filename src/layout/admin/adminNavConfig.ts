import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import PlayCircleOutlined from "@mui/icons-material/PlayCircleOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import type { UserNavItem } from "../dashboard/DashboardLayout.types";

export const adminNavItems: UserNavItem[] = [
    {
        key: "dashboard",
        labelKey: "admin.nav.dashboard",
        fallbackLabel: "Dashboard",
        path: "/admin",
        icon: GridViewOutlined,
    },
    {
        key: "instructors",
        labelKey: "admin.nav.instructors",
        fallbackLabel: "Instructors",
        path: "/admin/instructors",
        icon: SchoolOutlined,
    },
    {
        key: "students",
        labelKey: "admin.nav.students",
        fallbackLabel: "Students",
        path: "/admin/students",
        icon: GroupOutlined,
    },
    {
        key: "courses",
        labelKey: "admin.nav.courses",
        fallbackLabel: "Courses",
        path: "/admin/courses",
        icon: MenuBookOutlined,
    },
    {
        key: "shorts",
        labelKey: "admin.nav.shorts",
        fallbackLabel: "Public shorts",
        path: "/admin/shorts",
        icon: PlayCircleOutlined,
    },
    {
        key: "subscriptions",
        labelKey: "admin.nav.subscriptions",
        fallbackLabel: "Subscriptions",
        path: "/admin/subscriptions",
        icon: PaymentsOutlined,
    },
    {
        key: "invoices",
        labelKey: "admin.nav.invoices",
        fallbackLabel: "Invoices",
        path: "/admin/invoices",
        icon: ReceiptLongOutlined,
    },
    {
        key: "settings",
        labelKey: "admin.nav.settings",
        fallbackLabel: "Settings",
        path: "/admin/settings",
        icon: SettingsOutlined,
    },
];
