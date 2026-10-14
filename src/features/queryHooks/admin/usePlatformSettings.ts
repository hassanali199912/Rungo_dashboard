import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { adminKeys } from "@/shared/query/adminKeys";
import type { PlatformSettingsResponse, UpdatePlatformSettingsBody } from "./types";

export function platformSettingsApi() {
    return client.get<PlatformSettingsResponse>("/admin/settings");
}

export async function fetchPlatformSettings() {
    const { data } = await platformSettingsApi();
    return data;
}

export function usePlatformSettings() {
    return useQuery({
        queryKey: adminKeys.settings(),
        queryFn: fetchPlatformSettings,
    });
}

export function updatePlatformSettingsApi(body: UpdatePlatformSettingsBody) {
    return client.patch<PlatformSettingsResponse>("/admin/settings", body);
}

export function useUpdatePlatformSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: UpdatePlatformSettingsBody) => {
            const { data } = await updatePlatformSettingsApi(body);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(adminKeys.settings(), data);
        },
    });
}
