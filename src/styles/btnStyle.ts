import type { SxProps, Theme } from "@mui/material";
import type { SystemStyleObject } from "@mui/system";

export interface BtnVariants {
    btnMainStyle: SystemStyleObject<Theme>;
    btnStyleR0: SystemStyleObject<Theme>;
}


export const BtnLayout: BtnVariants = {
    btnMainStyle: {
        font14_12: {
            fontSize: { lg: 14, md: 12, xs: 8 },
        },
        paddingBlock: {
            lg: "10px",
            md: "8px",
            xs: "4px",
        },
        borderRadius: 2,
    },
    btnStyleR0: {
        paddingBlock: "12px",
        borderRadius: 0,
    }
}

export const actionIconSx: SxProps<Theme> = {
    marginInlineEnd: "10px",
    fontSize: { lg: 14, md: 14, xs: 12 },
};
export const actionIconEndSx: SxProps<Theme> = {
    marginInlineStart: "10px",
    fontSize: { lg: 14, md: 14, xs: 12 },
};
