import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import PlayCircleOutlined from "@mui/icons-material/PlayCircleOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import SupportAgentOutlined from "@mui/icons-material/SupportAgentOutlined";
import { isAdminRole } from "@/shared/auth/roles";
import type { UserNavItem } from "../dashboard/DashboardLayout.types";

const ASSISTANT_HIDDEN_NAV = new Set(["invoices", "assistants"]);

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
        key: "assistants",
        labelKey: "admin.nav.assistants",
        fallbackLabel: "Assistants",
        path: "/admin/assistants",
        icon: SupportAgentOutlined,
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

export function navItemsForStaff(role: string | null | undefined) {
    if (isAdminRole(role)) return adminNavItems;
    return adminNavItems.filter((item) => !ASSISTANT_HIDDEN_NAV.has(item.key));
}
