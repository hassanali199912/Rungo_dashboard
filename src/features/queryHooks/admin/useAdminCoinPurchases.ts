import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { adminKeys, type AdminCoinPurchaseParams } from "@/shared/query/adminKeys";
import type { CoinPurchasePage } from "./types";

export function adminCoinPurchasesApi(params: AdminCoinPurchaseParams) {
    return client.get<CoinPurchasePage>("/coin-purchases/admin", { params });
}

export async function fetchAdminCoinPurchases(params: AdminCoinPurchaseParams) {
    const { data } = await adminCoinPurchasesApi(params);
    return data;
}

export function useAdminCoinPurchases(params: AdminCoinPurchaseParams, enabled = true) {
    return useQuery({
        queryKey: adminKeys.coinPurchases(params),
        queryFn: () => fetchAdminCoinPurchases(params),
        enabled: enabled && Boolean(params.userId),
        placeholderData: (previousData) => previousData,
    });
}
