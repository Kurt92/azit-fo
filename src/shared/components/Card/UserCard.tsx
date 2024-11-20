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

export default function UserCard() {

    const [isFavorite, setIsFavorite] = React.useState(false); // 즐겨찾기 상태 관리

    const toggleFavorite = () => {
        setIsFavorite((prev) => !prev); // 상태 토글
    };

    return (
        <Card sx={{ maxWidth: 345, margin:2, backgroundColor: '#424242'}}>
            <CardActionArea className={"flex"}>
                {/*<CardMedia*/}
                {/*    component="img"*/}
                {/*    height="140"*/}
                {/*    image="/static/images/cards/contemplative-reptile.jpg"*/}
                {/*    alt="green iguana"*/}
                {/*/>*/}
                <IconButton component={"div"} onClick={toggleFavorite} sx={{ color: '#ffc107' }}>
                    {isFavorite ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
                <CardContent className={"flex-col"}>
                    <Typography gutterBottom variant="body2" component="div" sx={{ color: '#ffffff', fontSize: '12px'}}>
                        대표캐릭터
                    </Typography>
                    <div className={"flex"}>
                        <Typography sx={{ color: '#ffffff', fontSize: '18px' }}>
                            코코의무딜링호흡머신
                        </Typography>
                        <Typography sx={{ color: '#ffffff', marginLeft: '1rem', fontSize: '12px'}}>
                            1640Lv
                        </Typography>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}