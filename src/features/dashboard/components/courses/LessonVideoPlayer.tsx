import Close from "@mui/icons-material/Close";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

type LessonVideoPlayerProps = {
    file: File;
    title?: string;
};

export default function LessonVideoPlayer({ file, title }: LessonVideoPlayerProps) {
    const url = useMemo(() => URL.createObjectURL(file), [file]);

    useEffect(() => {
        return () => URL.revokeObjectURL(url);
    }, [url]);

    return (
        <Box sx={{ width: "100%", maxWidth: 280 }}>
            <Box
                sx={{
                    aspectRatio: "9 / 16",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    bgcolor: "secondary.main",
                    boxShadow: (theme) => `0 12px 28px ${alpha(theme.palette.secondary.main, 0.16)}`,
                }}
            >
                <Box
                    component="video"
                    src={url}
                    controls
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
            </Box>
            {title ? (
                <Typography sx={{ mt: 1, fontSize: 13, fontWeight: 700, textAlign: "center" }}>{title}</Typography>
            ) : null}
        </Box>
    );
}

type LessonVideoDialogProps = {
    file: File | null;
    title?: string;
    onClose: () => void;
};

export function LessonVideoDialog({ file, title, onClose }: LessonVideoDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog
            open={Boolean(file)}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: "background.paper",
                        borderRadius: "1rem",
                        p: 2,
                        m: 2,
                        overflow: "visible",
                    },
                },
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <IconButton aria-label={t("dashboard.courses.builder.close_preview")} onClick={onClose} sx={{ color: "text.secondary" }}>
                    <Close />
                </IconButton>
            </Box>
            {file ? <LessonVideoPlayer file={file} title={title} /> : null}
        </Dialog>
    );
}
