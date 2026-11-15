import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import { formOutlinedSingleLineInputSx } from "@/components/form/formFieldLayout";
import FormWrapper from "@/components/form/FormWrapper";
import AppBtn from "@/components/ui/AppBtn";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import { useDeleteUser } from "@/features/queryHooks/users/useDeleteUser";
import { useSetUserPassword } from "@/features/queryHooks/users/useSetUserPassword";
import { useToggleUserActive } from "@/features/queryHooks/users/useToggleUserActive";
import { useUsersByRole } from "@/features/queryHooks/users/useUsersByRole";
import type { UserProfile } from "@/features/queryHooks/users/types";
import { assistantPasswordSchema, type AssistantPasswordValues } from "@/schema";
import AdminDataTable, { AdminTablePersonCell, AdminTableText, type AdminTableColumn } from "../../components/AdminDataTable";
import StatusBadge from "../../components/StatusBadge";

function apiDetail(cause: unknown) {
    if (!axios.isAxiosError(cause)) return undefined;
    const message = cause.response?.data?.message;
    if (Array.isArray(message)) return message.filter((part) => typeof part === "string").join(", ");
    return typeof message === "string" ? message : undefined;
}

export default function AdminAssistants() {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState("");
    const [passwordTarget, setPasswordTarget] = useState<UserProfile | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);
    const assistantsQuery = useUsersByRole("assistant");
    const toggleActive = useToggleUserActive();
    const deleteUser = useDeleteUser();
    const setPassword = useSetUserPassword();
    const assistants = Array.isArray(assistantsQuery.data) ? assistantsQuery.data : [];

    const methods = useForm<AssistantPasswordValues>({
        resolver: zodResolver(assistantPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    useEffect(() => {
        if (!passwordTarget) return;
        methods.reset({ password: "", confirmPassword: "" });
    }, [methods, passwordTarget]);

    const visible = assistants.filter((row) => {
        const q = query.trim().toLowerCase();
        return !q || row.displayName.toLowerCase().includes(q) || (row.email ?? "").toLowerCase().includes(q);
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
            id: "status",
            label: t("admin.assistants.col_status"),
            render: (row) => (
                <StatusBadge
                    status={row.isActive ? "active" : "suspended"}
                    label={t(row.isActive ? "admin.people.active" : "admin.people.suspended_status")}
                />
            ),
        },
        {
            id: "joined",
            label: t("admin.instructors.col_joined"),
            render: (row) => <AdminTableText muted>{formatJoined(row.createdAt)}</AdminTableText>,
        },
    ];

    const savePassword = async (values: AssistantPasswordValues) => {
        if (!passwordTarget) return;
        try {
            await setPassword.mutateAsync({ id: passwordTarget.id, password: values.password });
            showSuccessToast(t("admin.assistants.password_saved"));
            setPasswordTarget(null);
        } catch (cause) {
            showErrorToast(t("admin.assistants.password_failed"), apiDetail(cause));
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget || deleteUser.isPending) return;
        try {
            await deleteUser.mutateAsync(deleteTarget.id);
            showSuccessToast(t("admin.assistants.deleted"));
            setDeleteTarget(null);
        } catch (cause) {
            showErrorToast(t("admin.assistants.delete_failed"), apiDetail(cause));
        }
    };

    return (
        <SectionWrapper title={t("admin.assistants.title")} description={t("admin.assistants.description")}>
            <TextField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("admin.assistants.search")}
                fullWidth
                sx={{ ...formOutlinedSingleLineInputSx, mb: 2, maxWidth: 420 }}
                slotProps={{
                    input: {
                        startAdornment: <SearchOutlined sx={{ fontSize: 18, color: "text.disabled", mr: 1 }} />,
                    },
                }}
            />

            {assistantsQuery.isPending ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress aria-label={t("status.loading")} />
                </Box>
            ) : assistantsQuery.isError || (assistantsQuery.isSuccess && !Array.isArray(assistantsQuery.data)) ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 6 }}>
                    <Typography sx={{ color: "error.main", textAlign: "center" }}>{t("admin.assistants.load_failed")}</Typography>
                    <AppBtn customType="primary" type="button" onClick={() => assistantsQuery.refetch()} sx={{ borderRadius: 999 }}>
                        {t("status.retry")}
                    </AppBtn>
                </Box>
            ) : (
                <AdminDataTable
                    columns={columns}
                    rows={visible}
                    emptyLabel={t("admin.assistants.empty")}
                    ariaLabel={t("admin.assistants.title")}
                    getActions={(row) => [
                        {
                            key: "password",
                            label: t("admin.assistants.edit_password"),
                            onClick: () => setPasswordTarget(row),
                        },
                        {
                            key: "toggle-active",
                            label: t(row.isActive ? "admin.people.suspend" : "admin.people.activate"),
                            onClick: async (item) => {
                                if (toggleActive.isPending) return;
                                try {
                                    const updated = await toggleActive.mutateAsync(item.id);
                                    showSuccessToast(t(updated.isActive ? "admin.people.activated" : "admin.people.suspended"));
                                } catch (cause) {
                                    showErrorToast(t("admin.assistants.toggle_failed"), apiDetail(cause));
                                }
                            },
                        },
                        {
                            key: "delete",
                            label: t("admin.assistants.delete"),
                            tone: "danger",
                            onClick: () => setDeleteTarget(row),
                        },
                    ]}
                />
            )}

            <Dialog open={Boolean(passwordTarget)} onClose={() => setPasswordTarget(null)} fullWidth maxWidth="xs">
                <FormWrapper methods={methods} onSubmit={savePassword}>
                    <DialogTitle sx={{ fontWeight: 800 }}>{t("admin.assistants.password_title")}</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                            {t("admin.assistants.password_hint", { name: passwordTarget?.displayName ?? "" })}
                        </Typography>
                        <AppFormField name="password" type="password" label={t("admin.assistants.password")} showLable />
                        <AppFormField name="confirmPassword" type="password" label={t("admin.assistants.confirm_password")} showLable />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                        <Button type="button" onClick={() => setPasswordTarget(null)} sx={{ borderRadius: 999 }}>
                            {t("admin.people.close")}
                        </Button>
                        <AppBtn customType="primary" type="submit" disabled={setPassword.isPending} sx={{ borderRadius: 999 }}>
                            {t("admin.assistants.password_save")}
                        </AppBtn>
                    </DialogActions>
                </FormWrapper>
            </Dialog>

            <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>{t("admin.assistants.delete_title")}</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: "text.secondary" }}>
                        {t("admin.assistants.delete_body", { name: deleteTarget?.displayName ?? "" })}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button type="button" onClick={() => setDeleteTarget(null)} sx={{ borderRadius: 999 }}>
                        {t("admin.people.close")}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => void confirmDelete()}
                        disabled={deleteUser.isPending}
                        sx={{ borderRadius: 999, bgcolor: "error.main", color: "common.white", "&:hover": { bgcolor: "error.dark" } }}
                    >
                        {t("admin.assistants.delete")}
                    </Button>
                </DialogActions>
            </Dialog>
        </SectionWrapper>
    );
}
