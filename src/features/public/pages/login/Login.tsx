import AlternateEmail from "@mui/icons-material/AlternateEmail";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/components/ui/appToast";
import { useAuth } from "@/provider/AuthProvider";
import { loginSchema, type LoginValues } from "@/schema";
import { homePathForRole } from "@/shared/auth/roles";
import LanguageSwitcher from "@/components/divTools/LanguageSwitcher";
import AuthHeroPanel from "../../components/auth/AuthHeroPanel";
const LOGO_SRC = encodeURI("/mainLogo.png");

export default function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();
  

    const methods = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "instructor@runro.test",
            password: "Password123!",
            remember: false,
        },
    });

    if (isAuthenticated) {
        return <Navigate to={homePathForRole(user?.role)} replace />;
    }

    const onSubmit = methods.handleSubmit(async (values) => {
        try {
            const actor = await login({ email: values.email, password: values.password });
            showSuccessToast(t("auth.toasts.login_ok"));
            navigate(homePathForRole(actor.role), { replace: true });

        } catch (cause) {
            
            const detail = axios.isAxiosError(cause)
                ? cause.response?.data?.message
                : undefined;
            showErrorToast(t("auth.errors.login_failed"), detail);
        
        
        }
    });

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                bgcolor: "background.paper",
            }}
        >
            <Box
                sx={{
                    flex: { xs: 1, md: "0 0 50%" },
                    display: "flex",
                    flexDirection: "column",
                    px: { xs: 3, sm: 6, lg: 10 },
                    py: { xs: 3, md: 4 },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 5 }}>
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1.25,
                            textDecoration: "none",
                            color: "text.primary",
                        }}
                    >
                        <Box component="img" src={LOGO_SRC} alt={t("brand.name")} sx={{ width: 40, height: 40 }} />
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                                {t("brand.name")}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: "0.16em",
                                    textTransform: "uppercase",
                                    color: "text.secondary",
                                    mt: 0.25,
                                }}
                            >
                                {t("auth.studio_kicker")}
                            </Typography>
                        </Box>
                    </Box>
                    <LanguageSwitcher variant="inline" />
                </Box>

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 520, width: "100%", mx: "auto" }}>
                    <Box>
                        <Typography
                            component="h1"
                            sx={{ fontWeight: 800, fontSize: { xs: 28, md: 34 }, letterSpacing: "-0.03em", lineHeight: 1.2 }}
                        >
                            {t("auth.login.title")}
                        </Typography>
                        <Typography sx={{ mt: 1, mb: 4, color: "text.secondary", lineHeight: 1.7 }}>
                            {t("auth.login.subtitle")}
                        </Typography>

                        <FormProvider {...methods}>
                            <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                                <AppFormField
                                    name="email"
                                    type="email"
                                    label={t("auth.login.email")}
                                    placeholder={t("auth.login.email_placeholder")}
                                    startIcon={<AlternateEmail sx={{ fontSize: 18 }} />}
                                />
                                <AppFormField
                                    name="password"
                                    type="password"
                                    label={t("auth.login.password")}
                                    placeholder={t("auth.login.password_placeholder")}
                                    startIcon={<LockOutlined sx={{ fontSize: 18 }} />}
                                />

                                <AppFormField name="remember" type="checkbox" label={t("auth.login.remember")}>
                                    <Button
                                        type="button"
                                        onClick={() => showInfoToast(t("auth.login.forgot_soon"))}
                                        sx={{
                                            color: "primary.main",
                                            fontWeight: 700,
                                            minWidth: "auto",
                                            px: 1,
                                            "&:hover": { bgcolor: "transparent" },
                                        }}
                                    >
                                        {t("auth.login.forgot")}
                                    </Button>
                                </AppFormField>

                                <Button
                                    type="submit"
                                    disabled={methods.formState.isSubmitting}
                                    sx={{
                                        mt: 0.5,
                                        bgcolor: "secondary.main",
                                        color: "secondary.contrastText",
                                        borderRadius: 999,
                                        py: 1.4,
                                        fontWeight: 700,
                                        fontSize: 15,
                                        "&:hover": { bgcolor: "secondary.dark" },
                                    }}
                                >
                                    {t("auth.login.submit")}
                                </Button>
                            </Box>
                        </FormProvider>

                        <Typography sx={{ mt: 3, textAlign: "center", color: "text.secondary", fontSize: 14 }}>
                            {t("auth.login.no_account")}{" "}
                            <Box
                                component={RouterLink}
                                to="/register"
                                sx={{ color: "primary.main", fontWeight: 700, textDecoration: "none" }}
                            >
                                {t("auth.login.create")}
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: { xs: "none", md: "block" }, flex: 1 }}>
                <AuthHeroPanel />
            </Box>
        </Box>

    );
}
