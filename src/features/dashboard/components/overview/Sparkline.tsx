import { Box, useTheme } from "@mui/material";

type SparklineProps = {
    values: number[];
};

export default function Sparkline({ values }: SparklineProps) {
    const theme = useTheme();
    const width = 120;
    const height = 36;
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = max - min || 1;

    const points = values
        .map((value, index) => {
            const x = (index / Math.max(values.length - 1, 1)) * width;
            const y = height - ((value - min) / range) * (height - 4) - 2;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <Box component="svg" viewBox={`0 0 ${width} ${height}`} sx={{ width: "100%", height: 36, display: "block" }}>
            <polyline
                fill="none"
                stroke={theme.palette.primary.main}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </Box>
    );
}
