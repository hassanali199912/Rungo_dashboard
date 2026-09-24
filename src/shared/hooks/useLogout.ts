import { useLogout  } from "@/features/queryHooks/auth/useLogout";
import { useNavigate } from "react-router-dom";

export function useLogoutHook() {
    const navigate = useNavigate();
    const { isPending, mutate } = useLogout();

    const handleLogout = () => {
        if (isPending) return;
        mutate(undefined, {
            onSettled: () => navigate("/login", { replace: true }),
        });
    };

    return { handleLogout, loggingOut: isPending };
}
