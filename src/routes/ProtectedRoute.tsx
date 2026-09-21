import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import RunGoLoader from "@/components/ui/RunGoLoader";
import { useAuth } from "@/provider/AuthProvider";
import { homePathForRole, isAdminRole } from "@/shared/auth/roles";

type ProtectedRouteProps = {
    allow: "admin" | "instructor";
    children: ReactNode;
};

export default function ProtectedRoute({ allow, children }: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <RunGoLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (allow === "admin" && !isAdminRole(user?.role)) {
        return <Navigate to={homePathForRole(user?.role)} replace />;
    }

    if (allow === "instructor" && isAdminRole(user?.role)) {
        return <Navigate to="/admin" replace />;
    }

    return children;
}
