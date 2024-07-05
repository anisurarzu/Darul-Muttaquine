import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

import "./effectiveCard.css";

// import required modules
import { EffectCards } from "swiper/modules";

export default function EffectiveCard() {
  return (
    <>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper bg-white">
        <SwiperSlide>
          <img
            className="h-[100px] w-full"
            src="https://swiperjs.com/demos/images/nature-1.jpg"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
      </Swiper>
    </>
  );
}
