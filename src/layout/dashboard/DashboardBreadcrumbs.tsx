import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation } from "react-router-dom";

const DashboardBreadcrumbs = () => {
    const { pathname } = useLocation();
    const { t, i18n } = useTranslation();

    const breadcrumbs = useMemo(() => {
        const resolveLabel = (segment: string, parent?: string) => {
            const nestedKey = parent ? `dashboard.crumb.${parent}_${segment}` : "";
            if (nestedKey && i18n.exists(nestedKey)) return t(nestedKey);
            if (i18n.exists(`dashboard.crumb.${segment}`)) return t(`dashboard.crumb.${segment}`);
            if (i18n.exists(`dashboard.nav.${segment}`)) return t(`dashboard.nav.${segment}`);
            return segment;
        };

        if (pathname.startsWith("/dashboard")) {
            const rest = pathname.replace(/^\/dashboard\/?/, "");
            const crumbs = [
                { label: t("dashboard.crumb_instructor"), path: "/dashboard" },
                { label: t("dashboard.crumb_studio"), path: "/dashboard" },
            ];
            if (rest) {
                let acc = "/dashboard";
                const segments = rest.split("/").filter(Boolean);
                segments.forEach((segment, index) => {
                    acc += `/${segment}`;
                    crumbs.push({
                        label: resolveLabel(segment, segments[index - 1]),
                        path: acc,
                    });
                });
            }
            return crumbs;
        }

        return [
            { label: t("dashboard.crumb_instructor"), path: "/dashboard" },
            { label: t("dashboard.crumb_studio"), path: "/dashboard" },
        ];
    }, [pathname, t, i18n]);

    return (
        <Breadcrumbs
            separator={
                <Typography component="span" sx={{ color: "text.disabled", fontSize: 13 }}>
                    ›
                </Typography>
            }
            aria-label="breadcrumb"
            sx={{ display: { xs: "none", md: "block" } }}
        >
            {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                    <Link
                        key={`${crumb.path}-${crumb.label}`}
                        component={RouterLink}
                        to={crumb.path}
                        underline="none"
                        sx={{
                            fontSize: 13,
                            fontWeight: isLast ? 600 : 500,
                            color: isLast ? "text.primary" : "text.secondary",
                            "&:hover": { color: "primary.main" },
                        }}
                    >
                        {crumb.label}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
};

export default DashboardBreadcrumbs;
