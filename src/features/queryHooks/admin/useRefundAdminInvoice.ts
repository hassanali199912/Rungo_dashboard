import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { adminKeys } from "@/shared/query/adminKeys";
import type { AdminInvoice } from "./types";

export function refundAdminInvoiceApi(id: string) {
    return client.patch<AdminInvoice>(`/admin/invoices/${id}/refund`);
}

export function useRefundAdminInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await refundAdminInvoiceApi(id);
            return data;
        },
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: [...adminKeys.all, "invoices"] });
            queryClient.invalidateQueries({ queryKey: adminKeys.invoice(id) });
        },
    });
}
