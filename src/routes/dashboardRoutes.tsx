import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import DashboardMainLayout from "../layout/dashboard/DashboardMainLayout";
import AppError from "../features/public/pages/error/AppError";

const Overview = lazy(() => import("../features/dashboard/pages/overview/Overview"));
const Shorts = lazy(() => import("../features/dashboard/pages/shorts/Shorts"));
const AddShort = lazy(() => import("../features/dashboard/pages/shorts/AddShort"));
const Courses = lazy(() => import("../features/dashboard/pages/courses/Courses"));
const AddCourse = lazy(() => import("../features/dashboard/pages/courses/AddCourse"));
const DashboardSection = lazy(() => import("../features/dashboard/pages/section/DashboardSection"));

const dashboardRoutes: RouteObject[] = [
    {
        path: "/dashboard",
        element: <DashboardMainLayout />,
        errorElement: <AppError />,
        children: [
            { index: true, element: <Overview /> },
            { path: "shorts", element: <Shorts /> },
            { path: "shorts/new", element: <AddShort /> },
            { path: "courses", element: <Courses /> },
            { path: "courses/new", element: <AddCourse /> },
            { path: "earnings", element: <DashboardSection /> },
            { path: "settings", element: <DashboardSection /> },
        ],
    },
];

export default dashboardRoutes;
