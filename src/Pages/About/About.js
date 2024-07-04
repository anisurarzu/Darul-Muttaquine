import React, { useEffect, useState } from "react";
import ProfileCard from "../Dashboard/Profile/ProfileCard";
import { coreAxios } from "../../utilities/axios";
import { toast } from "react-toastify";
import { Alert, Spin, Steps } from "antd";
import ProjectCard from "../Dashboard/Project/ProjectCard";
import axios from "axios";

export default function About() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tabNumber, setTabNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const reloadUntilToken = () => {
    if (!localStorage.getItem("token")) {
      // Reload the page if token is not found
      window.location.reload();
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

  const items1 = [
    {
      title: ` পবিত্র কুরআন ও আল্লাহর রাসুল মুহাম্মাদ (সাল্লাল্লাহু আলাইহি
                    ওয়া সাল্লাম)-এর সুন্নাহ তথা কর্মনীতিই আস-সুন্নাহ ফাউন্ডেশনের
                    মূল আদর্শ।`,
    },
    {
      title: `কুরআন-সুন্নাহকে সালাফে সালিহীনের ব্যাখ্যার আলোকে গ্রহণ করা।`,
    },
    {
      title: `আহলুস-সুন্নাহ ওয়াল-জামা‘আহর আক্বীদা ও দৃষ্টিভঙ্গি লালন করা।`,
    },
    {
      title: `শিরকমুক্ত ঈমান ও বিদ‘আতমুক্ত আমলের প্রতি আহ্বান করা।`,
    },
    {
      title: `উম্মাহর ঐক্য ও সংহতির জন্যে কাজ করা।`,
    },
    {
      title: `রাজনৈতিক কর্ম ও অবস্থান গ্রহণ থেকে বিরত থাকা এবং দলমত নির্বিশেষে সকলের বৃহত্তর কল্যাণে কাজ করে যাওয়া।`,
    },
  ];

  const items2 = [
    {
      title: ` দরিদ্র ও অসহায় পরিবারের জন্য খাদ্য, বস্ত্র ও আশ্রয়ের
                  ব্যবস্থা করা।`,
    },
    {
      title: `মেধাবী ও আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের জন্য শিক্ষা বৃত্তি
  প্রদান করা।`,
    },
    {
      title: `সাধারণ ও ইসলামিক শিক্ষার সমন্বয়ে একটি আধুনিক মাদ্রাসা
  প্রতিষ্ঠা করা।`,
    },
    {
      title: `স্বাস্থ্যসেবা ও চিকিৎসা সহায়তা প্রদান।`,
    },
    {
      title: `প্রাকৃতিক দুর্যোগ ও জরুরি পরিস্থিতিতে ত্রাণ সহায়তা প্রদান।`,
    },
    {
      title: `সাধারণ শিক্ষা ও ইসলামিক শিক্ষার প্রচার ও প্রসার।`,
    },
  ];
  const items3 = [
    {
      title: ` প্রাজ্ঞ আলেম ও নিবেদিতপ্রাণ দা‘য়ী ইলাল্লাহ গড়ে তুলতে কুরআন-সুন্নাহর মৌলিক শিক্ষা সম্বলিত আধুনিক যুগোপযোগী পাঠক্রম ও পাঠ্যপুস্তক প্রণয়ন এবং মাদরাসা প্রতিষ্ঠা।`,
    },
    {
      title: `মেধাবী ও আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের জন্য শিক্ষা বৃত্তি
  প্রদান করা।`,
    },

    {
      title: `স্বাস্থ্যসেবা ও চিকিৎসা সহায়তা প্রদান।`,
    },
    {
      title: `প্রাকৃতিক দুর্যোগ ও জরুরি পরিস্থিতিতে ত্রাণ সহায়তা প্রদান।`,
    },
    {
      title: `উচ্চতর ইলমী গবেষণাকেন্দ্র।`,
    },
    {
      title: `সাধারণ শিক্ষা ও ইসলামিক শিক্ষার প্রচার ও প্রসার।`,
    },
  ];
  const items4 = [
    {
      title: ` ফাউন্ডেশনের প্রতিষ্ঠাতা সদস্যগণের দানের অর্থে ক্রীত সম্পত্তি ও তহবিল দিয়ে যাত্রা শুরু।`,
    },
    {
      title: `সদস্য, সমর্থক ও শুভাকাঙ্ক্ষীদের এককালীন ও নিয়মিত অনুদান।`,
    },

    {
      title: `ফাউন্ডেশনর যে কোন প্রকল্প থেকে অর্জিত হয়।`,
    },
    {
      title: `জনসাধারণ কর্তৃক বিশেষ কোনো খাতে প্রদত্ত অনুদান।`,
    },
    {
      title: `সচ্ছল মুসলিমদের প্রদেয় যাকাত, ফিতরা।`,
    },
    {
      title: `বিভিন্ন প্রজেক্ট পরিচালনা বাবদ সংশ্লিষ্ট প্রজেক্ট থেকে কর্তনকৃত ১০% অ্যডমিনিস্ট্রেটিভ খরচ।`,
    },
  ];
  const items5 = [
    {
      title: `দাতাগণ যে খাতের জন্য দান করে থাকেন, সে খাতেই ব্যায় করা হয়। এক খাতের অর্থ অন্য খাতে ব্যয় করা হয় না।`,
    },
    {
      title: `সদস্য, সমর্থক ও শুভাকাঙ্ক্ষীদের এককালীন ও নিয়মিত অনুদান।`,
    },

    {
      title: `ফাউন্ডেশনর যে কোন প্রকল্প থেকে অর্জিত হয়।`,
    },
    {
      title: `প্রতিটি প্রকল্প শুর হবার আগে এবং পরের আয়-ব্যয়ের বিস্তারিত হিসাব সংরক্ষণ করা হয়।`,
    },
    {
      title: `সকল সক্রিয় সদস্যদের সমন্বয়ে গঠিত টীমের তত্ত্বাবধানে দারুল মুত্তাক্বীন ফাউন্ডেশনের সকল আর্থিক কার্যক্রম মনিটরিং করা হয়।`,
    },
  ];

  useEffect(() => {
    getAllProject();
    getAllUserList();
  }, []);

  return (
    <div className="px-0 ">
      <div className="w-full ">
        <div>
          <div style={{ background: "#408F49" }}>
            <h2 className="text-white font-semibold text-2xl md:text-[33px] py-4 text-center bangla-text">
              আমাদের সম্পর্কে
            </h2>
          </div>
          <div>
            <div
              className="grid grid-cols-1 md:grid-cols-7 py-4"
              style={{ background: "#F5F5F5" }}>
              <div className="md:col-span-2 mx-4 md:mx-20 py-4 md:py-16 md:pl-24 text-[16px] grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-4 border-b md:border-b-0 md:border-r text-center md:text-left lg:text-left xl:text-left">
                <p
                  onClick={() => setTabNumber(0)}
                  className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                    tabNumber === 0
                      ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                      : ""
                  }`}>
                  পরিচিতি
                </p>
                <p
                  onClick={() => setTabNumber(1)}
                  className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                    tabNumber === 1
                      ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                      : ""
                  }`}>
                  নীতি ও আদর্শ
                </p>
                <p
                  onClick={() => setTabNumber(2)}
                  className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                    tabNumber === 2
                      ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                      : ""
                  }`}>
                  লক্ষ্য ও উদ্দেশ্য
                </p>
                <p
                  onClick={() => setTabNumber(3)}
                  className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                    tabNumber === 3
                      ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                      : ""
                  }`}>
                  কার্যক্রম
                </p>
                <p
                  onClick={() => setTabNumber(4)}
                  className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                    tabNumber === 4
                      ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                      : ""
                  }`}>
                  তহবিল ও আয়
                </p>
                <p
                  onClick={() => setTabNumber(5)}
                  className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 lg:hover:bg-transparent  xl:hover:bg-transparent hover:shadow-lg lg:hover:shadow-none xl:hover:shadow-none hover:text-green-700 cursor-pointer ${
                    tabNumber === 5
                      ? " text-green-700 font-semibold md:bg-transparent md:text-black"
                      : ""
                  }`}>
                  ব্যয়ের নীতিমালা
                </p>
                {/* <p
                  onClick={() => setTabNumber(6)}
                  className={`bg-white shadow-md rounded-lg p-2 md:p-0 md:shadow-none md:bg-transparent hover:bg-green-100 hover:shadow-lg hover:text-green-700 cursor-pointer ${
                    tabNumber === 6
                      ? "bg-green-100 text-green-700 font-semibold md:bg-transparent md:text-black"
                      : ""
                  }`}>
                  অর্জনসমূহ
                </p> */}
              </div>

              <div className="md:col-span-5 rounded-lg shadow-lg p-4 bg-white mx-4 md:mx-20 my-4 md:my-8">
                {tabNumber === 0 ? (
                  <div>
                    <h3 className="text-2xl md:text-[22px] bangla-text p-4">
                      দারুল মুত্তাক্বীন ফাউন্ডেশন
                    </h3>
                    <p className="bangla-text text-[16px] leading-10 p-4 text-gray-700 text-justify">
                      দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক
                      শিক্ষা, দাওয়াহ ও পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক
                      প্রতিষ্ঠান। পরের মঙ্গল কামনা (অন্যের জন্য আল্লাহর নিকট
                      প্রার্থনা); পরের জন্য কিছু করার মানসিকতাই একদিন ব্যক্তি
                      আমিকে ভালো মানুষ হতে সহায়তা করে। আমরা সবাইকে ভালো মানুষ
                      হতে উপদেশ দিই কিন্তু ভালো মানুষ হয়ে উঠার পথ-পরিক্রমা অনেক
                      ক্ষেত্রেই বাতলে দিই না। (গরীব-অসহায়-দুঃস্থ-এতিম) আশেপাশের
                      মানুষের জন্য কিছু করতে চেষ্টা করলে যে নিজের অজান্তেই
                      মানসিক প্রশান্তি মিলে; ভালো মানুষ হওয়ার পথে যাত্রা শুরু
                      করা যায় তা বুঝি আমরা অনেকেই আজও ঠাহর করতে পারছিনা! ধরে
                      নিলাম আমাদের অনেকেরই ইচ্ছা আছে কিন্ত ফুরসত/সুযোগের অভাব।
                      নিজের জন্য/নিজেদের জন্য/আপনাদের জন্য এ ধরণের ফুরসত সৃষ্টি
                      করতে "দারুল মুত্তাক্বীন ফাউন্ডেশন (DMF)" এর যাত্রা শুরু
                      ২০২০ সালে। আমাদের লক্ষ্য: "শুধুমাত্র আল্লাহর সন্তুষ্টির
                      জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে
                      নিজেদের নিয়োজিত রাখা"
                    </p>
                    <div className="flex justify-end items-center">
                      <div className="p-2 text-center">
                        <p>আশিকুর রহমান</p>
                        <p>কেন্দ্রীয় প্রকল্প পরিচালক</p>
                      </div>
                      <img
                        className="w-20 h-20 rounded-full border-2 border-green-400"
                        src="https://i.ibb.co/XDsfYG3/inbound2876202773919974830.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                ) : tabNumber === 1 ? (
                  <div>
                    <h3 className="text-2xl md:text-[22px] bangla-text p-4">
                      নীতি ও আদর্শ
                    </h3>
                    <Steps
                      className=""
                      progressDot
                      current={6}
                      direction="vertical"
                      items={items1}
                    />
                  </div>
                ) : tabNumber === 2 ? (
                  <div>
                    <h3 className="text-2xl md:text-[22px] bangla-text p-4">
                      লক্ষ্য ও উদ্দেশ্য
                    </h3>
                    <Steps
                      className=""
                      progressDot
                      current={6}
                      direction="vertical"
                      items={items2}
                    />
                  </div>
                ) : tabNumber === 3 ? (
                  <div>
                    <h3 className="text-2xl md:text-[22px] bangla-text p-4">
                      কার্যক্রম
                    </h3>
                    <Steps
                      className=""
                      progressDot
                      current={6}
                      direction="vertical"
                      items={items3}
                    />
                  </div>
                ) : tabNumber === 4 ? (
                  <div>
                    <h3 className="text-2xl md:text-[22px] bangla-text p-4">
                      তহবিল ও আয়ের এর উৎস
                    </h3>
                    <Steps
                      className=""
                      progressDot
                      current={6}
                      direction="vertical"
                      items={items4}
                    />
                  </div>
                ) : (
                  tabNumber === 5 && (
                    <div>
                      <h3 className="text-2xl md:text-[22px] bangla-text p-4">
                        ব্যয়ের নীতিমালা
                      </h3>
                      <Steps
                        className=""
                        progressDot
                        current={6}
                        direction="vertical"
                        items={items5}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-4 md:mx-12 lg:mx-20 xl:mx-20">
          <h2 className="  md:text-4xl sm:text-3xl text-2xl font-bold text-center py-8 ">
            চলমান প্রকল্পসমূহ
          </h2>

          <div className="pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1 pt-4">
              {projects?.map((project, index) => (
                <div key={index}>
                  <ProjectCard rowData={project} />
                </div>
              ))}
            </div>
          </div>
          <h2 className="  md:text-4xl sm:text-3xl text-2xl font-bold text-center py-8 ">
            সক্রিয় সদস্যগণ
          </h2>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1 pt-4">
              {users?.map((user, index) => (
                <div key={index}>
                  <ProfileCard rowData={user} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}
