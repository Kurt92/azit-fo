'use client'

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {IconButton} from "@mui/material";
import {DataItem, Expedition} from "@/shared/types/ExpeditionInterface";

// props를 받으려니까 에러남. 이유는 타입스크립트는 타입을 명시적으로 해줘야함
// 임시로 any를 넣긴했으나 any를 넣으면 타입스크립트를 쓰는 이유가 없음
// export default function UserCard(props: any) {

// interface를 통해 진행하는방법
// /shared/types/ExpeditionInterface.ts에 따로 빼서 관리한다.
// state 인터페이스를 주입받는다
interface UserCardProps {
    dataItem: DataItem;
}

// 이방식은 함수표현식이라고 해서 클로저 export default UserCard; 를 따로 붙여줘야함
// 간단하게 에로우 펑션형이냐 아니냐 차이임. 에로우펑션의 경우 알듯이 기존펑션과 동작방식이 약간 다름.
// 찾아본 바로는 제네릭타입지원, 고차컴포넌트 활용에 유용하다고 해서 추후 다시 공부해서 이해하도록 할것.
// const UserCard: React.FC<UserCardProps> = ({ expeditions }) => {

// 아래방법은 함수선언형(기존 리엑트에서 하던 방식)인데
export default function UserCard({ dataItem }: UserCardProps) {

    const [isFavorite, setIsFavorite] = React.useState(false); // 즐겨찾기 상태 관리

    const toggleFavorite = () => {
        setIsFavorite((prev) => !prev); // 상태 토글
    };

    const matchedItemLevel = dataItem.expeditionList.find(
        (expedition) => expedition.characterNm === dataItem.mainCharacterNm
    )?.itemLevel || '';

    const matchedClassNm = dataItem.expeditionList.find(
        (expedition) => expedition.characterNm === dataItem.mainCharacterNm
    )?.characterClassName || '';


    console.log(dataItem)
    return (
        <Card sx={{ maxWidth: 345, margin:2, backgroundColor: '#424242'}}>
            <CardActionArea className={"flex flex-justify-between"}>
                {/*<CardMedia*/}
                {/*    component="img"*/}
                {/*    height="140"*/}
                {/*    image="/static/images/cards/contemplative-reptile.jpg"*/}
                {/*    alt="green iguana"*/}
                {/*/>*/}
                <IconButton component={"div"} onClick={toggleFavorite} sx={{ color: '#ffc107' }}>
                    {isFavorite ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
                <CardContent className={"flex-col "}>
                    <div className={"flex "}>
                        <Typography gutterBottom variant="body2" component="div"
                                    sx={{color: '#ffffff', fontSize: '11px'}}>
                            대표캐릭터
                        </Typography>
                        <Typography gutterBottom variant="body2" component="div"
                                    sx={{color: '#ffffff', fontSize: '11px'}}>
                            {matchedClassNm}
                        </Typography>
                    </div>
                    <div className={"flex "}>
                        <Typography sx={{color: '#ffffff', fontSize: '16px'}}>
                            {dataItem.mainCharacterNm}
                        </Typography>
                        <Typography sx={{color: '#ffffff', marginLeft: '1rem', fontSize: '12px'}}>
                            {matchedItemLevel} Lv
                        </Typography>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}