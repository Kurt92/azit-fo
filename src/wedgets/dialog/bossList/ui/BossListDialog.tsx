import {IUser} from "@/shared/types/UserInterface";
import {Checkbox, Dialog, DialogContent, DialogTitle} from "@mui/material";
import CustomBtn from "@/shared/components/Button/CustomBtn";
import React, {useEffect, useState} from "react";
import axios from "axios";


interface BossListDialogProps {
    userData: IUser | undefined; // 사용자 데이터
    open: boolean; // 다이얼로그 열림 여부
    onClose: () => void; // 닫기 핸들러
}

const BossListDialog: React.FC<BossListDialogProps> = ({userData, open, onClose}) => {

    const [bossListData, setBossListData] = useState<any>([]);


    const save = () => {

        const domain = process.env.NEXT_API_URL;
        axios
            .get(`${domain}/boss/list`,)
            .then((res) => {
                console.log(res);

            })
            .catch(() => {
                console.log('Failed find expedition');
            })
    }

    useEffect(() => {
        const domain = process.env.NEXT_API_URL;
        axios
            .get(`${domain}/boss/list`)
            .then((res) => {
                console.log("Boss List result : ", res.data.data);
                setBossListData(res.data.data);
            })
            .catch(() => {
                console.log('Failed find expedition');
            })
    }, [open]);
    useEffect(() => {
        console.log(bossListData)
    }, [bossListData]);

    return (
        <Dialog className={"dialog"} open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>캐릭터명</DialogTitle>
            <DialogContent>

            </DialogContent>
            <CustomBtn label="저장" onClick={save} color="primary" variant="outlined" />
        </Dialog>
    )

};

export default BossListDialog;