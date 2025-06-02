import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { Tag } from "primereact/tag";
import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";
import { coreAxios } from "../../../utilities/axios";
import { toast } from "react-toastify";
import ProjectCard from "../../../Pages/Dashboard/Project/ProjectCard";
import "./MiddleHome.css";

// Images
import icon1 from "../../../images/vecteezy_fund-raising-and-money-donation-illustration_6901910.jpg";
import icon2 from "../../../images/566.jpg";
import icon3 from "../../../images/vecteezy_food-and-groceries-donation-illustration_6916104.jpg";
import voulenteer from "../../../images/voluenteer.jpg";
import eidCard from "../../../images/eid-card.jpg";
import islamic1 from "../../../images/em040421n08.gif";
import islamic2 from "../../../images/animation-1.gif";
import islamic3 from "../../../images/animation-2.gif";
import logo from "../../../images/New-Main-2.png";

export default function MiddleHome() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    getAllProject();
  }, []);

  return (
    <div>
      {/* 1st Section: Islamic Motivational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 pt-16 mx-8 lg:mx-32 xl:mx-32">
        {[
          {
            icon: islamic1,
            title: "প্রতিদিন কুরআন পড়ুন",
            description:
              "কুরআন পড়ার প্রতি উদ্বুদ্ধ হন, কারণ এটি আমাদের জীবনে সঠিক পথ দেখায়, মানসিক শান্তি আনে এবং আল্লাহর নিকটবর্তী করে।",
          },
          {
            icon: islamic2,
            title: "শিশুকে ইসলামী শিক্ষা দিন",
            description:
              "আপনার শিশুকে ইসলামী শিক্ষা দিন, যাতে তারা ধর্মীয় মূল্যবোধ, নৈতিকতা এবং জীবনের সঠিক পথে চলার নির্দেশনা পায়।",
          },
          {
            icon: islamic3,
            title: "পরিবারের সঙ্গে সময় কাটান",
            description:
              "আপনার পরিবারের সঙ্গে সময় কাটান, কারণ এটি সম্পর্কের বন্ধনকে মজবুত করে, ভালবাসা ও সুখ বাড়ায় এবং একটি সুস্থ জীবন নিশ্চিত করে।",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="grid grid-cols-5 bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="col-span-2">
              <img className="w-full" src={item.icon} alt={item.title} />
            </div>
            <div className="col-span-3">
              <h3 className="text-[16px] lg:text-[20px] xl:text-[20px] font-bold bangla-text">
                {item.title}
              </h3>
              <hr className="w-[50px] h-1 bg-green-600 my-2" />
              <p className="text-[12px] lg:text-[14px] xl:text-[14px] bangla-text text-justify">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2nd Section: Volunteer and Eid Card */}
      <motion.div
        className="mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#BDDE98"
            fillOpacity="1"
            d="M0,160L48,133.3C96,107,192,53,288,53.3C384,53,480,107,576,117.3C672,128,768,96,864,112C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <div
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 px-8 lg:px-32 xl:px-32"
          style={{ background: "#BDDE98" }}
        >
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              className="rounded-lg shadow-lg"
              src={voulenteer}
              alt="Volunteer"
            />
          </motion.div>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              className="rounded-lg shadow-lg"
              src={eidCard}
              alt="Eid Card"
            />
          </motion.div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#BDDE98"
            fillOpacity="1"
            d="M0,160L48,133.3C96,107,192,53,288,53.3C384,53,480,107,576,117.3C672,128,768,96,864,112C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </motion.div>

      {/* 3rd Section: Donation, Scholarship, Food Donation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 pt-16 mx-8 lg:mx-32 xl:mx-32 pb-8">
        {[
          {
            icon: icon1,
            title: "দান করুন",
            description:
              "আপনার সমর্থনের মাধ্যমে আমরা সহযোগিতা ও উন্নয়নের পথে অগ্রসর হতে পারি। আপনার সহায়তা আমাদেরকে সমাজের কল্যাণে কাজ করতে উৎসাহিত করবে।",
          },
          {
            icon: icon2,
            title: "বৃত্তিতে যোগ দিন",
            description:
              "আপনার ভবিষ্যতের সাফল্যের দরজা খুলতে আমাদের বৃত্তি প্রোগ্রামে অংশগ্রহণ করুন! এটি আপনার শিক্ষা এবং ক্যারিয়ারকে এগিয়ে নিয়ে যেতে সাহায্য করবে।",
          },
          {
            icon: icon3,
            title: "খাদ্য দান",
            description:
              "খাদ্য দান শুধুমাত্র দেহকে পুষ্ট করে না, আত্মাকেও খাওয়ায় দয়ার উষ্ণতা। এটি মানুষের মধ্যে সহানুভূতি এবং মানবিকতা বৃদ্ধি করে।",
          },
          {
            icon: icon2,
            title: "চিকিৎসা সহায়তা",
            description:
              "রাসুলুল্লাহ (সাঃ) বলেছেন, 'যে ব্যক্তি তার ভাইয়ের চিকিৎসা সহায়তা করে, আল্লাহ তাকে পৃথিবীর সকল রোগ থেকে মুক্তি দিবেন।' চিকিৎসার জন্য সাহায্য করুন, মানুষের জীবন বাঁচান।",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="grid grid-cols-5 bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="col-span-3">
              <h3 className="text-[16px] lg:text-[20px] xl:text-[20px] font-bold bangla-text">
                {item.title}
              </h3>
              <hr className="w-[50px] h-1 bg-green-600 my-2" />
              <p className="text-[12px] lg:text-[14px] xl:text-[14px] bangla-text text-justify">
                {item.description}
              </p>
            </div>
            <div className="col-span-2">
              <img className="w-full" src={item.icon} alt={item.title} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 4th Section: Ongoing Projects */}
      <div className="py-8 bg-gray-100">
        <div className="mx-8 lg:mx-32 xl:mx-32">
          <h3 className="text-[19px] lg:text-[22px] xl:text-[23px] text-green-800 py-4 lg:py-8 xl:py-8 text-center font-semibold bangla-text">
            চলমান প্রজেক্ট সমূহ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4s gap-4 lg:gap-8 xl:gap-8 pt-4">
            {projects?.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <ProjectCard rowData={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 5th Section: About Darul Muttaqin Foundation */}
      <div className="mx-8 lg:mx-32 xl:mx-32 py-8">
        <h3 className="text-[19px] lg:text-[22px] xl:text-[23px] text-green-800 py-4 lg:py-8 xl:py-8 text-center font-semibold bangla-text">
          একনজরে দারুল মুত্তাক্বীন ফাউন্ডেশন
        </h3>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          <img className="w-[230px]" src={logo} alt="Darul Muttaqin Logo" />
          <div className="text-center lg:text-left">
            <h3 className="text-[16px] lg:text-[20px] xl:text-[20px] font-bold">
              কেন্দ্রীয় কার্যালয়
            </h3>
            <p className="py-2 text-[12px] lg:text-[14px] xl:text-[14px]">
              তক্তারচালা বাজার, মির্জাপুর, টাংগাইল, ঢাকা। <br />
              মোবাইলঃ ০১৭৯১৫৫৬১৮৪
            </p>
            <p className="py-2 text-[12px] lg:text-[14px] xl:text-[14px]">
              কার্যক্রম <br />
              শিক্ষা, গবেষণা, মানবসেবা
            </p>
          </div>
        </div>
      </div>

      {/* 6th Section: FAQ */}
      <div className="py-8 bg-gray-100">
        <div className="mx-8 lg:mx-32 xl:mx-32">
          <h3 className="text-[19px] lg:text-[22px] xl:text-[23px] text-green-800 py-4 lg:py-8 xl:py-8 text-center font-semibold bangla-text">
            প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[16px] lg:text-[18px] xl:text-[20px]">
                প্রশ্ন: কিভাবে আমি দান করতে পারি?
              </h4>
              <p className="text-[14px] lg:text-[16px] xl:text-[16px]">
                উত্তর: আমাদের ওয়েবসাইটে দানের জন্য একটি সহজ প্রক্রিয়া রয়েছে।
                আপনি আপনার পছন্দের দানটি নির্বাচন করে অনলাইনে নিরাপদে পেমেন্ট
                করতে পারেন।
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[16px] lg:text-[18px] xl:text-[20px]">
                প্রশ্ন: ফাউন্ডেশনটির প্রধান উদ্দেশ্য কি?
              </h4>
              <p className="text-[14px] lg:text-[16px] xl:text-[16px]">
                উত্তর: দারুল মুত্তাক্বীন ফাউন্ডেশন মূলত মানুষের কল্যাণে কাজ
                করছে। আমাদের মূল লক্ষ্য হলো শিক্ষা, গবেষণা, এবং মানবসেবায় অবদান
                রাখা।
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[16px] lg:text-[18px] xl:text-[20px]">
                প্রশ্ন: কি ধরণের প্রজেক্টের জন্য সাহায্য দেওয়া হয়?
              </h4>
              <p className="text-[14px] lg:text-[16px] xl:text-[16px]">
                উত্তর: আমরা বিভিন্ন সামাজিক প্রকল্প যেমন শিক্ষা সহায়তা, খাদ্য
                দান, স্বাস্থ্যসেবা, চিকিৎসা সহায়তা, এবং ধর্মীয় উদ্যোগ সমর্থন
                করি।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
