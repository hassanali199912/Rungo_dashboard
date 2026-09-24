import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { shortsKeys } from "@/shared/query/shortsKeys";
import type { Short } from "./useShorts";

export function shortApi(id: string) {
    return client.get<Short>(`/shorts/manage/${id}`);
}

export async function fetchShort(id: string) {
    const { data } = await shortApi(id);
    return data;
}

export function useShort(id: string, enabled = true) {
    return useQuery({
        queryKey: shortsKeys.detail(id),
        queryFn: () => fetchShort(id),
        enabled: enabled && Boolean(id),
    });
}
