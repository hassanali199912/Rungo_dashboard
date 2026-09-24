import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { shortsKeys } from "@/shared/query/shortsKeys";

export type ShortStatistics = {
    totalShorts: number;
    activeShorts: number;
    inactiveShorts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalEngagements: number;
};

export function shortStatisticsApi() {
    return client.get<ShortStatistics>("/statistics/shorts");
}

export async function fetchShortStatistics() {
    const { data } = await shortStatisticsApi();
    return data;
}

export function useShortStatistics() {
    return useQuery({
        queryKey: shortsKeys.statistics(),
        queryFn: fetchShortStatistics,
    });
}
