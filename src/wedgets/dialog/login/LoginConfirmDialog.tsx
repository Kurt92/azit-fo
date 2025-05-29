'use client';

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    useTheme
} from '@mui/material';

interface LoginConfirmDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function LoginConfirmDialog({
    open,
    onConfirm,
    onCancel
}: LoginConfirmDialogProps) {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            PaperProps={{
                sx: {
                    bgcolor: '#23272A',
                    color: '#B0B4BA',
                }
            }}
        >
            <DialogTitle sx={{ color: '#fff' }}>
                로그인이 필요합니다
            </DialogTitle>
            <DialogContent>
                <Typography>
                    로그인 페이지로 이동하시겠습니까?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onCancel}
                    sx={{ color: theme.palette.grey[400] }}
                >
                    아니요
                </Button>
                <Button 
                    onClick={onConfirm}
                    variant="contained"
                >
                    예
                </Button>
            </DialogActions>
        </Dialog>
    );
} 