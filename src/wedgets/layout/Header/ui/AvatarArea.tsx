import React, { useState } from "react";
import { Avatar, IconButton, Menu, MenuItem, Badge, Tooltip, Divider } from "@mui/material";
import CustomBtn from "@/shared/components/Button/CustomBtn";
import { useRouter } from "next/navigation";
import { UserData } from "@/shared/util/ReactQuery/UserData";
import { user } from "@/shared/util/ApiReq/user/req";
import axios from "axios";
import NotificationsIcon from '@mui/icons-material/Notifications';

export const AvatarArea: React.FC = () => {
    const { data: userData, isLoading } = UserData(["userData"], user);
    const router = useRouter();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // 임시 알람 데이터 (실제로는 API에서 가져와야 함)
    const [notifications] = useState([
        { id: 1, message: "새로운 댓글이 달렸습니다", time: "5분 전" },
        { id: 2, message: "게시글이 좋아요를 받았습니다", time: "1시간 전" },
    ]);

    const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => router.push("/login");

    const handleLogout = () => {
        const domain = process.env.NEXT_PUBLIC_AUTH_URL;
        axios
            .get(`${domain}/auth/logout`,
                { withCredentials: true })
            .then((res) => {
                window.location.reload();
            })
            .catch(() => {
                console.log("failed");
            })
    };

    return (
        <div className="avatar-area">
            {isLoading ? null : userData ? (
                <>
                    <Tooltip title="프로필 및 알림">
                        <IconButton onClick={handleOpenMenu} size="small" sx={{ p: 0 }}>
                            <Badge
                                badgeContent={notifications.length}
                                color="error"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        right: -3,
                                        top: 3,
                                    }
                                }}
                            >
                                <Avatar alt={userData.userNm} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        disableScrollLock
                        PaperProps={{
                            sx: {
                                width: 320,
                                maxHeight: 400
                            }
                        }}
                    >
                        <div style={{ padding: '8px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <Avatar 
                                    alt={userData.userNm} 
                                    sx={{ width: 40, height: 40, mr: 2 }}
                                />
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{userData.userNm}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'gray' }}>관리자</div>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <MenuItem 
                                        key={notification.id} 
                                        onClick={handleCloseMenu}
                                        sx={{ 
                                            display: 'block',
                                            whiteSpace: 'normal',
                                            py: 1
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{notification.message}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                                                {notification.time}
                                            </span>
                                        </div>
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>새로운 알림이 없습니다</MenuItem>
                            )}
                        </div>

                        <Divider />

                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: '8px 16px'
                        }}>
                            <MenuItem
                                onClick={() => {
                                    handleCloseMenu();
                                    router.push("/profile");
                                }}
                                sx={{ flex: 1, justifyContent: 'center' }}
                            >
                                프로필
                            </MenuItem>
                            <MenuItem 
                                onClick={handleLogout}
                                sx={{ flex: 1, justifyContent: 'center' }}
                            >
                                로그아웃
                            </MenuItem>
                        </div>
                    </Menu>
                </>
            ) : (
                <CustomBtn
                    label="로그인"
                    onClick={handleLogin}
                    color="primary"
                    variant="outlined"
                />
            )}
        </div>
    );
};

export default AvatarArea; 