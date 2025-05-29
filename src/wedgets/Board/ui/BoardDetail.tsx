'use client';

import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    IconButton, 
    Divider,
    Button,
    Chip,
    Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserData } from '@/shared/util/ReactQuery/UserData';
import { user } from '@/shared/util/ApiReq/user/req';

interface BoardDetailProps {
    boardId: number;
    onBack: () => void;
}

interface BoardPost {
    boardId: number;
    title: string;
    content: string;
    writerId: number;
    writerName: string;
    createDt: string;
    updateDt: string;
    viewCount: number;
    likeCount: number;
    category?: string;
    tags?: string[];
}

export default function BoardDetail({ boardId, onBack }: BoardDetailProps) {
    const router = useRouter();
    const { data: userData } = UserData(["userData"], user);
    const [post, setPost] = useState<BoardPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BOARD_URL}/board/${boardId}`, {
                    withCredentials: true
                });
                setPost(response.data);
            } catch (err) {
                console.error('게시글 조회 실패:', err);
                setError('게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [boardId]);

    const handleEdit = () => {
        router.push(`/board/edit/${boardId}`);
    };

    const handleDelete = async () => {
        if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BOARD_URL}/board/${boardId}`, {
                withCredentials: true
            });
            onBack();
        } catch (err) {
            console.error('게시글 삭제 실패:', err);
            alert('게시글 삭제에 실패했습니다.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>로딩 중...</Typography>
            </Box>
        );
    }

    if (error || !post) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">{error || '게시글을 찾을 수 없습니다.'}</Typography>
            </Box>
        );
    }

    const isWriter = userData?.userId === post.writerId;

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', my: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={onBack} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" component="h1" sx={{ flex: 1 }}>
                    {post.title}
                </Typography>
                {isWriter && (
                    <Box>
                        <IconButton onClick={handleEdit} color="primary">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={handleDelete} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle1">
                        작성자: {post.writerName}
                    </Typography>
                    {post.category && (
                        <Chip 
                            label={post.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                        />
                    )}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    조회수: {post.viewCount} | 좋아요: {post.likeCount}
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </Typography>
            </Box>

            {post.tags && post.tags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1}>
                        {post.tags.map((tag, index) => (
                            <Chip 
                                key={index} 
                                label={tag} 
                                size="small" 
                                color="secondary" 
                                variant="outlined" 
                            />
                        ))}
                    </Stack>
                </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                    작성일: {new Date(post.createDt).toLocaleString()}
                </Typography>
                {post.updateDt !== post.createDt && (
                    <Typography variant="body2" color="text.secondary">
                        수정일: {new Date(post.updateDt).toLocaleString()}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
} 