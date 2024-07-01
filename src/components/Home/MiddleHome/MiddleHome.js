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
            <p className="text-[10px] lg:text-[14px] xl:text-[14px] bangla-text text-justify">
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
            <h3 className="text-[13px] lg:text-[20px] xl:text-[20px] bangla-text">
              শিশুকে ইসলামী শিক্ষা দিন
            </h3>
            <hr className="w-[50px] h-2" />
            <p className="text-[10px] lg:text-[14px] xl:text-[14px] bangla-text text-justify">
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
            <p className="text-[10px] lg:text-[14px] xl:text-[14px] bangla-text text-justify">
              "আপনার পরিবারের সঙ্গে সময় কাটান, কারণ এটি সম্পর্কের বন্ধনকে মজবুত
              করে, ভালবাসা ও সুখ বাড়ায় এবং একটি সুস্থ জীবন নিশ্চিত করে।"
            </p>
          </div>
        </div>
        {/* 4 */}
      </div>
      {/* 2nd part */}
      <div className="lg:mx-32 xl:mx-32 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-16 py-4 lg:py-24 xl:py-24 ">
        <di className=" text-white">
          <img src={voulenteer} alt="" />
        </di>
        <di className=" text-white">
          <img src={eidCard} alt="" />
        </di>
      </div>
      {/* 3rd part */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 pt-16 mx-4 lg:mx-32 xl:mx-32 ">
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
      <div className="card mx:8 lg:mx-32 xl:mx-32 py-8">
        <h3 className=" text-[19px] lg:text-[22px] xl:text-[23px] text-green-800 py-4 lg:py-8 xl:py-8 underline text-center font-semibold">
          DMF RUNNING PROJECTS
        </h3>
        <Carousel
          value={projects}
          numScroll={1}
          numVisible={4}
          responsiveOptions={responsiveOptions}
          itemTemplate={productTemplate}
        />
      </div>
      {/*  <di className=" text-white pt-2 lg:pt-16 xl:pt-20">
        <img src={eidCard} alt="" />
      </di> */}
    </div>
  );
}
