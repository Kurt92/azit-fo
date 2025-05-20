import { Card, CardContent, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Box, Chip, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserData } from '@/shared/util/ReactQuery/UserData';
import { user } from '@/shared/util/ApiReq/user/req';

interface Friend {
    id: number;
    targetNm: string;
    avatar: string;
    status: 'online' | 'offline' | 'away' | 'busy';
    lastSeen?: string;
    currentActivity?: string;
}

const sampleFriends: Friend[] = [
    // { id: 1, targetNm: "Kurt", avatar: "/img/avatars/1.jpg", status: "online", currentActivity: "몬헌 - 조시아한테 쳐맞는중" },
    // { id: 2, targetNm: "Mors", avatar: "/img/avatars/2.jpg", status: "busy", currentActivity: "몬헌 - 알슈한테 잡혀있는중" },
    // { id: 3, targetNm: "정민", avatar: "/img/avatars/3.jpg", status: "away", lastSeen: "10분 전" },
    // { id: 4, targetNm: "성태", avatar: "/img/avatars/4.jpg", status: "offline", lastSeen: "1시간 전" },
];

const statusColors = {
    online: 'success',
    busy: 'error',
    away: 'warning',
    offline: 'default'
} as const;

const statusText = {
    online: '온라인',
    busy: '바쁨',
    away: '자리비움',
    offline: '오프라인'
} as const;

export default function FriendStatus() {
    const { data: userData } = UserData(["userData"], user);

    const [friends, setFriends] = useState<Friend[]>(sampleFriends);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userData?.userId) return;
        // 친구 접속 상태 조회
        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        axios
            .get(`${authDomain}/friend-list`, {
                params: { userId: userData?.userId },
                withCredentials: true
            })
            .then((res) => {
                setFriends(res.data);
            })
            .catch((err) => {
                console.error('친구 상태 조회 실패:', err);
            });
        
    }, [userData?.userId]);

    if (loading) {
        return (
            <Card sx={{ 
                height: '100%', 
                bgcolor: '#2A2D32',
                boxShadow: 'none',
                border: '1px solid',
                borderColor: '#23272A'
            }}>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                        친구 접속 상태
                    </Typography>
                    <List>
                        {[1, 2, 3].map((item) => (
                            <ListItem key={item}>
                                <ListItemAvatar>
                                    <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'grey.800' }} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Skeleton width="60%" sx={{ bgcolor: 'grey.800' }} />}
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
            bgcolor: '#23272A',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
            border: '1px solid #2A2D32',
            borderRadius: 2,
            p: 2,
            minHeight: 300,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.08)',
              pointerEvents: 'none'
            }
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
                    친구 접속 상태
                </Typography>
                <List sx={{ px: 1 }}>
                    {friends.map((friend) => (
                        <ListItem 
                            key={friend.id}
                            sx={{
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.03)',
                                    cursor: 'pointer'
                                },
                                borderRadius: 1.5,
                                mb: 1,
                                transition: 'background-color 0.2s',
                                px: 1.5,
                                py: 1.2
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar 
                                    src={friend.avatar} 
                                    alt={friend.targetNm}
                                    sx={{
                                        border: 2,
                                        borderColor: `${statusColors[friend.status]}.main`,
                                        bgcolor: '#2a2a2a'
                                    }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontWeight: 600,
                                                color: '#fff',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            {friend.targetNm}
                                        </Typography>
                                        <Chip
                                            label={statusText[friend.status]}
                                            size="small"
                                            color={statusColors[friend.status]}
                                            sx={{ 
                                                height: 20,
                                                bgcolor: 'transparent',
                                                border: '1px solid',
                                                borderColor: `${statusColors[friend.status]}.main`,
                                                '& .MuiChip-label': {
                                                    px: 1,
                                                    fontSize: '0.75rem',
                                                    color: `${statusColors[friend.status]}.main`
                                                }
                                            }}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: 'grey.500' }}
                                    >
                                        {friend.currentActivity || `마지막 접속: ${friend.lastSeen}`}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
} 