import './Header.css'
import React from "react";
import Link from "next/link";
import {Avatar} from "@mui/material";
import CustomBtn from "@/shared/components/Button/CustomBtn";
import { useRouter } from "next/navigation";
import {UserData} from "@/shared/util/ReactQuery/UserData";
import {user} from "@/shared/util/ApiReq/user/req";

export const Header = () => {

    const { data: userData, isLoading: isUserLoading, isError: isUserError } = UserData(["userData"], user);

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
                        {isUserLoading ? ( // 로딩 중에는 빈 Avatar 표시
                            <></>
                        ) : userData ? (
                            <Avatar/>
                        ) : (
                            <CustomBtn label="로그인" onClick={login} color="primary" variant="outlined" />
                        )}
                    </div>
            </header>
        </>
    )


}