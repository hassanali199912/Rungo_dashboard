export type FilterViewMode = "grid" | "list";

export type ContentFilterState = {
    query: string;
    domain: string;
    sort: string;
    status: string;
    view: FilterViewMode;
    tier: string;
};

export type ContentFilterOption = {
    value: string;
    label: string;
    count?: number;
};

export const defaultContentFilter: ContentFilterState = {
    query: "",
    domain: "all",
    sort: "plays",
    status: "all",
    view: "grid",
    tier: "all",
};
