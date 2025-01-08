'use client'

import "./boss.css"
import CustomBtn from "@/shared/components/Button/CustomBtn";
import React, {useEffect, useState} from "react";
import {Divider, Box} from "@mui/material";
import DraggableList from "@/shared/components/Dnd/DraggableList";
import axios from "axios";
import {UserData} from "@/shared/util/ReactQuery/UserData";
import {user} from "@/shared/util/ApiReq/user/req";
import {IDataItem} from "@/shared/types/ExpeditionInterface";
import UserCard from "@/shared/components/Card/UserCard";
import {IUser} from "@/shared/types/UserInterface";

export default function Boss() {
    // React Query로 사용자 데이터 로드
    const { data: userData, isLoading: isUserLoading, isError: isUserError } = UserData<undefined, IUser>(["userData"], user);

    // 상태 관리
    const [dataItem, setDataItem] = useState<IDataItem[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    // 버튼 클릭 핸들러
    const handleClick = () => {
        alert('Button clicked!');
    };

    // 데이터 로드
    useEffect(() => {
        if (!userData) return;

        const domain = process.env.NEXT_API_URL;
        axios
            .get(`${domain}/boss/${userData?.accountId}`)
            .then((res) => {
                setDataItem(res.data.data);
            })
            .catch(() => {
                console.log('Failed to fetch boss character');
            })
    }, [userData]);

    // 그룹 선택 핸들러
    const handleGroupSelect = (item: string) => {
        setSelectedGroup(item);
    };

    // 선택된 그룹 로깅
    useEffect(() => {
        console.log("Selected Group: ", selectedGroup);
    }, [selectedGroup]);

    // 데이터 로깅
    useEffect(() => {
        console.log("Data Items: ", dataItem);
    }, [dataItem]);

    return (
        <>
            <div className={"content"}>
                <div className={"flex mb-10"}>
                    {/* 왼쪽 섹션 */}
                    <div className={"user-box"}>
                        <div className={"bookmark"}>
                            <div>즐겨찾기</div>
                        </div>

                        <Divider
                            sx={{
                                my: 2,
                                mx: 2,
                                borderColor: 'grey.300'
                            }}
                        />

                        <div className={"user-list"}>
                            <div>친구목록</div>
                            <Box display="flex" flexDirection="column">
                                {dataItem.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleGroupSelect(item.mainCharacterNm)}
                                        style={{
                                            cursor: 'pointer',
                                            backgroundColor: selectedGroup === item.mainCharacterNm ? '#333' : '#2B2D31',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        <UserCard dataItem={item}/>
                                    </div>
                                ))}
                            </Box>
                        </div>
                    </div>

                    {/* 오른쪽 섹션 */}
                    <div className={"sixman-box"}>
                        {selectedGroup !== null ? (
                            <DraggableList
                                key={selectedGroup}
                                items={dataItem.find(item => item.mainCharacterNm === selectedGroup)?.expeditionList || {expeditionList: []}}
                                userData={userData}
                            />
                        ) : (
                            <div style={{padding: '20px', textAlign: 'center'}}>
                                대표캐릭터를 선택하세요.
                            </div>
                        )}
                    </div>
                </div>

                {/* 버튼 섹션 */}
                <div className={"btn-area"}>
                    <CustomBtn label="내 식스맨 변경" onClick={handleClick} color="primary" variant="outlined"/>
                </div>
            </div>
        </>
    );
}
