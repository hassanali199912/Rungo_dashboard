import type { TFunction } from "i18next";
import type { AdminStudent } from "./adminTypes";
import { getStatusMap } from "./adminStore";

export function getMockStudents(t: TFunction): AdminStudent[] {
    const status = getStatusMap("student");
    const rows: AdminStudent[] = [
        { id: "alex", name: "Alex M.", email: "alex@learn.io", coins: 240, invoices: 3, lastPurchase: "2026-09-12", status: "active" },
        { id: "elena", name: "Elena R.", email: "elena@learn.io", coins: 80, invoices: 1, lastPurchase: "2026-09-08", status: "active" },
        { id: "david", name: "David K.", email: "david@learn.io", coins: 560, invoices: 4, lastPurchase: "2026-09-14", status: "active" },
        { id: "nina", name: "Nina Park", email: "nina@learn.io", coins: 20, invoices: 1, lastPurchase: "2026-08-30", status: "suspended" },
        { id: "yusuf", name: "Yusuf N.", email: "yusuf@learn.io", coins: 150, invoices: 2, lastPurchase: "2026-09-10", status: "active" },
        { id: "hana", name: "Hana Saleh", email: "hana@learn.io", coins: 310, invoices: 2, lastPurchase: "2026-09-13", status: "active" },
    ];

    return rows.map((row) => ({
        ...row,
        status: status[row.id] ?? row.status,
        name: t(`admin.people.students.${row.id}_name`, { defaultValue: row.name }),
    }));
}
