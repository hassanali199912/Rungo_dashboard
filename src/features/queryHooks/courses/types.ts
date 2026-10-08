export type CourseSummary = {
    id: string;
    instructorUserId: string;
    title: string;
    description: string;
    tagCodes: string[];
    coverUrl: string | null;
    price: number;
    publishedAt: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type CourseListItem = CourseSummary & {
    lessonCount: number;
};

export type CoursePage = {
    items: CourseListItem[];
    total: number;
    page: number;
    limit: number;
};

export type CourseLessonPlacement = {
    id: string;
    shortId: string;
    title: string;
    position: number;
    videoUrl: string;
};

export type CourseChapterOutline = {
    id: string;
    title: string;
    position: number;
    shorts: CourseLessonPlacement[];
};

export type CourseOutline = CourseSummary & {
    chapters: CourseChapterOutline[];
};
