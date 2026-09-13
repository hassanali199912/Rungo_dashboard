import type { ElementType } from "react";

export interface UserNavItem {
    key: string;
    groptitle?: string;
    labelKey: string;
    fallbackLabel: string;
    path?: string;
    icon: ElementType;
    children?: Array<{
        key: string;
        labelKey: string;
        fallbackLabel: string;
        path: string;
    }>;
}
