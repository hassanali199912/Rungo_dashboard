import type { StudioPlanId } from "@/features/dashboard/pages/subscription/studioPlans";

export type AccountStatus = "active" | "suspended";

export type AdminInstructor = {
    id: string;
    name: string;
    email: string;
    expertise: string;
    plan: StudioPlanId;
    shorts: number;
    courses: number;
    status: AccountStatus;
    joinedAt: string;
};

export type AdminStudent = {
    id: string;
    name: string;
    email: string;
    coins: number;
    invoices: number;
    lastPurchase: string;
    status: AccountStatus;
};

export type AdminCourse = {
    id: string;
    title: string;
    instructorId: string;
    instructorName: string;
    domain: string;
    students: number;
    lessons: number;
    priceCoins: number;
    priceType: "free" | "coins" | "premium";
    duration: string;
    hidden: boolean;
};

export type AdminCourseLesson = {
    id: string;
    title: string;
    duration: string;
    previewUrl: string;
};

export type AdminCourseChapter = {
    id: string;
    title: string;
    lessons: AdminCourseLesson[];
};

export type AdminCourseDetail = AdminCourse & {
    description: string;
    completion: number;
    revenueCoins: number;
    instructorEmail: string;
    instructorExpertise: string;
    coverTone: "code" | "design" | "fitness" | "cooking";
    chapters: AdminCourseChapter[];
};

export type AdminShort = {
    id: string;
    title: string;
    instructorId: string;
    instructorName: string;
    domain: string;
    views: string;
    likes: string;
    previewUrl: string;
    hidden: boolean;
};

export type CoinPack = {
    id: string;
    coins: number;
    price: number;
    bonus: number;
    active: boolean;
};

export type CoinInvoice = {
    id: string;
    studentId: string;
    studentName: string;
    packId: string;
    coins: number;
    amount: number;
    date: string;
    status: "paid" | "refunded";
};

export type PlatformSettings = {
    supportEmail: string;
    creatorSplit: number;
    usdPerCoin: number;
    maintenance: boolean;
};

export type CatalogPlan = {
    id: StudioPlanId;
    name: string;
    description: string;
    price: number;
    currency: string;
    durationDays: number;
    maxCourses: number;
    maxVideos: number;
    isActive: boolean;
    popular: boolean;
    features: string[];
    active: boolean;
};
