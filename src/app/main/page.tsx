import React from "react";
import BannerSlider from "@/shared/components/Slider/BannerSlider"


export default function main() {


    return (
        <>
            <div className={"flex flex-col items-center mt-4"}>
                <div className={"slider-container w-3/4"}>
                    <BannerSlider></BannerSlider>
                </div>

            </div>

            <div className={"board-container"}></div>

            <div className={"card-container"}></div>

        </>
    )
}