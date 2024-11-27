'use client'

import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
};

function BannerSlider() {
    return (
        <Slider {...settings}>
            <div>
                <img src="/img/logo/logo_sample.png" alt="배너 1" />
            </div>
            <div>
                <img src="/img/logo/logo_sample.png" alt="배너 2" />
            </div>
            {/* 추가 배너 */}
        </Slider>
    );
}

export default BannerSlider;
