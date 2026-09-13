/** Space between label and control (all AppFormField-backed inputs). */
export const FORM_FIELD_LABEL_TO_INPUT_SPACING = "8px";

export type FormFieldLabelLayout = "vertical" | "horizontal";

export const formFieldLabelSx = {
    mb: 1,
    fontSize: 13,
    fontWeight: 600,
    color: "text.primary",
} as const;

export const formFieldHorizontalLabelSx = {
    mb: 0,
    flexShrink: 0,
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: "nowrap",
} as const;

/**
 * Shared height for single-line inputs (outlined TextField, standard phone inner field, Autocomplete, etc.).
 */
export const formOutlinedSingleLineInputSx = {
    "& .MuiInputBase-root": {
        bgcolor: "surface.main",
        minHeight: 52,
        alignItems: "center",
        borderRadius: 999,
        fontSize: 14,
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
    },
    "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "divider",
    },
    "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
        borderWidth: 1,
    },
    "& .MuiOutlinedInput-input, & .MuiInputBase-input": {
        paddingBlock: "13px",
        paddingInline: "14px",
        boxSizing: "border-box" as const,
        height: "auto",
    },
    "& .MuiInputAdornment-root": {
        color: "text.disabled",
    },
} as const;

/** Positions the Autocomplete popup arrow on the inline-end (right in LTR, left in RTL). */
export const formAutocompleteDirSx = (dir: "ltr" | "rtl") =>
    ({
        direction: dir,
        "& .MuiOutlinedInput-root .MuiAutocomplete-endAdornment": {
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: "auto",
            left: "auto",
            insetInlineEnd: 9,
        },
        // Override MUI physical padding-right (39px / 65px) so RTL uses inline-end instead.
        "&.MuiAutocomplete-hasPopupIcon .MuiOutlinedInput-root, &.MuiAutocomplete-hasClearIcon .MuiOutlinedInput-root, &.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiOutlinedInput-root":
            {
                paddingRight: "unset !important",
                paddingLeft: "unset !important",
                 paddingInlineStart:"16px !important"
            },
        "&.MuiAutocomplete-hasPopupIcon:not(.MuiAutocomplete-hasClearIcon) .MuiOutlinedInput-root":
            {
                paddingInlineEnd: "39px !important",
            },
        "&.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon .MuiOutlinedInput-root":
            {
                paddingInlineEnd: "65px !important",
                paddingInlineStart:"16px !important"
            },
        "&.MuiAutocomplete-hasClearIcon:not(.MuiAutocomplete-hasPopupIcon) .MuiOutlinedInput-root":
            {
                paddingInlineEnd: "39px !important",
            },
    }) as const;
