'use client'

import "./boss.css"
import CustomBtn from "@/shared/components/Button/CustomBtn";
import React, {useEffect} from "react";
import UserCard from "@/shared/components/Card/UserCard";
import {Divider} from "@mui/material";
import DraggableList from "@/shared/components/Dnd/DraggableList";
import axios from "axios";
import {UserData} from "@/shared/util/ReactQuery/UserData";
import {sample1} from "@/shared/util/ApiReq/boss/req";
import {user} from "@/shared/util/ApiReq/user/req";

export default function Boss() {

    const { data: sampleData, isLoading: isSampleLoading, isError: isSampleError } = UserData(["sampleData"], sample1);
    const { data: userData, isLoading: isUserLoading, isError: isUserError } = UserData(["userData"], user);


    const handleClick = () => {
        alert('Button clicked!');
    };

    // useEffect(() => {
    //     axios
    //         .get("/api/back/board/sample1",
    //             { withCredentials: true })
    //         .then((res) => {
    //             console.log(res)
    //
    //         })
    //         .catch(() => {
    //             console.log("failed");
    //         })
    // }, []);

    return (
        <>
            <div className={"content"}>
                <div className={"flex mb-10"}>
                    <div className={"user-box"}>
                        <div className={"bookmark"}>
                            <div>즐겨찾기</div>
                            <UserCard/>
                        </div>

                        <Divider
                            sx={{
                                my: 2,                  // 상하 간격 추가
                                mx: 2,                  // 양쪽 간격 추가
                                borderColor: 'grey.300' // 선 색상 설정
                            }}
                        />

                        <div className={"user-list"}>
                            <div>친구목록</div>
                            <UserCard/>
                        </div>
                    </div>
                    <div className={"sixman-box"}>
                        <DraggableList />
                    </div>
                </div>
                <div className={"btn-area"}>
                    <CustomBtn label="내 식스맨 변경" onClick={handleClick} color="primary" variant="outlined"  />
                </div>
            </div>

        </>
    );
}
