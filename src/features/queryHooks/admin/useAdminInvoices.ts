import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { adminKeys, type AdminPageParams } from "@/shared/query/adminKeys";
import type { AdminInvoicePage } from "./types";

export function adminInvoicesApi(params: AdminPageParams) {
    return client.get<AdminInvoicePage>("/admin/invoices", { params });
}

export async function fetchAdminInvoices(params: AdminPageParams) {
    const { data } = await adminInvoicesApi(params);
    return data;
}

export function useAdminInvoices(params: AdminPageParams, enabled = true) {
    return useQuery({
        queryKey: adminKeys.invoices(params),
        queryFn: () => fetchAdminInvoices(params),
        enabled,
        placeholderData: (previousData) => previousData,
    });
}
