'use client';

import React, { useState, useRef } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Avatar,
    Switch,
    Divider,
    Alert,
    IconButton,
    useTheme,
    Grid,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';

export default function ProfilePage() {
    const theme = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [avatar, setAvatar] = useState<string | null>(null);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);

    // 비밀번호 변경
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setAlert({ type: 'error', message: '새 비밀번호가 일치하지 않습니다.' });
            return;
        }
        
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/user/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            }, { withCredentials: true });
            
            setAlert({ type: 'success', message: '비밀번호가 성공적으로 변경되었습니다.' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setAlert({ type: 'error', message: '비밀번호 변경에 실패했습니다.' });
        }
    };

    // 2FA 활성화/비활성화
    const handle2FAToggle = async () => {
        try {
            if (!is2FAEnabled) {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/user/2fa/enable`, {}, 
                    { withCredentials: true }
                );
                setShowQRCode(true);
                // QR 코드 이미지 URL을 받아서 표시
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/user/2fa/disable`, {}, 
                    { withCredentials: true }
                );
                setShowQRCode(false);
            }
            setIs2FAEnabled(!is2FAEnabled);
        } catch (error) {
            setAlert({ type: 'error', message: '2FA 설정 변경에 실패했습니다.' });
        }
    };

    // 아바타 업로드
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/user/avatar`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAvatar(response.data.avatarUrl);
            setAlert({ type: 'success', message: '프로필 사진이 업데이트되었습니다.' });
        } catch (error) {
            setAlert({ type: 'error', message: '프로필 사진 업로드에 실패했습니다.' });
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.grey[100] }}>
                프로필 관리
            </Typography>

            {alert && (
                <Alert 
                    severity={alert.type} 
                    onClose={() => setAlert(null)}
                    sx={{ mb: 3 }}
                >
                    {alert.message}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* 아바타 섹션 */}
                <Grid item xs={12}>
                    <Paper 
                        elevation={3}
                        sx={{ 
                            p: 3,
                            bgcolor: theme.palette.grey[900],
                            color: theme.palette.common.white
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            프로필 사진
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={avatar || undefined}
                                    sx={{ width: 100, height: 100 }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: theme.palette.primary.main,
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                        },
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <CameraAltIcon />
                                </IconButton>
                            </Box>
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleAvatarUpload}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* 비밀번호 변경 섹션 */}
                <Grid item xs={12}>
                    <Paper 
                        elevation={3}
                        sx={{ 
                            p: 3,
                            bgcolor: theme.palette.grey[900],
                            color: theme.palette.common.white
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LockIcon />
                            <Typography variant="h6">
                                비밀번호 변경
                            </Typography>
                        </Box>
                        <form onSubmit={handlePasswordChange}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    type="password"
                                    label="현재 비밀번호"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    fullWidth
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: theme.palette.grey[700],
                                            },
                                            '&:hover fieldset': {
                                                borderColor: theme.palette.grey[500],
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: theme.palette.grey[400],
                                        },
                                    }}
                                />
                                <TextField
                                    type="password"
                                    label="새 비밀번호"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    fullWidth
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: theme.palette.grey[700],
                                            },
                                            '&:hover fieldset': {
                                                borderColor: theme.palette.grey[500],
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: theme.palette.grey[400],
                                        },
                                    }}
                                />
                                <TextField
                                    type="password"
                                    label="새 비밀번호 확인"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    fullWidth
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: theme.palette.grey[700],
                                            },
                                            '&:hover fieldset': {
                                                borderColor: theme.palette.grey[500],
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: theme.palette.grey[400],
                                        },
                                    }}
                                />
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    sx={{ alignSelf: 'flex-end' }}
                                >
                                    비밀번호 변경
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Grid>

                {/* 2FA 관리 섹션 */}
                <Grid item xs={12}>
                    <Paper 
                        elevation={3}
                        sx={{ 
                            p: 3,
                            bgcolor: theme.palette.grey[900],
                            color: theme.palette.common.white
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <SecurityIcon />
                            <Typography variant="h6">
                                2단계 인증
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="body1">
                                    2단계 인증 사용
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
                                    로그인 시 추가 보안을 위한 인증 코드가 필요합니다
                                </Typography>
                            </Box>
                            <Switch
                                checked={is2FAEnabled}
                                onChange={handle2FAToggle}
                                color="primary"
                            />
                        </Box>
                        {showQRCode && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    아래 QR 코드를 Google Authenticator 앱으로 스캔하세요
                                </Typography>
                                <Box 
                                    sx={{ 
                                        p: 2, 
                                        bgcolor: 'white', 
                                        width: 'fit-content',
                                        borderRadius: 1
                                    }}
                                >
                                    {/* QR 코드 이미지가 들어갈 자리 */}
                                    <img src="QR_CODE_URL" alt="2FA QR Code" style={{ width: 200, height: 200 }} />
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
} 