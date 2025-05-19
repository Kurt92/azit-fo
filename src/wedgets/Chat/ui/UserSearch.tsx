import React from 'react';
import { Box, TextField, List, ListItemButton, ListItemAvatar, ListItemText, Avatar, IconButton, Button, Typography, Divider, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { IFriend, IFriendRequest } from '@/shared/types/ChatInterface';

interface UserSearchProps {
    friendSearch: string;
    onSearchChange: (value: string) => void;
    searchResults: IFriend[];
    friendRequests: IFriendRequest[];
    onSendFriendRequest: (userId: number) => void;
    onAcceptFriendRequest: (userMappingId: number) => void;
    onRejectFriendRequest: (userMappingId: number) => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({
    friendSearch,
    onSearchChange,
    searchResults,
    friendRequests,
    onSendFriendRequest,
    onAcceptFriendRequest,
    onRejectFriendRequest
}) => {
    const theme = useTheme();

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="유저 검색..."
                    value={friendSearch}
                    onChange={(e) => onSearchChange(e.target.value)}
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
                                    <Button color="primary" size="small" sx={{ mr: 1 }} onClick={() => onAcceptFriendRequest(user.userMappingId)}>수락</Button>
                                    <Button color="error" size="small" onClick={() => onRejectFriendRequest(user.userMappingId)}>거절</Button>
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
                                            onClick={() => onSendFriendRequest(user.targetId)}
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
    );
}; 