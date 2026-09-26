import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { coinPackageKeys } from "@/shared/query/coinPackageKeys";
import type { CoinPackage } from "./types";

export function deleteCoinPackageApi(id: string) {
    return client.delete<void>(`/coin-packages/${id}`);
}

export function useDeleteCoinPackage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteCoinPackageApi(id);
            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.setQueryData<CoinPackage[]>(coinPackageKeys.list(), (current) =>
                current?.filter((pack) => pack.id !== deletedId),
            );
            queryClient.removeQueries({ queryKey: coinPackageKeys.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: coinPackageKeys.lists() });
        },
    });
}
