import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Skeleton, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Post {
    id: number;
    title: string;
    views: number;
    likes: number;
    createdAt: string;
}

const samplePosts: Post[] = [
    { id: 1, title: "[로아/뉴스] 디렉터가 몬헌을?!?!", views: 12543, likes: 450, createdAt: new Date().toISOString() },
    { id: 2, title: "[로아/비틱] 이거 좋은건가요?", views: 9872, likes: 320, createdAt: new Date().toISOString() },
    { id: 3, title: "[로아/자유] 블레이드가 사람구실 하려면", views: 8521, likes: 280, createdAt: new Date().toISOString() },
    { id: 4, title: "[몬헌/공략] 조시아 뚝배기에 정확히 돌떨구는법", views: 7654, likes: 190, createdAt: new Date().toISOString() },
    { id: 5, title: "[몬헌/공략] 알슈 팔 찢어버리는법", views: 6543, likes: 150, createdAt: new Date().toISOString() },
];



export default function PopularPosts() {
    const [posts, setPosts] = useState<Post[]>(samplePosts);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // TODO: API 구현 후 활성화
        /*
        const fetchPopularPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/posts/popular', {
                    withCredentials: true
                });
                setPosts(response.data.posts);
            } catch (error) {
                console.error('인기 게시물 로딩 실패:', error);
                setPosts(samplePosts);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularPosts();
        */
    }, []);

    if (loading) {
        return (
            <Card sx={{ 
                height: '100%', 
                bgcolor: '#2B2D31',
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'grey.800'
            }}>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                        오늘의 인기 게시물
                    </Typography>
                    <List>
                        {[1, 2, 3].map((item) => (
                            <ListItem key={item}>
                                <ListItemText
                                    primary={<Skeleton width="80%" sx={{ bgcolor: 'grey.800' }} />}
                                    secondary={<Skeleton width="40%" sx={{ bgcolor: 'grey.800' }} />}
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ 
            height: '100%', 
            bgcolor: '#2B2D31',
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'grey.800'
        }}>
            <CardContent>
                <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                        color: '#fff',
                        fontWeight: 'bold',
                        borderBottom: '1px solid',
                        borderColor: 'grey.800',
                        pb: 1,
                        mb: 2
                    }}
                >
                    오늘의 인기 게시물
                </Typography>
                <List sx={{ px: 1 }}>
                    {posts.map((post, index) => (
                        <Box key={post.id}>
                            <ListItem 
                                sx={{
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                                        cursor: 'pointer'
                                    },
                                    py: 1.5,
                                    borderRadius: 1,
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontWeight: 500,
                                                color: '#fff'
                                            }}
                                        >
                                            {post.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography 
                                            variant="body2"
                                            component="div"
                                            sx={{ 
                                                display: 'flex', 
                                                gap: 2, 
                                                fontSize: '0.875rem', 
                                                mt: 0.5,
                                                color: 'grey.500'
                                            }}
                                        >
                                            <span>조회 {post.views.toLocaleString()}</span>
                                            <span>좋아요 {post.likes.toLocaleString()}</span>
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < posts.length - 1 && <Divider sx={{ borderColor: 'grey.800' }} />}
                        </Box>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
} 