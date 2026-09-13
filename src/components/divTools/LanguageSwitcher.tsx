import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

type LanguageSwitcherProps = {
    variant?: "fab" | "inline";
};

function LanguageSwitcher({ variant = "inline" }: LanguageSwitcherProps) {
    const { i18n } = useTranslation();

    const handleClick = () => {
        i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
    };

    const label = i18n.language === "en" ? "AR" : "EN";

    if (variant === "fab") {
        return (
            <Button
                variant="text"
                onClick={handleClick}
                sx={{
                    position: "fixed",
                    insetInlineEnd: "1rem",
                    bottom: "1rem",
                    bgcolor: "primary.main",
                    borderRadius: "50%",
                    minWidth: 48,
                    width: 48,
                    height: 48,
                    color: "primary.contrastText",
                    zIndex: 1200,
                    "&:hover": { bgcolor: "primary.dark" },
                }}
            >
                {label}
            </Button>
        );
    }

    return (
        <Button
            variant="text"
            onClick={handleClick}
            aria-label={label}
            sx={{
                minWidth: 40,
                color: "text.secondary",
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 999,
                "&:hover": { bgcolor: "surface.main", color: "text.primary" },
            }}
        >
            {label}
        </Button>
    );
}

export default LanguageSwitcher;
