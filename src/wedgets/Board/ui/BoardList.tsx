'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Stack,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    InputBase,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserData } from '@/shared/util/ReactQuery/UserData';
import { user } from '@/shared/util/ApiReq/user/req';
import BoardTable from '@/shared/components/Table/Table';
import LoginConfirmDialog from '../../dialog/login/LoginConfirmDialog';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface BoardPost {
    boardId: number;
    title: string;
    writerName: string;
    createDt: string;
    viewCount: number;
    likeCount: number;
    category?: string;
}

export default function BoardList() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: userData } = UserData(["userData"], user);
    const [posts, setPosts] = useState<BoardPost[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [categoryInput, setCategoryInput] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const [categories, setCategories] = useState(['전체', '오버워치', '몬스터헌터', '로스트아크', '리그오브레전드']);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BOARD_URL}/board/list`, {
                params: {
                    page: page,
                    size: rowsPerPage
                },
                withCredentials: true
            });
            setPosts(response.data.content);
            setTotalCount(response.data.totalElements);
        } catch (err) {
            console.error('게시글 목록 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page, rowsPerPage]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (boardId: number) => {
        router.push(`/board/${boardId}`);
    };

    const handleWriteClick = () => {
        if (!userData) {
            setLoginDialogOpen(true);
            return;
        }
        router.push('/board/write');
    };

    const handleLoginConfirm = () => {
        setLoginDialogOpen(false);
        router.push('/login');
    };

    const handleLoginCancel = () => {
        setLoginDialogOpen(false);
    };

    const handleAddCategory = () => {
        const value = categoryInput.trim();
        if (value && !categories.includes(value)) {
            setCategories([...categories, value]);
            setCategoryInput('');
        }
    };

    const handleDeleteCategory = (cat: string) => {
        if (cat === '전체') return;
        setCategories(categories.filter(c => c !== cat));
        if (selectedCategory === cat) setSelectedCategory('전체');
    };

    const filteredCategories = categories.filter(cat => 
        cat.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const formattedPosts = posts.map(post => ({
        id: post.boardId,
        title: (
            <Stack direction="row" spacing={1} alignItems="center">
                {post.title}
                {post.category && (
                    <Chip 
                        label={post.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                    />
                )}
            </Stack>
        ),
        titleText: post.title,
        author: post.writerName,
        date: new Date(post.createDt).toLocaleDateString(),
        views: `${post.viewCount}/${post.likeCount}`
    }));

    return (
        <Box sx={{ display: 'flex', gap: 3, p: 3 }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" component="h1">
                        게시판
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleWriteClick}
                    >
                        글쓰기
                    </Button>
                </Box>

                <BoardTable
                    posts={formattedPosts}
                    onRowClick={(post) => handleRowClick(post.id)}
                />
            </Box>

            <LoginConfirmDialog
                open={loginDialogOpen}
                onConfirm={handleLoginConfirm}
                onCancel={handleLoginCancel}
            />
        </Box>
    );
} 