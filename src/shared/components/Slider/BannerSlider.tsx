'use client'

import './BannerSlider.css'
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useEffect, useState} from "react";
import axios from "axios";

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
};

type Event = {
    Thumbnail: string;
    Title: string;
    Link: string;
};

function BannerSlider() {

    const [events, setEvents] = useState<Event[]>([]);
    const [bannerImg, setBannerImg] = useState();
    const [link, setLink] = useState();

    useEffect(() => {
        axios.get("/api/back/event", {withCredentials: true,})
            .then((res)=>{
                // console.log(res.data.data.events);
                            })
            .catch()
    }, []);

    return (
        <Slider {...settings}>
            {events.map((item, index)=> (
                <div key={index}>
                    <img src={item.Thumbnail} alt={item.Title} />
                </div>
            ))}
        </Slider>
    );
}

export default BannerSlider;
