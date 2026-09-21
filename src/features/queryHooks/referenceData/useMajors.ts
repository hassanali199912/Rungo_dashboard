import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { referenceDataKeys } from "@/shared/query/referenceDataKeys";
import type { ReferenceItem } from "./reference.types";

export function majorsApi() {
    return client.get<ReferenceItem[]>("/reference/major");
}

export async function fetchMajors() {
    const { data } = await majorsApi();
    return data;
}

export function useMajors(enabled = true) {
    return useQuery({
        queryKey: referenceDataKeys.majors(),
        queryFn: fetchMajors,
        enabled,
        staleTime: 30 * 60_000,
    });
}
