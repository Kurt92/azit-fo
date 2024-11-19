import React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

interface CustomButtonProps {
    label: string;
    onClick: () => void;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    variant?: 'text' | 'outlined' | 'contained';
}

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       label,
                                                       onClick,
                                                       color = 'primary',
                                                       variant = 'contained',
                                                   }) => {
    const theme = useTheme(); // MUI 테마 접근

    return (
        <Button
            color={color === 'primary' ? 'primary' : color} // 기본 MUI 색상 처리
            variant={variant}
            onClick={onClick}
            sx={{
                ...(color === 'primary' && {
                    backgroundColor: theme.palette.primary.dark, // 테마의 primary.dark 사용
                    color: theme.palette.primary.contrastText, // 텍스트 대비 색상
                    '&:hover': {
                        backgroundColor: theme.palette.primary.main, // 밝은 파란색
                        color: theme.palette.primary.contrastText, // 텍스트는 유지
                    },
                }),
            }}
        >
            {label}
        </Button>
    );
};

export default CustomButton;
