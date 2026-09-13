import {
    Box,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
    type SxProps,
    type Theme,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { Option } from "../../shared/types/generalTypes";
import { formFieldLabelSx } from "./formFieldLayout";

interface AppRadioFieldProps {
    name: string;
    label: string;
    options: Option[];
    disabled?: boolean;
    /** When true, radios are laid out in a row (default). */
    row?: boolean;
    sx?: SxProps<Theme>
}

export default function AppRadioField({
    name,
    options,
    disabled = false,
    row = true,
    label = "",
    sx = {}
}: AppRadioFieldProps) {
    const { control } = useFormContext();
    const { t } = useTranslation();

    return (
        <Box>
            {label && (
                <Typography sx={formFieldLabelSx}>{label}</Typography>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <FormControl error={!!error} disabled={disabled} fullWidth>
                        <RadioGroup
                            row={row}
                            {...field}
                            value={field.value ?? ""}
                        >
                            {options.map((opt) => (
                                <FormControlLabel
                                    key={opt.value}
                                    value={opt.value}
                                    control={<Radio />}
                                    label={opt.label}
                                    sx={{
                                        margin: 0,
                                        ...sx
                                    }}
                                />
                            ))}
                        </RadioGroup>
                        {error?.message ? (
                            <Typography
                                variant="caption"
                                component="span"
                                sx={{ color: "error.main", mt: 0.5, display: "block" }}
                            >
                                {t(error.message)}
                            </Typography>
                        ) : null}
                    </FormControl>
                )}
            />
        </Box>
    );
}
