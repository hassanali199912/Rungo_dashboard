import type { SxProps, Theme } from "@mui/material";
import type { SystemStyleObject } from "@mui/system";
import { cloneElement, isValidElement, type ReactElement } from "react";

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
    },
};

/** Clears MUI physical icon gutters so spacing can follow `marginInline*`. */
export const btnIconSlotReset: SystemStyleObject<Theme> = {
    "& .MuiButton-startIcon": {
        marginLeft: 0,
        marginRight: 0,
        marginInlineStart: 0,
        marginInlineEnd: 0,
    },
    "& .MuiButton-endIcon": {
        marginLeft: 0,
        marginRight: 0,
        marginInlineStart: 0,
        marginInlineEnd: 0,
    },
};

export const btnIconSlotsSx: SxProps<Theme> = btnIconSlotReset;

export const btnIconStartSx: SxProps<Theme> = {
    fontSize: 18,
    marginInlineEnd: "8px",
};

export const btnIconEndSx: SxProps<Theme> = {
    fontSize: 18,
    marginInlineStart: "8px",
};

type IconSxProps = { sx?: SxProps<Theme> };

export function withBtnIconSx(icon: ReactElement<IconSxProps> | undefined, edge: "start" | "end" = "start") {
    if (!icon || !isValidElement(icon)) return undefined;
    return cloneElement(icon, {
        sx: [edge === "end" ? btnIconEndSx : btnIconStartSx, icon.props.sx],
    });
}

export const actionIconSx = btnIconStartSx;
export const actionIconEndSx = btnIconEndSx;
