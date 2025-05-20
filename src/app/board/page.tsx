"use client";

import React, { useState } from 'react';
import { Box, Container, Paper, TextField, Typography, IconButton, InputAdornment, Pagination, useTheme, List, ListItem, ListItemButton, ListItemText, useMediaQuery, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Table, { Post } from '@/shared/components/Table/Table';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const postsPerPage = 10;
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [categoryInput, setCategoryInput] = useState('');
    const [categories, setCategories] = useState(['전체', '오버워치', '몬스터헌터', '로스트아크', '리그오브레전드']);
    const [categorySearch, setCategorySearch] = useState('');

    // 카테고리 추가
    const handleAddCategory = () => {
        const value = categoryInput.trim();
        if (value && !categories.includes(value)) {
            setCategories([...categories, value]);
            setCategoryInput('');
        }
    };
    // 카테고리 삭제
    const handleDeleteCategory = (cat: string) => {
        if (cat === '전체') return;
        setCategories(categories.filter(c => c !== cat));
        if (selectedCategory === cat) setSelectedCategory('전체');
    };
    // 카테고리 검색 필터링
    const filteredCategories = categories.filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase()));

    // 검색 필터링 (카테고리 적용)
    const filteredPosts = DUMMY_POSTS.filter(post =>
        (selectedCategory === '전체' || post.category === selectedCategory) &&
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()))
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
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* 카테고리 영역 (PC에서만 보임) */}
                    {!isMobile && (
                        <Paper
                            elevation={2}
                            sx={{
                                minWidth: 180,
                                maxWidth: 220,
                                bgcolor: '#23272A',
                                color: '#B0B4BA',
                                borderRadius: 2,
                                p: 2,
                                height: 'fit-content',
                                alignSelf: 'flex-start',
                                boxShadow: '0px 2px 8px rgba(0,0,0,0.10)',
                                border: '1px solid',
                                borderColor: 'grey.800',
                            }}
                        >
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#fff' }}>
                                카테고리
                            </Typography>
                            {/* 카테고리 검색 */}
                            <InputBase
                                placeholder="카테고리 검색"
                                value={categorySearch}
                                onChange={e => setCategorySearch(e.target.value)}
                                sx={{
                                    bgcolor: '#181A1B',
                                    color: '#B0B4BA',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    mb: 1.5,
                                    fontSize: 15,
                                    width: '100%',
                                }}
                                inputProps={{ 'aria-label': '카테고리 검색' }}
                            />
                            {/* 카테고리 추가 */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <InputBase
                                    placeholder="카테고리 추가"
                                    value={categoryInput}
                                    onChange={e => setCategoryInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); }}
                                    sx={{
                                        bgcolor: '#181A1B',
                                        color: '#B0B4BA',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontSize: 15,
                                        flex: 1,
                                    }}
                                    inputProps={{ 'aria-label': '카테고리 추가' }}
                                />
                                <IconButton
                                    color="primary"
                                    onClick={handleAddCategory}
                                    sx={{ bgcolor: '#181A1B', borderRadius: 1 }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            <List>
                                {filteredCategories.map((cat) => (
                                    <ListItem key={cat} disablePadding
                                        secondaryAction={cat !== '전체' && (
                                            <IconButton edge="end" size="small" onClick={() => handleDeleteCategory(cat)}>
                                                <DeleteIcon fontSize="small" sx={{ color: '#B0B4BA' }} />
                                            </IconButton>
                                        )}
                                    >
                                        <ListItemButton
                                            selected={selectedCategory === cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            sx={{
                                                borderRadius: 1,
                                                color: selectedCategory === cat ? theme.palette.primary.main : '#B0B4BA',
                                                fontWeight: selectedCategory === cat ? 700 : 500,
                                                '&.Mui-selected': {
                                                    bgcolor: '#262B31',
                                                    color: theme.palette.primary.main,
                                                },
                                            }}
                                        >
                                            <ListItemText primary={cat} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                    {/* 게시판 본문 */}
                    <Box sx={{ flex: 1 }}>
                        <Paper 
                            elevation={2} 
                            sx={{ 
                                p: 3, 
                                bgcolor: '#23272A',
                                color: '#B0B4BA',
                                boxShadow: '0px 2px 8px rgba(0,0,0,0.10)',
                                border: '1px solid',
                                borderColor: 'grey.800',
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
                                            color: '#B0B4BA',
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
                    </Box>
                </Box>
            </Container>
        </Box>
    );
} 