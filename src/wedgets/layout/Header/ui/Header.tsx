import './Header.css'
import React from "react";
import Link from "next/link";
import {Avatar} from "@mui/material";
import CustomBtn from "@/shared/components/Button/CustomBtn";
import { useRouter } from "next/navigation";

export const Header = () => {

    const router = useRouter();

    const login = () => {
        router.push("/login")
    }

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
                    <div className={"avatar-area"}>
                        <CustomBtn label="로그인" onClick={login} color="primary" variant="outlined"/>
                        {/*<Avatar>H</Avatar>*/}
                    </div>
            </header>
        </>
    )


}