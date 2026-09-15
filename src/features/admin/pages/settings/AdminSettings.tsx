import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import AppearanceSettingsCard from "@/features/dashboard/pages/settings/AppearanceSettingsCard";
import PasswordSettingsCard from "@/features/dashboard/pages/settings/PasswordSettingsCard";
import ProfileSettingsCard from "@/features/dashboard/pages/settings/ProfileSettingsCard";
import PlatformSettingsCard from "./PlatformSettingsCard";

export default function AdminSettings() {
    const { t } = useTranslation();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SectionWrapper title={t("admin.settings.title")} description={t("admin.settings.description")} />
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "9fr 3fr" },
                    gap: 2,
                    alignItems: "stretch",
                }}
            >
                <ProfileSettingsCard />
                <AppearanceSettingsCard />
            </Box>
            <PasswordSettingsCard />
            <PlatformSettingsCard />
        </Box>
    );
}
