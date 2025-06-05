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
        // Filter and sort the projects
        const approvedProjects = response?.data
          ?.filter((project) => project?.approvalStatus === "Approve")
          ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));

        setProjects(approvedProjects);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
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
        {/* Top wave */}

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
          <path
            fill="#91CA49"
            fillOpacity="1"
            d="M0,128L48,112C96,96,192,64,288,69.3C384,75,480,117,576,112C672,107,768,53,864,42.7C960,32,1056,64,1152,85.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>

        {/* Content */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 md:px-20 lg:px-32 xl:px-40 py-16 text-white"
          style={{ backgroundColor: "#91CA49" }}
        >
          {/* Left Block */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-lg p-10 rounded-xl shadow-xl hover:scale-[1.02] transition-transform duration-300"
          >
            <h3 className="text-3xl font-bold mb-4 border-b border-white pb-3">
              স্বেচ্ছাসেবক কার্যক্রম
            </h3>
            <p className="text-lg leading-relaxed">
              দারুল মুত্তাক্বীন ফাউন্ডেশন স্বেচ্ছাসেবক দল গঠনের মাধ্যমে বিভিন্ন
              মানবসেবামূলক কাজ করে থাকে। শিক্ষা কার্যক্রম, খাদ্য বিতরণ, রক্তদান
              এবং অন্যান্য সমাজকল্যাণমূলক কাজে সক্রিয় অংশগ্রহণ করা হয়।
            </p>
          </motion.div>

          {/* Right Block */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-lg p-10 rounded-xl shadow-xl hover:scale-[1.02] transition-transform duration-300"
          >
            <h3 className="text-3xl font-bold mb-4 border-b border-white pb-3">
              ঈদ উপহার বিতরণ
            </h3>
            <p className="text-lg leading-relaxed">
              ঈদ উপলক্ষে সুবিধাবঞ্চিত মানুষদের মাঝে ফাউন্ডেশন থেকে ঈদ কার্ড ও
              উপহার সামগ্রী বিতরণ করা হয়। এই আয়োজনের মাধ্যমে সমাজের মানুষের মাঝে
              হাসি ও আনন্দ ছড়িয়ে দেওয়া আমাদের উদ্দেশ্য।
            </p>
          </motion.div>
        </div>

        {/* Bottom wave (reduced height) */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180">
          <path
            fill="#91CA49"
            fillOpacity="1"
            d="M0,128L48,112C96,96,192,64,288,69.3C384,75,480,117,576,112C672,107,768,53,864,42.7C960,32,1056,64,1152,85.3C1248,107,1344,117,1392,122.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </motion.div>

      {/* 3rd Section: Impact Cards - Wide Responsive Version */}
      <div className="w-full py-16 px-4 sm:px-8">
        {/* Full-width container with controlled max-width */}
        <div className="mx-auto" style={{ maxWidth: "1800px" }}>
          {/* Section Header */}
          <div className="text-center mb-16 px-4 sm:px-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              আমাদের <span className="text-green-600">সেবা</span> সমূহ
            </h2>
            <div className="w-24 h-1.5 bg-green-600 mx-auto mb-6"></div>
            <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              মানবতার সেবায় আমাদের বিভিন্ন কার্যক্রমে অংশগ্রহণ করুন এবং সমাজ
              উন্নয়নে ভূমিকা রাখুন
            </p>
          </div>

          {/* Impact Cards Grid - Wider with responsive adjustments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 px-4 sm:px-8 lg:px-12 xl:px-16">
            {[
              {
                icon: "https://i.ibb.co/jZsyf19C/Donation.jpg",
                title: "দান করুন",
                description:
                  "আপনার দান অসহায় মানুষের মুখে হাসি ফুটাবে এবং সমাজ উন্নয়নে গুরুত্বপূর্ণ ভূমিকা রাখবে।",
                cta: "দান করুন →",
                color: "bg-green-100",
              },
              {
                icon: "https://i.ibb.co/xS7TPXqW/Schoalrship.jpg",
                title: "বৃত্তি প্রোগ্রাম",
                description:
                  "মেধাবী কিন্তু অসচ্ছল শিক্ষার্থীদের শিক্ষা নিশ্চিত করতে আমাদের বৃত্তি প্রোগ্রামে অংশ নিন।",
                cta: "আবেদন করুন →",
                color: "bg-blue-100",
              },
              {
                icon: "https://i.ibb.co/pjvZNzLT/Charity-Donations-Instagram-Post-1.jpg",
                title: "দরিদ্রদের স্বাবলম্বীকরণ",
                description:
                  "দরিদ্র মানুষদের আত্মনির্ভরশীল করে গড়ে তুলতে সহায়তা করুন। কর্মসংস্থান সৃষ্টি ও দক্ষতা উন্নয়নের মাধ্যমে তাদের স্বাবলম্বী হওয়ার পথ দেখান।",
                cta: "সহায়তা করুন →",
                color: "bg-green-100",
              },
              {
                icon: "https://i.ibb.co/DgCzBcGC/Charity-Donations.jpg",
                title: "খাদ্য বিতরণ",
                description:
                  "দরিদ্র ও অসহায় পরিবারের মাঝে পুষ্টিকর খাদ্য বিতরণ করুন এবং ক্ষুধামুক্ত সমাজ গড়ে তুলুন।",
                cta: "সহায়তা করুন →",
                color: "bg-amber-100",
              },

              // ... (other card data remains same)
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Card Image - Larger height */}
                <div className="h-80 sm:h-96 lg:h-[28rem] overflow-hidden">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Card Content - More padding for larger screens */}
                <div className="p-6 sm:p-8">
                  {/* <div
                    className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center mb-5`}
                  >
                    <span className="text-3xl">
                      {index === 0 && "💰"}
                      {index === 1 && "🎓"}
                      {index === 2 && "🍲"}
                      {index === 3 && "🏥"}
                    </span>
                  </div> */}

                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 ">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 mb-5 text-base sm:text-lg bangla-text leading-relaxed">
                    {item.description}
                  </p>

                  <button className="text-green-600 font-semibold text-lg flex items-center group-hover:text-green-700 transition-colors">
                    {item.cta}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 ml-1 transition-transform group-hover:translate-x-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button - Larger and more prominent */}
          <div className="text-center mt-20 px-4 sm:px-0">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg sm:text-xl">
              আরো জানুন
            </button>
          </div>
        </div>
      </div>

      {/* 4th Section: Ongoing Projects */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
        <path
          fill="#F3F4F6"
          fill-opacity="1"
          d="M0,144L48,133.3C96,123,192,101,288,104C384,107,480,133,576,128C672,123,768,85,864,74.7C960,64,1056,80,1152,90.7C1248,101,1344,107,1392,109.3L1440,112L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
        ></path>
      </svg>
      <div className=" bg-gray-100">
        <div className="mx-8 lg:mx-32 xl:mx-32">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center py-4 lg:py-8 xl:py-8 ">
            চলমান <span className="text-green-600">প্রজেক্ট</span> সমূহ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4s gap-8 lg:gap-12 xl:gap-12 pt-4">
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
        <path
          fill="#F3F4F6"
          fill-opacity="1"
          d="M0,144L48,133.3C96,123,192,101,288,104C384,107,480,133,576,128C672,123,768,85,864,74.7C960,64,1056,80,1152,90.7C1248,101,1344,107,1392,109.3L1440,112L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>
      {/* Section 5: About Darul Muttaqin Foundation */}
      {/* <div
        className="w-full bg-cover bg-center bg-no-repeat py-16"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1950&q=80')`, // Replace with your own image
        }}
      >
        <div className="bg-white/80 backdrop-blur-sm max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-24 py-12 rounded-xl shadow-lg">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-10 text-center bangla-text">
            একনজরে <span className="text-green-600">দারুল মুত্তাক্বীন</span>{" "}
            ফাউন্ডেশন
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-10">
            <img
              className="w-40 sm:w-52 lg:w-60"
              src={logo}
              alt="Darul Muttaqin Logo"
            />
            <div className="text-center lg:text-left space-y-3 text-sm sm:text-base">
              <h4 className="text-lg lg:text-xl font-bold">
                কেন্দ্রীয় কার্যালয়
              </h4>
              <p>
                তক্তারচালা বাজার, মির্জাপুর, টাংগাইল, ঢাকা। <br />
                মোবাইলঃ ০১৭৯১৫৫৬১৮৪
              </p>
              <p>
                <strong>কার্যক্রম:</strong> শিক্ষা, গবেষণা, মানবসেবা
              </p>
            </div>
          </div>
        </div>
      </div> */}
      {/* Section 6: FAQ */}
      <div
        className="w-full bg-cover bg-center bg-no-repeat py-16"
        // style={{
        //   backgroundImage: `url('https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1950&q=80')`, // Replace with your own image
        // }}
      >
        <div className="bg-white/80 backdrop-blur-sm max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-24 py-12 rounded-xl shadow-lg">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-10 text-center bangla-text">
            প্রায়শই <span className="text-green-600">জিজ্ঞাসিত</span>{" "}
            প্রশ্নাবলী
          </h2>

          <div className="space-y-6 text-sm sm:text-base">
            <div>
              <h4 className="text-lg font-semibold mb-1">
                প্রশ্ন: কিভাবে আমি দান করতে পারি?
              </h4>
              <p>
                উত্তর: আমাদের ওয়েবসাইটে দানের জন্য একটি সহজ প্রক্রিয়া রয়েছে।
                আপনি আপনার পছন্দের দানটি নির্বাচন করে অনলাইনে নিরাপদে পেমেন্ট
                করতে পারেন।
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-1">
                প্রশ্ন: ফাউন্ডেশনটির প্রধান উদ্দেশ্য কি?
              </h4>
              <p>
                উত্তর: দারুল মুত্তাক্বীন ফাউন্ডেশন মূলত মানুষের কল্যাণে কাজ
                করছে। আমাদের মূল লক্ষ্য হলো শিক্ষা, গবেষণা, এবং মানবসেবায় অবদান
                রাখা।
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-1">
                প্রশ্ন: কি ধরণের প্রজেক্টের জন্য সাহায্য দেওয়া হয়?
              </h4>
              <p>
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
