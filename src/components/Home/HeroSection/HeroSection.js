import { Carousel } from "antd";
import React from "react";
import "primeicons/primeicons.css";

import bannerImage from "../../../images/home-banner-1.jpg";
import bannerImage2 from "../../../images/home-banner-2.jpg";

export default function HeroSection() {
  const contentStyle = {
    lineHeight: "1.5",
    textAlign: "center",
    background: "#F4F8FB",
  };

  return (
    <div>
      <Carousel autoplay>
        <div>
          <div className="" style={contentStyle}>
            <div className="hero-div">
              <img
                className="lg:h-[670px] xl:h-[679px] w-full"
                src={bannerImage}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="hero-div">
          <img
            className="lg:h-[670px] xl:h-[679px] w-full"
            src={bannerImage2}
            alt=""
          />
        </div>
      </Carousel>
    </div>
  );
}
