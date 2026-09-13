import type { GridSpacing } from "@mui/material";

type ResponsiveSize<T> = {
    lg: T;
    md: T;
    xs: T;
};

interface SpaceLayoutInterface {
    spacing: ResponsiveSize<GridSpacing | string>;
    spacingLg: ResponsiveSize<GridSpacing | string>;
    rowSpacing: ResponsiveSize<string>;
    rowSpacingLg: ResponsiveSize<string>;
    columnSpacing: ResponsiveSize<string>;
}

const spaceLayout: SpaceLayoutInterface = {
    spacingLg: {
        lg: "32px",
        md: "24px",
        xs: "16px",
    },
    spacing: {
        lg: "20px",
        md: "16px",
        xs: "10px",
    },
    rowSpacing: {
        lg: "24px",
        md: "24px",
        xs: "28px",
    },
    rowSpacingLg: {
        lg: "20px",
        md: "40px",
        xs: "44px",
    },
    columnSpacing: {
        lg: "20px",
        md: "16px",
        xs: "10px",
    }
};

export default spaceLayout;