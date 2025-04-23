"use client";

import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Pagination,
    useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Table, { Post } from '@/shared/components/Table/Table';

// 임시 데이터
const DUMMY_POSTS: Post[] = [
    { id: 1, title: 'test', author: 'admin', date: '2024-03-20', views: 42 },
    { id: 2, title: 'test2', author: 'admin', date: '2024-03-20', views: 28 },
    { id: 3, title: 'test3', author: 'admin', date: '2024-03-19', views: 156 },
    { id: 4, title: 'test4', author: 'admin', date: '2024-03-19', views: 89 },
    { id: 5, title: 'test5', author: 'admin', date: '2024-03-18', views: 67 },
];

export default function Board() {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const postsPerPage = 10;

    // 검색 필터링
    const filteredPosts = DUMMY_POSTS.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 페이지네이션
    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // 게시글 클릭 핸들러
    const handlePostClick = (post: Post) => {
        console.log('게시글 클릭:', post);
        // TODO: 게시글 상세 페이지로 이동 로직 추가
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: '#2B2D31',
            pt: 4, 
            pb: 4 
        }}>
            <Container maxWidth="lg">
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        bgcolor: '#2B2D31',
                        color: theme.palette.common.white,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                        border: '1px solid',
                        borderColor: 'grey.800'
                    }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            gutterBottom 
                            sx={{ 
                                color: '#fff',
                                fontWeight: 'bold'
                            }}
                        >
                            게시판
                        </Typography>
                        
                        {/* 검색 필드 */}
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="제목 또는 작성자로 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ 
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': {
                                        borderColor: theme.palette.grey[600],
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.grey[400],
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: theme.palette.grey[400],
                                },
                                '& .MuiIconButton-root': {
                                    color: theme.palette.grey[400],
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton sx={{ color: theme.palette.grey[400] }}>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* 게시글 테이블 */}
                    <Table posts={filteredPosts} onRowClick={handlePostClick} />

                    {/* 페이지네이션 */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={Math.ceil(filteredPosts.length / postsPerPage)}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: theme.palette.common.white,
                                },
                            }}
                        />
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
} 