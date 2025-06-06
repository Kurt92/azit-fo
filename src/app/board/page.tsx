"use client";

import React from 'react';
import { Box, Container } from '@mui/material';
import BoardList from '@/wedgets/Board/ui/BoardList';

export default function Board() {
    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: '#2B2D31',
            pt: 4, 
            pb: 4 
        }}>
            <Container maxWidth="lg">
                <BoardList />
            </Container>
        </Box>
    );
} 