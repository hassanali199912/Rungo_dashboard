// components/AppButton.tsx
import { styled } from '@mui/material';
import Button, { type ButtonProps } from '@mui/material/Button';
import type { CustomVariant } from '../../shared/types/generalTypes';
import { btnIconSlotReset } from '@/styles/btnStyle';
import { Link as RouterLink } from "react-router-dom"

interface AppButtonProps extends ButtonProps {
    customType?: CustomVariant;
    to?: string;
    reloadDocument?: boolean;
}

const StyledBtn = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'customType',
})<AppButtonProps>(({ theme, customType = 'primary' }) => ({
    paddingBlock: "0.3rem",
    paddingInline: "1.5rem",
    transition: 'all 0.2s ease',
    ...btnIconSlotReset,
    ...(customType === 'primary' && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.primary.contrastText,
        },
        '&.Mui-disabled': {
            color: theme.palette.primary.contrastText,
            opacity: 0.5    
        },
    }),


    ...(customType === 'outline' && {
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: `${theme.palette.primary.main}`,
            color: `${theme.palette.primary.contrastText}`
        },
        '&.Mui-disabled': {
            color: theme.palette.text.primary,
            opacity: 0.5    
        },
    }),

    ...(customType === 'outline-gray' && {
        border: `1px solid gray`,
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: `${theme.palette.primary.main}`,
            color: `${theme.palette.primary.contrastText}`
        },
        '&.Mui-disabled': {
            color: theme.palette.text.primary,
            opacity: 0.5    
        },
    }),

    ...(customType === 'solid' && {
        border: `none`,
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: `${theme.palette.primary.main}`,
            color: `${theme.palette.primary.contrastText}`
        },
        '&.Mui-disabled': {
            color: theme.palette.text.primary,
            opacity: 0.5    
        },
    }),

}));

const AppBtn = ({ to, ...props }: AppButtonProps) => {

    if (to) {
        return <StyledBtn component={RouterLink} to={to} {...props} />;
    }


    return <StyledBtn {...props} />
}


export default AppBtn;