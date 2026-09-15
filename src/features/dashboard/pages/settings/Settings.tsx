import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import SectionWrapper from "../../components/SectionWrapper";
import AppearanceSettingsCard from "./AppearanceSettingsCard";
import PasswordSettingsCard from "./PasswordSettingsCard";
import ProfileSettingsCard from "./ProfileSettingsCard";

export default function Settings() {
    const { t } = useTranslation();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SectionWrapper
                title={t("dashboard.settings.title")}
                description={t("dashboard.settings.description")}
            />
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
        </Box>
    );
}
