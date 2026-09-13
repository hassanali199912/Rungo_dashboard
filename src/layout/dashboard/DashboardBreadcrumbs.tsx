import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation } from "react-router-dom";

const DashboardBreadcrumbs = () => {
    const { pathname } = useLocation();
    const { t } = useTranslation();

    const breadcrumbs = useMemo(() => {
        if (pathname.startsWith("/dashboard")) {
            const rest = pathname.replace(/^\/dashboard\/?/, "");
            const crumbs = [
                { label: t("dashboard.crumb_instructor"), path: "/dashboard" },
                { label: t("dashboard.crumb_studio"), path: "/dashboard" },
            ];
            if (rest) {
                const segment = rest.split("/")[0];
                crumbs.push({
                    label: t(`dashboard.nav.${segment}`, { defaultValue: segment }),
                    path: `/dashboard/${segment}`,
                });
            }
            return crumbs;
        }

        return [
            { label: t("dashboard.crumb_instructor"), path: "/dashboard" },
            { label: t("dashboard.crumb_studio"), path: "/dashboard" },
        ];
    }, [pathname, t]);

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
