import React, { useRef, useEffect } from 'react';
import { Box, Paper, IconButton, TextField, Typography, Avatar, useTheme, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IChatRoom, IMessage } from '@/shared/types/ChatInterface';
import dayjs from 'dayjs';

interface ChatWindowProps {
    room: IChatRoom;
    messages: IMessage[];
    currentUserId: number;
    onClose: () => void;
    onBack: () => void;
    onSendMessage: (message: string) => void;
}

const getDateLabel = (isoString: string) => {
    const date = dayjs(isoString);
    const today = dayjs();
    const yesterday = dayjs().subtract(1, 'day');

    if (date.isSame(today, 'day')) return '오늘';
    if (date.isSame(yesterday, 'day')) return '어제';
    return date.format('YYYY-MM-DD');
};

export const ChatWindow: React.FC<ChatWindowProps> = ({
    room,
    messages,
    currentUserId,
    onClose,
    onBack,
    onSendMessage
}) => {
    const theme = useTheme();
    const messageEndRef = useRef<HTMLDivElement>(null);
    const [msgInput, setMsgInput] = React.useState('');

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (msgInput.trim()) {
            onSendMessage(msgInput.trim());
            setMsgInput('');
        }
    };

    return (
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
                zIndex: 1000,
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
                        onClick={onBack}
                        sx={{ 
                            color: theme.palette.grey[400],
                            '&:hover': {
                                bgcolor: theme.palette.grey[700]
                            }
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Avatar sx={{ mr: 1 }}>{room.roomNm[0]}</Avatar>
                    <Typography variant="subtitle1" sx={{ color: theme.palette.common.white }}>
                        {room.roomNm}
                    </Typography>
                </Box>
                <IconButton size="small" onClick={onClose} sx={{ color: theme.palette.grey[400] }}>
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
                        const isMyMessage = msg.senderId === currentUserId;
                        const currentLabel = getDateLabel(msg.createDt);
                        const prevLabel = i > 0 ? getDateLabel(messages[i - 1].createDt) : null;
                        const showDateDivider = i === 0 || prevLabel !== currentLabel;
                        return (
                            <React.Fragment key={i}>
                                {showDateDivider && (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        my: 2,
                                        '&::before, &::after': {
                                            content: '""',
                                            flex: 1,
                                            borderBottom: `1px solid ${theme.palette.grey[700]}`
                                        }
                                    }}>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                mx: 2, 
                                                color: theme.palette.grey[400],
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {currentLabel}
                                        </Typography>
                                    </Box>
                                )}
                                <Box 
                                    sx={{ 
                                        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
                                        maxWidth: '80%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: isMyMessage ? 'flex-end' : 'flex-start',
                                        mb: 1
                                    }}
                                >
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: theme.palette.grey[400],
                                            ml: isMyMessage ? 0 : 1,
                                            mr: isMyMessage ? 1 : 0,
                                            mb: 0.5
                                        }}
                                    >
                                        {msg.userName}
                                    </Typography>
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
                                            {msg.message}
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
                                        {dayjs(msg.createDt).format('HH:mm')}
                                    </Typography>
                                </Box>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messageEndRef} />
            </Box>

            <Box
                component="form"
                onSubmit={handleSubmit}
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
    );
}; 