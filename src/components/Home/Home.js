import React, { useEffect, useState } from "react";
import { Skeleton } from "antd";
import DonationBox from "../DnationBox/DonationBox";
import MiddleHome from "./MiddleHome/MiddleHome";
import HelperCompany from "../HelperCompany/HelperCompany";
import "./home.css";
import tempBanner from "../../images/New-Banner-2025-2.svg";
import eidBanner from "../../images/eduladha.jpg";

export default function Home() {
  const [show, setShow] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleBannerLoad = () => {
    setBannerLoaded(true);
  };

  return (
    <div>
      {/* temp banner with full-width skeleton loading */}
      <div className="w-full relative">
        {!bannerLoaded && (
          <div className="w-full">
            <Skeleton.Image
              active
              className="!w-full !h-auto"
              style={{
                aspectRatio: "16/9", // Adjust this to match your banner's aspect ratio
                minHeight: "200px", // Minimum height while maintaining aspect ratio
              }}
            />
          </div>
        )}
        <div style={{ display: bannerLoaded ? "block" : "none" }}>
          <img
            src={tempBanner}
            alt="Foundation Banner"
            className="w-full h-auto object-cover"
            onLoad={handleBannerLoad}
          />
        </div>
      </div>

      {/* Rest of your existing code */}
      <div className="relative overflow-hidden h-12 bg-white">
        <div
          style={{ color: "#4AA44B" }}
          className="absolute whitespace-nowrap animate-slide text-[15px] pt-2"
        >
          দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক শিক্ষা, দাওয়াহ ও
          পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক প্রতিষ্ঠান। "শুধুমাত্র আল্লাহর
          সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে
          নিজেদের নিয়োজিত রাখা"
        </div>
      </div>

      <DonationBox />

      <MiddleHome />
      {/* <HelperCompany /> */}
    </div>
  );
}
