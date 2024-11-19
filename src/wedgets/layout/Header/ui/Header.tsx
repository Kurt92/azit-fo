import './Header.css'
import React from "react";
import Link from "next/link";

export const Header = () => {

    return (
        <>
            <header className="header-container">
                <Link className="logo-area" href={"/main"}>
                    <div className="logo"></div>
                </Link>
                <nav>
                    <ul className="header-nav">
                        <li><a href="/boss">보스고?</a></li>
                        <li><a href="/contact">제작 계산기</a></li>
                    </ul>
                </nav>
            </header>
        </>
    )


}