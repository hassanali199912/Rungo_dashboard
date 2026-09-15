import { Box, Typography } from "@mui/material";
import type { AccountStatus } from "../data/adminTypes";

export default function StatusBadge({ status, label }: { status: AccountStatus | "hidden" | "visible" | "paid" | "refunded"; label: string }) {
    const tone =
        status === "active" || status === "visible" || status === "paid"
            ? "tertiary.main"
            : status === "hidden"
              ? "text.secondary"
              : "error.main";

    return (
        <Box
            sx={{
                display: "inline-flex",
                px: 1,
                py: 0.25,
                borderRadius: 999,
                bgcolor: "surface.main",
                color: tone,
                fontSize: 12,
                fontWeight: 700,
            }}
        >
            <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, color: "inherit" }}>
                {label}
            </Typography>
        </Box>
    );
}
