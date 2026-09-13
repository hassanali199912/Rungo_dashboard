/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import publicRoutes from "./publicRoutes";
import dashboardRoutes from "./dashboardRoutes";
import RunGoLoader from "@/components/ui/RunGoLoader";

const routerBasename = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";

export const router = createBrowserRouter([...dashboardRoutes, ...publicRoutes], { basename: routerBasename });

export default function AppRouter() {
    return (
        <Suspense fallback={<RunGoLoader />}>
            <RouterProvider router={router} />
        </Suspense>
    );
}
