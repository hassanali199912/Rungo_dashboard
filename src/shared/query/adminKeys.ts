import { QUERY_ROOT } from "./queryKeys";

export type AdminPageParams = {
    page: number;
    limit: number;
};

export type AdminCoinPurchaseParams = AdminPageParams & {
    userId: string;
};

export const adminKeys = {
    all: [QUERY_ROOT, "admin"] as const,
    students: (params: AdminPageParams) => [...adminKeys.all, "students", params] as const,
    wallet: (userId: string) => [...adminKeys.all, "wallet", userId] as const,
    coinPurchases: (params: AdminCoinPurchaseParams) => [...adminKeys.all, "coin-purchases", params] as const,
    invoices: (params: AdminPageParams) => [...adminKeys.all, "invoices", params] as const,
    invoice: (id: string) => [...adminKeys.all, "invoice", id] as const,
    settings: () => [...adminKeys.all, "settings"] as const,
};
