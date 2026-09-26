import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { coinPackageKeys } from "@/shared/query/coinPackageKeys";
import type { CoinPackage, CoinPackageInput } from "./types";

export type UpdateCoinPackageInput = {
    id: string;
    body: Partial<CoinPackageInput>;
};

export function updateCoinPackageApi({ id, body }: UpdateCoinPackageInput) {
    return client.patch<CoinPackage>(`/coin-packages/${id}`, body);
}

export function useUpdateCoinPackage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateCoinPackageInput) => {
            const { data } = await updateCoinPackageApi(input);
            return data;
        },
        onSuccess: (updated) => {
            if (updated?.id) {
                queryClient.setQueryData(coinPackageKeys.detail(updated.id), updated);
            }
            queryClient.invalidateQueries({ queryKey: coinPackageKeys.lists() });
        },
    });
}
