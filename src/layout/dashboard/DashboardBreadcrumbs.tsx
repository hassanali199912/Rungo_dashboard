import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation } from "react-router-dom";

const DashboardBreadcrumbs = () => {
    const { pathname } = useLocation();
    const { t, i18n } = useTranslation();

    const breadcrumbs = useMemo(() => {
        const resolveLabel = (segment: string, parent?: string, navNs = "dashboard") => {
            const nestedKey = parent ? `${navNs}.crumb.${parent}_${segment}` : "";
            if (nestedKey && i18n.exists(nestedKey)) return t(nestedKey);
            if (i18n.exists(`${navNs}.crumb.${segment}`)) return t(`${navNs}.crumb.${segment}`);
            if (i18n.exists(`${navNs}.nav.${segment}`)) return t(`${navNs}.nav.${segment}`);
            if (parent && i18n.exists(`${navNs}.crumb.detail`)) return t(`${navNs}.crumb.detail`);
            return segment;
        };

        const isAdmin = pathname.startsWith("/admin");
        const base = isAdmin ? "/admin" : "/dashboard";
        const navNs = isAdmin ? "admin" : "dashboard";

        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
            const rest = pathname.replace(new RegExp(`^${base}/?`), "");
            const crumbs = [
                {
                    label: t(isAdmin ? "admin.crumb_admin" : "dashboard.crumb_instructor"),
                    path: base,
                },
                {
                    label: t(isAdmin ? "admin.crumb_control" : "dashboard.crumb_studio"),
                    path: base,
                },
            ];
            if (rest) {
                let acc = base;
                const segments = rest.split("/").filter(Boolean);
                segments.forEach((segment, index) => {
                    acc += `/${segment}`;
                    crumbs.push({
                        label: resolveLabel(segment, segments[index - 1], navNs),
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
