export type ShortStatus = "monetized" | "preview" | "review" | "draft";

export type ShortTag = {
    label: string;
    tone: "light" | "dark";
};

export type ShortItem = {
    id: string;
    title: string;
    description: string;
    category: string;
    domain: string;
    status: ShortStatus;
    duration: string;
    tags: ShortTag[];
    topics: string[];
    plays: string;
    playsCount: number;
    enrollments: string;
    enrollmentsCount: number;
    retention: string;
    retentionValue: number;
    createdAt: string;
    thumbnail?: string;
};
