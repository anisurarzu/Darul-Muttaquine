import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./Slider.css";

import slider from "../../../images/banner-hero.png";

// import required modules
import { Parallax, Pagination, Navigation } from "swiper/modules";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import "../../../Pages/scholarship/scholarshipButton.css";

export default function Slider() {
  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        speed={400}
        parallax={true}
        pagination={{
          clickable: true,
        }}
        // navigation={true}
        modules={[Parallax, Pagination, Navigation]}
        className="h-[350px] lg:h-[500px] xl:h-[500px] p-2 lg:p-8 xl:p-8">
        <div
          slot="container-start"
          className="parallax-bg "
          /* style={{
            "background-image":
              "url(https://i.ibb.co/S6ChvJb/Nature-Happy-Earth-Day-Banner.png)",
          }} */
          data-swiper-parallax="-23%"></div>
        <SwiperSlide className="h-[700px]">
          <div
            className=" bangla-text text-[25px] lg:text-[37px] xl:text-[37px] p-2 lg:p-8 xl:p-8 text-center  font-semibold py-2 drop-shadow-xl"
            data-swiper-parallax="-300">
            দারুল মুত্তাক্বীন শিহ্মাবৃত্তি ২০২৪
          </div>
          <div
            className=" p-2 lg:p-8 xl:p-8 text-[15px] lg:text-[24px] xl:text-[24px] text-center bangla-text drop-shadow-md"
            data-swiper-parallax="-200">
            "শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও
            কল্যাণকর কাজের মধ্যে নিজেদের নিয়োজিত রাখা"
          </div>
          <div
            className="text text-justify  mx-2 my-2 lg:mx-56 xl:mx-56 rounded-lg text-center "
            data-swiper-parallax="-100">
            <p className="px-2 lg:px-[15px] xl:px-[15px] text-[12px] lg:text-[20px] xl:[20px] p-2 lg:p-8 xl:p-8 bangla-text bangla-text lg:leading:10 xl:leading-10">
              এই কর্মসূচির উদ্দেশ্য হল মেধাবী ও দরিদ্র শিক্ষার্থীদের উচ্চতর
              শিক্ষার সুযোগ প্রদান করা যাতে তারা তাদের শিক্ষাজীবনে অগ্রগতি লাভ
              করতে পারে এবং সমাজে উন্নতি করতে পারে। DMF স্কলারশিপের মূল
              অনুপ্রেরণা হল সাধারণ শিক্ষা ও ইসলামিক শিক্ষার উপর গুরুত্বারোপ করা।
              এই দুটি শিক্ষার সংমিশ্রণ একজন সৎ ও সুশৃঙ্খল মানুষের জন্য অত্যন্ত
              প্রয়োজনীয়।.........{" "}
              <span className="cursor-pointer">বিস্তারিত পড়ুন</span>
            </p>
          </div>
          <div className="flex items-center justify-center mt-8 lg:mt-16 xl:mt-16">
            <NavLink to="/scholarship-public">
              <scholarshipButton className="flex justify-center items-center font-semibold border border-[#62AB00] hover:no-underline">
                <span className="text-white ">শিহ্মাবৃত্তি</span>
              </scholarshipButton>
            </NavLink>
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-[700px]">
          <div
            className=" bangla-text text-[25px] lg:text-[37px] xl:text-[37px] p-2 lg:p-8 xl:p-8 text-center  font-semibold py-2 drop-shadow-xl"
            data-swiper-parallax="-300">
            দারুল মুত্তাক্বীন ফাউন্ডেশন
          </div>
          <div
            className=" p-2 lg:p-8 xl:p-8 text-[15px] lg:text-[24px] xl:text-[24px] text-center bangla-text drop-shadow-md"
            data-swiper-parallax="-200">
            "শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও
            কল্যাণকর কাজের মধ্যে নিজেদের নিয়োজিত রাখা"
          </div>
          <div
            className="text text-justify  mx-2 my-2 lg:mx-56 xl:mx-56 rounded-lg text-center "
            data-swiper-parallax="-100">
            <p className="px-2 lg:px-[15px] xl:px-[15px] text-[12px] lg:text-[20px] xl:[20px] p-2 lg:p-8 xl:p-8 bangla-text bangla-text lg:leading:10 xl:leading-10">
              দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক শিক্ষা, দাওয়াহ
              ও পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক প্রতিষ্ঠান। পরের মঙ্গল কামনা
              (অন্যের জন্য আল্লাহর নিকট প্রার্থনা); পরের জন্য কিছু করার
              মানসিকতাই একদিন ব্যক্তি আমিকে ভালো মানুষ হতে সহায়তা করে। আমরা
              সবাইকে ভালো মানুষ হতে উপদেশ দিই কিন্তু ভালো মানুষ হয়ে উঠার
              পথ-পরিক্রমা অনেক ক্ষেত্রেই বাতলে দিই না।
            </p>
          </div>
          <div className="flex items-center justify-center mt-8 lg:mt-16 xl:mt-16">
            <NavLink to="/scholarship-public">
              <scholarshipButton className="flex justify-center items-center font-semibold border border-[#62AB00] hover:no-underline">
                <span className="text-white ">শিহ্মাবৃত্তি</span>
              </scholarshipButton>
            </NavLink>
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-[700px]">
          <div
            className=" bangla-text text-[25px] lg:text-[37px] xl:text-[37px] p-2 lg:p-8 xl:p-8 text-center  font-semibold py-2 drop-shadow-xl"
            data-swiper-parallax="-300">
            দারুল মুত্তাক্বীন ফাউন্ডেশন
          </div>
          <div
            className=" p-2 lg:p-8 xl:p-8 text-[15px] lg:text-[24px] xl:text-[24px] text-center bangla-text drop-shadow-md"
            data-swiper-parallax="-200">
            "শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও
            কল্যাণকর কাজের মধ্যে নিজেদের নিয়োজিত রাখা"
          </div>
          <div
            className="text text-justify  mx-2 my-2 lg:mx-56 xl:mx-56 rounded-lg text-center "
            data-swiper-parallax="-100">
            <p className="px-2 lg:px-[15px] xl:px-[15px] text-[12px] lg:text-[20px] xl:[20px] p-2 lg:p-8 xl:p-8 bangla-text bangla-text lg:leading:10 xl:leading-10">
              দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক শিক্ষা, দাওয়াহ
              ও পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক প্রতিষ্ঠান। পরের মঙ্গল কামনা
              (অন্যের জন্য আল্লাহর নিকট প্রার্থনা); পরের জন্য কিছু করার
              মানসিকতাই একদিন ব্যক্তি আমিকে ভালো মানুষ হতে সহায়তা করে। আমরা
              সবাইকে ভালো মানুষ হতে উপদেশ দিই কিন্তু ভালো মানুষ হয়ে উঠার
              পথ-পরিক্রমা অনেক ক্ষেত্রেই বাতলে দিই না।
            </p>
          </div>
          <div className="flex items-center justify-center mt-8 lg:mt-16 xl:mt-16">
            <NavLink to="/scholarship-public">
              <scholarshipButton className="flex justify-center items-center font-semibold border border-[#62AB00] hover:no-underline">
                <span className="text-white ">শিহ্মাবৃত্তি</span>
              </scholarshipButton>
            </NavLink>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
