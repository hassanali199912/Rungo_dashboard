import type { TFunction } from "i18next";
import type { AdminShort } from "./adminTypes";
import { getHiddenIds } from "./adminStore";

const SAMPLE_PREVIEW = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export function getMockAdminShorts(t: TFunction): AdminShort[] {
    const hidden = getHiddenIds("shorts");
    return [
        {
            id: "figma-autolayout",
            title: t("dashboard.shorts.mock.figma_title"),
            instructorId: "maya",
            instructorName: "Dr. Maya Patel",
            domain: "ui-ux",
            views: "594.3k",
            likes: "48.2k",
            previewUrl: SAMPLE_PREVIEW,
            hidden: hidden.includes("figma-autolayout"),
        },
        {
            id: "python-loops",
            title: t("dashboard.shorts.mock.python_title"),
            instructorId: "maya",
            instructorName: "Dr. Maya Patel",
            domain: "code",
            views: "812.1k",
            likes: "61.4k",
            previewUrl: SAMPLE_PREVIEW,
            hidden: hidden.includes("python-loops"),
        },
        {
            id: "dance-warmup",
            title: t("dashboard.shorts.mock.dance_title"),
            instructorId: "omar",
            instructorName: "Omar Haddad",
            domain: "fitness",
            views: "1.08M",
            likes: "92.7k",
            previewUrl: SAMPLE_PREVIEW,
            hidden: hidden.includes("dance-warmup"),
        },
        {
            id: "pasta-five",
            title: t("dashboard.shorts.mock.pasta_title"),
            instructorId: "sara",
            instructorName: "Sara Alami",
            domain: "cooking",
            views: "226.4k",
            likes: "19.8k",
            previewUrl: SAMPLE_PREVIEW,
            hidden: hidden.includes("pasta-five"),
        },
        {
            id: "brand-sprint",
            title: t("admin.content.short_brand"),
            instructorId: "lena",
            instructorName: "Lena Costa",
            domain: "ui-ux",
            views: "188.2k",
            likes: "14.1k",
            previewUrl: SAMPLE_PREVIEW,
            hidden: hidden.includes("brand-sprint"),
        },
        {
            id: "hooks-memo",
            title: t("admin.content.short_hooks"),
            instructorId: "noah",
            instructorName: "Noah Klein",
            domain: "code",
            views: "97.4k",
            likes: "7.6k",
            previewUrl: SAMPLE_PREVIEW,
            hidden: hidden.includes("hooks-memo"),
        },
    ];
}
