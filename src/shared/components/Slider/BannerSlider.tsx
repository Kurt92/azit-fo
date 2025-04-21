'use client';

import './BannerSlider.css';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from "react";
import axios from "axios";

type Event = {
    Thumbnail: string;
    Title: string;
    Link: string;
};

const defaultSlide: Event = {
    Thumbnail: "/img/slider/default-banner.jpg",
    Title: "Default Banner",
    Link: "#",
};

export default function BannerSlider() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        axios
            .get("/api/back/event", { withCredentials: true })
            .then((res) => {
                setEvents(res.data.data.events || []);
            })
            .catch((err) => {
                console.error("슬리이더 조회 실패:", err);
            });
    }, []);

    const defaultSlides: Event[] = [defaultSlide, defaultSlide, defaultSlide];
    const slides = events.length > 0 ? events : defaultSlides;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
    };

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {slides.map((item, idx) => (
                    <a href={item.Link} key={idx}>
                        <img
                            src={item.Thumbnail}
                            alt={item.Title}
                        />
                    </a>
                ))}
            </Slider>
        </div>
    );
}
