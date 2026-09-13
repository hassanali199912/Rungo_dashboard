import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import SectionWrapper from "../../components/SectionWrapper";

export default function DashboardSection() {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const segment = pathname.split("/").filter(Boolean).at(-1) || "dashboard";

    return (
        <SectionWrapper
            title={t(`dashboard.nav.${segment}`, { defaultValue: segment })}
            description={t("dashboard.section_placeholder")}
            sx={{ minHeight: 280 }}
        />
    );
}
