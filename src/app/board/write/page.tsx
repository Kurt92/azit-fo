'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import BoardWrite from '@/wedgets/Board/ui/BoardWrite';

export default function BoardWritePage() {
    const categories = ['전체', '오버워치', '몬스터헌터', '로스트아크', '리그오브레전드'];

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: '#2B2D31',
            pt: 4, 
            pb: 4 
        }}>
            <Container maxWidth="lg">
                <BoardWrite categories={categories} />
            </Container>
        </Box>
    );
} 