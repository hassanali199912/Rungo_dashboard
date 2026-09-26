import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { coinPackageKeys } from "@/shared/query/coinPackageKeys";
import type { CoinPackage, CoinPackageInput } from "./types";

export function createCoinPackageApi(input: CoinPackageInput) {
    return client.post<CoinPackage>("/coin-packages", input);
}

export function useCreateCoinPackage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CoinPackageInput) => {
            const { data } = await createCoinPackageApi(input);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: coinPackageKeys.lists() });
        },
    });
}
