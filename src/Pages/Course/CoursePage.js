import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rate, message, Skeleton } from "antd";
import { useHistory } from "react-router-dom";
import EnrollmentModal from "./EnrollmentModal";
import { coreAxios } from "../../utilities/axios";

export default function CoursePage() {
  const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState([]);

  const fetchCourseInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("/courses");
      if (response?.status === 200) {
        const sortedData = response?.data?.courses?.sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
        );
        setCourseData(sortedData);
      }
    } catch (err) {
      console.error(err);
      message.error("কোর্স লোড করা যায়নি। পরে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseInfo();
  }, []);

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setIsEnrollModalVisible(true);
  };

  const handleDetailsClick = (courseId) => {
    history.push(`/course/${courseId}`);
  };

  const closeEnrollModal = () => {
    setIsEnrollModalVisible(false);
    setSelectedCourse(null);
  };

  const CourseSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full border border-gray-100 shadow-sm">
      <Skeleton.Image active className="!w-full !h-48 sm:!h-56" />
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <Skeleton active paragraph={{ rows: 0 }} />
        <Skeleton active paragraph={{ rows: 2 }} />
        <div className="mt-auto">
          <Skeleton.Button active size="default" className="!w-full !mt-4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16 overflow-x-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            আমাদের কোর্সসমূহ
          </h1>
          <p className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            আধুনিক প্রযুক্তি ও ডিজিটাল দক্ষতা উন্নয়নের জন্য আমাদের বিশেষায়িত
            কোর্সসমূহ
          </p>
        </div>
      </div>

      {/* Course List */}
      <div className="w-full px-6 sm:px-12 lg:px-20 py-8 mx-auto max-w-[1600px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CourseSkeleton />
              </motion.div>
            ))}
          </div>
        ) : courseData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {courseData.map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden flex flex-col h-full border border-gray-200 shadow-sm"
              >
                <div className="h-[250px] sm:h-72 w-full overflow-hidden">
                  <img
                    src={
                      course.image ||
                      "https://via.placeholder.com/600x400/EDF2F7/64748B?text=Course+Image"
                    }
                    alt={course.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-grow space-y-3">
                  <div className="flex flex-wrap justify-between items-center">
                    <span className="bg-green-100 text-green-800 text-xs sm:text-sm px-2 py-1 rounded-full font-medium">
                      {course.category || "প্রযুক্তি"}
                    </span>
                    {course.isPremium && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm px-2 py-1 rounded-full font-medium mt-2 sm:mt-0">
                        প্রিমিয়াম
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug truncate">
                    {course.title}
                  </h3>

                  <p className="text-gray-700 text-sm sm:text-base line-clamp-3">
                    {course.description?.slice(0, 150) ||
                      "কোর্সের সংক্ষিপ্ত বিবরণ এখানে।"}
                    ...
                  </p>

                  <div className="space-y-2 mt-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <Rate
                          disabled
                          allowHalf
                          defaultValue={course.rating || 4.5}
                          className="text-sm sm:text-base"
                        />
                        <span className="text-gray-600 text-xs sm:text-sm">
                          ({course.totalReviews || 0} রিভিউ)
                        </span>
                      </div>
                      <span className="text-gray-700 text-base sm:text-lg font-bold">
                        {course.price
                          ? `${new Intl.NumberFormat("bn-BD").format(
                              course.price
                            )}৳`
                          : "০৳"}
                      </span>
                    </div>

                    {/* Updated buttons container with justify-between */}
                    <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 mt-3 gap-3">
                      <button
                        onClick={() => handleDetailsClick(course._id)}
                        className="flex-1 border-2 border-green-600 text-green-600 py-2 px-4 rounded-xl hover:bg-green-50 transition-all text-sm sm:text-base font-semibold"
                      >
                        বিস্তারিত
                      </button>
                      <button
                        onClick={() => handleEnrollClick(course)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl transition-all text-sm sm:text-base font-semibold"
                      >
                        এনরোল করুন
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-16">
              <div className="text-gray-600 text-lg mb-6">
                কোন কোর্স পাওয়া যায়নি
              </div>
              <button
                onClick={fetchCourseInfo}
                className="text-green-600 hover:text-green-700 font-semibold text-base px-6 py-2 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          )
        )}
      </div>

      {/* Enrollment Modal */}
      <EnrollmentModal
        visible={isEnrollModalVisible}
        onClose={closeEnrollModal}
        course={selectedCourse}
        onEnrollSuccess={() => {
          message.success("সফলভাবে এনরোল করা হয়েছে!");
          closeEnrollModal();
        }}
      />
    </div>
  );
}
