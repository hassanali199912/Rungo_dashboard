import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Box, Typography } from "@mui/material";
import type { ElementType } from "react";
import toast from "react-hot-toast";

type ToastVariant = "success" | "error" | "warning" | "info";

type AppToastProps = {
    title: string;
    description?: string;
    variant?: ToastVariant;
};

const TOAST_VARIANTS: Record<
    ToastVariant,
    {
        bgcolor: string;
        shadow: string;
        Icon: ElementType;
    }
> = {
    success: {
        bgcolor: "#109D46",
        shadow: "0 8px 24px rgba(16, 157, 70, 0.28)",
        Icon: CheckCircleIcon,
    },
    error: {
        bgcolor: "#DC2626",
        shadow: "0 8px 24px rgba(220, 38, 38, 0.28)",
        Icon: ErrorOutlineIcon,
    },
    warning: {
        bgcolor: "#E17100",
        shadow: "0 8px 24px rgba(225, 113, 0, 0.28)",
        Icon: WarningAmberOutlinedIcon,
    },
    info: {
        bgcolor: "#155DFC",
        shadow: "0 8px 24px rgba(21, 93, 252, 0.28)",
        Icon: InfoOutlinedIcon,
    },
};

function AppToastContent({ title, description, variant = "success" }: AppToastProps) {
    const { bgcolor, shadow, Icon } = TOAST_VARIANTS[variant];

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                bgcolor,
                color: "common.white",
                px: 2,
                py: 1.5,
                borderRadius: 3,
                boxShadow: shadow,
                minWidth: { xs: 280, sm: 360 },
                maxWidth: 420,
            }}
        >
            <Icon sx={{ fontSize: 22, color: "common.white", mt: 0.15, flexShrink: 0 }} />
            <Box sx={{ textAlign: "start", minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "common.white", lineHeight: 1.4 }}>
                    {title}
                </Typography>
                {description ? (
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 400,
                            color: "rgba(255,255,255,0.92)",
                            mt: 0.5,
                            lineHeight: 1.4,
                        }}
                    >
                        {description}
                    </Typography>
                ) : null}
            </Box>
        </Box>
    );
}

function showToast(variant: ToastVariant, title: string, description?: string) {
    return toast.custom(
        () => <AppToastContent variant={variant} title={title} description={description} />,
        { duration: 4000 },
    );
}

export function showSuccessToast(title: string, description?: string) {
    return showToast("success", title, description);
}

export function showErrorToast(title: string, description?: string) {
    return showToast("error", title, description);
}

export function showWarningToast(title: string, description?: string) {
    return showToast("warning", title, description);
}

export function showInfoToast(title: string, description?: string) {
    return showToast("info", title, description);
}
