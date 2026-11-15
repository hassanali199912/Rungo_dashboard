import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import { useAuth } from "@/provider/AuthProvider";
import { isAdminRole, isAssistantRole } from "@/shared/auth/roles";
import AppearanceSettingsCard from "@/features/dashboard/pages/settings/AppearanceSettingsCard";
import PasswordSettingsCard from "@/features/dashboard/pages/settings/PasswordSettingsCard";
import ProfileSettingsCard from "@/features/dashboard/pages/settings/ProfileSettingsCard";
import PlatformSettingsCard from "./PlatformSettingsCard";

export default function AdminSettings() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const assistant = isAssistantRole(user?.role);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SectionWrapper
                title={t("admin.settings.title")}
                description={t(assistant ? "admin.settings.description_assistant" : "admin.settings.description")}
            />
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: assistant ? "1fr" : { xs: "1fr", md: "9fr 3fr" },
                    gap: 2,
                    alignItems: "stretch",
                }}
            >
                {assistant ? null : <ProfileSettingsCard />}
                <AppearanceSettingsCard />
            </Box>
            {assistant ? null : <PasswordSettingsCard />}
            {isAdminRole(user?.role) ? <PlatformSettingsCard /> : null}
        </Box>
    );
}
