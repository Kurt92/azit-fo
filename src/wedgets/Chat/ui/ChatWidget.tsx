// components/ChatWidget.tsx
'use client';

import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {Box, Fab, Paper, IconButton, TextField, Button, Typography, Grow, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Badge, Tabs, Tab, useTheme, Divider} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";
import {UserData} from "@/shared/util/ReactQuery/UserData";
import {user} from "@/shared/util/ApiReq/user/req";
import {Client, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import debounce from 'lodash/debounce';
import { useQuery } from '@tanstack/react-query';

interface ChatRoom {
    chatRoomId: number;
    roomNm: string;
    lastMessage: string;
    lastMessageTime?: string;
    unreadCount?: number;
}

interface Friend {
    targetId: number;
    targetNm: string;
    status: 'online' | 'offline' | 'away';
    avatarUrl?: string;
    isPending?: boolean;
}

interface Msg {
    chatRoomId: number;
    senderId: number;
    senderNm: string;
    createDt: string;
    userName: string;
    message: string;
}

export default function ChatWidget() {
    const { data: userData } = UserData(["userData"], user);
    const stompClientRef = useRef<Client | null>(null);

    

    /* 샘플 하드코딩 */
    // const [rooms] = useState<ChatRoom[]>([
    //     { chatRoomId: 1, roomNm: '성태', lastMessage: '몬헌함??', lastMessageTime: '오후 2:30', unreadCount: 3 },
    //     { chatRoomId: 2, roomNm: '정민', lastMessage: '와 이게 되네?', lastMessageTime: '오후 1:15', unreadCount: 0 },
    //     { chatRoomId: 3, roomNm: '11', lastMessage: 'zz', lastMessageTime: '오전 11:20', unreadCount: 1 },
    //     { chatRoomId: 4, roomNm: '22', lastMessage: 'qq', lastMessageTime: '어제', unreadCount: 0 },
    // ]);
    const [rooms, setRooms] = useState<ChatRoom[]>([]);

    
    // const [friends] = useState<Friend[]>([
    //     { targetId: 1, targetNm: '성태', status: 'online' },
    //     { targetId: 2, targetNm: '정민', status: 'away' },
    // ]);
    const [friends, setFriends] = useState<Friend[]>([]);

    const theme = useTheme();
    const messageEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const [listOpen, setListOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<Msg[]>([]);
    const [msgInput, setMsgInput] = useState('');
    const [tabIndex, setTabIndex] = useState(0);
    const [friendSearch, setFriendSearch] = useState('');
    const [searchResults, setSearchResults] = useState<Friend[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    
    // 샘플 친구요청 데이터 제거 및 서버 요청으로 대체
    const [friendRequests, setFriendRequests] = useState<{ userMappingId: number, targetId: number, targetNm: string }[]>([]);

    // 메시지 자동 스크롤
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!userData?.userId) return;
        
        // domain set
        const chatDomain = process.env.NEXT_PUBLIC_CHAT_URL;
        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        
        
        // 채팅방 조회
        axios
            .get(`${chatDomain}/chat/room-list`, {
                params: { 
                    userId: userData.userId
                },
                withCredentials: true 
            })
            .then((res) => {
                setRooms(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

        // 친구목록 조회
        axios
            .get(`${authDomain}/friend-list`, {
                params: { 
                    userId: userData.userId
                },
                withCredentials: true
            })
            .then((res) => {
                setFriends(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

    }, [userData?.userId]);

    // 친구 요청 목록 조회
    useEffect(() => {
        if (!userData?.userId) return;
        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        axios
            .get(`${authDomain}/friend-req`, {
                params: { userId: userData.userId },
                withCredentials: true
            })
            .then(res => {
                setFriendRequests(res.data);
            })
            .catch(err => {
                console.error('친구 요청 목록 조회 실패:', err);
            });
    }, [userData?.userId]);

    // 채팅 소캣 연결
    // useEffect(() => {
    //     if (!chatOpen) return;
    //     console.log("소켓 연결 시도");

    //     socketRef.current = new WebSocket("ws://localhost:8077/chat");

    //     socketRef.current.onopen = () => {
    //     };

    //     socketRef.current.onmessage = (event) => {
    //         setMessages(prev => [...prev, event.data]);
    //     };

    //     return () => {
    //         socketRef.current?.close();
    //     };
    // }, [chatOpen]);

    useEffect(() => {
        if (!chatOpen) return;

        const chatDomain = process.env.NEXT_PUBLIC_CHAT_URL;
        // 채팅 조회
        axios
            .get(`${chatDomain}/chat/chat-list`, {
                params: { 
                    chatRoomId: selectedRoom?.chatRoomId
                },
                withCredentials: true 
            })
            .then((res) => {
                console.log("채팅 조회 결과", res.data);
                setMessages(prev => [...prev, ...res.data]);
            })
            .catch((err) => {
                console.error(err);
            });


        const socket = new SockJS(`${chatDomain}/ws`); // WebSocketConfig에서 설정한 endpoint
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('STOMP:', str),
            onConnect: () => {
                console.log('STOMP 연결됨');

                stompClient.subscribe(`/topic/chat/${selectedRoom?.chatRoomId}`, (message: IMessage) => {
                    console.log('수신 메시지', message.body);
                    setMessages(prev => [...prev, JSON.parse(message.body)]);
                    console.log("메시지 업데이트", messages);
                });
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, [chatOpen, selectedRoom?.chatRoomId]);

    useEffect(() => {
        console.log("messages 업데이트됨", messages);
      }, [messages]);

    const toggleList = () => setListOpen(o => !o);

    const openChat = (room: ChatRoom) => {
        console.log("채팅방 번호:", room);
        setSelectedRoom(room);
        setListOpen(false);
        setChatOpen(true);
    };

    const closeChat = () => setChatOpen(false);


    // 메시지 전송
    const sendMessage = () => {
        if (!msgInput.trim()) return;
        console.log("!!!!!!!!!!!!!!",msgInput.trim());
        if (!selectedRoom) {
            console.error('선택된 채팅방이 없습니다.');
            return;
        }
        
        const message = {
            chatRoomId: selectedRoom.chatRoomId,
            senderId: userData?.userId,
            userName: userData?.userNm,
            message: msgInput.trim(),
            createDt: new Date().toISOString()
        };

        stompClientRef.current?.publish({
            destination: `/pub/chat.sendMessage`,
            body: JSON.stringify(message)
        });

        // 채팅방 목록의 마지막 메시지 업데이트
        setRooms(prevRooms => 
            prevRooms.map(room => 
                room.chatRoomId === selectedRoom.chatRoomId
                    ? {
                        ...room,
                        lastMessage: msgInput.trim(),
                        lastMessageTime: new Date().toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })
                    }
                    : room
            )
        );
        
        setMsgInput('');
    };

    
    const handleTabChange = (_: React.SyntheticEvent, newIdx: number) => setTabIndex(newIdx);

   


    // 유저 검색
    const handleUserSearch = useCallback((query: string) => {
        if (!query.trim()) {
          setSearchResults([]);
          return;
        }
      
        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
      
        axios
            .get(`${authDomain}/user-list`, {
                params: { 
                    targetNm: query, userId: userData?.userId 
                },
                withCredentials: true
            })
            .then((res) => {
                const friendIds = new Set(friends.map(friend => friend.targetId));
                const filtered = res.data.filter((user: any) => !friendIds.has(user.targetId));
                setSearchResults(filtered);
            })
            .catch((err) => {
                console.error('유저 검색 실패:', err);
                setSearchResults([]);
            });
    }, [friends, userData]); 

    //유저검색 디바운스
    const debouncedHandleUserSearch = useMemo(
        () => debounce(handleUserSearch, 300), // 300ms 지연
        [handleUserSearch]
      );

    // 친구 요청 보내기
    const sendFriendRequest = (userId: number) => {
        axios
            .get(`${process.env.NEXT_PUBLIC_AUTH_URL}/request-friend`, {
                params: { 
                    targetId: userId, userId: userData?.userId 
                },
                withCredentials: true
            })
            .then((res) => {
                setSearchResults(prev => 
                    prev.map(user => 
                        user.targetId === Number(userId)
                            ? { ...user, isPending: true }
                            : user
                    )
                );
            })
            .catch((err) => {
                console.error('친구 요청 실패:', err);
            });
       
    };

    const acceptFriendRequest = (userMappingId: number) => {
        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        axios
        .get(`${authDomain}/request-status`, {
            params: { 
                userMappingId: userMappingId, 
                status: 'ACCEPTED'
            },
            withCredentials: true
        })
        .then(() => {
            setFriendRequests(prev => prev.filter(req => req.userMappingId !== userMappingId));
        })
        .catch(err => {
            console.error('친구 요청 수락 실패:', err);
        });
    };

    const rejectFriendRequest = (userMappingId: number) => {
        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        axios
        .get(`${authDomain}/request-status`, {
            params: { 
                userMappingId: userMappingId, 
                status: 'REJECTED'
            },
            withCredentials: true
        })
        .then(() => {
            setFriendRequests(prev => prev.filter(req => req.userMappingId !== userMappingId));
        })
        .catch(err => {
            console.error('친구 요청 거절 실패:', err);
        });
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
                    
                    <Box sx={{ flex: 1, overflowY: 'auto' }}>
                        {!userData ? (
                            <Box 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: 2,
                                    p: 3,
                                    textAlign: 'center',
                                    color: theme.palette.grey[400]
                                }}
                            >
                                <Typography variant="h6">
                                    로그인이 필요합니다
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                {tabIndex === 0 && (
                                    <List disablePadding>
                                        {rooms.map(room => (
                                            <ListItemButton
                                                key={room.chatRoomId}
                                                onDoubleClick={() => openChat(room)}
                                                sx={{
                                                    '&:hover': { bgcolor: theme.palette.grey[800] },
                                                    borderBottom: `1px solid ${theme.palette.grey[800]}`,
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>{room.roomNm[0]}</Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="subtitle2">{room.roomNm}</Typography>
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
                                                key={friend.targetId}
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
                                                        <Avatar src={friend.avatarUrl}>{friend.targetNm[0]}</Avatar>
                                                    </Badge>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={friend.targetNm}
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
                                                onChange={(e) => {
                                                    debouncedHandleUserSearch(e.target.value)
                                                    setFriendSearch(e.target.value);
                                                }}
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
                                                {friendSearch.trim() === '' ? (
                                                    // 검색어가 없으면 친구요청 리스트업
                                                    friendRequests.length > 0 ? (
                                                        friendRequests.map(user => (
                                                            <ListItemButton
                                                                key={user.userMappingId}
                                                                sx={{ '&:hover': { bgcolor: theme.palette.grey[800] }, borderBottom: `1px solid ${theme.palette.grey[800]}` }}
                                                            >
                                                                <ListItemAvatar>
                                                                    <Avatar>{user.targetNm[0]}</Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText primary={user.targetNm} sx={{ color: theme.palette.common.white }} />
                                                                <Button color="primary" size="small" sx={{ mr: 1 }} onClick={() => acceptFriendRequest(user.userMappingId)}>수락</Button>
                                                                <Button color="error" size="small" onClick={() => rejectFriendRequest(user.userMappingId)}>거절</Button>
                                                            </ListItemButton>
                                                        ))
                                                    ) : (
                                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                                            <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
                                                                받은 친구 요청이 없습니다
                                                            </Typography>
                                                        </Box>
                                                    )
                                                ) : (
                                                    // 검색어가 있으면 기존 유저 검색 결과
                                                    searchResults.length > 0 ? (
                                                        searchResults.map(user => (
                                                            <ListItemButton
                                                                key={user.targetId}
                                                                sx={{ '&:hover': { bgcolor: theme.palette.grey[800] }, borderBottom: `1px solid ${theme.palette.grey[800]}` }}
                                                            >
                                                                <ListItemAvatar>
                                                                    <Avatar src={user.avatarUrl}>{user.targetNm[0]}</Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText primary={user.targetNm} sx={{ color: theme.palette.common.white }} />
                                                                {!user.isPending ? (
                                                                    <IconButton
                                                                        onClick={() => sendFriendRequest(user.targetId)}
                                                                        sx={{ color: theme.palette.primary.main, '&:hover': { bgcolor: `${theme.palette.primary.main}20` } }}
                                                                    >
                                                                        <PersonAddIcon />
                                                                    </IconButton>
                                                                ) : (
                                                                    <Typography variant="caption" sx={{ color: theme.palette.grey[400] }}>
                                                                        요청됨
                                                                    </Typography>
                                                                )}
                                                            </ListItemButton>
                                                        ))
                                                    ) : (
                                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                                            <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
                                                                검색 결과가 없습니다
                                                            </Typography>
                                                        </Box>
                                                    )
                                                )}
                                            </List>
                                        </Box>
                                    </Box>
                                )}
                            </>
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton 
                                    size="small" 
                                    onClick={() => {
                                        setChatOpen(false);
                                        setListOpen(true);
                                    }} 
                                    sx={{ 
                                        color: theme.palette.grey[400],
                                        '&:hover': {
                                            bgcolor: theme.palette.grey[700]
                                        }
                                    }}
                                >
                                    <ArrowBackIcon fontSize="small" />
                                </IconButton>
                                <Avatar sx={{ mr: 1 }}>{selectedRoom.roomNm[0]}</Avatar>
                                <Typography variant="subtitle1">{selectedRoom.roomNm}</Typography>
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
                                messages.map((msg, i) => {
                                    const message = msg;
                                    const isMyMessage = message.senderId === userData?.userId;
                                    
                                    return (
                                        <Box 
                                            key={i} 
                                            sx={{ 
                                                alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
                                                maxWidth: '80%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: isMyMessage ? 'flex-end' : 'flex-start',
                                                mb: 1
                                            }}
                                        >
                                            {!isMyMessage ? (
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: theme.palette.grey[400],
                                                        ml: 1,
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {message.userName}
                                                </Typography>
                                            ) : (
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: theme.palette.grey[400],
                                                        mr: 1,
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {message.userName}
                                                </Typography>
                                            )}
                                            <Paper
                                                sx={{
                                                    p: 1.5,
                                                    bgcolor: isMyMessage ? theme.palette.primary.main : theme.palette.grey[800],
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography 
                                                    variant="body2"
                                                    sx={{ color: theme.palette.common.white }}
                                                >
                                                    {message.message}
                                                </Typography>
                                            </Paper>
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: theme.palette.grey[400],
                                                    display: 'block',
                                                    textAlign: isMyMessage ? 'right' : 'left',
                                                    mt: 0.5,
                                                    fontSize: '0.7rem',
                                                    px: 1
                                                }}
                                            >
                                                {message.createDt || ''}
                                            </Typography>
                                        </Box>
                                    );
                                })
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
                                value={msgInput}
                                onChange={e => setMsgInput(e.target.value)}
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
