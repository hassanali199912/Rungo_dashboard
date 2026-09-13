import { Box, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    formFieldHorizontalLabelSx,
    formFieldLabelSx,
    formOutlinedSingleLineInputSx,
    type FormFieldLabelLayout,
} from "./formFieldLayout";

interface AppDateFieldProps {
    name: string;
    label: string;
    disabled?: boolean;
    labelLayout?: FormFieldLabelLayout;
    showLabel?: boolean;
}

export default function AppDateField({
    name,
    label,
    disabled = false,
    labelLayout = "vertical",
    showLabel = true,
}: AppDateFieldProps) {
    const { control } = useFormContext();
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();
    const isHorizontal = labelLayout === "horizontal";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isHorizontal ? "row" : "column",
                alignItems: isHorizontal ? "center" : "stretch",
                gap: isHorizontal ? 2 : 0,
                width: "100%",
            }}
        >
            {showLabel && (
                <Typography
                    sx={isHorizontal ? formFieldHorizontalLabelSx : formFieldLabelSx}
                >
                    {label}
                </Typography>
            )}

            <Box sx={{ flex: isHorizontal ? 1 : undefined, minWidth: 0, width: "100%" }}>
                <Controller
                    name={name}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            type="date"
                            fullWidth
                            disabled={disabled}
                            error={!!error}
                            helperText={error?.message ? t(error.message) : ""}
                            slotProps={{
                                htmlInput: { dir },
                                formHelperText: {
                                    sx: {
                                        textAlign: dir === "rtl" ? "right" : "left",
                                    },
                                },
                            }}
                            sx={formOutlinedSingleLineInputSx}
                        />
                    )}
                />
            </Box>
        </Box>
    );
}
