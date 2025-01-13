import React, {useEffect, useState} from "react";
import {Dialog, DialogTitle, DialogContent, Box, Checkbox} from "@mui/material";
import { IUser } from "@/shared/types/UserInterface";
import "./SixmanDialog.css"
import axios from "axios";
import UserCard from "@/shared/components/Card/UserCard";
import CustomBtn from "@/shared/components/Button/CustomBtn";

interface SixmanDialogProps {
    userData: IUser | undefined; // 사용자 데이터
    open: boolean; // 다이얼로그 열림 여부
    onClose: () => void; // 닫기 핸들러
}

const SixmanDialog: React.FC<SixmanDialogProps> = ({ userData, open, onClose }) => {

    const [expedition, setExpedition] = useState<any[]>([]);

    const save = () => {

    }

    useEffect(() => {
        const domain = process.env.NEXT_API_URL;
        axios
            .get(`${domain}/expedition/${userData?.accountId}`)
            .then((res) => {
                setExpedition(res.data.data);
            })
            .catch(() => {
                console.log('Failed find expedition');
            })
    }, [open]);
    useEffect(() => {
        console.log("asdfasdf", expedition);
    }, [expedition]);


    return (
        <Dialog className={"dialog"} open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>내 식스맨 변경</DialogTitle>
            <DialogContent>
                {/*<Box display="flex" flexDirection="column">*/}
                {/*    {dataItem.map((item, index) => (*/}
                {/*        <div*/}
                {/*            key={index}*/}
                {/*            onClick={() => handleGroupSelect(item.mainCharacterNm)}*/}
                {/*            style={{*/}
                {/*                cursor: 'pointer',*/}
                {/*                backgroundColor: selectedGroup === item.mainCharacterNm ? '#333' : '#2B2D31',*/}
                {/*                borderRadius: '5px'*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <UserCard dataItem={item}/>*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</Box>*/}

                {expedition.length > 0 ? (
                    expedition.map((item, index) => (
                        <div className={"dialog-row"} key={item.expeditionId}>
                            <Checkbox
                                id={item.expeditionId}
                                checked={item.sixmanAt}
                                // onChange={() =>
                                //     toggleCheckbox(exp.expeditionBossId, bossIndex)
                                // }
                                color="default"
                            />
                            <div className={"mr-2.5 w-1/6 "}>{item.serverNm}</div>
                            <div className={"mr-2.5 w-1/6"}>{item.itemLevel}</div>
                            <div className={"mr-2.5 w-1/5"}>{item.characterClassName}</div>
                            <div className={"mr-2.5 w-3/6"}>{item.characterNm}</div>
                        </div>

                    ))
                ) : (
                    <p>데이터가 없습니다.</p>
                )}

                
            </DialogContent>
            <CustomBtn label="저장" onClick={save} color="primary" variant="outlined" />
        </Dialog>
    );
};

export default SixmanDialog;
