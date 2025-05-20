import React, { useState } from 'react';
import { List, ListItemButton, ListItemAvatar, ListItemText, Avatar, Badge, Menu, MenuItem, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IFriend } from '@/shared/types/ChatInterface';

interface FriendListProps {
    friends: IFriend[];
    onViewBroadcast: (friendId: number) => void;
    onCreateChatRoom: (friendId: number, roomName: string) => void;
    onDeleteFriend: (friendId: number) => void;
}

export const FriendList: React.FC<FriendListProps> = ({
    friends,
    onViewBroadcast,
    onCreateChatRoom,
    onDeleteFriend
}) => {
    const theme = useTheme();
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
        friendId: number | null;
    } | null>(null);
    const [createRoomDialog, setCreateRoomDialog] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);

    const handleContextMenu = (event: React.MouseEvent, friendId: number) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            friendId
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleCreateRoomClick = () => {
        if (contextMenu?.friendId) {
            setSelectedFriendId(contextMenu.friendId);
            setCreateRoomDialog(true);
            handleCloseContextMenu();
        }
    };

    const handleCreateRoomConfirm = () => {
        if (selectedFriendId && newRoomName.trim()) {
            onCreateChatRoom(selectedFriendId, newRoomName.trim());
            setCreateRoomDialog(false);
            setNewRoomName('');
            setSelectedFriendId(null);
        }
    };

    const handleCreateRoomCancel = () => {
        setCreateRoomDialog(false);
        setNewRoomName('');
        setSelectedFriendId(null);
    };

    return (
        <>
            <List>
                {friends.map((friend) => (
                    <ListItemButton
                        key={friend.targetId}
                        onClick={(e) => handleContextMenu(e, friend.targetId)}
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

            <Menu
                open={contextMenu !== null}
                onClose={handleCloseContextMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
                container={document.body}
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.grey[900],
                        color: theme.palette.common.white,
                        minWidth: 160,
                        py: 1,
                        zIndex: 2147483647,
                    }
                }}
            >
                <MenuItem 
                    onClick={() => {
                        if (contextMenu?.friendId) {
                            onViewBroadcast(contextMenu.friendId);
                            handleCloseContextMenu();
                        }
                    }}
                    sx={{
                        py: 1.5,
                        fontSize: 15,
                        '&:hover': { bgcolor: theme.palette.grey[800] }
                    }}
                >
                    방송 보기
                </MenuItem>
                <MenuItem 
                    onClick={handleCreateRoomClick}
                    sx={{
                        py: 1.5,
                        fontSize: 15,
                        '&:hover': { bgcolor: theme.palette.grey[800] }
                    }}
                >
                    채팅방 생성
                </MenuItem>
                <MenuItem 
                    onClick={() => {
                        if (contextMenu?.friendId) {
                            onDeleteFriend(contextMenu.friendId);
                            handleCloseContextMenu();
                        }
                    }}
                    sx={{
                        py: 1.5,
                        fontSize: 15,
                        color: theme.palette.error.main,
                        '&:hover': { bgcolor: theme.palette.grey[800] }
                    }}
                >
                    친구 삭제
                </MenuItem>
            </Menu>

            <Dialog 
                open={createRoomDialog} 
                onClose={handleCreateRoomCancel}
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.grey[900],
                        color: theme.palette.common.white,
                    }
                }}
            >
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
                        sx={{
                            mt: 2,
                            '& .MuiOutlinedInput-root': {
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
                            '& .MuiInputLabel-root': {
                                color: theme.palette.grey[400],
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleCreateRoomCancel}
                        sx={{ color: theme.palette.grey[400] }}
                    >
                        취소
                    </Button>
                    <Button 
                        onClick={handleCreateRoomConfirm}
                        disabled={!newRoomName.trim()}
                        variant="contained"
                    >
                        생성
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}; 