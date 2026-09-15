import type { TFunction } from "i18next";
import type { AdminCourseDetail } from "./adminTypes";
import { getMockAdminCourses } from "./mockAdminCourses";

const SAMPLE_PREVIEW = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

const bodyById: Record<string, string> = {
    "react-architecture": "dashboard.courses.mock.react_body",
    "figma-systems": "dashboard.courses.mock.figma_body",
    mobility: "dashboard.courses.mock.mobility_body",
    brand: "dashboard.courses.mock.brand_body",
    knife: "dashboard.courses.mock.knife_body",
    css: "dashboard.courses.mock.css_body",
};

const coverByDomain: Record<string, AdminCourseDetail["coverTone"]> = {
    code: "code",
    "ui-ux": "design",
    fitness: "fitness",
    cooking: "cooking",
};

type ChapterSeed = {
    id: string;
    titleKey: string;
    lessons: Array<{ id: string; titleKey: string; duration: string }>;
};

const detailMeta: Record<
    string,
    {
        coverTone: AdminCourseDetail["coverTone"];
        instructorEmail: string;
        instructorExpertise: string;
        completion: number;
        revenueCoins: number;
        chapters: ChapterSeed[];
    }
> = {
    "react-architecture": {
        coverTone: "code",
        instructorEmail: "maya@teach.io",
        instructorExpertise: "frontend",
        completion: 76,
        revenueCoins: 184800,
        chapters: [
            {
                id: "ch-1",
                titleKey: "admin.courses.detail.mock.react_ch1",
                lessons: [
                    { id: "l-1", titleKey: "admin.courses.detail.mock.react_l1", duration: "12m" },
                    { id: "l-2", titleKey: "admin.courses.detail.mock.react_l2", duration: "18m" },
                    { id: "l-3", titleKey: "admin.courses.detail.mock.react_l3", duration: "15m" },
                ],
            },
            {
                id: "ch-2",
                titleKey: "admin.courses.detail.mock.react_ch2",
                lessons: [
                    { id: "l-4", titleKey: "admin.courses.detail.mock.react_l4", duration: "22m" },
                    { id: "l-5", titleKey: "admin.courses.detail.mock.react_l5", duration: "19m" },
                ],
            },
            {
                id: "ch-3",
                titleKey: "admin.courses.detail.mock.react_ch3",
                lessons: [
                    { id: "l-6", titleKey: "admin.courses.detail.mock.react_l6", duration: "24m" },
                    { id: "l-7", titleKey: "admin.courses.detail.mock.react_l7", duration: "16m" },
                ],
            },
        ],
    },
    "figma-systems": {
        coverTone: "design",
        instructorEmail: "lena@design.io",
        instructorExpertise: "design",
        completion: 81,
        revenueCoins: 0,
        chapters: [
            {
                id: "ch-1",
                titleKey: "admin.courses.detail.mock.figma_ch1",
                lessons: [
                    { id: "l-1", titleKey: "admin.courses.detail.mock.figma_l1", duration: "10m" },
                    { id: "l-2", titleKey: "admin.courses.detail.mock.figma_l2", duration: "14m" },
                ],
            },
            {
                id: "ch-2",
                titleKey: "admin.courses.detail.mock.figma_ch2",
                lessons: [
                    { id: "l-3", titleKey: "admin.courses.detail.mock.figma_l3", duration: "17m" },
                    { id: "l-4", titleKey: "admin.courses.detail.mock.figma_l4", duration: "13m" },
                ],
            },
        ],
    },
};

function fallbackChapters(courseId: string): ChapterSeed[] {
    return [
        {
            id: `${courseId}-ch-1`,
            titleKey: "admin.courses.detail.mock.generic_ch1",
            lessons: [
                { id: `${courseId}-l-1`, titleKey: "admin.courses.detail.mock.generic_l1", duration: "11m" },
                { id: `${courseId}-l-2`, titleKey: "admin.courses.detail.mock.generic_l2", duration: "15m" },
            ],
        },
        {
            id: `${courseId}-ch-2`,
            titleKey: "admin.courses.detail.mock.generic_ch2",
            lessons: [
                { id: `${courseId}-l-3`, titleKey: "admin.courses.detail.mock.generic_l3", duration: "18m" },
                { id: `${courseId}-l-4`, titleKey: "admin.courses.detail.mock.generic_l4", duration: "12m" },
            ],
        },
    ];
}

export function getMockAdminCourseDetail(id: string, t: TFunction): AdminCourseDetail | null {
    const course = getMockAdminCourses(t).find((row) => row.id === id);
    if (!course) return null;

    const meta = detailMeta[id];
    const chapters = (meta?.chapters ?? fallbackChapters(id)).map((chapter) => ({
        id: chapter.id,
        title: t(chapter.titleKey),
        lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: t(lesson.titleKey),
            duration: lesson.duration,
            previewUrl: SAMPLE_PREVIEW,
        })),
    }));

    return {
        ...course,
        description: t(bodyById[id] ?? "dashboard.courses.mock.react_body"),
        completion: meta?.completion ?? 72,
        revenueCoins: meta?.revenueCoins ?? course.students * Math.max(course.priceCoins, 40),
        instructorEmail: meta?.instructorEmail ?? `${course.instructorId}@studio.io`,
        instructorExpertise: meta?.instructorExpertise ?? "education",
        coverTone: meta?.coverTone ?? coverByDomain[course.domain] ?? "code",
        chapters,
    };
}
