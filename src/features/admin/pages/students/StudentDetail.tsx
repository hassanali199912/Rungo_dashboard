import { Avatar, Box, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import SectionWrapper from "@/features/dashboard/components/SectionWrapper";
import StudioCard from "@/features/dashboard/components/StudioCard";
import StatusBadge from "../../components/StatusBadge";
import { setAccountStatus } from "../../data/adminStore";
import { getMockInvoices } from "../../data/mockInvoices";
import { getMockStudents } from "../../data/mockStudents";

export default function StudentDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [tick, setTick] = useState(0);
    const student = useMemo(() => getMockStudents(t).find((row) => row.id === id), [t, id, tick]);
    const invoices = useMemo(() => getMockInvoices().filter((row) => row.studentId === id), [id, tick]);

    if (!student) {
        return <Navigate to="/admin/students" replace />;
    }

    const toggle = () => {
        const next = student.status === "active" ? "suspended" : "active";
        setAccountStatus("student", student.id, next);
        setTick((value) => value + 1);
        showSuccessToast(next === "suspended" ? t("admin.people.suspended") : t("admin.people.activated"));
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SectionWrapper
                title={student.name}
                description={student.email}
                actions={[
                    {
                        label: student.status === "active" ? t("admin.people.suspend") : t("admin.people.activate"),
                        onClick: toggle,
                    },
                ]}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>{student.name.slice(0, 1)}</Avatar>
                    <Box>
                        <StatusBadge status={student.status} label={t(`admin.people.${student.status === "active" ? "active" : "suspended_status"}`)} />
                        <Typography sx={{ mt: 1, color: "text.secondary", fontSize: 14 }}>
                            {student.coins} {t("dashboard.coins")} · {student.invoices} {t("admin.nav.invoices")}
                        </Typography>
                    </Box>
                </Box>
            </SectionWrapper>

            <StudioCard title={t("admin.students.invoices_title")} subtitle={t("admin.students.invoices_subtitle")}>
                {invoices.length === 0 ? (
                    <Typography sx={{ color: "text.secondary" }}>{t("admin.people.empty")}</Typography>
                ) : (
                    invoices.map((invoice) => (
                        <Box key={invoice.id} sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                            <Typography sx={{ fontWeight: 700 }}>{invoice.id}</Typography>
                            <Typography sx={{ color: "text.secondary" }}>${invoice.amount.toFixed(2)}</Typography>
                            <StatusBadge status={invoice.status} label={t(`admin.invoices.${invoice.status}`)} />
                        </Box>
                    ))
                )}
            </StudioCard>

            <AppBtn customType="outline" to="/admin/students" sx={{ borderRadius: 999, alignSelf: "flex-start" }}>
                {t("admin.people.back")}
            </AppBtn>
        </Box>
    );
}
