import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formOutlinedSingleLineInputSx } from "@/components/form/formFieldLayout";
import AppBtn from "@/components/ui/AppBtn";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import { useToggleUserActive } from "@/features/queryHooks/users/useToggleUserActive";
import { useUsersByRole } from "@/features/queryHooks/users/useUsersByRole";
import type { UserProfile } from "@/features/queryHooks/users/types";
import AdminDataTable, { AdminTablePersonCell, AdminTableText, type AdminTableColumn } from "../../components/AdminDataTable";

export default function Instructors() {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState("");
    const instructorsQuery = useUsersByRole("instructor");
    const toggleActive = useToggleUserActive();
    const instructors = Array.isArray(instructorsQuery.data) ? instructorsQuery.data : [];

    const visible = instructors.filter((row) => {
        const q = query.trim().toLowerCase();
        return (
            !q ||
            row.displayName.toLowerCase().includes(q) ||
            row.email.toLowerCase().includes(q) ||
            (row.phoneNumber ?? "").toLowerCase().includes(q)
        );
    });

    const formatJoined = (value: string) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString(i18n.language);
    };

    const columns: AdminTableColumn<UserProfile>[] = [
        {
            id: "name",
            label: t("admin.people.col_name"),
            render: (row) => <AdminTablePersonCell name={row.displayName} src={row.avatarUrl} />,
        },
        {
            id: "email",
            label: t("admin.people.col_email"),
            render: (row) => <AdminTableText muted>{row.email}</AdminTableText>,
        },
        {
            id: "phone",
            label: t("admin.instructors.col_phone"),
            render: (row) => <AdminTableText>{row.phoneNumber || t("admin.instructors.not_set")}</AdminTableText>,
        },
        {
            id: "joined",
            label: t("admin.instructors.col_joined"),
            render: (row) => <AdminTableText muted>{formatJoined(row.createdAt)}</AdminTableText>,
        },
    ];

    return (
        <SectionWrapper title={t("admin.instructors.title")} description={t("admin.instructors.description")}>
            <TextField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("admin.instructors.search")}
                fullWidth
                sx={{ ...formOutlinedSingleLineInputSx, mb: 2, maxWidth: 420 }}
                slotProps={{
                    input: {
                        startAdornment: <SearchOutlined sx={{ fontSize: 18, color: "text.disabled", mr: 1 }} />,
                    },
                }}
            />

            {instructorsQuery.isPending ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress aria-label={t("status.loading")} />
                </Box>
            ) : instructorsQuery.isError || (instructorsQuery.isSuccess && !Array.isArray(instructorsQuery.data)) ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 6 }}>
                    <Typography sx={{ color: "error.main", textAlign: "center" }}>
                        {t("admin.instructors.load_failed")}
                    </Typography>
                    <AppBtn customType="primary" type="button" onClick={() => instructorsQuery.refetch()} sx={{ borderRadius: 999 }}>
                        {t("status.retry")}
                    </AppBtn>
                </Box>
            ) : (
                <AdminDataTable
                    columns={columns}
                    rows={visible}
                    emptyLabel={t("admin.instructors.empty")}
                    ariaLabel={t("admin.instructors.title")}
                    getActions={() => [
                        {
                            key: "toggle-active",
                            label: t("admin.instructors.toggle_active"),
                            onClick: async (item) => {
                                if (toggleActive.isPending) return;
                                try {
                                    await toggleActive.mutateAsync(item.id);
                                    showSuccessToast(t("admin.instructors.toggled"));
                                } catch (cause) {
                                    const message = axios.isAxiosError(cause) ? cause.response?.data?.message : undefined;
                                    const detail = Array.isArray(message)
                                        ? message.filter((part) => typeof part === "string").join(", ")
                                        : typeof message === "string"
                                          ? message
                                          : undefined;
                                    showErrorToast(t("admin.instructors.toggle_failed"), detail);
                                }
                            },
                        },
                    ]}
                />
            )}
        </SectionWrapper>
    );
}
