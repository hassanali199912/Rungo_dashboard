import { Box, Button, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ViewListOutlined from "@mui/icons-material/ViewListOutlined";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { formOutlinedSingleLineInputSx } from "@/components/form/formFieldLayout";
import type { ContentFilterOption, ContentFilterState } from "./contentFilter.types";

type ContentFilterBarProps = {
    value: ContentFilterState;
    onChange: (next: ContentFilterState) => void;
    searchPlaceholder: string;
    domainLabel: string;
    domainOptions: ContentFilterOption[];
    sortLabel: string;
    sortOptions: ContentFilterOption[];
    statusOptions: ContentFilterOption[];
};

const pillFieldSx = {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    bgcolor: "surface.main",
    borderRadius: 999,
    pl: 2,
    pr: 1.75,
    minHeight: 48,
    minWidth: { xs: "100%", sm: 188 },
} as const;

export default function ContentFilterBar({
    value,
    onChange,
    searchPlaceholder,
    domainLabel,
    domainOptions,
    sortLabel,
    sortOptions,
    statusOptions,
}: ContentFilterBarProps) {
    const { t } = useTranslation();

    const patch = (partial: Partial<ContentFilterState>) => onChange({ ...value, ...partial });

    const handleSelect = (key: "domain" | "sort") => (event: SelectChangeEvent<string>) => {
        patch({ [key]: event.target.value });
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.25,
                }}
            >
                <TextField
                    value={value.query}
                    onChange={(event) => patch({ query: event.target.value })}
                    placeholder={searchPlaceholder}
                    sx={{
                        ...formOutlinedSingleLineInputSx,
                        flex: 1,
                        minWidth: { xs: "100%", md: 240 },
                        "& .MuiInputBase-root": {
                            ...formOutlinedSingleLineInputSx["& .MuiInputBase-root"],
                            minHeight: 48,
                        },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: <SearchOutlined sx={{ fontSize: 18, color: "text.disabled", mr: 1 }} />,
                        },
                    }}
                />

                <Box sx={pillFieldSx}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", whiteSpace: "nowrap" }}>
                        {domainLabel}:
                    </Typography>
                    <Select
                        variant="standard"
                        disableUnderline
                        value={value.domain}
                        onChange={handleSelect("domain")}
                        sx={{
                            flex: 1,
                            fontSize: 13,
                            fontWeight: 700,
                            "& .MuiSelect-select": { py: 1, paddingInlineEnd: 2 },
                        }}
                    >
                        {domainOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value} sx={{ fontSize: 13 }}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box sx={pillFieldSx}>
                    <Typography sx={{ fontSize: 13, color: "text.secondary", whiteSpace: "nowrap" }}>
                        {sortLabel}:
                    </Typography>
                    <Select
                        variant="standard"
                        disableUnderline
                        value={value.sort}
                        onChange={handleSelect("sort")}
                        sx={{
                            flex: 1,
                            fontSize: 13,
                            fontWeight: 700,
                            "& .MuiSelect-select": { py: 1, paddingInlineEnd: 2 },
                        }}
                    >
                        {sortOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value} sx={{ fontSize: 13 }}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <IconButton
                        aria-label={t("dashboard.shorts.view_grid")}
                        onClick={() => patch({ view: "grid" })}
                        sx={{
                            width: 42,
                            height: 42,
                            bgcolor: value.view === "grid" ? "surface.dark" : "surface.main",
                            color: value.view === "grid" ? "text.primary" : "text.secondary",
                            "&:hover": { bgcolor: "surface.dark" },
                        }}
                    >
                        <GridViewOutlined sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                        aria-label={t("dashboard.shorts.view_list")}
                        onClick={() => patch({ view: "list" })}
                        sx={{
                            width: 42,
                            height: 42,
                            bgcolor: value.view === "list" ? "surface.dark" : "surface.main",
                            color: value.view === "list" ? "text.primary" : "text.secondary",
                            "&:hover": { bgcolor: "surface.dark" },
                        }}
                    >
                        <ViewListOutlined sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {statusOptions.map((option) => {
                    const selected = value.status === option.value;
                    const label = option.count == null ? option.label : `${option.label} (${option.count})`;

                    return (
                        <Button
                            key={option.value}
                            type="button"
                            onClick={() => patch({ status: option.value })}
                            sx={{
                                minWidth: 0,
                                borderRadius: 999,
                                px: 1.75,
                                py: 0.85,
                                fontSize: 13,
                                fontWeight: 700,
                                textTransform: "none",
                                bgcolor: selected ? "secondary.main" : "surface.main",
                                color: selected ? "secondary.contrastText" : "text.secondary",
                                "&:hover": {
                                    bgcolor: selected ? "secondary.dark" : (theme) => alpha(theme.palette.secondary.main, 0.06),
                                },
                            }}
                        >
                            {label}
                        </Button>
                    );
                })}
            </Box>
        </Box>
    );
}
