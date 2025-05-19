import React from 'react';
import { List, ListItemButton, ListItemAvatar, ListItemText, Avatar, Badge, Box, Typography, useTheme } from '@mui/material';
import { IChatRoom } from '@/shared/types/ChatInterface';

interface ChatRoomListProps {
    rooms: IChatRoom[];
    onRoomSelect: (room: IChatRoom) => void;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({
    rooms,
    onRoomSelect
}) => {
    const theme = useTheme();

    return (
        <List disablePadding>
            {rooms.map(room => (
                <ListItemButton
                    key={room.chatRoomId}
                    onDoubleClick={() => onRoomSelect(room)}
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
    );
}; 