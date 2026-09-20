import { useNavigate } from "react-router-dom";
import { useLogout as useLogoutMutation } from "@/features/queryHooks/useLogout";

export function useLogout() {
    const navigate = useNavigate();
    const { isPending, mutate } = useLogoutMutation();

    const handleLogout = () => {
        if (isPending) return;
        mutate(undefined, {
            onSettled: () => navigate("/login", { replace: true }),
        });
    };

    return { handleLogout, loggingOut: isPending };
}
