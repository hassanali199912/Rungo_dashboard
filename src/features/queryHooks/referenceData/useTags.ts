import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { referenceDataKeys } from "@/shared/query/referenceDataKeys";
import type { ReferenceItem } from "./reference.types";

export function tagsApi() {
    return client.get<ReferenceItem[]>("/reference/tag");
}

export async function fetchTags() {
    const { data } = await tagsApi();
    return data;
}

export function useTags(enabled = true) {
    return useQuery({
        queryKey: referenceDataKeys.tags(),
        queryFn: fetchTags,
        enabled,
        staleTime: 30 * 60_000,
    });
}
