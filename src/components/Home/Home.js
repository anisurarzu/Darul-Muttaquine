import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import HeroSection from "./HeroSection/HeroSection";
import MiddleHome from "./MiddleHome/MiddleHome";
import Fotter from "../Fotter";
import DonationBox from "../DnationBox/DonationBox";
import HelperCompany from "../HelperCompany/HelperCompany";
import Slider from "./Slider/Slider";

import "./home.css";
import demo from "../../images/GIF/animation-1.gif";
import tempBanner from "../../images/web.png";

export default function Home() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <div>
      {/* <Navbar /> */}
      <Slider />
      {/*   <HeroSection /> */}
      <div className="relative overflow-hidden h-12 bg-white">
        <div
          style={{ color: "#4AA44B" }}
          className="absolute whitespace-nowrap animate-slide text-[15px] pt-2 ">
          দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক শিক্ষা, দাওয়াহ ও
          পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক প্রতিষ্ঠান। "শুধুমাত্র আল্লাহর
          সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে
          নিজেদের নিয়োজিত রাখা"
        </div>
      </div>
      {/* temp banner */}

      {/*  <div>
        <img src={tempBanner} alt="" />
      </div> */}

      <DonationBox />
      <MiddleHome />
      <HelperCompany />
    </div>
  );
}
