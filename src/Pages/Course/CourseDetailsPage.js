import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Collapse, Skeleton, message } from "antd";
import { coreAxios } from "../../utilities/axios";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const history = useHistory();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="relative rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center min-h-[280px] md:min-h-[340px]">
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
              className="w-full h-full max-h-[500px] object-contain p-2"
              style={{ maxHeight: "500px" }}
            />
          )}
        </div>

        <div>
          <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2D6A3F] mb-6 leading-tight">
              {course?.title}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">
              {course?.description}
            </p>
          </Skeleton>
        </div>
      </div>

      {loading ? (
        <div className="mt-10">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : course?.modules?.length > 0 ? (
        <div className="mt-12 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2D6A3F] mb-2">
            কোর্স আউটলাইন
          </h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            প্রতিটি মডিউলের লেসনের শিরোনাম—বিস্তারিত পাঠ ও কুইজ শুধু কোর্সে প্রবেশের
            পর দেখতে পারবেন।
          </p>
          <Collapse
            bordered={false}
            defaultActiveKey={[]}
            className="!bg-transparent [&_.ant-collapse-item]:!mb-3 [&_.ant-collapse-item]:!rounded-xl [&_.ant-collapse-item]:!border [&_.ant-collapse-item]:!border-slate-200 [&_.ant-collapse-item]:!bg-white [&_.ant-collapse-item]:!overflow-hidden [&_.ant-collapse-content-box]:!pt-0"
            expandIconPosition="end"
            items={course.modules.map((mod, index) => ({
              key: String(index),
              label: (
                <span className="font-semibold text-gray-900 pr-2">
                  <span className="text-[#2D6A3F]">মডিউল {index + 1}:</span>{" "}
                  {mod?.title}
                </span>
              ),
              children: (
                <ul className="m-0 pl-0 list-none space-y-2 pb-1">
                  {(mod?.lessons || []).length === 0 ? (
                    <li className="text-gray-500 text-sm">কোনো লেসন যোগ করা হয়নি।</li>
                  ) : (
                    (mod.lessons || []).map((lesson, li) => (
                      <li
                        key={lesson?.lessonId || `${index}-${li}`}
                        className="flex gap-3 text-gray-700 text-sm sm:text-base border-b border-slate-100 last:border-0 pb-2 last:pb-0"
                      >
                        <span className="text-slate-400 tabular-nums shrink-0 w-6">
                          {li + 1}.
                        </span>
                        <span className="leading-snug">{lesson?.title}</span>
                      </li>
                    ))
                  )}
                </ul>
              ),
            }))}
          />
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
