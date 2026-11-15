import { useTranslation } from "react-i18next";
import DashboardMainLayout from "@/layout/dashboard/DashboardMainLayout";
import { useAuth } from "@/provider/AuthProvider";
import { isAssistantRole } from "@/shared/auth/roles";
import { navItemsForStaff } from "./adminNavConfig";

export default function AdminShell() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const assistant = isAssistantRole(user?.role);

    return (
        <DashboardMainLayout
            navItems={navItemsForStaff(user?.role)}
            homePath="/admin"
            roleLabel={assistant ? t("admin.role_assistant") : undefined}
        />
    );
}
