'use client';

import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    MenuItem,
    useTheme
} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserData } from '@/shared/util/ReactQuery/UserData';
import { user } from '@/shared/util/ApiReq/user/req';

interface BoardWriteProps {
    categories: string[];
}

export default function BoardWrite({ categories }: BoardWriteProps) {
    const router = useRouter();
    const theme = useTheme();
    const { data: userData } = UserData(["userData"], user);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BOARD_URL}/board/write`,
                {
                    title,
                    content,
                    category: category || null
                },
                {
                    withCredentials: true
                }
            );
            router.push('/board');
        } catch (err) {
            console.error('게시글 작성 실패:', err);
            alert('게시글 작성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <Box sx={{ p: 3 }}>
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
                <Typography variant="h5" component="h1" sx={{ mb: 3, color: '#fff', fontWeight: 'bold' }}>
                    글쓰기
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="제목"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            required
                            sx={{
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
                                }
                            }}
                        />

                        <TextField
                            select
                            label="카테고리"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            fullWidth
                            sx={{
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
                                }
                            }}
                        >
                            <MenuItem value="">
                                <em>카테고리 선택</em>
                            </MenuItem>
                            {categories.filter(cat => cat !== '전체').map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="내용"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            multiline
                            rows={10}
                            fullWidth
                            required
                            sx={{
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
                                }
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                disabled={loading}
                                sx={{
                                    color: theme.palette.grey[400],
                                    borderColor: theme.palette.grey[600],
                                    '&:hover': {
                                        borderColor: theme.palette.grey[400],
                                    }
                                }}
                            >
                                취소
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                작성
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
} 