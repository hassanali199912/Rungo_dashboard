import type { TFunction } from "i18next";
import type { AdminCourse } from "./adminTypes";
import { getHiddenIds } from "./adminStore";

export function getMockAdminCourses(t: TFunction): AdminCourse[] {
    const hidden = getHiddenIds("courses");
    return [
        {
            id: "react-architecture",
            title: t("dashboard.courses.mock.react_title"),
            instructorId: "maya",
            instructorName: "Dr. Maya Patel",
            domain: "code",
            students: 4280,
            lessons: 18,
            priceCoins: 420,
            priceType: "coins",
            duration: "6h 20m",
            hidden: hidden.includes("react-architecture"),
        },
        {
            id: "figma-systems",
            title: t("dashboard.courses.mock.figma_title"),
            instructorId: "lena",
            instructorName: "Lena Costa",
            domain: "ui-ux",
            students: 3120,
            lessons: 12,
            priceCoins: 0,
            priceType: "premium",
            duration: "4h 10m",
            hidden: hidden.includes("figma-systems"),
        },
        {
            id: "mobility",
            title: t("dashboard.courses.mock.mobility_title"),
            instructorId: "omar",
            instructorName: "Omar Haddad",
            domain: "fitness",
            students: 1980,
            lessons: 14,
            priceCoins: 260,
            priceType: "coins",
            duration: "5h 05m",
            hidden: hidden.includes("mobility"),
        },
        {
            id: "brand",
            title: t("dashboard.courses.mock.brand_title"),
            instructorId: "lena",
            instructorName: "Lena Costa",
            domain: "ui-ux",
            students: 1540,
            lessons: 9,
            priceCoins: 180,
            priceType: "coins",
            duration: "3h 20m",
            hidden: hidden.includes("brand"),
        },
        {
            id: "knife",
            title: t("dashboard.courses.mock.knife_title"),
            instructorId: "sara",
            instructorName: "Sara Alami",
            domain: "cooking",
            students: 860,
            lessons: 8,
            priceCoins: 140,
            priceType: "coins",
            duration: "2h 45m",
            hidden: hidden.includes("knife"),
        },
        {
            id: "css",
            title: t("dashboard.courses.mock.css_title"),
            instructorId: "noah",
            instructorName: "Noah Klein",
            domain: "code",
            students: 420,
            lessons: 11,
            priceCoins: 0,
            priceType: "free",
            duration: "3h 50m",
            hidden: hidden.includes("css"),
        },
    ];
}

export function formatCoursePrice(course: Pick<AdminCourse, "priceType" | "priceCoins">, t: TFunction) {
    if (course.priceType === "free") return t("dashboard.courses.badge_free");
    if (course.priceType === "premium") return t("dashboard.courses.badge_premium");
    return t("admin.courses.price_coins", { count: course.priceCoins });
}
