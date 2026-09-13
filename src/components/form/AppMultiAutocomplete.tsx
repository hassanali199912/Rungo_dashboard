import { Autocomplete, Box, Chip, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type { MultiSelectOption } from "../../shared/types/generalTypes";
import { useTranslation } from "react-i18next";
import {
    formAutocompleteDirSx,
    formFieldLabelSx,
    formOutlinedSingleLineInputSx,
} from "./formFieldLayout";

const DEFAULT_CHIP_BG = "#F1F5F9";
const DEFAULT_CHIP_COLOR = "#475569";

interface AppMultiAutocompleteProps {
    name: string;
    label: string;
    options?: MultiSelectOption[];
    placeholder?: string;
    disabled?: boolean;
    limitTags?: number;
}

function getChipStyles(option: MultiSelectOption) {
    return {
        backgroundColor: option.chipBackgroundColor ?? DEFAULT_CHIP_BG,
        color: option.chipColor ?? DEFAULT_CHIP_COLOR,
    };
}

export default function AppMultiAutocomplete({
    name,
    label,
    options = [],
    placeholder,
    disabled = false,
    limitTags,
}: AppMultiAutocompleteProps) {
    const { control } = useFormContext();
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();

    return (
        <Box>
            <Typography sx={formFieldLabelSx}>{label}</Typography>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => {
                    const selectedOptions = options.filter((opt) =>
                        (field.value as string[] | undefined)?.includes(opt.value),
                    );

                    return (
                        <Autocomplete
                            multiple
                            disabled={disabled}
                            limitTags={limitTags}
                            options={options}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            value={selectedOptions}
                            onChange={(_, value) =>
                                field.onChange(value.map((item) => item.value))
                            }
                            renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => {
                                    const { backgroundColor, color } = getChipStyles(option);
                                    const { key, ...chipProps } = getTagProps({ index });

                                    return (
                                        <Chip
                                            key={key}
                                            label={option.label}
                                            size="small"
                                            {...chipProps}
                                            sx={{
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                fontSize: "13px",
                                                height: 28,
                                                bgcolor: backgroundColor,
                                                color,
                                                "& .MuiChip-deleteIcon": {
                                                    color,
                                                    opacity: 0.7,
                                                    marginInlineEnd:1,
                                                    "&:hover": { opacity: 1 },
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                            renderOption={(props, option) => {
                                const { backgroundColor, color } = getChipStyles(option);
                                const { key, ...optionProps } = props;

                                return (
                                    <Box
                                        component="li"
                                        key={key}
                                        {...optionProps}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        {(option.chipColor || option.chipBackgroundColor) && (
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    bgcolor: color,
                                                    border: `1px solid ${backgroundColor}`,
                                                    flexShrink: 0,
                                                }}
                                            />
                                        )}
                                        <Typography sx={{ fontSize: "14px" }}>
                                            {option.label}
                                        </Typography>
                                    </Box>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder={placeholder}
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error?.message
                                            ? t(fieldState.error.message)
                                            : ""
                                    }
                                    slotProps={{
                                        ...params.slotProps,
                                        formHelperText: {
                                            sx: {
                                                textAlign: dir === "rtl" ? "right" : "left",
                                            },
                                        },
                                    }}
                                    sx={formOutlinedSingleLineInputSx}
                                />
                            )}
                            sx={{
                                ...formAutocompleteDirSx(dir),
                                "& .MuiOutlinedInput-root": {
                                    paddingBlock: "4px",
                                    paddingInlineStart: "6px",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                },
                            }}
                        />
                    );
                }}
            />
        </Box>
    );
}
