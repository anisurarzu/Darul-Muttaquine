import React from "react";
import Navbar from "../Navbar";
import HeroSection from "./HeroSection/HeroSection";
import MiddleHome from "./MiddleHome/MiddleHome";
import Fotter from "../Fotter";
import DonationBox from "../DnationBox/DonationBox";
import HelperCompany from "../HelperCompany/HelperCompany";

export default function Home() {
  return (
    <div>
      {/* <Navbar /> */}

      <HeroSection />
      <DonationBox />
      <MiddleHome />
      <HelperCompany />
    </div>
  );
}
