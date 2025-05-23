// components/ChatWidget.tsx
'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Box, Fab, Paper, Tabs, Tab, useTheme, Grow, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Snackbar } from '@mui/material';
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
    const [createRoomDialog, setCreateRoomDialog] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
    const [errorAlert, setErrorAlert] = useState(false);

    // 채팅방 조회
    useEffect(() => {
        if (!userData?.userId) return;
        
        const chatDomain = process.env.NEXT_PUBLIC_CHAT_URL;
        const authDomain = process.env.NEXT_PUBLIC_AUTH_URL;
        
        axios
            .get(`${chatDomain}/room-list`, {
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
                console.error('친구 상태 조회 실패:', err);
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
            .get(`${chatDomain}/chat-list`, {
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
                setSearchResults(res.data);
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

    const handleCreateChatRoom = (friendId: number, roomName: string) => {
        if (!userData?.userId) return;

        const chatDomain = process.env.NEXT_PUBLIC_CHAT_URL;
        const targetFriend = friends.find(friend => friend.targetId === friendId);

        axios
            .post(`${chatDomain}/room`, {
                userId: userData.userId,
                targetId: friendId,
                roomNm: roomName
            }, {
                withCredentials: true,
                validateStatus: (status) => {
                    return status === 200; // 200만 성공으로 처리
                }
            })
            .then((res) => {
                if (!res.data) {
                    throw new Error('서버 응답이 없습니다.');
                }

                const newRoom = {
                    ...res.data,
                    roomNm: roomName,
                    lastMessage: '',
                    lastMessageTime: new Date().toISOString()
                };
                setRooms(prev => [...prev, newRoom]);
                setSelectedRoom(newRoom);
                setListOpen(false);
                setChatOpen(true);
                setTabIndex(0);
            })
            .catch((err) => {
                console.error('채팅방 생성 실패:', err);
                if (err.response) {
                    console.error('에러 데이터:', err.response.data);
                    console.error('에러 상태:', err.response.status);
                } else if (err.request) {
                    console.error('응답 없음:', err.request);
                } else {
                    console.error('에러 메시지:', err.message);
                }
                setErrorAlert(true);
            });
    };

    const handleCreateRoomConfirm = () => {
        if (!userData?.userId || !selectedFriendId || !newRoomName.trim()) return;

        const chatDomain = process.env.NEXT_PUBLIC_CHAT_URL;

        axios
            .post(`${chatDomain}/chat/room`, {
                userId: userData.userId,
                targetId: selectedFriendId,
                roomNm: newRoomName.trim()
            }, {
                withCredentials: true
            })
            .then((res) => {
                setRooms(prev => [...prev, res.data]);
                setSelectedRoom(res.data);
                setListOpen(false);
                setChatOpen(true);
                setCreateRoomDialog(false);
                setNewRoomName('');
                setSelectedFriendId(null);
            })
            .catch((err) => {
                console.error('채팅방 생성 실패:', err);
            });
    };

    const handleCreateRoomCancel = () => {
        setCreateRoomDialog(false);
        setNewRoomName('');
        setSelectedFriendId(null);
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
                        lastMessageTime: new Date().toISOString()
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
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: theme.zIndex.modal,
                    }}
                    onClick={() => setListOpen(false)}
                >
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
                            zIndex: 1000,
                            overflow: 'hidden',
                        }}
                        onClick={e => e.stopPropagation()}
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
                </Box>
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

            <Dialog open={createRoomDialog} onClose={handleCreateRoomCancel}>
                <DialogTitle>새로운 채팅방 만들기</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="채팅방 이름"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="채팅방 이름을 입력하세요"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateRoomCancel}>취소</Button>
                    <Button 
                        onClick={handleCreateRoomConfirm}
                        disabled={!newRoomName.trim()}
                        variant="contained"
                    >
                        생성
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={errorAlert} 
                autoHideDuration={3000} 
                onClose={() => setErrorAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setErrorAlert(false)} 
                    severity="error" 
                    sx={{ width: '100%' }}
                >
                    채팅방 생성에 실패했습니다.
                </Alert>
            </Snackbar>
        </>
    );
}
