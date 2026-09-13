import { lazy, Suspense, type ReactNode } from "react";
import type { MultiSelectOption, Option } from "../../shared/types/generalTypes";
import type { EmailStatus } from "./AppEmailStatusField";
import type { SxProps, Theme } from "@mui/material";
import type { FormFieldLabelLayout } from "./formFieldLayout";

const AppAutocomplete = lazy(() => import("./AppAutocomplete"));
const AppMultiAutocomplete = lazy(() => import("./AppMultiAutocomplete"));
const AppCheckboxField = lazy(() => import("./AppCheckboxField"));
const AppColorField = lazy(() => import("./AppColorField"));
const AppDateField = lazy(() => import("./AppDateField"));
const AppEmailField = lazy(() => import("./AppEmailField"));
const AppEmailStatusField = lazy(() => import("./AppEmailStatusField"));
const AppNumberField = lazy(() => import("./AppNumberField"));
const AppPasswordField = lazy(() => import("./AppPasswordField"));
const AppPasswordWithBarField = lazy(() => import("./AppPasswordWithBarField"));
const AppPhoneField = lazy(() => import("./AppPhoneField"));
const AppTextField = lazy(() => import("./AppTextField"));
const AppOtpField = lazy(() => import("./ِAppOtpField"));
const AppTextAreaField = lazy(() => import("./AppTextAreaField"));
const AppRadioField = lazy(() => import("./AppRadioField"));
const AppRichTextField = lazy(() => import("./AppRichTextField"));
const AppUploadField = lazy(() => import("./AppUploadField"));
const ProfileImageUploader = lazy(() => import("./ProfileImageUploader"));
const AppCardExpiryField = lazy(() => import("./AppCardExpiryField"));
const AppCvvField = lazy(() => import("./AppCvvField"));

type FieldType =
    | "text"
    | "email"
    | "emailStatus"
    | "password"
    | "passwordWithBar"
    | "tel"
    | "autocomplete"
    | "multiAutocomplete"
    | "checkbox"
    | "otp"
    | "textarea"
    | "richtext"
    | "date"
    | "number"
    | "radio"
    | "upload"
    | "profileImage"
    | "color"
    | "cardExpiry"
    | "cvv";

interface AppFormFieldProps {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: Option[] | MultiSelectOption[];
    children?: ReactNode;
    length?: number;
    /** For `type="radio"`: horizontal row of options (default true). */
    row?: boolean;
    sx?: SxProps<Theme>;
    minRows?: number;
    maxRows?: number;
    multiple?: boolean;
    accept?: string;
    showLable?: boolean;
    labelLayout?: FormFieldLabelLayout;
    /** For `type="emailStatus"`: verified / unverified badge + helper text. */
    emailStatus?: EmailStatus;
    startIcon?: ReactNode;
}

export default function AppFormField({
    type,
    startIcon,
    ...rest
}: AppFormFieldProps) {
    const renderField = () => {
        switch (type) {
            case "email":
                return <AppEmailField {...rest} startIcon={startIcon} />;
            case "emailStatus":
                return (
                    <AppEmailStatusField
                        {...rest}
                        emailStatus={rest.emailStatus}
                    />
                );
            case "textarea":
                return <AppTextAreaField {...rest} />;
            case "richtext":
                return <AppRichTextField name={rest.name} label={rest.label} />;
            case "checkbox":
                return <AppCheckboxField {...rest} />;
            case "password":
                return <AppPasswordField {...rest} startIcon={startIcon} />;
            case "passwordWithBar":
                return <AppPasswordWithBarField {...rest} startIcon={startIcon} />;
            case "tel":
                return <AppPhoneField {...rest} />;
            case "autocomplete":
                return <AppAutocomplete {...rest} options={rest.options as Option[]} startIcon={startIcon} />;
            case "multiAutocomplete":
                return (
                    <AppMultiAutocomplete
                        {...rest}
                        options={rest.options as MultiSelectOption[]}
                    />
                );
            case "otp":
                return <AppOtpField {...rest} />;
            case "date":
                return (
                    <AppDateField
                        {...rest}
                        showLabel={rest.showLable}
                    />
                );
            case "number":
                return <AppNumberField {...rest} />;
            case "radio":
                return (
                    <AppRadioField
                        options={rest.options ?? []}
                        disabled={rest.disabled}
                        row={rest.row}
                        {...rest}
                    />
                );
            case "upload":
                return (
                    <AppUploadField
                        name={rest.name}
                        label={rest.label}
                        placeholder={rest.placeholder}
                        disabled={rest.disabled}
                        multiple={rest.multiple}
                        accept={rest.accept}
                    />
                );
            case "profileImage":
                return (
                    <ProfileImageUploader
                        name={rest.name}
                        label={rest.label}
                        disabled={rest.disabled}
                        showLable={rest.showLable}
                    />
                );
            case "color":
                return <AppColorField {...rest} />;
            case "cardExpiry":
                return <AppCardExpiryField {...rest} />;
            case "cvv":
                return <AppCvvField {...rest} />;
            case "text":
            default:
                return <AppTextField {...rest} startIcon={startIcon} />;
        }
    };

    return <Suspense fallback={null}>{renderField()}</Suspense>;
}
