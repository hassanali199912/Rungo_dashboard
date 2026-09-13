import type { ReactElement } from "react";

export type CustomVariant = 'primary' | 'outline' | 'outline-gray' | "solid";

export interface NavOption {
    label: string,
    path: string,
    icon?: ReactElement
}
export interface NavOptionString {
    label: string,
    path: string,
    icon?: string
}

export interface Option {
    label: string;
    value: string
}

export interface MultiSelectOption extends Option {
    chipColor?: string;
    chipBackgroundColor?: string;
}


export interface btnTypes {
    key: string,
    type: CustomVariant
}

export interface FQAAccordingType {
    question: string,
    answer: string
}

export interface titleDescription {
    title: string
    description: string
}
export interface titleDescriptionSupDescription {
    title: string
    description: string,
    supDescription: string
}

export interface PrivacyPolicySection {
    items: [string];
}


export interface TableActionMenuItem {
    key: string;
    label: string;
    onClick: () => void;
    color?: "error" | "default";
    disabled?: boolean;
}

export type ActionsDropdownVariant = "primary" | "default" | "danger";

export interface ActionsDropdownItem {
    key: string;
    label: string;
    onClick: () => void;
    icon?: ReactElement;
    variant?: ActionsDropdownVariant;
    disabled?: boolean;
    dividerAfter?: boolean;
}


export interface MultibleActionWithIcon {
    label: string;
    onClick: () => void;
    icon?: ReactElement,
    customType?: CustomVariant
}

export interface ActionLable {
    label: string;
    onClick: () => void;
    icon?: ReactElement
}