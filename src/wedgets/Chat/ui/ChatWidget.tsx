// components/ChatWidget.tsx
'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Box, Fab, Paper, Tabs, Tab, useTheme, Grow, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import axios from "axios";
import { UserData } from "@/shared/util/ReactQuery/UserData";
import { user } from "@/shared/util/ApiReq/user/req";
import { Client, IMessage as StompMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import debounce from 'lodash/debounce';
import { IChatRoom, IFriend, IMessage, IFriendRequest } from '@/shared/types/ChatInterface';
import { FriendList } from './FriendList';
import { ChatRoomList } from './ChatRoomList';
import { ChatWindow } from './ChatWindow';
import { UserSearch } from './UserSearch';

export default function ChatWidget() {
    const { data: userData } = UserData(["userData"], user);
    const stompClientRef = useRef<Client | null>(null);
    const theme = useTheme();

    const [rooms, setRooms] = useState<IChatRoom[]>([]);
    const [friends, setFriends] = useState<IFriend[]>([]);
    const [listOpen, setListOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<IChatRoom | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [friendSearch, setFriendSearch] = useState('');
    const [searchResults, setSearchResults] = useState<IFriend[]>([]);
    const [friendRequests, setFriendRequests] = useState<IFriendRequest[]>([]);

    // 채팅방 조회
    useEffect(() => {
        if (!userData?.userId) return;
        
        const chatDomain = process.env.NEXT_PUBLIC_CHAT_URL;
        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        
        axios
            .get(`${chatDomain}/chat/room-list`, {
                params: { userId: userData.userId },
                withCredentials: true 
            })
            .then((res) => {
                setRooms(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

        axios
            .get(`${authDomain}/friend-list`, {
                params: { userId: userData.userId },
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

    // 채팅 소켓 연결
    useEffect(() => {
        if (!chatOpen || !selectedRoom) return;

        const chatDomain = process.env.NEXT_PUBLIC_CHAT_URL;
        
        axios
            .get(`${chatDomain}/chat/chat-list`, {
                params: { chatRoomId: selectedRoom.chatRoomId },
                withCredentials: true 
            })
            .then((res) => {
                setMessages(res.data);
            })
            .catch((err) => {
                console.error(err);
            });

        const socket = new SockJS(`${chatDomain}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log('STOMP:', str),
            onConnect: () => {
                console.log('STOMP 연결됨');
                stompClient.subscribe(`/topic/chat/${selectedRoom.chatRoomId}`, (message: StompMessage) => {
                    setMessages(prev => [...prev, JSON.parse(message.body)]);
                });
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, [chatOpen, selectedRoom?.chatRoomId]);

    const handleTabChange = (_: React.SyntheticEvent, newIdx: number) => setTabIndex(newIdx);

    const handleUserSearch = useCallback((query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
      
        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
      
        axios
            .get(`${authDomain}/user-list`, {
                params: { 
                    targetNm: query, 
                    userId: userData?.userId 
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

    const debouncedHandleUserSearch = useMemo(
        () => debounce(handleUserSearch, 300),
        [handleUserSearch]
    );

    const handleSendFriendRequest = (userId: number) => {
        axios
            .get(`${process.env.NEXT_PUBLIC_AUTH_URL}/request-friend`, {
                params: { 
                    targetId: userId, 
                    userId: userData?.userId 
                },
                withCredentials: true
            })
            .then(() => {
                setSearchResults(prev => 
                    prev.map(user => 
                        user.targetId === userId
                            ? { ...user, isPending: true }
                            : user
                    )
                );
            })
            .catch((err) => {
                console.error('친구 요청 실패:', err);
            });
    };

    const handleAcceptFriendRequest = (userMappingId: number) => {
        axios
            .get(`${process.env.NEXT_PUBLIC_AUTH_URL}/request-status`, {
                params: { 
                    userMappingId, 
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

    const handleRejectFriendRequest = (userMappingId: number) => {
        axios
            .get(`${process.env.NEXT_PUBLIC_AUTH_URL}/request-status`, {
                params: { 
                    userMappingId, 
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

    const handleViewBroadcast = (friendId: number) => {
        console.log('방송 보기:', friendId);
    };

    const handleCreateChatRoom = (friendId: number) => {
        console.log('채팅방 생성:', friendId);
    };

    const handleDeleteFriend = (friendId: number) => {
        console.log('친구 삭제:', friendId);
    };

    const handleSendMessage = (message: string) => {
        if (!selectedRoom || !userData?.userId) return;

        const messageData = {
            chatRoomId: selectedRoom.chatRoomId,
            senderId: userData.userId,
            userName: userData.userNm,
            message: message,
            createDt: new Date().toISOString()
        };

        stompClientRef.current?.publish({
            destination: `/pub/chat.sendMessage`,
            body: JSON.stringify(messageData)
        });

        setRooms(prevRooms => 
            prevRooms.map(room => 
                room.chatRoomId === selectedRoom.chatRoomId
                    ? {
                        ...room,
                        lastMessage: message,
                        lastMessageTime: new Date().toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })
                    }
                    : room
            )
        );
    };

    return (
        <>
            <Fab
                color="primary"
                onClick={() => setListOpen(o => !o)}
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
                                    <ChatRoomList
                                        rooms={rooms}
                                        onRoomSelect={(room) => {
                                            setSelectedRoom(room);
                                            setListOpen(false);
                                            setChatOpen(true);
                                        }}
                                    />
                                )}
                                {tabIndex === 1 && (
                                    <FriendList
                                        friends={friends}
                                        onViewBroadcast={handleViewBroadcast}
                                        onCreateChatRoom={handleCreateChatRoom}
                                        onDeleteFriend={handleDeleteFriend}
                                    />
                                )}
                                {tabIndex === 2 && (
                                    <UserSearch
                                        friendSearch={friendSearch}
                                        onSearchChange={(value) => {
                                            debouncedHandleUserSearch(value);
                                            setFriendSearch(value);
                                        }}
                                        searchResults={searchResults}
                                        friendRequests={friendRequests}
                                        onSendFriendRequest={handleSendFriendRequest}
                                        onAcceptFriendRequest={handleAcceptFriendRequest}
                                        onRejectFriendRequest={handleRejectFriendRequest}
                                    />
                                )}
                            </>
                        )}
                    </Box>
                </Paper>
            </Grow>

            {selectedRoom && chatOpen && (
                <ChatWindow
                    room={selectedRoom}
                    messages={messages}
                    currentUserId={userData?.userId || 0}
                    onClose={() => {
                        setChatOpen(false);
                        setSelectedRoom(null);
                    }}
                    onBack={() => {
                        setChatOpen(false);
                        setListOpen(true);
                    }}
                    onSendMessage={handleSendMessage}
                />
            )}
        </>
    );
}
