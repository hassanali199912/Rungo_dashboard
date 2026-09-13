import type { SxProps, Theme } from "@mui/material";

/** 👇 أي key انت حر فيه */
export interface TypographyVariants {
    h1: SxProps<Theme>;
    h2: SxProps<Theme>;
    p: SxProps<Theme>;
    homeTitle: SxProps<Theme>;
    homeAboutTitle: SxProps<Theme>;
    homeAboutDescription: SxProps<Theme>;
    homeAboutImg: SxProps<Theme>;
    homeServiceCardTitle: SxProps<Theme>;
    homeServiceCardDescription: SxProps<Theme>;
    sectionTitle: SxProps<Theme>;
    sectionDescription: SxProps<Theme>;
    pageTitleBox: SxProps<Theme>;
    freeTitleInvoice: SxProps<Theme>;

    font42_26: SxProps<Theme>;

    font42_22: SxProps<Theme>;

    font32_20: SxProps<Theme>;
    font32_16: SxProps<Theme>;

    font26_24_20: SxProps<Theme>;
    font26_22_16: SxProps<Theme>;
    font26_20: SxProps<Theme>;
    font26_16: SxProps<Theme>;

    font24_20: SxProps<Theme>;
    font24_16: SxProps<Theme>;
    font24_14: SxProps<Theme>;

    font22_16: SxProps<Theme>;
    font22_14: SxProps<Theme>;

    font20_16: SxProps<Theme>;
    font20_14: SxProps<Theme>;

    font18_16: SxProps<Theme>;

    font16_16: SxProps<Theme>;
    font16_14: SxProps<Theme>;
    font16_12: SxProps<Theme>;

    font14_14: SxProps<Theme>;
    font14_12: SxProps<Theme>;

    font12_12: SxProps<Theme>;

    font11_11: SxProps<Theme>;

    font10_10: SxProps<Theme>;
    font8_8: SxProps<Theme>;


    [key: string]: SxProps<Theme>;
}

/** 👇 implementation */
export const typography: TypographyVariants = {
    h1: {
        fontSize: { lg: 32, md: 28, xs: 24 },
        fontWeight: 700,
        lineHeight: 1.4,
    },

    h2: {
        fontSize: { lg: 24, md: 22, xs: 20 },
        fontWeight: 600,
        lineHeight: 1.4,
    },

    p: {
        fontSize: { lg: 16, md: 15, xs: 14 },
        lineHeight: 1.6,
    },


    pageTitleBox: {
        textAlign: { xs: "center", lg: "start" },
        fontSize: { lg: 42, md: 38, xs: 22 },
    },

    btnHome: {
        fontSize: { lg: 16, md: 15, xs: 14 },
        lineHeight: 1.6,
        width: {
            lg: "80%",
            md: "90%",
            xs: "100%",
        }
    },

    homeTitle: {
        fontSize: { lg: 42, md: 38, xs: 26 },
        fontWeight: { lg: 600, md: 600, xs: 500 },
        textAlign: { xs: "center", lg: "start", md: "start" },
        lineHeight: 1.6
    },

    homeAboutTitle: {
        fontSize: { lg: 26, md: 26, xs: 20 },
    },
    homeAboutDescription: {
        fontSize: { lg: 16, md: 16, xs: 14 },
    },
    homeAboutImg: {
        fontSize: { lg: 40, md: 32, xs: 26 },
    },

    homeServiceCardTitle: {
        fontSize: { lg: 20, md: 16, xs: 16 },
    },
    homeServiceCardDescription: {
        fontSize: { lg: 16, md: 14, xs: 12 },
    },

    sectionTitle: {
        fontSize: { lg: 26, md: 26, xs: 20 },
    },
    sectionDescription: {
        fontSize: { lg: 16, md: 16, xs: 14 },
    },

    freeTitleInvoice: {
        fontSize: { lg: 42, md: 32, xs: 26 },
        fontWeight: { lg: 700, md: 600, xs: 500 },
        textAlign: { xs: "center", lg: "start" },
    },



    font42_26: {
        fontSize: { lg: 42, md: 32, xs: 26 },
    },

    font42_22: {
        fontSize: { lg: 42, md: 38, xs: 22 },
    },




    font32_20: {
        fontSize: { lg: 32, md: 22, xs: 20 },
    },

    font32_16: {
        fontSize: { lg: 32, md: 24, xs: 16 },
    },

    font26_24_20: {
        fontSize: { lg: 26, md: 24, xs: 20 },
    },
    font26_20: {
        fontSize: { lg: 26, md: 26, xs: 20 },
    },
    font26_22_16: {
        fontSize: { lg: 26, md: 22, xs: 16 },
    },
    font26_16: {
        fontSize: { lg: 26, md: 20, xs: 16 },
    },

    font24_20: {
        fontSize: { lg: 24, md: 20, xs: 20 },
    },
    font24_16: {
        fontSize: { lg: 24, md: 24, xs: 16 },
    },
    font24_14: {
        fontSize: { lg: 24, md: 20, xs: 14 },
    },
    font22_16: {
        fontSize: { lg: 22, md: 20, xs: 16 },
    },
    font22_14: {
        fontSize: { lg: 22, md: 16, xs: 14 },
    },

    font20_16: {
        fontSize: { lg: 20, md: 16, xs: 16 },
    },
    font20_14: {
        fontSize: { lg: 20, md: 16, xs: 14 },
    },

    font18_16: {
        fontSize: { lg: 18, md: 16, xs: 16 },
    },

    font16_16: {
        fontSize: { lg: 16, md: 16, xs: 16 },
    },
    font16_14: {
        fontSize: { lg: 16, md: 14, xs: 14 },
    },
    font16_12: {
        fontSize: { lg: 16, md: 12, xs: 12 },
    },
    font14_14: {
        fontSize: { lg: 14, md: 14, xs: 14 },
    },
    font14_12: {
        fontSize: { lg: 14, md: 14, xs: 12 },
    },

    font12_12: {
        fontSize: 12,
    },
    font11_11: {
        fontSize: 11,
    },
    font10_10: {
        fontSize: 10,
    },
    font8_8: {
        fontSize: 8,
    }

};