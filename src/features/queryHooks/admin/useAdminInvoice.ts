import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { adminKeys } from "@/shared/query/adminKeys";
import type { AdminInvoice } from "./types";

export function adminInvoiceApi(id: string) {
    return client.get<AdminInvoice>(`/admin/invoices/${id}`);
}

export async function fetchAdminInvoice(id: string) {
    const { data } = await adminInvoiceApi(id);
    return data;
}

export function useAdminInvoice(id?: string) {
    return useQuery({
        queryKey: adminKeys.invoice(id ?? ""),
        queryFn: () => fetchAdminInvoice(id ?? ""),
        enabled: Boolean(id),
    });
}
