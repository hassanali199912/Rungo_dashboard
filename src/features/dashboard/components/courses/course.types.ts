export type CourseStatus = "published" | "draft" | "review";

export type CoursePricing = "free" | "coins" | "premium";

export type CourseItem = {
    id: string;
    title: string;
    description: string;
    category: string;
    domain: string;
    status: CourseStatus;
    pricing: CoursePricing;
    lessons: number;
    duration: string;
    students: string;
    studentsCount: number;
    completion: string;
    completionValue: number;
    shorts: number;
    topics: string[];
    createdAt: string;
    thumbnail?: string;
};
