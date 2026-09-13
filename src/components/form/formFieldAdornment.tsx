import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import type { ReactNode } from "react";

export function formStartAdornment(startIcon?: ReactNode) {
    if (!startIcon) return undefined;

    return (
        <InputAdornment position="start" sx={{ pl: 0.5, color: "text.disabled" }}>
            {startIcon}
        </InputAdornment>
    );
}

export function formEndAdornment(endAction?: ReactNode) {
    if (!endAction) return undefined;

    return (
        <InputAdornment position="end" sx={{ pr: 0.5 }}>
            {endAction}
        </InputAdornment>
    );
}

export function formPasswordToggleAdornment(
    showPassword: boolean,
    onToggle: () => void,
    label: string,
) {
    return (
        <InputAdornment position="end">
            <IconButton onClick={onToggle} edge="end" size="small" aria-label={label}>
                {showPassword ? (
                    <VisibilityOff sx={{ fontSize: 18, color: "text.disabled" }} />
                ) : (
                    <Visibility sx={{ fontSize: 18, color: "text.disabled" }} />
                )}
            </IconButton>
        </InputAdornment>
    );
}
