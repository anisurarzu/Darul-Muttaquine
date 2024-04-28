import React from "react";
import Navbar from "../Navbar";
import HeroSection from "./HeroSection/HeroSection";
import MiddleHome from "./MiddleHome/MiddleHome";
import Fotter from "../Fotter";

export default function Home() {
  return (
    <div>
      {/* <Navbar /> */}
      <HeroSection />
      <MiddleHome />
      <Fotter />
    </div>
  );
}
