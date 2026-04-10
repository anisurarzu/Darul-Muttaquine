import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Skeleton, message, Tag } from "antd";
import { useHistory } from "react-router-dom";
import { BookOutlined, RightOutlined } from "@ant-design/icons";
import { coreAxios } from "../../utilities/axios";

export default function MyEnrollmentsPage() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await coreAxios.get("/courses");
        setCourses(response?.data?.courses || []);
      } catch (error) {
        message.error("Enrollment list load করা যায়নি");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const enrolledCourses = useMemo(() => courses, [courses]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-[#2D6A3F] to-emerald-700 text-white px-5 py-6 md:px-8 md:py-8 mb-6 md:mb-8 shadow-lg shadow-emerald-900/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">
                Learning dashboard
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                আমার কোর্সসমূহ
              </h1>
              <p className="text-emerald-100/90 mt-2 text-sm md:text-base max-w-2xl">
                নিচে আপনার কোর্সের আউটলাইন দেখুন এবং শেখা চালিয়ে যান।
              </p>
            </div>
            <Button
              size="large"
              className="!bg-white/15 !border-white/30 !text-white hover:!bg-white/25 shrink-0"
              onClick={() => history.push("/course")}
            >
              সব কোর্স ব্রাউজ করুন
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="!rounded-2xl !border-slate-200/80 !shadow-sm overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  <Skeleton.Image active className="!w-full lg:!w-64 !h-44 !rounded-xl" />
                  <div className="flex-1 min-w-0 space-y-3 pt-2">
                    <Skeleton active paragraph={{ rows: 3 }} title={{ width: "60%" }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <Alert
            type="info"
            showIcon
            className="!rounded-2xl"
            message="এখনও কোনো কোর্সে enroll করা হয়নি।"
            description="কোর্স ক্যাটালগ থেকে enroll করুন।"
            action={
              <Button type="primary" onClick={() => history.push("/course")}>
                কোর্স দেখুন
              </Button>
            }
          />
        ) : (
          <div className="space-y-4 md:space-y-5">
            {enrolledCourses.map((course) => {
              const modules = course?.modules || [];
              const moduleCount = modules.length;
              const lessonCount = modules.reduce(
                (acc, m) => acc + (m?.lessons?.length || 0),
                0
              );

              return (
                <Card
                  key={course._id}
                  className="!rounded-2xl !border-slate-200/80 !shadow-md hover:!shadow-lg transition-shadow duration-300 overflow-hidden"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Thumbnail — fixed width on large screens */}
                    <div className="relative lg:w-72 xl:w-80 shrink-0">
                      <img
                        src={
                          course?.image ||
                          "https://via.placeholder.com/600x400/EDF2F7/64748B?text=Course+Image"
                        }
                        alt={course?.title}
                        className="w-full h-48 lg:h-full min-h-[12rem] lg:min-h-[220px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
                    </div>

                    {/* Main + outline — takes remaining width */}
                    <div className="flex-1 min-w-0 flex flex-col md:flex-row">
                      <div className="p-4 md:p-5 lg:p-6 flex-1 min-w-0 border-b md:border-b-0 md:border-r border-slate-100">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {course?.category && (
                            <Tag color="green" className="!m-0">
                              {course.category}
                            </Tag>
                          )}
                          <Tag className="!m-0">
                            {moduleCount} মডিউল · {lessonCount} লেসন
                          </Tag>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-snug">
                          {course?.title}
                        </h3>
                        <p className="text-slate-600 text-sm md:text-base line-clamp-2 mb-4">
                          {course?.description}
                        </p>
                        <Button
                          type="primary"
                          size="large"
                          className="!bg-[#2D6A3F] !border-[#2D6A3F] hover:!bg-emerald-800"
                          icon={<RightOutlined />}
                          onClick={() =>
                            history.push(`/my-courses/${course._id}/learn`)
                          }
                        >
                          কোর্সে প্রবেশ করুন
                        </Button>
                      </div>

                      {/* Course outline — wider column */}
                      <div className="w-full md:w-[55%] lg:w-[52%] xl:w-[50%] min-w-0 bg-slate-50/80 p-4 md:p-5 lg:p-6 border-t md:border-t-0 border-slate-100">
                        <div className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
                          <BookOutlined className="text-[#2D6A3F]" />
                          <span>কোর্স আউটলাইন</span>
                        </div>
                        <div className="space-y-2 max-h-[220px] md:max-h-[260px] overflow-y-auto pr-1 [scrollbar-width:thin]">
                          {modules.length === 0 ? (
                            <p className="text-sm text-slate-500">
                              আউটলাইন এখনও যোগ করা হয়নি।
                            </p>
                          ) : (
                            modules.map((mod, mi) => (
                              <div
                                key={mod.moduleId || mi}
                                className="rounded-xl bg-white border border-slate-200/90 px-3 py-2.5 shadow-sm"
                              >
                                <p className="text-sm font-semibold text-slate-800 mb-1.5">
                                  <span className="text-emerald-700 mr-1">
                                    {mi + 1}.
                                  </span>
                                  {mod.title}
                                </p>
                                <ul className="text-xs md:text-sm text-slate-600 space-y-1 pl-1">
                                  {(mod.lessons || []).slice(0, 6).map(
                                    (lesson, li) => (
                                      <li
                                        key={lesson.lessonId || li}
                                        className="flex items-start gap-2"
                                      >
                                        <span className="text-emerald-600 mt-0.5 shrink-0">
                                          •
                                        </span>
                                        <span className="leading-snug">
                                          {lesson.title}
                                        </span>
                                      </li>
                                    )
                                  )}
                                  {(mod.lessons || []).length > 6 && (
                                    <li className="text-slate-400 text-xs pl-4">
                                      + আরও {(mod.lessons || []).length - 6}{" "}
                                      লেসন…
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
