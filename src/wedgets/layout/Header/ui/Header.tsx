// components/Header.tsx
'use client';

import React, { useState } from "react";
import Link from "next/link";
import {Avatar, IconButton, Menu, MenuItem} from "@mui/material";
import CustomBtn from "@/shared/components/Button/CustomBtn";
import { useRouter } from "next/navigation";
import { UserData } from "@/shared/util/ReactQuery/UserData";
import { user } from "@/shared/util/ApiReq/user/req";
import './Header.css';

export const Header: React.FC = () => {
    const { data: userData, isLoading } = UserData(["userData"], user);
    const router = useRouter();

    // 1️⃣ 메뉴 오픈용 anchor 관리
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => router.push("/login");
    const handleLogout = () => {
        // TODO: 로그아웃 로직
        handleCloseMenu();
        router.push("/login");
    };

    return (
        <header className="header-container">
            <Link className="logo-area" href={"/"}>
                <div className="logo"></div>
            </Link>
            <nav>
                <ul className="header-nav">
                    {/*<li><a href="/boss">보스고?</a></li>*/}
                    {/*<li><a href="/contact">제작 계산기</a></li>*/}
                    <li><a href="/">tts</a></li>
                    <li><a href="/board">커뮤</a></li>
                </ul>
            </nav>

            <div className="avatar-area">
                {isLoading ? null : userData ? (
                    <>
                        {/* 클릭용 버튼으로 Avatar 감싸기 */}
                        <IconButton onClick={handleOpenMenu} size="small" sx={{ p: 0 }}>
                            <Avatar alt={userData.userNm} />
                        </IconButton>

                        {/* 메뉴 컴포넌트 */}
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseMenu}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            disableScrollLock
                        >
                            <MenuItem
                                onClick={() => {
                                    handleCloseMenu();
                                    router.push("/profile");
                                }}
                            >
                                프로필
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                로그아웃
                            </MenuItem>
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
        </header>
    );
};

export default Header;
