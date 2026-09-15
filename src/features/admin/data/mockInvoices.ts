import type { CoinInvoice, CoinPack } from "./adminTypes";
import { getRefundedInvoices, getStoredCoinPacks } from "./adminStore";

export const defaultCoinPacks: CoinPack[] = [
    { id: "starter-50", coins: 50, price: 2.99, bonus: 0, active: true },
    { id: "plus-150", coins: 150, price: 7.99, bonus: 10, active: true },
    { id: "pro-500", coins: 500, price: 19.99, bonus: 50, active: true },
    { id: "elite-1200", coins: 1200, price: 39.99, bonus: 200, active: false },
];

export function getMockCoinPacks(): CoinPack[] {
    return getStoredCoinPacks(defaultCoinPacks);
}

export function getMockInvoices(): CoinInvoice[] {
    const refunded = getRefundedInvoices();
    const rows: CoinInvoice[] = [
        { id: "INV-1042", studentId: "alex", studentName: "Alex M.", packId: "plus-150", coins: 160, amount: 7.99, date: "2026-09-12", status: "paid" },
        { id: "INV-1043", studentId: "david", studentName: "David K.", packId: "pro-500", coins: 550, amount: 19.99, date: "2026-09-14", status: "paid" },
        { id: "INV-1038", studentId: "elena", studentName: "Elena R.", packId: "starter-50", coins: 50, amount: 2.99, date: "2026-09-08", status: "paid" },
        { id: "INV-1031", studentId: "nina", studentName: "Nina Park", packId: "starter-50", coins: 50, amount: 2.99, date: "2026-08-30", status: "refunded" },
        { id: "INV-1040", studentId: "yusuf", studentName: "Yusuf N.", packId: "plus-150", coins: 160, amount: 7.99, date: "2026-09-10", status: "paid" },
        { id: "INV-1041", studentId: "hana", studentName: "Hana Saleh", packId: "pro-500", coins: 550, amount: 19.99, date: "2026-09-13", status: "paid" },
    ];

    return rows.map((row) => ({
        ...row,
        status: refunded.includes(row.id) ? "refunded" : row.status,
    }));
}
