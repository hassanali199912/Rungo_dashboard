import { useMutation, useQueryClient } from "@tanstack/react-query";
import client, { refreshAccessToken } from "@/config/apis";
import { authKeys } from "@/shared/query/authKeys";
import type { LoginResponse } from "./useLogin";

export type RefreshResponse = LoginResponse;

export function refreshApi(refreshToken: string) {
    return client.post<RefreshResponse>("/auth/refresh", { refreshToken }, {
        skipAuthHandling: true,
    });
}

export function useRefreshToken() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const data = await refreshAccessToken();
            if (!data) throw new Error("Session could not be refreshed");
            return data as RefreshResponse;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.me(), data.user);
        },
    });
}
