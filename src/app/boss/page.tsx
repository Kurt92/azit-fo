'use client'

import "./boss.css"
import CustomBtn from "@/shared/components/Button/CustomBtn";
import React, {useEffect, useState} from "react";
import {Divider} from "@mui/material";
import DraggableList from "@/shared/components/Dnd/DraggableList";
import axios from "axios";
import {UserData} from "@/shared/util/ReactQuery/UserData";
import {sample1} from "@/shared/util/ApiReq/boss/req";
import {user} from "@/shared/util/ApiReq/user/req";
import {DataItem, Expedition} from "@/shared/types/ExpeditionInterface";
import UserCard from "@/shared/components/Card/UserCard";


export default function Boss() {

    const { data: userData, isLoading: isUserLoading, isError: isUserError } = UserData(["userData"], user);
    // 논타입스크립트에서 state 설정
    // const [expeditions, setExpeditions] = useState([]);

    // 타입스크립트에서 state 인터페이스 설정, 타입을 명시적으로 하고 인터페이스파일을 따로 빼서 정의
    const [expeditions, setExpeditions] = useState<Expedition[]>([]);
    const [dataItem, setDataItem] = useState<DataItem[]>([]);




    const handleClick = () => {
        alert('Button clicked!');
        console.log(dataItem);
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

    useEffect(() => {

        //리엑트쿼리에 값 불러오기전 호출을 한번해서 호출완료후에 엑시오스요청하도록 조건추가
        if (!userData || !userData) return;

        const domain = process.env.NEXT_API_URL;
        axios
            .get(`${domain}/boss/${userData?.accountId}`)
            .then((res)=>{
                setDataItem(res.data.data);
            })
            .catch(()=>{
                console.log('Failed to fetch boss character');
            })


    }, [userData]);


    return (
        <>
            <div className={"content"}>
                <div className={"flex mb-10"}>
                    <div className={"user-box"}>
                        <div className={"bookmark"}>
                            <div>즐겨찾기</div>
                            {/*<UserCard expeditions={expeditions}/>*/}
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
                            {dataItem.map((item, index)=>(
                                <UserCard key={index} dataItem={item}/>
                            ))}
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
