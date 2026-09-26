import { Box, Button, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export type OverviewRangeKey = "7d" | "30d" | "year" | "custom";

export type OverviewCustomRange = {
    start: string;
    end: string;
};

type OverviewRangeControlProps = {
    range: OverviewRangeKey;
    customRange: OverviewCustomRange;
    onRangeChange: (range: OverviewRangeKey) => void;
    onCustomRangeChange: (range: OverviewCustomRange) => void;
};

function toDateInput(date: Date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

export function defaultOverviewCustomRange(): OverviewCustomRange {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);
    return { start: toDateInput(start), end: toDateInput(end) };
}

const dateFieldSx = {
    minWidth: 150,
    "& .MuiInputBase-root": {
        bgcolor: "background.paper",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "divider",
    },
} as const;

export default function OverviewRangeControl({
    range,
    customRange,
    onRangeChange,
    onCustomRangeChange,
}: OverviewRangeControlProps) {
    const { t } = useTranslation();
    const ranges: Array<{ key: OverviewRangeKey; label: string }> = [
        { key: "7d", label: t("dashboard.range_7") },
        { key: "30d", label: t("dashboard.range_30") },
        { key: "year", label: t("dashboard.range_year") },
        { key: "custom", label: t("dashboard.range_custom") },
    ];
    const datesInvalid = Boolean(customRange.start && customRange.end && customRange.end < customRange.start);

    const selectRange = (key: OverviewRangeKey) => {
        onRangeChange(key);
        if (key === "custom" && (!customRange.start || !customRange.end)) {
            onCustomRangeChange(defaultOverviewCustomRange());
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "stretch", sm: "flex-end" }, gap: 1.25 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {ranges.map((item) => {
                    const selected = range === item.key;
                    return (
                        <Button
                            key={item.key}
                            onClick={() => selectRange(item.key)}
                            sx={{
                                borderRadius: 999,
                                px: 1.75,
                                py: 0.75,
                                fontSize: 13,
                                fontWeight: 600,
                                color: selected ? "text.primary" : "text.secondary",
                                bgcolor: selected ? "background.paper" : "transparent",
                                border: "1px solid",
                                borderColor: selected ? "divider" : "transparent",
                                "&:hover": { bgcolor: "background.paper" },
                            }}
                        >
                            {item.label}
                        </Button>
                    );
                })}
            </Box>
            {range === "custom" ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "flex-end" }}>
                    <Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 0.5 }}>
                            {t("dashboard.range_from")}
                        </Typography>
                        <TextField
                            type="date"
                            size="small"
                            value={customRange.start}
                            onChange={(event) => onCustomRangeChange({ ...customRange, start: event.target.value })}
                            sx={dateFieldSx}
                            slotProps={{ htmlInput: { max: customRange.end || undefined } }}
                        />
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 0.5 }}>
                            {t("dashboard.range_to")}
                        </Typography>
                        <TextField
                            type="date"
                            size="small"
                            value={customRange.end}
                            onChange={(event) => onCustomRangeChange({ ...customRange, end: event.target.value })}
                            sx={dateFieldSx}
                            slotProps={{ htmlInput: { min: customRange.start || undefined } }}
                        />
                    </Box>
                    {datesInvalid ? (
                        <Typography sx={{ fontSize: 12, color: "error.main", pb: 1 }}>{t("dashboard.range_invalid")}</Typography>
                    ) : null}
                </Box>
            ) : null}
        </Box>
    );
}
