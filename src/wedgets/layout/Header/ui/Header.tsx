// components/Header.tsx
'use client';

import React from "react";
import Link from "next/link";
import './Header.css';
import AvatarArea from "./AvatarArea";

export const Header: React.FC = () => {
    return (
        <header className="header-container">
            <Link className="logo-area" href={"/"}>
                <div className="logo"></div>
            </Link>
            <nav>
                <ul className="header-nav">
                    {/*<li><a href="/boss">보스고?</a></li>*/}
                    {/*<li><a href="/contact">제작 계산기</a></li>*/}
                    <li><a href="/">Home</a></li>
                    <li><a href="/board">Comm</a></li>
                    <li><a href="/download">Azit Client Download</a></li>
                    <li><a href="/">Notice</a></li>
                </ul>
            </nav>

            <AvatarArea />
        </header>
    );
};

export default Header;
