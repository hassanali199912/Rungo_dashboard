import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function HomePhonePreview() {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 380,
                mx: "auto",
                borderRadius: 5,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 24px 60px rgba(18, 20, 23, 0.08)",
                p: 2.5,
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, color: "text.disabled", fontSize: 12 }}>
                <span>9:41</span>
                <span>●●●</span>
            </Box>

            <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 0.5 }}>
                {t("hero.phone_kicker")}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>{t("hero.phone_feed")}</Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{t("hero.phone_coins")}</Typography>
            </Box>

            {[
                { title: t("hero.phone_card_1_title"), meta: t("hero.phone_card_1_meta") },
                { title: t("hero.phone_card_2_title"), meta: t("hero.phone_card_2_meta") },
            ].map((card) => (
                <Box
                    key={card.title}
                    sx={{
                        borderRadius: 3,
                        bgcolor: "surface.main",
                        p: 1.5,
                        mb: 1.25,
                    }}
                >
                    <Box
                        sx={{
                            height: 88,
                            borderRadius: 2,
                            mb: 1,
                            background: "linear-gradient(135deg, #FF5722 0%, #ffb5a0 55%, #1E2229 100%)",
                        }}
                    />
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{card.title}</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{card.meta}</Typography>
                </Box>
            ))}

            <Box sx={{ display: "flex", justifyContent: "space-around", pt: 1, color: "text.secondary", fontSize: 11 }}>
                <span>{t("hero.phone_tab_home")}</span>
                <span>{t("hero.phone_tab_learn")}</span>
                <span>{t("hero.phone_tab_earn")}</span>
            </Box>
        </Box>
    );
}
