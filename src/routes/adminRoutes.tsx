import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import DashboardMainLayout from "../layout/dashboard/DashboardMainLayout";
import AppError from "../features/public/pages/error/AppError";
import { adminNavItems } from "../layout/admin/adminNavConfig";
import RoleGate from "./RoleGate";

const AdminOverview = lazy(() => import("../features/admin/pages/overview/AdminOverview"));
const Instructors = lazy(() => import("../features/admin/pages/instructors/Instructors"));
const InstructorDetail = lazy(() => import("../features/admin/pages/instructors/InstructorDetail"));
const Students = lazy(() => import("../features/admin/pages/students/Students"));
const StudentDetail = lazy(() => import("../features/admin/pages/students/StudentDetail"));
const AdminCourses = lazy(() => import("../features/admin/pages/courses/AdminCourses"));
const AdminCourseDetail = lazy(() => import("../features/admin/pages/courses/AdminCourseDetail"));
const AdminShorts = lazy(() => import("../features/admin/pages/shorts/AdminShorts"));
const AdminSubscriptions = lazy(() => import("../features/admin/pages/subscriptions/AdminSubscriptions"));
const AdminInvoices = lazy(() => import("../features/admin/pages/invoices/AdminInvoices"));
const AdminSettings = lazy(() => import("../features/admin/pages/settings/AdminSettings"));

const adminRoutes: RouteObject[] = [
    {
        path: "/admin",
        element: (
            <RoleGate allow="admin">
                <DashboardMainLayout navItems={adminNavItems} homePath="/admin" />
            </RoleGate>
        ),
        errorElement: <AppError />,
        children: [
            { index: true, element: <AdminOverview /> },
            { path: "instructors", element: <Instructors /> },
            { path: "instructors/:id", element: <InstructorDetail /> },
            { path: "students", element: <Students /> },
            { path: "students/:id", element: <StudentDetail /> },
            { path: "courses", element: <AdminCourses /> },
            { path: "courses/:id", element: <AdminCourseDetail /> },
            { path: "shorts", element: <AdminShorts /> },
            { path: "subscriptions", element: <AdminSubscriptions /> },
            { path: "invoices", element: <AdminInvoices /> },
            { path: "settings", element: <AdminSettings /> },
        ],
    },
];

export default adminRoutes;
