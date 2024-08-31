import React, { useEffect, useState } from "react";

import icon1 from "../../../images/vecteezy_fund-raising-and-money-donation-illustration_6901910.jpg";
import icon2 from "../../../images/566.jpg";
import icon3 from "../../../images/vecteezy_food-and-groceries-donation-illustration_6916104.jpg";

import icon4 from "../../../images/icon04_small.png";
import voulenteer from "../../../images/voluenteer.jpg";
import eidCard from "../../../images/eid-card.jpg";
import islamic1 from "../../../images/em040421n08.gif";
import islamic2 from "../../../images/animation-1.gif";
import islamic3 from "../../../images/animation-2.gif";
import logo from "../../../images/dmf-logo-2.png";

import { Tag } from "primereact/tag";

import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";
import { coreAxios } from "../../../utilities/axios";
import { toast } from "react-toastify";
import ProjectCard from "../../../Pages/Dashboard/Project/ProjectCard";

import "./MiddleHome.css";

export default function MiddleHome() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const getAllProject = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/project-info`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        setLoading(false);
        setProjects(sortedData);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    }
  };
  const getAllUserList = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        setLoading(false);
        setUsers(sortedData);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllProject();
    // getAllUserList();
  }, []);

  return (
    <div>
      {/* 1st part */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 pt-16 mx-8 lg:mx-32 xl:mx-32 ">
        {/* 1 */}

        <div className="grid grid-cols-5">
          <div className="col-span-2 ">
            <img className="w-full" src={islamic1} alt="" />
          </div>
          <div className="col-span-3  ">
            <h3 className="text-[13px] lg:text-[20px] xl:text-[20px] bangla-text">
              প্রতিদিন কুরআন পড়ুন
            </h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[10px] lg:text-[14px] xl:text-[14px] bangla-text text-justify pr-4">
              "কুরআন পড়ার প্রতি উদ্বুদ্ধ হন, কারণ এটি আমাদের জীবনে সঠিক পথ
              দেখায়, মানসিক শান্তি আনে এবং আল্লাহর নিকটবর্তী করে।"
            </p>
          </div>
        </div>
        {/* 2 */}
        <div className="grid grid-cols-5">
          <div className="col-span-2 ">
            <img className="w-full" src={islamic2} alt="" />
          </div>
          <div className="col-span-3 ">
            <h3 className="text-[13px] lg:text-[20px] xl:text-[20px] bangla-text ">
              শিশুকে ইসলামী শিক্ষা দিন
            </h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[10px] lg:text-[14px] xl:text-[14px] bangla-text text-justify pr-4">
              "আপনার শিশুকে ইসলামী শিক্ষা দিন, যাতে তারা ধর্মীয় মূল্যবোধ,
              নৈতিকতা এবং জীবনের সঠিক পথে চলার নির্দেশনা পায়।"
            </p>
          </div>
        </div>
        {/* 3 */}
        <div className="grid grid-cols-5">
          <div className="col-span-2">
            <img className="w-full" src={islamic3} alt="" />
          </div>
          <div className="col-span-3">
            <h3 className="text-[13px] lg:text-[20px] xl:text-[20px] bangla-text">
              পরিবারের সঙ্গে সময় কাটান
            </h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[10px] lg:text-[14px] xl:text-[14px] bangla-text text-justify pr-4">
              "আপনার পরিবারের সঙ্গে সময় কাটান, কারণ এটি সম্পর্কের বন্ধনকে মজবুত
              করে, ভালবাসা ও সুখ বাড়ায় এবং একটি সুস্থ জীবন নিশ্চিত করে।"
            </p>
          </div>
        </div>
        {/* 4 */}
      </div>

      {/* 2nd part */}

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#BDDE98"
          fill-opacity="1"
          d="M0,160L48,133.3C96,107,192,53,288,53.3C384,53,480,107,576,117.3C672,128,768,96,864,112C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      <div
        className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-16 "
        style={{ background: "#BDDE98" }}>
        <di className=" text-white lg:ml-20 xl:ml-20 ">
          <img className="rounded-lg" src={voulenteer} alt="" />
        </di>
        <div className=" text-white lg:mr-20 xl:mr-20">
          <img className="rounded-lg" src={eidCard} alt="" />
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#BDDE98"
          fill-opacity="1"
          d="M0,160L48,133.3C96,107,192,53,288,53.3C384,53,480,107,576,117.3C672,128,768,96,864,112C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
      </svg>
      {/* 3rd part */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 pt-16 mx-12 lg:mx-32 xl:mx-32 pb-8">
        {/* 1 */}
        <div className="grid grid-cols-5">
          <div className="col-span-3">
            <h3 className="text-[13px] lg:text-[20px] xl:text-[20px] bangla-text">
              দান করুন
            </h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[10px] lg:text-[14px] xl:text-[14px] bangla-text text-justify">
              "আপনার সমর্থনের মাধ্যমে আমরা সহযোগিতা ও উন্নয়নের পথে অগ্রসর হতে
              পারি। আপনার সহায়তা আমাদেরকে সমাজের কল্যাণে কাজ করতে উৎসাহিত
              করবে।"
            </p>
          </div>
          <div className="col-span-2">
            <img className="w-full " src={icon1} alt="" />
          </div>
        </div>
        {/* 2 */}
        <div className="grid grid-cols-5">
          <div className="col-span-3 ">
            <h3 className="text-[13px] lg:text-[20px] xl:text-[20px] bangla-text">
              বৃত্তিতে যোগ দিন
            </h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[10px] lg:text-[14px] xl:text-[14px] bangla-text text-justify">
              "আপনার ভবিষ্যতের সাফল্যের দরজা খুলতে আমাদের বৃত্তি প্রোগ্রামে
              অংশগ্রহণ করুন! এটি আপনার শিক্ষা এবং ক্যারিয়ারকে এগিয়ে নিয়ে যেতে
              সাহায্য করবে।"
            </p>
          </div>
          <div className="col-span-2">
            <img className="w-full " src={icon2} alt="" />
          </div>
        </div>
        {/* 3 */}
        <div className="grid grid-cols-3">
          <div className="col-span-2 lg:col-span-2 xl:col-span-2">
            <h3 className="text-[13px] lg:text-[20px] xl:text-[20px] bangla-text">
              খাদ্য দান
            </h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[10px] lg:text-[14px] xl:text-[14px] bangla-text text-justify">
              "খাদ্য দান শুধুমাত্র দেহকে পুষ্ট করে না, আত্মাকেও খাওয়ায় দয়ার
              উষ্ণতা। এটি মানুষের মধ্যে সহানুভূতি এবং মানবিকতা বৃদ্ধি করে।"
            </p>
          </div>
          <div className="col-span-1 lg:col-span-1 xl:col-span-1">
            <img className="w-full" src={icon3} alt="" />
          </div>
        </div>
      </div>
      {/* 4th part */}
      <div className=" py-8" style={{ background: "#F5F5F5" }}>
        <div className=" mx:8 lg:mx-32 xl:mx-32">
          <h3 className=" text-[19px] lg:text-[22px] xl:text-[23px] text-green-800 py-4 lg:py-8 xl:py-8  text-center font-semibold bangla-text">
            চলমান প্রজেক্ট সমূহ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 lg:gap-8 xl:gap-8 pt-4 mx-12 lg:mx-2 xl:mx-2">
            {projects?.map((project, index) => (
              <div key={index}>
                <ProjectCard rowData={project} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 
     একনজরে  দারুল মুত্তাক্বীন ফাউন্ডেশন
      */}

      <div className="mx-2 lg:mx-28 xl:mx-28 py-4">
        <h3 className="text-[19px] lg:text-[22px] xl:text-[23px] text-green-800 py-4 lg:py-8 xl:py-8 text-center font-semibold bangla-text">
          একনজরে দারুল মুত্তাক্বীন ফাউন্ডেশন
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          <div className="hidden lg:block"></div>
          <div className="flex flex-col items-center lg:flex-row lg:items-center py-2 gap-4 lg:gap-16 xl:gap-20 pb-8">
            <img className=" w-[230px]" src={logo} alt="" />
            <div className="text-center lg:text-left">
              <h3 className="text-[13px] lg:text-[17px] xl:text-[17px]">
                কেন্দ্রীয় কার্যালয়
              </h3>
              <p className="py-2 text-[10px] lg:text-[12px] xl:text-[12px]">
                তক্তারচালা বাজার,মির্জাপুর,টাংগাইল,ঢাকা। <br />
                মোবাইলঃ 01791556184
              </p>
              <p className="py-2 text-[10px] lg:text-[12px] xl:text-[12px]">
                কার্যক্রম <br />
                শিক্ষা, গবেষণা, মানবসেবা
              </p>
            </div>
          </div>
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
}
