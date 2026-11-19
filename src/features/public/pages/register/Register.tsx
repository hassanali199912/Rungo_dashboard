import AlternateEmail from "@mui/icons-material/AlternateEmail";
import LockOutlined from "@mui/icons-material/LockOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import RocketLaunch from "@mui/icons-material/RocketLaunch";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppFormField from "@/components/form/AppFormField";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import { useRegister } from "@/features/queryHooks/auth/useRegister";
import { useAuth } from "@/provider/AuthProvider";
import { registerSchema, type RegisterValues } from "@/schema";
import { homePathForRole } from "@/shared/auth/roles";
import AuthHeroPanel from "../../components/auth/AuthHeroPanel";
import LanguageSwitcher from "@/components/divTools/LanguageSwitcher";
const LOGO_SRC = encodeURI("/mainLogo.png");

export default function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { establishSession, isAuthenticated, user } = useAuth();
    const registerAccount = useRegister();

    const methods = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            displayName: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
    });

    if (isAuthenticated) {
        return <Navigate to={homePathForRole(user?.role)} replace />;
    }

    const onSubmit = methods.handleSubmit(async (values) => {
        try {
            const session = await registerAccount.mutateAsync({
                email: values.email.trim(),
                password: values.password,
                role: "instructor",
                displayName: values.displayName.trim(),
                avatarUrl: null,
                bio: null,
            });
            const actor = establishSession(session);
            showSuccessToast(t("auth.toasts.register_ok"));
            navigate(homePathForRole(actor.role), { replace: true });
        } catch (cause) {
            const message = axios.isAxiosError(cause) ? cause.response?.data?.message : undefined;
            const detail = Array.isArray(message) ? message.filter((item) => typeof item === "string").join(" ") : message;
            showErrorToast(t("auth.errors.register_failed"), detail);
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
                {t("auth.register.title")}
            </Typography>
            <Typography sx={{ mt: 1, mb: 4, color: "text.secondary", lineHeight: 1.7 }}>
                {t("auth.register.subtitle")}
            </Typography>

            <FormProvider {...methods}>
                <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 2,
                        }}
                    >
                        <AppFormField
                            name="displayName"
                            type="text"
                            label={t("auth.register.name")}
                            placeholder={t("auth.register.name_placeholder")}
                            startIcon={<PersonOutlined sx={{ fontSize: 18 }} />}
                        />
                        <AppFormField
                            name="email"
                            type="email"
                            label={t("auth.register.email")}
                            placeholder={t("auth.register.email_placeholder")}
                            startIcon={<AlternateEmail sx={{ fontSize: 18 }} />}
                        />
                    </Box>

                    <AppFormField
                        name="password"
                        type="passwordWithBar"
                        label={t("auth.register.password")}
                        placeholder={t("auth.register.password_placeholder")}
                        startIcon={<LockOutlined sx={{ fontSize: 18 }} />}
                    />

                    <AppFormField
                        name="confirmPassword"
                        type="password"
                        label={t("auth.register.confirm_password")}
                        placeholder={t("auth.register.confirm_password_placeholder")}
                        startIcon={<LockOutlined sx={{ fontSize: 18 }} />}
                    />

                    <AppFormField name="terms" type="checkbox" label={t("auth.register.terms")} />

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
                        {t("auth.register.submit")}
                        <RocketLaunch sx={{ fontSize: 18, marginInlineStart: 1 }} />
                    </Button>
                </Box>
            </FormProvider>

            <Typography sx={{ mt: 3, textAlign: "center", color: "text.secondary", fontSize: 14 }}>
                {t("auth.register.have_account")}{" "}
                <Box
                    component={RouterLink}
                    to="/login"
                    sx={{ color: "primary.main", fontWeight: 700, textDecoration: "none" }}
                >
                    {t("auth.register.sign_in")}
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
