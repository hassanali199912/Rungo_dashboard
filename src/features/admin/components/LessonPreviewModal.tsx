import Close from "@mui/icons-material/Close";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

type LessonPreviewModalProps = {
    open: boolean;
    title: string;
    videoUrl: string | null;
    onClose: () => void;
    hint?: string;
    aspectRatio?: string;
    maxWidth?: "xs" | "sm" | "md";
};

export default function LessonPreviewModal({
    open,
    title,
    videoUrl,
    onClose,
    hint,
    aspectRatio = "16 / 9",
    maxWidth = "sm",
}: LessonPreviewModalProps) {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: "background.paper",
                        borderRadius: "1rem",
                        p: 2,
                        m: 2,
                        overflow: "hidden",
                    },
                },
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 16 }}>{title}</Typography>
                <IconButton aria-label={t("admin.people.close")} onClick={onClose} sx={{ color: "text.secondary" }}>
                    <Close />
                </IconButton>
            </Box>
            <Box
                sx={{
                    aspectRatio,
                    maxHeight: aspectRatio === "9 / 16" ? 520 : undefined,
                    mx: aspectRatio === "9 / 16" ? "auto" : undefined,
                    width: aspectRatio === "9 / 16" ? "min(100%, 280px)" : "100%",
                    borderRadius: "0.85rem",
                    overflow: "hidden",
                    bgcolor: "secondary.main",
                    boxShadow: (theme) => `0 12px 28px ${alpha(theme.palette.secondary.main, 0.16)}`,
                }}
            >
                {videoUrl ? (
                    <Box
                        component="video"
                        key={videoUrl}
                        src={videoUrl}
                        controls
                        autoPlay
                        playsInline
                        preload="metadata"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                            bgcolor: "secondary.main",
                        }}
                    />
                ) : null}
            </Box>
            <Typography sx={{ mt: 1.25, fontSize: 13, color: "text.secondary" }}>
                {hint ?? t("admin.courses.detail.preview_hint")}
            </Typography>
        </Dialog>
    );
}
