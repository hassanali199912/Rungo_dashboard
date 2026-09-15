import { Box, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useRef } from "react";
import { formOutlinedSingleLineInputSx } from "./formFieldLayout";

interface AppOtpFieldProps {
    name: string;
    length?: number;
}

export default function AppOtpField({
    name,
    length = 6,
}: AppOtpFieldProps) {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const { control } = useFormContext();

    return (
        <Box>
            <Controller
                name={name}
                control={control}
                defaultValue=""
                render={({ field }) => {
                    const value = field.value || "";

                    const handleChange = (index: number, val: string) => {
                        if (!/^\d?$/.test(val)) return;

                        const newValue =
                            value.substring(0, index) +
                            val +
                            value.substring(index + 1);

                        field.onChange(newValue);

                        if (val && index < length - 1) {
                            inputsRef.current[index + 1]?.focus();
                        }
                    };

                    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
                        if (e.key === "Backspace" && !value[index] && index > 0) {
                            inputsRef.current[index - 1]?.focus();
                        }
                    };

                    const handlePaste = (e: React.ClipboardEvent) => {
                        const pasteData = e.clipboardData.getData("text").slice(0, length);
                        if (!/^\d+$/.test(pasteData)) return;

                        field.onChange(pasteData);
                        pasteData.split("").forEach((_, i) => {
                            if (inputsRef.current[i]) {
                                inputsRef.current[i]!.value = pasteData[i];
                            }
                        });
                    };

                    return (
                        <Box
                            onPaste={handlePaste}
                            sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}
                        >
                            {Array.from({ length }).map((_, index) => (
                                <TextField
                                    key={index}
                                    inputRef={(el) => (inputsRef.current[index] = el)}
                                    slotProps={{
                                        htmlInput: {
                                            maxLength: 1,
                                            style: { textAlign: "center", fontSize: "20px" },
                                        },
                                    }}
                                    value={value[index] || ""}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    sx={[
                                        formOutlinedSingleLineInputSx,
                                        {
                                            width: 48,
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                        },
                                    ]}
                                />
                            ))}
                        </Box>
                    );
                }}
            />
        </Box>
    );
}