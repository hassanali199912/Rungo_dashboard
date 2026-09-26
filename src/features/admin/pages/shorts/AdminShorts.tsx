import { Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import ContentFilterBar from "@/features/dashboard/components/ContentFilterBar";
import { defaultContentFilter, type ContentFilterState } from "@/features/dashboard/components/contentFilter.types";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import { useShort } from "@/features/queryHooks/shorts/useShort";
import { useShorts, type Short } from "@/features/queryHooks/shorts/useShorts";
import AdminDataTable, { AdminTableText, type AdminTableColumn } from "../../components/AdminDataTable";
import LessonPreviewModal from "../../components/LessonPreviewModal";
import StatusBadge from "../../components/StatusBadge";

const SHORTS_PARAMS = { page: 1, limit: 50 } as const;
const SHORTS_MEDIA_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

function getShortMediaUrl(path: string | null | undefined) {
    if (!path) return null;
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    return `${SHORTS_MEDIA_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

function matchesDomain(tagCodes: string[], domain: string) {
    if (domain === "all") return true;
    const tags = tagCodes.map((tag) => tag.toLowerCase());
    if (domain === "ui-ux") return tags.some((tag) => tag.includes("ui") || tag.includes("ux") || tag.includes("design"));
    if (domain === "code") return tags.some((tag) => tag.includes("code") || tag.includes("program"));
    if (domain === "cooking") return tags.some((tag) => tag.includes("cook") || tag.includes("food"));
    if (domain === "fitness") return tags.some((tag) => tag.includes("fit") || tag.includes("sport"));
    return tags.includes(domain);
}

export default function AdminShorts() {
    const { t } = useTranslation();
    const [filter, setFilter] = useState<ContentFilterState>(defaultContentFilter);
    const [previewId, setPreviewId] = useState<string | null>(null);
    const shortsQuery = useShorts(SHORTS_PARAMS);
    const previewQuery = useShort(previewId ?? "", Boolean(previewId));
    const shorts = shortsQuery.data?.items ?? [];
    const preview = shorts.find((row) => row.id === previewId) ?? null;
    const previewVideo = getShortMediaUrl(previewQuery.data?.videoUrl ?? preview?.videoUrl);

    const visible = shorts.filter((row) => {
        const q = filter.query.trim().toLowerCase();
        const matchesQuery =
            !q ||
            row.title.toLowerCase().includes(q) ||
            row.description.toLowerCase().includes(q) ||
            row.tagCodes.some((tag) => tag.toLowerCase().includes(q));
        const matchesStatus = filter.status === "all" || (filter.status === "hidden" ? !row.isActive : row.isActive);
        return matchesQuery && matchesDomain(row.tagCodes, filter.domain) && matchesStatus;
    });

    const columns: AdminTableColumn<Short>[] = [
        {
            id: "title",
            label: t("admin.shorts.col_title"),
            render: (row) => <AdminTableText strong>{row.title}</AdminTableText>,
        },
        {
            id: "tags",
            label: t("admin.shorts.col_tags"),
            render: (row) => (
                <AdminTableText muted>{row.tagCodes.length ? row.tagCodes.join(", ") : t("admin.shorts.not_set")}</AdminTableText>
            ),
        },
        {
            id: "likes",
            label: t("admin.shorts.col_likes"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.likeCount}</AdminTableText>,
        },
        {
            id: "comments",
            label: t("admin.shorts.col_comments"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.commentCount}</AdminTableText>,
        },
        {
            id: "shares",
            label: t("admin.shorts.col_shares"),
            align: "center",
            render: (row) => <AdminTableText strong>{row.shareCount}</AdminTableText>,
        },
        {
            id: "status",
            label: t("footer.status"),
            render: (row) => (
                <StatusBadge
                    status={row.isActive ? "visible" : "hidden"}
                    label={row.isActive ? t("admin.content.visible") : t("admin.content.hidden_status")}
                />
            ),
        },
    ];

    return (
        <SectionWrapper title={t("admin.shorts.title")} description={t("admin.shorts.description")}>
            <ContentFilterBar
                value={filter}
                onChange={setFilter}
                searchPlaceholder={t("admin.shorts.search")}
                domainLabel={t("admin.people.expertise")}
                domainOptions={[
                    { value: "all", label: t("admin.people.all") },
                    { value: "code", label: t("dashboard.shorts.domain_code") },
                    { value: "ui-ux", label: t("dashboard.shorts.domain_ui") },
                    { value: "fitness", label: t("dashboard.shorts.domain_fitness") },
                    { value: "cooking", label: t("dashboard.shorts.domain_cooking") },
                ]}
                sortLabel={t("admin.people.plan")}
                sortOptions={[{ value: "plays", label: t("admin.people.all") }]}
                statusOptions={[
                    { value: "all", label: t("admin.people.all"), count: shorts.length },
                    {
                        value: "visible",
                        label: t("admin.content.visible"),
                        count: shorts.filter((row) => row.isActive).length,
                    },
                    {
                        value: "hidden",
                        label: t("admin.content.hidden_status"),
                        count: shorts.filter((row) => !row.isActive).length,
                    },
                ]}
            />

            {shortsQuery.isPending ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress aria-label={t("status.loading")} />
                </Box>
            ) : shortsQuery.isError ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 6 }}>
                    <Typography sx={{ color: "error.main", textAlign: "center" }}>{t("admin.shorts.load_failed")}</Typography>
                    <AppBtn customType="primary" type="button" onClick={() => shortsQuery.refetch()} sx={{ borderRadius: 999 }}>
                        {t("status.retry")}
                    </AppBtn>
                </Box>
            ) : (
                <AdminDataTable
                    columns={columns}
                    rows={visible}
                    emptyLabel={t("admin.shorts.empty")}
                    ariaLabel={t("admin.shorts.title")}
                    getActions={() => [
                        {
                            key: "preview",
                            label: t("admin.shorts.preview"),
                            onClick: (item) => setPreviewId(item.id),
                        },
                    ]}
                />
            )}

            <LessonPreviewModal
                open={Boolean(previewId)}
                title={previewQuery.data?.title ?? preview?.title ?? ""}
                videoUrl={previewQuery.isError ? null : previewVideo}
                onClose={() => setPreviewId(null)}
                hint={previewQuery.isError ? t("admin.shorts.preview_failed") : t("admin.shorts.preview_hint")}
                aspectRatio="9 / 16"
                maxWidth="xs"
            />
        </SectionWrapper>
    );
}
