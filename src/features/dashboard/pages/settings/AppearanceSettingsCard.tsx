import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import type { ElementType } from "react";
import { useTranslation } from "react-i18next";
import { useThemeMode } from "@/provider/ThemeModeProvider";
import StudioCard from "../../components/StudioCard";

export default function AppearanceSettingsCard() {
    const { t } = useTranslation();
    const { mode, setMode } = useThemeMode();

    const options: { value: PaletteMode; label: string; hint: string; icon: ElementType }[] = [
        {
            value: "light",
            label: t("dashboard.settings.appearance.light"),
            hint: t("dashboard.settings.appearance.light_hint"),
            icon: LightModeOutlined,
        },
        {
            value: "dark",
            label: t("dashboard.settings.appearance.dark"),
            hint: t("dashboard.settings.appearance.dark_hint"),
            icon: DarkModeOutlined,
        },
    ];

    return (
        <StudioCard
            title={t("dashboard.settings.appearance.title")}
            subtitle={t("dashboard.settings.appearance.subtitle")}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {options.map((option) => {
                    const selected = mode === option.value;
                    const Icon = option.icon;

                    return (
                        <Box
                            key={option.value}
                            component="button"
                            type="button"
                            onClick={() => setMode(option.value)}
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1.5,
                                textAlign: "start",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                appearance: "none",
                                borderRadius: "1rem",
                                border: "1px solid",
                                borderColor: (theme) =>
                                    selected
                                        ? "primary.main"
                                        : alpha(theme.palette.secondary.main, 0.12),
                                bgcolor: selected ? "surface.main" : "background.paper",
                                p: 2,
                                color: "text.primary",
                                "&:hover": {
                                    borderColor: "primary.main",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    bgcolor: "surface.main",
                                    display: "grid",
                                    placeItems: "center",
                                    flexShrink: 0,
                                    color: selected ? "primary.main" : "text.secondary",
                                }}
                            >
                                <Icon sx={{ fontSize: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{option.label}</Typography>
                                <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}>
                                    {option.hint}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </StudioCard>
    );
}
