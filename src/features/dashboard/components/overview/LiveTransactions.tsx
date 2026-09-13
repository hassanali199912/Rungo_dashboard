import LockOutlined from "@mui/icons-material/LockOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import { Box, Button, Typography } from "@mui/material";
import type { ElementType } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

const ITEMS: Array<{ icon: ElementType; nameKey: string; actionKey: string; coins: string; timeKey: string }> = [
    {
        icon: LockOutlined,
        nameKey: "dashboard.tx_1_name",
        actionKey: "dashboard.tx_1_action",
        coins: "+10",
        timeKey: "dashboard.tx_1_time",
    },
    {
        icon: PersonOutlined,
        nameKey: "dashboard.tx_2_name",
        actionKey: "dashboard.tx_2_action",
        coins: "+50",
        timeKey: "dashboard.tx_2_time",
    },
    {
        icon: MenuBookOutlined,
        nameKey: "dashboard.tx_3_name",
        actionKey: "dashboard.tx_3_action",
        coins: "+260",
        timeKey: "dashboard.tx_3_time",
    },
];

export default function LiveTransactions() {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                bgcolor: "surface.main",
                borderRadius: "1rem",
                p: { xs: 2, md: 2.5 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
                    {t("dashboard.live_title")}
                </Typography>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
            </Box>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2.5 }}>
                {t("dashboard.live_subtitle")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                {ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Box key={item.nameKey} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    bgcolor: "surface.main",
                                    display: "grid",
                                    placeItems: "center",
                                    color: "text.secondary",
                                    flexShrink: 0,
                                }}
                            >
                                <Icon sx={{ fontSize: 18 }} />
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{t(item.nameKey)}</Typography>
                                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{t(item.actionKey)}</Typography>
                            </Box>
                            <Box sx={{ textAlign: "end", flexShrink: 0 }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                    {item.coins} {t("dashboard.coins")}
                                </Typography>
                                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{t(item.timeKey)}</Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            <Button
                component={RouterLink}
                to="/dashboard/earnings"
                sx={{
                    mt: 3,
                    bgcolor: "surface.main",
                    color: "text.primary",
                    borderRadius: 999,
                    py: 1.2,
                    fontWeight: 700,
                    "&:hover": { bgcolor: "surface.dark" },
                }}
            >
                {t("dashboard.live_all")}
            </Button>
        </Box>
    );
}
