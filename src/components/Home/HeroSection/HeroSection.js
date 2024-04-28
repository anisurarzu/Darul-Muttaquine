import { Carousel } from "antd";
import React from "react";
import "primeicons/primeicons.css";

export default function HeroSection() {
  const contentStyle = {
    height: "560px",
    lineHeight: "160px",
    textAlign: "center",
    background: "#F4F8FB",
  };

  return (
    <div>
      <Carousel autoplay>
        <div className="">
          <div className="grid grid-cols-2" style={contentStyle}>
            <div>
              <h1 className="text-8xl font-bold pt-[170px] font-mono">
                Child Care Book
              </h1>
              <h4 className="text-xl  pt-[15px] font-mono pl-[100px] text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. It is a long established fact that a reader.
                <br />
                <br />
                <br />
                <br />
                <span className="border border-black py-[15px] px-16 cursor-pointer   ">
                  SHOP NOW <span className="pi pi-cart-plus pl-1"></span>
                </span>
              </h4>
            </div>
            <div className="first-div m-20 ml-[160px] "></div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2" style={contentStyle}>
            <div>
              <h1 className="text-8xl font-bold pt-[170px] font-mono">
                Yoga Lesson Non
              </h1>
              <h4 className="text-xl  pt-[15px] font-mono pl-[100px] text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. It is a long established fact that a reader.
                <br />
                <br />
                <br />
                <br />
                <span className="border border-black py-[15px] px-16 cursor-pointer   ">
                  SHOP NOW <span className="pi pi-cart-plus pl-1"></span>
                </span>
              </h4>
            </div>
            <div className="second-div m-20 ml-[160px] "></div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2" style={contentStyle}>
            <div>
              <h1 className="text-8xl font-bold pt-[170px] font-mono">
                Child Care Book
              </h1>
              <h4 className="text-xl  pt-[15px] font-mono pl-[100px] text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. It is a long established fact that a reader.
                <br />
                <br />
                <br />
                <br />
                <span className="border border-black py-[15px] px-16 cursor-pointer   ">
                  SHOP NOW <span className="pi pi-cart-plus pl-1"></span>
                </span>
              </h4>
            </div>
            <div className="first-div m-20 ml-[160px] "></div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
