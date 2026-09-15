import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";

type AdminViewDialogProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};

export default function AdminViewDialog({ open, title, onClose, children }: AdminViewDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, pt: 0.5 }}>{children}</Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <AppBtn customType="outline" type="button" onClick={onClose} sx={{ borderRadius: 999 }}>
                    {t("admin.people.close")}
                </AppBtn>
            </DialogActions>
        </Dialog>
    );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {label}
            </Typography>
            <Typography sx={{ mt: 0.35, fontWeight: 600 }}>{value}</Typography>
        </Box>
    );
}
