/// <reference types="vite/client" />

declare module "react-date-range" {
    import type { ComponentType, CSSProperties } from "react";

    export interface Range {
        startDate?: Date;
        endDate?: Date;
        key?: string;
        color?: string;
        autoFocus?: boolean;
        disabled?: boolean;
        showDateDisplay?: boolean;
    }

    export type RangeKeyDict = Record<string, Range>;

    export interface DateRangeProps {
        ranges: Range[];
        onChange: (item: RangeKeyDict) => void;
        months?: number;
        direction?: "vertical" | "horizontal";
        rangeColors?: string[];
        showDateDisplay?: boolean;
        className?: string;
        style?: CSSProperties;
    }

    export const DateRange: ComponentType<DateRangeProps>;
}
