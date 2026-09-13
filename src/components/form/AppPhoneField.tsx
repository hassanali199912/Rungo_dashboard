import { Box, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formFieldLabelSx, formOutlinedSingleLineInputSx } from "./formFieldLayout";
import sudiAreba_img from "@assets/icons/saudi-arabia.svg"
export const countries = [
    { code: "SA", dialCode: "+966", label: sudiAreba_img },
    { code: "EG", dialCode: "+20", label: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/960px-Flag_of_Egypt.svg.png?_=20250804162936" },
    { code: "AE", dialCode: "+971", label: sudiAreba_img },
];

interface AppPhoneFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
}

export default function AppPhoneField({
    name,
    label,
    placeholder,
    disabled = false,
}: AppPhoneFieldProps) {
    const { control, setValue } = useFormContext();
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const { t } = useTranslation();
    return (
        <Box>
            <Typography sx={formFieldLabelSx}>{label}</Typography>

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                height: 47,
                                boxSizing: "border-box",
                                border: "1px solid",
                                borderColor: error ? "error.main" : "grey.400",
                                borderRadius: 2,
                                overflow: "hidden",
                                background:"#fff",

                            }}
                        >
                            <TextField
                                {...field}
                                type="tel"
                                variant="standard"
                                fullWidth
                                placeholder={placeholder}
                                disabled={disabled}
                                slotProps={{
                                    input: {
                                        disableUnderline: true,
                                        sx: {
                                            px: 1,
                                            margin: 0,
                                            py: 0,
                                            height: "100%",
                                            minHeight: 0,
                                            alignItems: "center",
                                        },
                                    },
                                }}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    field.onChange(value);
                                }}
                                sx={[
                                    formOutlinedSingleLineInputSx,
                                    {
                                        flex: 1,
                                        minWidth: 0,
                                        height: "100%",
                                        "& .MuiInputBase-root": {
                                            minHeight: 0,
                                            height: "100%",
                                        },
                                    },
                                ]}
                            />
                            <Select
                                value={selectedCountry.code}
                                renderValue={(selectedCode) => {
                                    const country = countries.find(
                                        (c) => c.code === selectedCode
                                    );
                                    if (!country) return selectedCode;
                                    return (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                width: "100%",
                                            }}
                                        >
                                            <Typography
                                                component="span"
                                                sx={{
                                                    fontSize: "1.35rem",
                                                    lineHeight: 1,
                                                }}
                                                aria-hidden
                                            >
                                                <Box component={"img"} alt={country.code}  src={country.label} width={20}/>
                                            </Typography>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                sx={{ color: "text.secondary" }}
                                            >
                                                {country.dialCode}
                                            </Typography>
                                        </Box>
                                    );
                                }}
                                onChange={(e) => {
                                    const country = countries.find(
                                        (c) => c.code === e.target.value
                                    )!;
                                    setSelectedCountry(country);
                                    setValue(
                                        name,
                                        (field.value?.replace(/^\+\d+/, "") || "")
                                    );
                                }}
                                variant="standard"
                                disableUnderline
                                sx={{
                                    minWidth: 112,
                                    flexShrink: 0,
                                    height: "80%",
                                    marginBlock: 0,
                                    marginInline: "0.3rem",
                                    borderRadius: 2,
                                    backgroundColor: "#f5f5f5",
                                    "& .MuiInputBase-root": {
                                        height: "100%",
                                        minHeight: 0,
                                        alignItems: "center",
                                    },
                                    "& .MuiSelect-select": {
                                        display: "flex",
                                        alignItems: "center",
                                        minHeight: "0 !important",
                                        py: 0,
                                        px: 1,
                                        boxSizing: "border-box",
                                    },
                                }}
                            >
                                {countries.map((country) => (
                                    <MenuItem
                                        key={country.code}
                                        value={country.code}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.25,
                                                width: "100%",
                                            }}
                                        >
                                            <Typography
                                                component="span"
                                                sx={{
                                                    fontSize: "1.35rem",
                                                    lineHeight: 1,
                                                }}
                                                aria-hidden
                                            >
                                               <Box component={"img"} alt={country.code}  src={country.label} width={20}/>
                                            </Typography>
                                            <Typography variant="body2">
                                                {country.dialCode}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>


                        </Box>
                        {error && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "error.main",
                                    mt: 1,
                                    display: "block",
                                }}
                            >
                                {t(`${error.message}`)}
                            </Typography>
                        )}
                    </>
                )}
            />
        </Box>
    );
}