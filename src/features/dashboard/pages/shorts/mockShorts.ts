import type { TFunction } from "i18next";
import type { ContentFilterState } from "../../components/contentFilter.types";
import type { ShortItem, ShortStatus } from "../../components/shorts/short.types";

export function getMockShorts(t: TFunction): ShortItem[] {
    return [
        {
            id: "figma-autolayout",
            title: t("dashboard.shorts.mock.figma_title"),
            description: t("dashboard.shorts.mock.figma_body"),
            category: t("dashboard.shorts.mock.cat_ui"),
            domain: "ui-ux",
            status: "preview",
            duration: "0:45",
            tags: [
                { label: t("dashboard.shorts.tag_lead"), tone: "light" },
                { label: t("dashboard.shorts.tag_viral"), tone: "dark" },
            ],
            topics: ["figma", "autolayout", "ui"],
            plays: "594.3k",
            playsCount: 594300,
            enrollments: "+1,240",
            enrollmentsCount: 1240,
            retention: "84.2%",
            retentionValue: 84.2,
            createdAt: "2026-09-10",
        },
        {
            id: "python-loops",
            title: t("dashboard.shorts.mock.python_title"),
            description: t("dashboard.shorts.mock.python_body"),
            category: t("dashboard.shorts.mock.cat_code"),
            domain: "code",
            status: "monetized",
            duration: "0:58",
            tags: [
                { label: t("dashboard.shorts.tag_evergreen"), tone: "light" },
                { label: t("dashboard.shorts.tag_series"), tone: "dark" },
            ],
            topics: ["python", "loops", "code"],
            plays: "812.1k",
            playsCount: 812100,
            enrollments: "+2,180",
            enrollmentsCount: 2180,
            retention: "79.4%",
            retentionValue: 79.4,
            createdAt: "2026-09-08",
        },
        {
            id: "dance-warmup",
            title: t("dashboard.shorts.mock.dance_title"),
            description: t("dashboard.shorts.mock.dance_body"),
            category: t("dashboard.shorts.mock.cat_fitness"),
            domain: "fitness",
            status: "monetized",
            duration: "0:32",
            tags: [
                { label: t("dashboard.shorts.tag_viral"), tone: "dark" },
                { label: t("dashboard.shorts.tag_lead"), tone: "light" },
            ],
            topics: ["dance", "warmup", "fitness"],
            plays: "1.08M",
            playsCount: 1080000,
            enrollments: "+3,420",
            enrollmentsCount: 3420,
            retention: "91.0%",
            retentionValue: 91,
            createdAt: "2026-09-11",
        },
        {
            id: "pasta-five",
            title: t("dashboard.shorts.mock.pasta_title"),
            description: t("dashboard.shorts.mock.pasta_body"),
            category: t("dashboard.shorts.mock.cat_cooking"),
            domain: "cooking",
            status: "preview",
            duration: "0:41",
            tags: [{ label: t("dashboard.shorts.tag_lead"), tone: "light" }],
            topics: ["cooking", "pasta", "recipe"],
            plays: "226.4k",
            playsCount: 226400,
            enrollments: "+640",
            enrollmentsCount: 640,
            retention: "72.8%",
            retentionValue: 72.8,
            createdAt: "2026-09-06",
        },
        {
            id: "css-grid",
            title: t("dashboard.shorts.mock.css_title"),
            description: t("dashboard.shorts.mock.css_body"),
            category: t("dashboard.shorts.mock.cat_code"),
            domain: "code",
            status: "review",
            duration: "1:02",
            tags: [{ label: t("dashboard.shorts.tag_series"), tone: "dark" }],
            topics: ["css", "grid", "flexbox"],
            plays: "94.7k",
            playsCount: 94700,
            enrollments: "+210",
            enrollmentsCount: 210,
            retention: "68.5%",
            retentionValue: 68.5,
            createdAt: "2026-09-12",
        },
        {
            id: "mobility-flow",
            title: t("dashboard.shorts.mock.mobility_title"),
            description: t("dashboard.shorts.mock.mobility_body"),
            category: t("dashboard.shorts.mock.cat_fitness"),
            domain: "fitness",
            status: "draft",
            duration: "0:36",
            tags: [{ label: t("dashboard.shorts.tag_evergreen"), tone: "light" }],
            topics: ["mobility", "morning", "fitness"],
            plays: "0",
            playsCount: 0,
            enrollments: "0",
            enrollmentsCount: 0,
            retention: "—",
            retentionValue: 0,
            createdAt: "2026-09-13",
        },
        {
            id: "brand-color",
            title: t("dashboard.shorts.mock.brand_title"),
            description: t("dashboard.shorts.mock.brand_body"),
            category: t("dashboard.shorts.mock.cat_ui"),
            domain: "ui-ux",
            status: "monetized",
            duration: "0:49",
            tags: [
                { label: t("dashboard.shorts.tag_lead"), tone: "light" },
                { label: t("dashboard.shorts.tag_evergreen"), tone: "dark" },
            ],
            topics: ["brand", "color", "design"],
            plays: "341.2k",
            playsCount: 341200,
            enrollments: "+890",
            enrollmentsCount: 890,
            retention: "81.6%",
            retentionValue: 81.6,
            createdAt: "2026-09-04",
        },
        {
            id: "knife-skills",
            title: t("dashboard.shorts.mock.knife_title"),
            description: t("dashboard.shorts.mock.knife_body"),
            category: t("dashboard.shorts.mock.cat_cooking"),
            domain: "cooking",
            status: "monetized",
            duration: "0:54",
            tags: [{ label: t("dashboard.shorts.tag_series"), tone: "dark" }],
            topics: ["cooking", "knife", "skills"],
            plays: "478.9k",
            playsCount: 478900,
            enrollments: "+1,050",
            enrollmentsCount: 1050,
            retention: "86.1%",
            retentionValue: 86.1,
            createdAt: "2026-09-02",
        },
    ];
}

export function countShortsByStatus(items: ShortItem[]): Record<ShortStatus | "all", number> {
    return items.reduce(
        (acc, item) => {
            acc.all += 1;
            acc[item.status] += 1;
            return acc;
        },
        { all: 0, monetized: 0, preview: 0, review: 0, draft: 0 },
    );
}

export function filterShorts(items: ShortItem[], filter: ContentFilterState): ShortItem[] {
    const query = filter.query.trim().toLowerCase();

    const next = items.filter((item) => {
        const matchesDomain = filter.domain === "all" || item.domain === filter.domain;
        const matchesStatus = filter.status === "all" || item.status === filter.status;
        const haystack = [item.title, item.description, item.category, ...item.topics, ...item.tags.map((tag) => tag.label)]
            .join(" ")
            .toLowerCase();
        const matchesQuery = !query || haystack.includes(query);
        return matchesDomain && matchesStatus && matchesQuery;
    });

    const sorted = [...next].sort((a, b) => {
        if (filter.sort === "recent") return b.createdAt.localeCompare(a.createdAt);
        if (filter.sort === "retention") return b.retentionValue - a.retentionValue;
        if (filter.sort === "enrollments") return b.enrollmentsCount - a.enrollmentsCount;
        return b.playsCount - a.playsCount;
    });

    return sorted;
}
