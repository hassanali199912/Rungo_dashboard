import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import RunGoLoader from "@/components/ui/RunGoLoader";
import { useAuth } from "@/provider/AuthProvider";
import { homePathForRole, isAdminRole } from "@/shared/auth/roles";

type RoleGateProps = {
    allow: "admin" | "instructor";
    children: ReactNode;
};

export default function RoleGate({ allow, children }: RoleGateProps) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <RunGoLoader />;
    }

    if (isAuthenticated) {
        const admin = isAdminRole(user?.role);
        if (allow === "admin" && !admin) {
            return <Navigate to={homePathForRole(user?.role)} replace />;
        }
        if (allow === "instructor" && admin) {
            return <Navigate to="/admin" replace />;
        }
    }

    return children;
}
