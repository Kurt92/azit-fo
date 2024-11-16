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
                        <li><a href="/about">About</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </nav>
            </header>
        </>
    )


}