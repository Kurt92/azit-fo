'use client';
import Image from "next/image";

import { Container, Box } from '@mui/material';
import BannerSlider from '@/shared/components/Slider/BannerSlider';
import PopularPosts from '@/shared/components/Dashboard/PopularPosts';
import FriendStatus from '@/shared/components/Dashboard/FriendStatus';

export default function Home() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'grid', gap: 3 }}>
                {/* 배너 슬라이더 */}
                <Box sx={{marginBottom: 5}}>
                    <BannerSlider />
                </Box>

                {/* 대시보드 섹션 */}
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                    gap: 3
                }}>
                    <PopularPosts />
                    <FriendStatus />
                </Box>
            </Box>
        </Container>
    );
}