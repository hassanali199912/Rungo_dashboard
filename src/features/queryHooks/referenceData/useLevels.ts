import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { referenceDataKeys } from "@/shared/query/referenceDataKeys";
import type { ReferenceItem } from "./reference.types";

export function levelsApi() {
    return client.get<ReferenceItem[]>("/reference/level");
}

export async function fetchLevels() {
    const { data } = await levelsApi();
    return data;
}

export function useLevels(enabled = true) {
    return useQuery({
        queryKey: referenceDataKeys.levels(),
        queryFn: fetchLevels,
        enabled,
        staleTime: 30 * 60_000,
    });
}
