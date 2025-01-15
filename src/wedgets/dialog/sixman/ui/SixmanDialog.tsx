import React, {useEffect, useState} from "react";
import {Dialog, DialogTitle, DialogContent, Box, Checkbox} from "@mui/material";
import { IUser } from "@/shared/types/UserInterface";
import "./SixmanDialog.css"
import axios from "axios";
import UserCard from "@/shared/components/Card/UserCard";
import CustomBtn from "@/shared/components/Button/CustomBtn";
import {IExpedition} from "@/shared/types/ExpeditionInterface";

interface SixmanDialogProps {
    userData: IUser | undefined; // 사용자 데이터
    open: boolean; // 다이얼로그 열림 여부
    onClose: () => void; // 닫기 핸들러
}
interface EditSixman {
    accountId: string;
    charaterNm: string;
    sixmanName: boolean;
}

const SixmanDialog: React.FC<SixmanDialogProps> = ({ userData, open, onClose }) => {

    const [expedition, setExpedition] = useState<IExpedition[]>([]);
    const [checkboxStates, setCheckboxStates] = useState<{ [key: string]: boolean }>({});

    const save = () => {

        const domain = process.env.NEXT_API_URL;
        axios
            .post(`${domain}/expedition/${userData?.accountId}`, {expedition},)
            .then((res) => {
                console.log(res);
                onClose();
            })
            .catch(() => {
                console.log('Failed find expedition');
            })
    }

    const toggleCheckbox = (expeditionId: string) => {
        setExpedition((prev) => {
            // 현재 체크된 항목 수 계산
            const checkedCount = prev.filter((item) => item.sixmanAt).length;

            // 현재 클릭한 항목이 체크 해제 상태인지 확인
            const isCurrentlyChecked = prev.find((item) => item.expeditionId === expeditionId)?.sixmanAt;

            // 체크된 항목이 6개 이상이고 현재 항목이 체크되지 않은 상태라면 경고
            if (checkedCount >= 6 && !isCurrentlyChecked) {
                alert("최대 6개의 식스맨만 선택할 수 있습니다.");
                return prev; // 상태 변경하지 않음
            }

            // 상태 업데이트: 체크박스 토글
            return prev.map((item) =>
                item.expeditionId === expeditionId
                    ? { ...item, sixmanAt: !item.sixmanAt }
                    : item
            );
        });

    };

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

                {expedition.length > 0 ? (
                    expedition.map((item, index) => (
                        <div className={"dialog-row"} key={item.expeditionId}>
                            <Checkbox
                                id={item.expeditionId}
                                checked={item.sixmanAt}
                                onClick={() => {
                                    if (item.characterNm === expedition[0].mainCharacterNm){
                                        alert("대표캐릭터는 식스맨에 반드시 포함되어야 합니다.");
                                        return;
                                    }
                                    toggleCheckbox(item.expeditionId);
                                }}
                                aria-disabled={()=> item.characterNm === expedition[0].mainCharacterNm}
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
