import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useMemo, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  isSameDay,
  format,
} from "date-fns";
import type { Range, RangeKeyDict } from "react-date-range";
import { typography } from "@/styles/fontsLayout";
import AppBtn from "@/components/ui/AppBtn";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";

type QuickRangeId = "this_week" | "this_month" | "last_month" | "this_quarter" | "this_year";

interface DateRangePickerProps {
  onApply?: (range: { startDate: Date; endDate: Date }) => void;
  onCancel?: () => void;
}

function getQuickRange(id: QuickRangeId): { startDate: Date; endDate: Date } {
  const now = new Date();

  switch (id) {
    case "this_week":
      return { startDate: startOfWeek(now), endDate: endOfWeek(now) };
    case "this_month":
      return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
    case "last_month": {
      const lastMonth = subMonths(now, 1);
      return { startDate: startOfMonth(lastMonth), endDate: endOfMonth(lastMonth) };
    }
    case "this_quarter":
      return { startDate: startOfQuarter(now), endDate: endOfQuarter(now) };
    case "this_year":
      return { startDate: startOfYear(now), endDate: endOfYear(now) };
  }
}

function formatDisplayDate(date?: Date) {
  return date ? format(date, "dd/MM/yyyy") : "--/--/----";
}

export default function DateRangePicker({ onApply, onCancel }: DateRangePickerProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const inRangeBg = "rgba(232, 97, 10, 0.10)";
  const isRtl = i18n.dir() === "rtl";
  const isSmDown = useMediaQuery(theme.breakpoints.down("md"));
  const calendarDirection = isSmDown ? "vertical" : "horizontal";

  const [range, setRange] = useState<Range[]>([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);

  const startDate = range[0]?.startDate;
  const endDate = range[0]?.endDate;

  const quickRanges = useMemo(
    () =>
      [
        { id: "this_week" as const, label: t("reports_page.period.this_week") },
        { id: "this_month" as const, label: t("reports_page.period.this_month") },
        { id: "last_month" as const, label: t("reports_page.period.last_month") },
        { id: "this_quarter" as const, label: t("reports_page.period.this_quarter") },
        { id: "this_year" as const, label: t("reports_page.period.this_year") },
      ] satisfies { id: QuickRangeId; label: string }[],
    [t],
  );

  const selectedQuickId = useMemo(() => {
    if (!startDate || !endDate) return null;

    return (
      quickRanges.find(({ id }) => {
        const preset = getQuickRange(id);
        return isSameDay(startDate, preset.startDate) && isSameDay(endDate, preset.endDate);
      })?.id ?? null
    );
  }, [quickRanges, startDate, endDate]);

  const handleQuickSelect = (id: QuickRangeId) => {
    const next = getQuickRange(id);
    setRange([{ ...next, key: "selection" }]);
  };

  const handleApply = () => {
    if (!startDate || !endDate) return;
    onApply?.({ startDate, endDate });
  };

  const datePillSx = {
    ...typography.font12_12,
    bgcolor: inRangeBg,
    color: primary,
    borderRadius: 2.5,
    px: 1.5,
    py: 0.5,
    whiteSpace: "nowrap" as const,
  };

  return (
    <Box sx={{ position: "relative", display: "inline-flex", alignSelf: "flex-start" }}>
      <Box
        sx={{
          position: "absolute",
          top: "100%",
          insetInlineStart: 0,
          zIndex: 1400,
          mt: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "white.main",
          borderRadius: 2,
          boxShadow: 6,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          maxWidth: "min(100vw - 32px, 860px)",
          "& .rdrCalendarWrapper": {
            direction: "ltr",
            fontSize: { xs: 10, sm: 11 },
            color: primary,
            "& .rdrMonthAndYearWrapper": {
              height: 44,
              paddingTop: 4,
            },
            "& .rdrMonth": {
              width: "24em",
              padding: "0 0.6em 1em",
            },
            "& .rdrMonthName": {
              textAlign: "center",
              padding: "0.5em",
            },
            "& .rdrWeekDay": {
              lineHeight: "2.2em",
            },
            "& .rdrDay": {
              lineHeight: "2.4em",
              height: "2.4em",
            },
            "& .rdrDayNumber": {
              top: 3,
              bottom: 3,
            },
            "& .rdrSelected, & .rdrInRange, & .rdrStartEdge, & .rdrEndEdge": {
              top: 3,
              bottom: 3,
            },
            "& .rdrStartEdge, & .rdrEndEdge, & .rdrSelected": {
              background: primary,
            },
            "& .rdrStartEdge": {
              borderRadius: "4px 0 0 4px",
            },
            "& .rdrEndEdge": {
              borderRadius: "0 4px 4px 0",
            },
            "& .rdrSelected": {
              borderRadius: "4px",
            },
            "& .rdrInRange": {
              background: inRangeBg,
              borderRadius: 0,
            },
            "& .rdrDayStartOfMonth .rdrInRange, & .rdrDayStartOfMonth .rdrEndEdge, & .rdrDayStartOfWeek .rdrInRange, & .rdrDayStartOfWeek .rdrEndEdge":
              {
                borderRadius: "4px 0 0 4px",
              },
            "& .rdrDayEndOfMonth .rdrInRange, & .rdrDayEndOfMonth .rdrStartEdge, & .rdrDayEndOfWeek .rdrInRange, & .rdrDayEndOfWeek .rdrStartEdge":
              {
                borderRadius: "0 4px 4px 0",
              },
            "& .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span, & .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span, & .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span":
              {
                color: `${theme.palette.common.white} !important`,
              },
            "& .rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span": {
              color: `${primary} !important`,
            },
            "& .rdrDayToday .rdrDayNumber span:after": {
              background: primary,
              width: 14,
              bottom: 2,
            },
            "& .rdrDayToday:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span:after": {
              background: primary,
            },
            "& .rdrDayToday:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span:after, & .rdrDayToday:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span:after, & .rdrDayToday:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span:after":
              {
                background: theme.palette.common.white,
              },
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>

          <Box
            sx={{
              width: 110,
              flexShrink: 0,
              bgcolor: "#F9FAFB",
              borderInlineEnd: "1px solid",
              borderColor: "divider",
              py: 2,
              px: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Typography
              sx={{
                ...typography.font10_10,
                color: "#99A1AF",
                textAlign: "start",
              }}
            >
              {t("reports_page.period.quick_select")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              {quickRanges.map((item) => {
                const isActive = selectedQuickId === item.id;

                return (
                  <Box
                    key={item.id}
                    component="button"
                    type="button"
                    onClick={() => handleQuickSelect(item.id)}
                    sx={{
                      all: "unset",
                      cursor: "pointer",
                      ...typography.font12_12,
                      color: isActive ? "primary.main" : "#4A5565",
                      fontWeight: isActive ? 600 : 400,
                      textAlign: "start",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {item.label}
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box>
            <DateRange
              ranges={range}
              onChange={(item: RangeKeyDict) => setRange([item.selection])}
              months={isSmDown ? 1 : 2}
              direction={calendarDirection}
              rangeColors={[primary]}
              showDateDisplay={false}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                px: 2,
                py: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "white.main",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                <Box sx={datePillSx}>{formatDisplayDate(startDate)}</Box>
                {isRtl ? (
                  <ArrowBack sx={{ fontSize: 16, color: "text.disabled" }} />
                ) : (
                  <ArrowForward sx={{ fontSize: 16, color: "text.disabled" }} />
                )}
                <Box sx={datePillSx}>{formatDisplayDate(endDate)}</Box>
              </Box>
              <Box sx={{
                display: "flex",
                gap: 1
              }}>
                <AppBtn
                  customType="primary"
                  onClick={handleApply}
                  sx={{
                    fontSize: {  md: 12, xs: 8 },
                    minWidth: 130,
                    borderRadius: 2,
                  }}
                >
                  {t("reports_page.period.apply_period")}
                </AppBtn>

                <AppBtn
                  customType="solid"
                  onClick={onCancel}
                  sx={{
                    ...typography.font14_12,
                    color: "text.primary",
                    minWidth: "auto",
                    px: 1,
                    "&:hover": {
                      bgcolor: "transparent",
                      color: "primary.main",
                    },
                  }}
                >
                  {t("form.cancel")}
                </AppBtn>
              </Box>
            </Box>
          </Box>

        </Box>

      </Box>
    </Box>
  );
}
