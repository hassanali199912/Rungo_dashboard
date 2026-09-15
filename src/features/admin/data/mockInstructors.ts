import type { TFunction } from "i18next";
import type { AdminInstructor } from "./adminTypes";
import { getInstructorPlanOverrides, getStatusMap } from "./adminStore";

export function getMockInstructors(t: TFunction): AdminInstructor[] {
    const status = getStatusMap("instructor");
    const plans = getInstructorPlanOverrides();
    const rows: AdminInstructor[] = [
        {
            id: "maya",
            name: "Dr. Maya Patel",
            email: "maya@teach.io",
            expertise: "frontend",
            plan: "pro",
            shorts: 34,
            courses: 6,
            status: "active",
            joinedAt: "2026-01-12",
        },
        {
            id: "omar",
            name: "Omar Haddad",
            email: "omar@studio.io",
            expertise: "fitness",
            plan: "elite",
            shorts: 21,
            courses: 3,
            status: "active",
            joinedAt: "2026-03-04",
        },
        {
            id: "lena",
            name: "Lena Costa",
            email: "lena@design.io",
            expertise: "design",
            plan: "pro",
            shorts: 18,
            courses: 4,
            status: "active",
            joinedAt: "2026-02-19",
        },
        {
            id: "noah",
            name: "Noah Klein",
            email: "noah@code.io",
            expertise: "frontend",
            plan: "starter",
            shorts: 5,
            courses: 1,
            status: "suspended",
            joinedAt: "2026-06-01",
        },
        {
            id: "sara",
            name: "Sara Alami",
            email: "sara@edu.io",
            expertise: "education",
            plan: "pro",
            shorts: 12,
            courses: 2,
            status: "active",
            joinedAt: "2026-04-22",
        },
        {
            id: "kenji",
            name: "Kenji Mori",
            email: "kenji@biz.io",
            expertise: "business",
            plan: "elite",
            shorts: 9,
            courses: 5,
            status: "active",
            joinedAt: "2026-05-14",
        },
    ];

    return rows.map((row) => ({
        ...row,
        status: status[row.id] ?? row.status,
        plan: plans[row.id] ?? row.plan,
        name: t(`admin.people.instructors.${row.id}_name`, { defaultValue: row.name }),
    }));
}
