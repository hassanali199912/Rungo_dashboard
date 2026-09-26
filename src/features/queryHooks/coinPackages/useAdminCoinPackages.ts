import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { coinPackageKeys } from "@/shared/query/coinPackageKeys";
import type { CoinPackage } from "./types";

export function adminCoinPackagesApi() {
    return client.get<CoinPackage[]>("/coin-packages/admin/all");
}

export async function fetchAdminCoinPackages() {
    const { data } = await adminCoinPackagesApi();
    return data;
}

export function useAdminCoinPackages(enabled = true) {
    return useQuery({
        queryKey: coinPackageKeys.list(),
        queryFn: fetchAdminCoinPackages,
        enabled,
    });
}
