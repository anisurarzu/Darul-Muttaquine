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
import logo from "../../../images/dmf-logo.png";

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
      toast.error(err.response.data?.message);
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
      toast.error(err.response.data?.message);
    }
  };

  useEffect(() => {
    getAllProject();
    // getAllUserList();
  }, []);

  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const productTemplate = (product) => {
    return (
      <div className="" data-aos="fade-down">
        <ProjectCard rowData={product} />
      </div>
    );
  };
  return (
    <div data-aos="fade-down">
      {/* 1st part */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 pt-16 mx-4 lg:mx-32 xl:mx-32 ">
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
      <div
        className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-16 py-4 lg:py-24 xl:py-24 "
        style={{ background: "#F5F5F5" }}>
        <di className=" text-white lg:ml-20 xl:ml-20 ">
          <img className="rounded-lg" src={voulenteer} alt="" />
        </di>
        <div className=" text-white lg:mr-20 xl:mr-20">
          <img className="rounded-lg" src={eidCard} alt="" />
        </div>
      </div>
      {/* 3rd part */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 pt-16 mx-4 lg:mx-32 xl:mx-32 pb-8">
        {/* 1 */}
        <div className="grid grid-cols-5" data-aos="fade-down">
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
        <div className="grid grid-cols-5" data-aos="fade-down">
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
        <div className="grid grid-cols-3" data-aos="fade-down">
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
        <div className="card mx:8 lg:mx-32 xl:mx-32">
          <h3 className=" text-[19px] lg:text-[22px] xl:text-[23px] text-green-800 py-4 lg:py-8 xl:py-8  text-center font-semibold bangla-text">
            চলমান প্রজেক্ট সমূহ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1 pt-4 mx-2">
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
          <div className="flex flex-col items-center lg:flex-row lg:items-center py-2 gap-4 lg:gap-16 pb-8">
            <img className="h-[100px] w-[130px]" src={logo} alt="" />
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
