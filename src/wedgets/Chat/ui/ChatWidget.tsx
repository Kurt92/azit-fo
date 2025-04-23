// components/ChatWidget.tsx
'use client';

import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Fab,
    Paper,
    IconButton,
    TextField,
    Button,
    Typography,
    Grow,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Badge,
    Tabs,
    Tab,
    useTheme,
    Divider,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import axios from "axios";

interface ChatRoom {
    id: string;
    name: string;
    lastMessage: string;
    lastMessageTime?: string;
    unreadCount?: number;
}

interface Friend {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'away';
    avatarUrl?: string;
    isPending?: boolean;
}

export default function ChatWidget() {
    /* 샘플 하드코딩 */
    const [rooms] = useState<ChatRoom[]>([
        { id: '1', name: '성태', lastMessage: '몬헌함??', lastMessageTime: '오후 2:30', unreadCount: 3 },
        { id: '2', name: '정민', lastMessage: '와 이게 되네?', lastMessageTime: '오후 1:15', unreadCount: 0 },
        { id: '3', name: '11', lastMessage: 'zz', lastMessageTime: '오전 11:20', unreadCount: 1 },
        { id: '4', name: '22', lastMessage: 'qq', lastMessageTime: '어제', unreadCount: 0 },
    ]);
    
    const [friends] = useState<Friend[]>([
        { id: '1', name: '성태', status: 'online' },
        { id: '2', name: '정민', status: 'away' },
    ]);

    const theme = useTheme();
    const messageEndRef = useRef<HTMLDivElement>(null);

    const socketRef = useRef<WebSocket | null>(null);

    const [listOpen, setListOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [tabIndex, setTabIndex] = useState(0);
    const [friendSearch, setFriendSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Friend[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const toggleList = () => setListOpen(o => !o);

    const openChat = (room: ChatRoom) => {
        setSelectedRoom(room);
        setListOpen(false);
        setChatOpen(true);
    };

    const closeChat = () => setChatOpen(false);

    const sendMessage = () => {
        if (!input.trim()) return;
        socketRef.current?.send(input.trim());
        setInput('');
    };
    const handleTabChange = (_: React.SyntheticEvent, newIdx: number) => setTabIndex(newIdx);

    // 어두운 패널과 흰색 텍스트 스타일
    const panelBg = '#2e2e2e';
    const inputBg = '#3a3a3a';
    const white = '#ffffff';

    // 메시지 자동 스크롤
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // 채팅방 조회
        const domain = process.env.NEXT_CHAT_URL;
        axios
            .get("/api/back/event", { withCredentials: true })
            .then((res) => {

            })
            .catch((err) => {
                console.error(err);
            });

        // 친구목록 조회
        const authDomain = process.env.NEXT_AUTH_URL;
        axios
            .get(`${authDomain}/friend/list`, { withCredentials: true })
            .then((res) => {

            })
            .catch((err) => {
                console.error(err);
            });

    }, []);

    // 채팅 소캣 연결
    useEffect(() => {
        if (!chatOpen) return;
        console.log("소켓 연결 시도");

        socketRef.current = new WebSocket("ws://localhost:8077/chat");

        socketRef.current.onopen = () => {
            console.log("✅ 연결됨");
        };

        socketRef.current.onmessage = (event) => {
            console.log("📩 수신 메시지", event.data);
            setMessages(prev => [...prev, event.data]);
        };

        return () => {
            socketRef.current?.close();
        };
    }, [chatOpen]);

    // 유저 검색
    const handleUserSearch = async (query: string) => {
        setFriendSearch(query);
        if (query.trim().length > 0) {
            try {
                const response = await axios.get(`${process.env.NEXT_AUTH_URL}/user/search`, {
                    params: { query },
                    withCredentials: true
                });
                
                const friendIds = new Set(friends.map(friend => friend.id));
                const nonFriendUsers = response.data.filter((user: any) => !friendIds.has(user.id));
                
                setSearchResults(nonFriendUsers);
            } catch (error) {
                console.error('유저 검색 실패:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    // 친구 요청 보내기
    const sendFriendRequest = async (userId: string) => {
        try {
            await axios.post(`${process.env.NEXT_AUTH_URL}/friend/request`, {
                friendId: userId
            }, {
                withCredentials: true
            });
            
            // 검색 결과 업데이트 - 요청 상태로 변경
            setSearchResults(prev => 
                prev.map(user => 
                    user.id === userId 
                        ? { ...user, isPending: true }
                        : user
                )
            );
        } catch (error) {
            console.error('친구 요청 실패:', error);
        }
    };

    return (
        <>
            <Fab
                color="primary"
                onClick={toggleList}
                sx={{ 
                    position: 'fixed', 
                    bottom: 16, 
                    right: 16, 
                    zIndex: theme.zIndex.modal + 1,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                    }
                }}
            >
                <ChatIcon />
            </Fab>

            <Grow in={listOpen} mountOnEnter unmountOnExit style={{ transformOrigin: 'right bottom' }}>
                <Paper
                    elevation={3}
                    sx={{
                        position: 'fixed',
                        borderRadius: 2,
                        bottom: 80,
                        right: 16,
                        width: 350,
                        height: 600,
                        maxHeight: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: theme.palette.grey[900],
                        color: theme.palette.common.white,
                        zIndex: theme.zIndex.modal + 1,
                        overflow: 'hidden',
                    }}
                >
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                                color: theme.palette.grey[400],
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main,
                                }
                            }
                        }}
                    >
                        <Tab label="채팅방" />
                        <Tab label="친구" />
                        <Tab label="유저 검색" />
                    </Tabs>
                    
                    <Box sx={{ overflowY: 'auto', flex: 1 }}>
                        {tabIndex === 0 && (
                            <List disablePadding>
                                {rooms.map(room => (
                                    <ListItemButton
                                        key={room.id}
                                        onDoubleClick={() => openChat(room)}
                                        sx={{
                                            '&:hover': { bgcolor: theme.palette.grey[800] },
                                            borderBottom: `1px solid ${theme.palette.grey[800]}`,
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>{room.name[0]}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="subtitle2">{room.name}</Typography>
                                                    <Typography variant="caption" sx={{ color: theme.palette.grey[400] }}>
                                                        {room.lastMessageTime}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: theme.palette.grey[400],
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            maxWidth: '180px'
                                                        }}
                                                    >
                                                        {room.lastMessage}
                                                    </Typography>
                                                    {room.unreadCount?.toString() && (
                                                        <Badge
                                                            badgeContent={room.unreadCount}
                                                            color="primary"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        )}
                        {tabIndex === 1 && (
                            <List>
                                {friends.map((friend: Friend) => (
                                    <ListItemButton
                                        key={friend.id}
                                        sx={{
                                            '&:hover': { bgcolor: theme.palette.grey[800] },
                                            borderBottom: `1px solid ${theme.palette.grey[800]}`,
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={
                                                    <FiberManualRecordIcon 
                                                        sx={{ 
                                                            fontSize: 12,
                                                            color: friend.status === 'online' 
                                                                ? theme.palette.success.main 
                                                                : friend.status === 'away'
                                                                ? theme.palette.warning.main
                                                                : theme.palette.grey[500],
                                                            bgcolor: theme.palette.background.paper,
                                                            borderRadius: '50%'
                                                        }} 
                                                    />
                                                }
                                            >
                                                <Avatar src={friend.avatarUrl}>{friend.name[0]}</Avatar>
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={friend.name}
                                            secondary={friend.status === 'online' ? '온라인' : friend.status === 'away' ? '자리비움' : '오프라인'}
                                            secondaryTypographyProps={{
                                                sx: { 
                                                    color: friend.status === 'online' 
                                                        ? theme.palette.success.main 
                                                        : theme.palette.grey[400]
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        )}
                        {tabIndex === 2 && (
                            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ p: 2 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="유저 검색..."
                                        value={friendSearch}
                                        onChange={(e) => handleUserSearch(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <SearchIcon sx={{ color: theme.palette.grey[400], mr: 1 }} />
                                            ),
                                            sx: {
                                                bgcolor: theme.palette.grey[800],
                                                '& fieldset': {
                                                    borderColor: theme.palette.grey[700]
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: theme.palette.grey[600]
                                                },
                                                '& input': {
                                                    color: theme.palette.common.white
                                                }
                                            }
                                        }}
                                    />
                                </Box>

                                <Divider sx={{ borderColor: theme.palette.grey[800] }} />

                                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                                    <List>
                                        {searchResults.length > 0 ? (
                                            searchResults.map(user => (
                                                <ListItemButton
                                                    key={user.id}
                                                    sx={{
                                                        '&:hover': { bgcolor: theme.palette.grey[800] },
                                                        borderBottom: `1px solid ${theme.palette.grey[800]}`
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar src={user.avatarUrl}>{user.name[0]}</Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={user.name}
                                                        sx={{ color: theme.palette.common.white }}
                                                    />
                                                    {!user.isPending ? (
                                                        <IconButton
                                                            onClick={() => sendFriendRequest(user.id)}
                                                            sx={{ 
                                                                color: theme.palette.primary.main,
                                                                '&:hover': {
                                                                    bgcolor: `${theme.palette.primary.main}20`
                                                                }
                                                            }}
                                                        >
                                                            <PersonAddIcon />
                                                        </IconButton>
                                                    ) : (
                                                        <Typography
                                                            variant="caption"
                                                            sx={{ color: theme.palette.grey[400] }}
                                                        >
                                                            요청됨
                                                        </Typography>
                                                    )}
                                                </ListItemButton>
                                            ))
                                        ) : (
                                            friendSearch ? (
                                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                                    <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
                                                        검색 결과가 없습니다
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                                    <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
                                                        유저를 검색해보세요
                                                    </Typography>
                                                </Box>
                                            )
                                        )}
                                    </List>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Grow>

            {selectedRoom && (
                <Grow in={chatOpen} mountOnEnter unmountOnExit style={{ transformOrigin: 'right bottom' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            position: 'fixed',
                            bottom: 80,
                            right: 16,
                            width: 350,
                            height: 600,
                            maxHeight: 600,
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: theme.palette.grey[900],
                            color: theme.palette.common.white,
                            zIndex: theme.zIndex.modal + 1,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: theme.palette.grey[800],
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: `1px solid ${theme.palette.grey[700]}`,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 1 }}>{selectedRoom.name[0]}</Avatar>
                                <Typography variant="subtitle1">{selectedRoom.name}</Typography>
                            </Box>
                            <IconButton size="small" onClick={closeChat} sx={{ color: theme.palette.grey[400] }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <Box 
                            sx={{ 
                                flex: 1, 
                                p: 2, 
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            {messages.length === 0 ? (
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: theme.palette.grey[400],
                                        textAlign: 'center',
                                        mt: 2 
                                    }}
                                >
                                    대화를 시작해보세요
                                </Typography>
                            ) : (
                                messages.map((msg, i) => (
                                    <Box 
                                        key={i} 
                                        sx={{ 
                                            alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                                            maxWidth: '80%',
                                        }}
                                    >
                                        <Paper
                                            sx={{
                                                p: 1.5,
                                                bgcolor: i % 2 === 0 ? theme.palette.grey[800] : theme.palette.primary.main,
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="body2">{msg}</Typography>
                                        </Paper>
                                    </Box>
                                ))
                            )}
                            <div ref={messageEndRef} />
                        </Box>

                        <Box
                            component="form"
                            onSubmit={e => {
                                e.preventDefault();
                                sendMessage();
                            }}
                            sx={{
                                p: 2,
                                bgcolor: theme.palette.grey[800],
                                borderTop: `1px solid ${theme.palette.grey[700]}`,
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="메시지를 입력하세요..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: theme.palette.grey[900],
                                        color: theme.palette.common.white,
                                        '& fieldset': {
                                            borderColor: theme.palette.grey[700],
                                        },
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.grey[600],
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />
                            <IconButton 
                                type="submit" 
                                color="primary"
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.dark,
                                    },
                                }}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                </Grow>
            )}
        </>
    );
}
