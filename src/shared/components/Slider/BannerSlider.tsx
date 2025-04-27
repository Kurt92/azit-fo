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

    const domain = process.env.NEXT_API_URL;
    useEffect(() => {
        // axios
        //     .get(`${domain}/api/back/event`, { withCredentials: true })
        //     .then((res) => {
        //         setEvents(res.data.data.events || []);
        //     })
        //     .catch((err) => {
        //         console.error("슬라이더 조회 실패:", err);
        //     });
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
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                }
            }
        ],
        lazyLoad: "ondemand" as const,
        accessibility: true,
    };

    return (
        <div className="slider-container" role="region" aria-label="이벤트 배너 슬라이더">
            <Slider {...settings}>
                {slides.map((item, idx) => (
                    <div key={idx} className="slider-item">
                        <a 
                            href={item.Link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label={`${item.Title} 이벤트로 이동`}
                        >
                            <img
                                src={item.Thumbnail}
                                alt={item.Title}
                                loading="lazy"
                                className="slider-image"
                            />
                        </a>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
