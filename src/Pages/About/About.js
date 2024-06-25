import React, { useEffect, useState } from "react";
import ProfileCard from "../Dashboard/Profile/ProfileCard";
import { coreAxios } from "../../utilities/axios";
import { toast } from "react-toastify";
import { Alert, Spin } from "antd";
import ProjectCard from "../Dashboard/Project/ProjectCard";
import axios from "axios";

export default function About() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
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

  useEffect(() => {
    getAllProject();
    getAllUserList();
  }, []);

  return (
    <div className="px-0 md:px-8 lg:px-24 xl:px-24">
      {loading ? (
        <Spin tip="Loading...">
          <Alert
            message="Alert message title"
            description="Further details about the context of this alert."
            type="info"
          />
        </Spin>
      ) : (
        <div className="w-full  py-16 px-6">
          <div>
            <h2 className="text-[21px] font-semibold text-center py-3">
              দারুল মুত্তাক্বীন ফাউন্ডেশন (DMF)
            </h2>
            <p className="text-[15px] text-center py-2 ">
              আমাদের লক্ষ্য: "শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা,
              প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে নিজেদের নিয়োজিত রাখা"
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 py-8">
              <div>
                <h3 className="text-left text-[17px] font-semibold">
                  আমাদের মিশন:
                </h3>
                <ul className="text-[13px] py-4 text-green-800">
                  <li>
                    ♦ দরিদ্র ও অসহায় পরিবারের জন্য খাদ্য, বস্ত্র ও আশ্রয়ের
                    ব্যবস্থা করা।
                  </li>
                  <li>
                    ♦ মেধাবী ও আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের জন্য শিক্ষা
                    বৃত্তি প্রদান করা।
                  </li>
                  <li>
                    ♦ সাধারণ ও ইসলামিক শিক্ষার সমন্বয়ে একটি আধুনিক মাদ্রাসা
                    প্রতিষ্ঠা করা।
                  </li>
                  <li>♦ স্বাস্থ্যসেবা ও চিকিৎসা সহায়তা প্রদান।</li>
                  <li>
                    ♦ প্রাকৃতিক দুর্যোগ ও জরুরি পরিস্থিতিতে ত্রাণ সহায়তা
                    প্রদান।
                  </li>
                  <li>♦ সাধারণ শিক্ষা ও ইসলামিক শিক্ষার প্রচার ও প্রসার।</li>
                </ul>
              </div>
              <div className="py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 ">
                  <h3 className="text-green-800 text-[13px]">
                    <small>Asikur Rahman</small>
                    <img
                      className="w-[200px] h-[200px] border border-green-800 rounded"
                      src="https://i.ibb.co/XDsfYG3/inbound2876202773919974830.jpg"
                      alt=""
                    />
                    Central Project Leader
                  </h3>
                </div>
                <div className="md:col-span-2 lg:col-span-3 xl:col-span-3">
                  <p className="text-justify text-[13px] text-green-800">
                    পরের মঙ্গল কামনা (অন্যের জন্য আল্লাহর নিকট প্রার্থনা); পরের
                    জন্য কিছু করার মানসিকতাই একদিন ব্যক্তি আমিকে ভালো মানুষ হতে
                    সহায়তা করে। আমরা সবাইকে ভালো মানুষ হতে উপদেশ দিই কিন্তু ভালো
                    মানুষ হয়ে উঠার পথ-পরিক্রমা অনেক ক্ষেত্রেই বাতলে দিই না।
                    (গরীব-অসহায়-দুঃস্থ-এতিম) আশেপাশের মানুষের জন্য কিছু করতে
                    চেষ্টা করলে যে নিজের অজান্তেই মানসিক প্রশান্তি মিলে; ভালো
                    মানুষ হওয়ার পথে যাত্রা শুরু করা যায় তা বুঝি আমরা অনেকেই আজও
                    ঠাহর করতে পারছিনা! ধরে নিলাম আমাদের অনেকেরই ইচ্ছা আছে কিন্ত
                    ফুরসত/সুযোগের অভাব। নিজের জন্য/নিজেদের জন্য/আপনাদের জন্য এ
                    ধরণের ফুরসত সৃষ্টি করতে "দারুল মুত্তাক্বীন ফাউন্ডেশন (DMF)"
                    এর যাত্রা শুরু ২০২০ সালে। আমাদের লক্ষ্য: "শুধুমাত্র আল্লাহর
                    সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজের
                    মধ্যে নিজেদের নিয়োজিত রাখা" আমাদের চলমান প্রজেক্টসমূহ: ১.
                    শিক্ষা কার্যক্রম (DMF Scholarship): বিভিন্ন
                    শিক্ষাপ্রতিষ্ঠানের মধ্যে বাৎসরিক শিক্ষাবৃত্তির আয়োজন ২.
                    প্রস্তাবিত "দারুল মুত্তাক্বীন মডেল মাদ্রাসা": ফান্ড সংগ্রহ ও
                    অন্যান্য প্রস্তুতি চলমান ৩. দরিদ্রদের স্বাবলম্বীকরণ ৪. ঈদের
                    খুশি: প্রতি ঈদে অভাবীদের মাঝে খাদ্যসামগ্রী বিতরণ ৫.
                    বৃক্ষরোপণ/সাদাকায়ে জারিয়া কর্মসূচি ৬. DMF Blood Bank ৭. DMF
                    Islamic Media ৮. DMF Muslim Community
                  </p>
                </div>
              </div>
            </div>
          </div>

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
      )}
    </div>
  );
}
