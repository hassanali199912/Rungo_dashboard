import ChatBubbleOutlineOutlined from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import IosShareOutlined from "@mui/icons-material/IosShareOutlined";
import PlayArrowOutlined from "@mui/icons-material/PlayArrowOutlined";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { useTranslation } from "react-i18next";

type ShortFeedPreviewProps = {
    authorName: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
    video?: File | null;
    existingVideoUrl?: string;
};

export default function ShortFeedPreview({
    authorName,
    description,
    likes,
    comments,
    shares,
    video,
    existingVideoUrl,
}: ShortFeedPreviewProps) {
    const { t, i18n } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const localVideoUrl = useMemo(() => (video ? URL.createObjectURL(video) : null), [video]);
    const previewVideoUrl = localVideoUrl ?? existingVideoUrl;
    const caption = description.trim();
    const isRtl = i18n.dir() === "rtl";

    useEffect(() => {
        return () => {
            if (localVideoUrl) URL.revokeObjectURL(localVideoUrl);
        };
    }, [localVideoUrl]);

    const togglePlay = () => {
        const element = videoRef.current;
        if (!element) return;
        if (element.paused) {
            void element.play();
            return;
        }
        element.pause();
    };

    const actions: Array<{ key: string; icon: ElementType; count: number; label: string }> = [
        { key: "likes", icon: FavoriteBorder, count: likes, label: t("dashboard.shorts.stat_likes") },
        { key: "comments", icon: ChatBubbleOutlineOutlined, count: comments, label: t("dashboard.shorts.stat_comments") },
        { key: "shares", icon: IosShareOutlined, count: shares, label: t("dashboard.shorts.stat_shares") },
    ];

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
                    {previewVideoUrl ? (
                        <Box
                            component="video"
                            ref={videoRef}
                            src={previewVideoUrl}
                            playsInline
                            onClick={togglePlay}
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "pointer" }}
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

                    {previewVideoUrl && !playing ? (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                display: "grid",
                                placeItems: "center",
                                pointerEvents: "none",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    display: "grid",
                                    placeItems: "center",
                                    color: "common.white",
                                    bgcolor: (theme) => alpha(theme.palette.common.black, 0.35),
                                }}
                            >
                                <PlayArrowOutlined />
                            </Box>
                        </Box>
                    ) : null}

                    <Box
                        sx={{
                            position: "absolute",
                            insetInline: 0,
                            bottom: 0,
                            display: "flex",
                            direction: "ltr",
                            alignItems: "flex-end",
                            gap: 1,
                            px: 1.25,
                            pt: 7,
                            pb: 1.5,
                            pointerEvents: "none",
                            background: (theme) =>
                                `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.78)} 0%, ${alpha(theme.palette.common.black, 0.28)} 55%, transparent 100%)`,
                        }}
                    >
                        <Box sx={{ flex: 1, minWidth: 0, direction: isRtl ? "rtl" : "ltr", textAlign: "left" }}>
                            <Typography sx={{ color: "common.white", fontSize: 13, fontWeight: 800, lineHeight: 1.3 }}>
                                {authorName}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    alignItems: "baseline",
                                    gap: 0.5,
                                    mt: 0.35,
                                    minWidth: 0,
                                    maxWidth: "100%",
                                    color: "common.white",
                                    fontSize: 12,
                                    lineHeight: 1.35,
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        flex: "1 1 auto",
                                        minWidth: 0,
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {caption}
                                </Box>
                                {caption ? (
                                    <Box
                                        component="span"
                                        sx={{
                                            flexShrink: 0,
                                            color: (theme) => alpha(theme.palette.common.white, 0.72),
                                            fontWeight: 600,
                                        }}
                                    >
                                        {t("dashboard.shorts.publisher.show_more")}
                                    </Box>
                                ) : null}
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.25, flexShrink: 0 }}>
                            {actions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <Box
                                        key={action.key}
                                        aria-label={`${action.label} ${action.count}`}
                                        sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25, color: "common.white" }}
                                    >
                                        <Icon sx={{ fontSize: 22 }} />
                                        <Typography sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>
                                            {action.count.toLocaleString(i18n.language)}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Typography sx={{ mt: 1.5, fontSize: 12, color: "text.secondary" }}>
                {t("dashboard.shorts.publisher.live_view")}
            </Typography>
        </Box>
    );
}
