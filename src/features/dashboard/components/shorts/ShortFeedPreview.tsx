import PlayArrowOutlined from "@mui/icons-material/PlayArrowOutlined";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

type ShortFeedPreviewProps = {
    title: string;
    creatorName: string;
    video?: File | null;
};

export default function ShortFeedPreview({ title, creatorName, video }: ShortFeedPreviewProps) {
    const { t } = useTranslation();
    const videoUrl = useMemo(() => (video ? URL.createObjectURL(video) : null), [video]);

    useEffect(() => {
        return () => {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
        };
    }, [videoUrl]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box
                sx={{
                    width: { xs: 220, md: 248 },
                    aspectRatio: "9 / 16",
                    borderRadius: "2rem",
                    bgcolor: "secondary.main",
                    p: 1,
                    boxShadow: (theme) => `0 16px 40px ${alpha(theme.palette.secondary.main, 0.18)}`,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        borderRadius: "1.5rem",
                        overflow: "hidden",
                        bgcolor: "neutral.main",
                    }}
                >
                    {videoUrl ? (
                        <Box
                            component="video"
                            src={videoUrl}
                            controls
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <Box sx={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: "50%",
                                    bgcolor: "background.paper",
                                    display: "grid",
                                    placeItems: "center",
                                    color: "text.primary",
                                }}
                            >
                                <PlayArrowOutlined />
                            </Box>
                        </Box>
                    )}

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 16,
                            insetInline: 14,
                            color: "common.white",
                        }}
                    >
                        <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{creatorName}</Typography>
                        <Typography sx={{ fontSize: 12, opacity: 0.86, mt: 0.25 }}>
                            {title || t("dashboard.shorts.publisher.untitled")}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Typography sx={{ mt: 1.5, fontSize: 12, color: "text.secondary" }}>
                {t("dashboard.shorts.publisher.live_view")}
            </Typography>
        </Box>
    );
}
