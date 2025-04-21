// components/ChatWidget.tsx
'use client';

import React, { useState } from 'react';
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
    ListItemText,
    Tabs,
    Tab,
    useTheme,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

interface ChatRoom {
    id: string;
    name: string;
    lastMessage: string;
}
interface Friend {
    id: string;
    name: string;
}

export default function ChatWidget() {
    const theme = useTheme();
    const [rooms] = useState<ChatRoom[]>([
        { id: '1', name: '성태', lastMessage: '몬헌함??' },
        { id: '2', name: '정민', lastMessage: '와 이게 되네?' },
        { id: '3', name: '11', lastMessage: 'zz' },
        { id: '4', name: '22', lastMessage: 'qq' },
    ]);
    const [friends] = useState<Friend[]>([
        { id: '1', name: '성태' },
        { id: '2', name: '정민' },
    ]);

    const [listOpen, setListOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [tabIndex, setTabIndex] = useState(0);

    const toggleList = () => setListOpen(o => !o);
    const openChat = (room: ChatRoom) => {
        setSelectedRoom(room);
        setListOpen(false);
        setChatOpen(true);
    };
    const closeChat = () => setChatOpen(false);
    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages(msgs => [...msgs, input.trim()]);
        setInput('');
    };
    const handleTabChange = (_: React.SyntheticEvent, newIdx: number) => setTabIndex(newIdx);

    // 어두운 패널과 흰색 텍스트 스타일
    const panelBg = '#2e2e2e';
    const inputBg = '#3a3a3a';
    const white = '#ffffff';

    return (
        <>
            {/* Floating Button */}
            <Fab
                color="secondary"
                onClick={toggleList}
                sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: theme.zIndex.modal + 1 }}
            >
                <ChatIcon />
            </Fab>

            {/* Tabbed List */}
            <Grow in={listOpen} mountOnEnter unmountOnExit style={{ transformOrigin: 'right bottom' }}>
                <Paper
                    elevation={3}
                    sx={{
                        position: 'fixed',
                        borderRadius: 10,
                        bottom: 80,
                        right: 16,
                        width: 350,
                        height: 600,
                        maxHeight: 600,
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: panelBg,
                        color: white,
                        zIndex: theme.zIndex.modal + 1,
                    }}
                >
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        textColor="inherit"
                        indicatorColor="primary"
                        sx={{
                            bgcolor: panelBg,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Tab label="채팅방" sx={{ color: white }} />
                        <Tab label="친구" sx={{ color: white }} />
                    </Tabs>
                    <Box sx={{ overflowY: 'auto', flex: 1, bgcolor: panelBg }}>
                        {tabIndex === 0 && (
                            <List disablePadding>
                                {rooms.map(room => (
                                    <ListItem
                                        key={room.id}
                                        button
                                        onDoubleClick={() => openChat(room)}
                                        sx={{
                                            '&:hover': { bgcolor: theme.palette.action.selected },
                                            px: 2,
                                        }}
                                    >
                                        <ListItemText
                                            primary={room.name}
                                            secondary={room.lastMessage}
                                            primaryTypographyProps={{ color: white }}
                                            secondaryTypographyProps={{ color: white }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        {tabIndex === 1 && (
                            <List disablePadding>
                                {friends.map(friend => (
                                    <ListItem
                                        key={friend.id}
                                        button
                                        sx={{ '&:hover': { bgcolor: theme.palette.action.selected }, px: 2 }}
                                    >
                                        <ListItemText
                                            primary={friend.name}
                                            primaryTypographyProps={{ color: white }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </Paper>
            </Grow>

            {/* Chat Panel */}
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
                            bgcolor: panelBg,
                            color: white,
                            zIndex: theme.zIndex.modal + 1,
                        }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                bgcolor: theme.palette.secondary.dark,
                                color: theme.palette.secondary.contrastText,
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ color: white }}>{selectedRoom.name}</Typography>
                            <IconButton size="small" onClick={closeChat} sx={{ color: white }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {/* Messages */}
                        <Box sx={{ flex: 1, p: 1, overflowY: 'auto', bgcolor: panelBg }}>
                            {messages.length === 0 ? (
                                <Typography variant="body2" sx={{ color: white }}>
                                    내용을 입력해 보세요.
                                </Typography>
                            ) : (
                                messages.map((msg, i) => (
                                    <Box key={i} sx={{ mb: 1 }}>
                                        <Typography variant="body2" sx={{ color: white }}>• {msg}</Typography>
                                    </Box>
                                ))
                            )}
                        </Box>

                        {/* Input */}
                        <Box
                            component="form"
                            onSubmit={e => {
                                e.preventDefault();
                                sendMessage();
                            }}
                            sx={{ display: 'flex', p: 1, bgcolor: panelBg }}
                        >
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="메시지 입력…"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                variant="filled"
                                sx={{
                                    backgroundColor: inputBg,
                                    borderRadius: 1,
                                    input: { color: white },
                                }}
                                InputProps={{ disableUnderline: true }}
                            />
                            <Button type="submit" variant="contained" size="small" sx={{ ml: 1, bgcolor: theme.palette.action.selected}}>
                                전송
                            </Button>
                        </Box>
                    </Paper>
                </Grow>
            )}
        </>
    );
}
