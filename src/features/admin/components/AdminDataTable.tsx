import MoreHoriz from "@mui/icons-material/MoreHoriz";
import {
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState, type MouseEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type AdminTableAlign = "left" | "center" | "right";

export type AdminTableColumn<T> = {
    id: string;
    label: string;
    align?: AdminTableAlign;
    render: (row: T) => ReactNode;
};

export type AdminTableAction<T> = {
    key: string;
    label: string;
    onClick: (row: T) => void;
    tone?: "default" | "danger" | "success";
};

type AdminDataTableProps<T extends { id: string }> = {
    columns: AdminTableColumn<T>[];
    rows: T[];
    getActions?: (row: T) => AdminTableAction<T>[];
    emptyLabel: string;
    ariaLabel: string;
    minWidth?: number;
};

const headCellSx = {
    fontWeight: 700,
    fontSize: 12,
    color: "text.secondary",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid",
    borderBottomColor: (theme: { palette: { secondary: { main: string } } }) =>
        alpha(theme.palette.secondary.main, 0.08),
    whiteSpace: "nowrap",
    bgcolor: "transparent",
    py: 1.5,
    px: 2,
} as const;

const bodyCellSx = {
    borderBottom: "1px solid",
    borderBottomColor: (theme: { palette: { secondary: { main: string } } }) =>
        alpha(theme.palette.secondary.main, 0.06),
    py: 1.75,
    px: 2,
    verticalAlign: "middle",
} as const;

export function AdminTablePersonCell({ name, subtitle }: { name: string; subtitle?: string }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
            <Avatar
                sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontSize: 15,
                    fontWeight: 700,
                }}
            >
                {name.slice(0, 1)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>{name}</Typography>
                {subtitle ? (
                    <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.15 }}>{subtitle}</Typography>
                ) : null}
            </Box>
        </Box>
    );
}

export function AdminTableChip({ children }: { children: ReactNode }) {
    return (
        <Box
            sx={{
                display: "inline-flex",
                px: 1.1,
                py: 0.35,
                borderRadius: 999,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                fontSize: 12,
                fontWeight: 700,
            }}
        >
            {children}
        </Box>
    );
}

export function AdminTableText({ children, muted, strong }: { children: ReactNode; muted?: boolean; strong?: boolean }) {
    return (
        <Typography
            sx={{
                fontSize: 13,
                color: muted ? "text.secondary" : "text.primary",
                fontWeight: strong ? 700 : muted ? 400 : 600,
            }}
        >
            {children}
        </Typography>
    );
}

export default function AdminDataTable<T extends { id: string }>({
    columns,
    rows,
    getActions,
    emptyLabel,
    ariaLabel,
    minWidth = 880,
}: AdminDataTableProps<T>) {
    const { t, i18n } = useTranslation();
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [menuRow, setMenuRow] = useState<T | null>(null);
    const showActions = Boolean(getActions);
    const actionsAlign: AdminTableAlign = i18n.dir() === "rtl" ? "left" : "right";
    const colSpan = columns.length + (showActions ? 1 : 0);
    const menuActions = menuRow && getActions ? getActions(menuRow) : [];

    const closeMenu = () => {
        setMenuAnchor(null);
        setMenuRow(null);
    };

    const openMenu = (event: MouseEvent<HTMLElement>, row: T) => {
        setMenuAnchor(event.currentTarget);
        setMenuRow(row);
    };

    const toneColor = (tone?: AdminTableAction<T>["tone"]) => {
        if (tone === "danger") return "error.main";
        if (tone === "success") return "tertiary.main";
        return "text.primary";
    };

    return (
        <>
            <Box
                sx={{
                    mt: 2.5,
                    p: { xs: 1.25, md: 1.5 },
                    borderRadius: "1rem",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                    boxShadow: (theme) => `0 2px 12px 0 ${alpha(theme.palette.secondary.main, 0.05)}`,
                }}
            >
                <TableContainer
                    sx={{
                        borderRadius: "0.85rem",
                        // bgcolor: "surface.main",
                        overflowX: "auto",
                    }}
                >
                    <Table sx={{ minWidth }} aria-label={ariaLabel}>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} sx={headCellSx} align={column.align ?? "center"}>
                                        {column.label}
                                    </TableCell>
                                ))}
                                {showActions ? (
                                    <TableCell sx={headCellSx} align={actionsAlign}>
                                        {t("admin.people.col_actions")}
                                    </TableCell>
                                ) : null}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    sx={{
                                        transition: "background-color 0.15s ease",
                                        "&:last-child td": { borderBottom: 0 },
                                        "&:hover": {
                                            bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.03),
                                        },
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.id} sx={bodyCellSx} align={column.align ?? "center"}>
                                            {column.render(row)}
                                        </TableCell>
                                    ))}
                                    {showActions ? (
                                        <TableCell sx={bodyCellSx} align={actionsAlign}>
                                            <IconButton
                                                size="small"
                                                aria-label={t("admin.people.col_actions")}
                                                onClick={(event) => openMenu(event, row)}
                                                sx={{
                                                    color: "text.secondary",
                                                    bgcolor: "background.paper",
                                                    border: "1px solid",
                                                    borderColor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                                                    "&:hover": {
                                                        bgcolor: "background.paper",
                                                        color: "text.primary",
                                                        borderColor: "primary.main",
                                                    },
                                                }}
                                            >
                                                <MoreHoriz fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            ))}
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={colSpan} sx={{ ...bodyCellSx, borderBottom: 0 }}>
                                        <Typography sx={{ color: "text.secondary", p: 3, textAlign: "center" }}>
                                            {emptyLabel}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : null}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {showActions ? (
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor) && Boolean(menuRow)}
                    onClose={closeMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: i18n.dir() === "rtl" ? "left" : "right" }}
                    transformOrigin={{ vertical: "top", horizontal: i18n.dir() === "rtl" ? "left" : "right" }}
                    slotProps={{
                        paper: {
                            sx: {
                                mt: 0.75,
                                minWidth: 180,
                                borderRadius: "0.85rem",
                                border: "1px solid",
                                borderColor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                                boxShadow: (theme) => `0 8px 24px 0 ${alpha(theme.palette.secondary.main, 0.12)}`,
                            },
                        },
                    }}
                >
                    {menuActions.map((action) => (
                        <MenuItem
                            key={action.key}
                            sx={{ fontSize: 14, fontWeight: 600, py: 1.1, color: toneColor(action.tone) }}
                            onClick={() => {
                                if (!menuRow) return;
                                const current = menuRow;
                                closeMenu();
                                action.onClick(current);
                            }}
                        >
                            {action.label}
                        </MenuItem>
                    ))}
                </Menu>
            ) : null}
        </>
    );
}
