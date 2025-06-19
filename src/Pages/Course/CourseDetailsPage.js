import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Skeleton, message } from "antd";
import { coreAxios } from "../../utilities/axios";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const history = useHistory();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "জানা যায়নি";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("bn-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const fetchCourseById = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/courses/${id}`);
      if (response?.status === 200) {
        setCourse(response?.data?.course);
      } else {
        message.error("কোর্স পাওয়া যায়নি");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      message.error("সার্ভার সমস্যার কারণে কোর্স লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseById();
  }, [id]);

  const handleEnroll = () => {
    history.push(`/checkout/${id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <Button
        onClick={() => history.goBack()}
        className="mb-8 text-lg font-semibold"
        style={{
          borderColor: "#2D6A3F",
          color: "#2D6A3F",
          padding: "10px 20px",
          fontSize: "18px",
        }}
      >
        ← পেছনে যান
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bangla-text">
        <div className="relative">
          {loading ? (
            <Skeleton.Image
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: "3 / 2",
                borderRadius: "10px",
                minHeight: "280px",
              }}
              active
            />
          ) : (
            <img
              src={
                course?.image ||
                "https://via.placeholder.com/600x400/EDF2F7/64748B?text=Course+Image"
              }
              alt={course?.title}
              className="w-full max-h-[440px] object-cover rounded-lg"
              style={{ maxHeight: "440px" }}
            />
          )}
        </div>

        <div>
          <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2D6A3F] mb-6 leading-tight">
              {course?.title}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">
              {course?.description}
            </p>

            <div className="space-y-3">
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                <span className="font-normal">ইন্সট্রাক্টর:</span>{" "}
                {course?.instructor || "জানা যায়নি"}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                <span className="font-normal">পেশা:</span>{" "}
                {course?.instructorProfession || "জানা যায়নি"}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                <span className="font-normal">শিক্ষাগত যোগ্যতা:</span>{" "}
                {course?.instructorEducation || "জানা যায়নি"}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                <span className="font-normal">শুরু তারিখ:</span>{" "}
                {formatDate(course?.startDate)}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                <span className="font-normal">শেষ তারিখ:</span>{" "}
                {formatDate(course?.endDate)}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                <span className="font-normal">যোগ্যতা:</span>{" "}
                {course?.qualifications || "জানা যায়নি"}
              </p>
              <p className="text-lg sm:text-xl font-semibold text-gray-800">
                <span className="font-normal">সার্টিফিকেশন:</span>{" "}
                {course?.certifications || "জানা যায়নি"}
              </p>
            </div>
          </Skeleton>
        </div>
      </div>

      {loading ? (
        <div className="mt-10">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : course?.outline?.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2D6A3F] mb-6">
            কোর্সের বিষয়বস্তু
          </h2>
          {course.outline.map((item, index) => (
            <div key={index} className="mb-8 sm:mb-10">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                {item?.classNumber}ম ক্লাস:
              </h3>
              <ul className="list-disc list-inside text-base sm:text-lg text-gray-700">
                {item?.topics?.map((topic, idx) => (
                  <li key={idx} className="mb-1 sm:mb-2">
                    {topic}
                  </li>
                ))}
              </ul>
              {item.description && (
                <p className="text-base sm:text-lg text-gray-500 mt-2">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {!loading && (
        <div className="mt-12 flex justify-center">
          <Button
            onClick={handleEnroll}
            className="bg-[#2D6A3F] text-white py-3 px-6 rounded-lg text-lg sm:text-xl hover:bg-green-700 transition duration-300 w-full max-w-md"
          >
            কোর্সে অংশগ্রহণ করুন
          </Button>
        </div>
      )}
    </div>
  );
}
