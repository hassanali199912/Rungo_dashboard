import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { adminKeys } from "@/shared/query/adminKeys";
import type { AdminWalletBalance } from "./types";

export function adminWalletApi(userId: string) {
    return client.get<AdminWalletBalance>(`/wallet/admin/${userId}`);
}

export async function fetchAdminWallet(userId: string) {
    const { data } = await adminWalletApi(userId);
    return data;
}

export function useAdminWallet(userId?: string) {
    return useQuery({
        queryKey: adminKeys.wallet(userId ?? ""),
        queryFn: () => fetchAdminWallet(userId ?? ""),
        enabled: Boolean(userId),
    });
}
