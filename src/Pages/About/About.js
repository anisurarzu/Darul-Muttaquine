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
              দারুল মুত্তাকিন ফাউন্ডেশন (DMF)
            </h2>
            <p className="text-[15px] text-center py-2 ">
              দারুল মুত্তাকিন ফাউন্ডেশন (DMF) একটি প্রখ্যাত দাতব্য সংস্থা, যা
              সমাজের উন্নতি ও কল্যাণে কাজ করে যাচ্ছে। আমাদের মূল লক্ষ্য হল
              দরিদ্র ও অসহায় মানুষের সাহায্যে বিভিন্ন ধরণের সমাজসেবামূলক
              কার্যক্রম পরিচালনা করা এবং তাদের জীবনমান উন্নত করা।
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
              <div>
                <h3 className="text-left text-[17px] font-semibold">
                  আমাদের প্রভাব:
                </h3>
                <p className="text-[13px] py-4 text-green-800">
                  DMF-এর কার্যক্রমগুলোর মাধ্যমে আমরা অসংখ্য দরিদ্র ও অসহায়
                  মানুষের জীবন মান উন্নত করতে পেরেছি। আমাদের শিক্ষা বৃত্তি
                  প্রোগ্রাম, খাদ্য দান প্রকল্প, স্বাস্থ্যসেবা উদ্যোগ এবং ত্রাণ
                  সহায়তা কার্যক্রমগুলো সমাজে ইতিবাচক পরিবর্তন আনতে সহায়ক
                  হয়েছে।
                </p>
              </div>
            </div>
          </div>

          <h2 className="  md:text-4xl sm:text-3xl text-2xl font-bold text-center py-8 underline">
            Darul Muttaquine Running Projects
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
          <h2 className="  md:text-4xl sm:text-3xl text-2xl font-bold text-center py-8 underline">
            Darul Muttaquine Foundations Active Members
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
