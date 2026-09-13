import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { Option } from "../../shared/types/generalTypes";
import { useTranslation } from "react-i18next";
import { formStartAdornment } from "./formFieldAdornment";
import {
    formAutocompleteDirSx,
    formFieldLabelSx,
    formOutlinedSingleLineInputSx,
} from "./formFieldLayout";



interface AppAutocompleteProps {
    name: string;
    label: string;
    options?: Option[];
    placeholder?: string;
    showLable?: boolean
    startIcon?: ReactNode;
}

export default function AppAutocomplete({
    name,
    label,
    options = [{ label: "", value: "" }],
    placeholder,
    showLable = true,
    startIcon,
}: AppAutocompleteProps) {
    const { control } = useFormContext();
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();

    return (
        <Box>
            {showLable && (
                <Typography sx={formFieldLabelSx}>{label}</Typography>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => option.label}
                        onChange={(_, value) => field.onChange(value?.value ?? "")}
                        value={
                            options.find((opt) => opt.value === field.value) ?? null
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={placeholder}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                                slotProps={{
                                    ...params.slotProps,
                                    formHelperText: {
                                        sx: {
                                            textAlign: dir === "rtl" ? "right" : "left",
                                        },
                                    },
                                    input: {
                                        ...params.slotProps?.input,
                                        startAdornment: (
                                            <>
                                                {formStartAdornment(startIcon)}
                                            </>
                                        ),
                                    },
                                }}
                                sx={formOutlinedSingleLineInputSx}
                            />
                        )}
                        sx={{
                            ...formAutocompleteDirSx(dir),
                            "& .MuiOutlinedInput-root": {
                                paddingBlock: 0,
                                paddingInlineStart: "14px",
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
}