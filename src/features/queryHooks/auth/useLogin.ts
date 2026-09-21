import { useMutation, useQueryClient } from "@tanstack/react-query";
import client, { setAuthSession } from "@/config/apis";
import { authKeys } from "@/shared/query/authKeys";

export type LoginCredentials = {
    email: string;
    password: string;
};

export type DashboardUser = {
    id: string;
    email: string;
    phoneNumber: string | null;
    role: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: DashboardUser;
};

export function loginApi(credentials: LoginCredentials) {
    return client.post<LoginResponse>("/auth/dashboard/login", credentials, {
        skipAuthHandling: true,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const { data } = await loginApi(credentials);
            setAuthSession({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: data.user,
            });
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.me(), data.user);
        },
    });
}
