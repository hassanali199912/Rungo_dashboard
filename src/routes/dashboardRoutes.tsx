import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import DashboardMainLayout from "../layout/dashboard/DashboardMainLayout";
import AppError from "../features/public/pages/error/AppError";
import ProtectedRoute from "./ProtectedRoute";
import { userNavItems } from "../layout/dashboard/DashbaordNavConfig";

const Overview = lazy(() => import("../features/dashboard/pages/overview/Overview"));
const Shorts = lazy(() => import("../features/dashboard/pages/shorts/Shorts"));
const AddShort = lazy(() => import("../features/dashboard/pages/shorts/AddShort"));
const Courses = lazy(() => import("../features/dashboard/pages/courses/Courses"));
const AddCourse = lazy(() => import("../features/dashboard/pages/courses/AddCourse"));
const Settings = lazy(() => import("../features/dashboard/pages/settings/Settings"));
const Subscription = lazy(() => import("../features/dashboard/pages/subscription/Subscription"));

const dashboardRoutes: RouteObject[] = [
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute allow="instructor">
                <DashboardMainLayout navItems={userNavItems} homePath="/dashboard" />
            </ProtectedRoute>
        ),
        errorElement: <AppError />,
        children: [
            { index: true, element: <Overview /> },
            { path: "shorts", element: <Shorts /> },
            { path: "shorts/new", element: <AddShort /> },
            { path: "courses", element: <Courses /> },
            { path: "courses/new", element: <AddCourse /> },
            { path: "subscription", element: <Subscription /> },
            { path: "settings", element: <Settings /> },
        ],
    },
];

export default dashboardRoutes;
