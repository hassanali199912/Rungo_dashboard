import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import PublicMainLayout from "../layout/public/PublicMainLayout";
import NotFound from "../features/public/pages/notFound/NotFound";
import AppError from "../features/public/pages/error/AppError";

const Home = lazy(() => import("../features/public/pages/home/Home"));
const Login = lazy(() => import("../features/public/pages/login/Login"));
const Register = lazy(() => import("../features/public/pages/register/Register"));

const publicRoutes: RouteObject[] = [
    {
        path: "/",
        element: <PublicMainLayout />,
        errorElement: (
            <PublicMainLayout>
                <AppError />
            </PublicMainLayout>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
        ],
    },
];

export default publicRoutes;
