import { type ReactNode } from "react";
import {
    FormProvider,
    type UseFormReturn,
    type SubmitHandler,
    type FieldValues,
} from "react-hook-form";
import { Box } from "@mui/material";

interface FormWrapperProps<T extends FieldValues> {
    methods: UseFormReturn<T>;
    onSubmit: SubmitHandler<T>;
    children: ReactNode;
}

export default function FormWrapper<T extends FieldValues>({
    methods,
    onSubmit,
    children,
}: FormWrapperProps<T>) {
    return (
        <FormProvider {...methods}>
            <Box
                component="form"
                onSubmit={methods.handleSubmit(onSubmit)}
                noValidate
            >
                {children}
            </Box>
        </FormProvider>
    );
}