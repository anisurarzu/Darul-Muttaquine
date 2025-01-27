import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Modal,
  Input,
  Form,
  notification,
  Avatar,
  Tooltip,
} from "antd";
import { useHistory } from "react-router-dom";
import EnrollmentModal from "./EnrollmentModal";
import { coreAxios } from "../../utilities/axios";

const coursesData = [
  {
    id: 1,
    title: "তথ্য ও যোগাযোগ প্রযুক্তি (H.S.C.)",
    category: "আইসিটি",
    description:
      "আইসিটির বিভিন্ন বিষয় সম্পর্কে বিস্তারিত ধারণা এবং ব্যবহারিক জ্ঞান।",
    instructor: {
      name: "মোহাম্মদ হাসান",
      image: "https://i.ibb.co/kSzpnXJ/unnamed.png", // Example image
    },
    startDate: "২০২৪-০১-১৫",
    endDate: "২০২৪-০২-১৫",
    duration: "১ মাস",
    availableSeats: 25,
    batchNumber: "BATCH 1",
    outline: [
      {
        classNumber: 1,
        topics: [
          "AI সম্পর্কে ধারণা ও কিভাবে কাজ করে",
          "রোবোটিকস",
          "ক্রায়োসার্জারী",
          "বায়োমেট্রিকস",
          "বায়োফরমেট্রিক্সস",
          "জেনেটিক ইঞ্জিনিয়ারিং",
          "ন্যানোটেকনোলজি",
        ],
        description: "------------- এগুলো সম্পর্কে জাস্ট ধারণা দেওয়া...",
      },
      // More class outlines...
    ],
    image: "https://i.ibb.co/kSzpnXJ/unnamed.png",
    qualifications: "মৌলিক কম্পিউটার জ্ঞান এবং ইন্টারনেট ব্যবহারের অভিজ্ঞতা।",
    certifications: "কোর্স শেষে একটি সার্টিফিকেট প্রদান করা হবে।",
    enrolledStudents: [
      { name: "Student 1", image: "https://i.pravatar.cc/150?img=1" },
      { name: "Student 2", image: "https://i.pravatar.cc/150?img=2" },
      { name: "Student 3", image: "https://i.pravatar.cc/150?img=3" },
      // More student images...
    ],
  },
  {
    id: 1,
    title: "তথ্য ও যোগাযোগ প্রযুক্তি (H.S.C.)",
    category: "আইসিটি",
    description:
      "আইসিটির বিভিন্ন বিষয় সম্পর্কে বিস্তারিত ধারণা এবং ব্যবহারিক জ্ঞান।",
    instructor: {
      name: "মোহাম্মদ হাসান",
      image: "https://i.ibb.co/kSzpnXJ/unnamed.png", // Example image
    },
    startDate: "২০২৪-০১-১৫",
    endDate: "২০২৪-০২-১৫",
    duration: "১ মাস",
    availableSeats: 25,
    batchNumber: "BATCH 1",
    outline: [
      {
        classNumber: 1,
        topics: [
          "AI সম্পর্কে ধারণা ও কিভাবে কাজ করে",
          "রোবোটিকস",
          "ক্রায়োসার্জারী",
          "বায়োমেট্রিকস",
          "বায়োফরমেট্রিক্সস",
          "জেনেটিক ইঞ্জিনিয়ারিং",
          "ন্যানোটেকনোলজি",
        ],
        description: "------------- এগুলো সম্পর্কে জাস্ট ধারণা দেওয়া...",
      },
      // More class outlines...
    ],
    image: "https://i.ibb.co/kSzpnXJ/unnamed.png",
    qualifications: "মৌলিক কম্পিউটার জ্ঞান এবং ইন্টারনেট ব্যবহারের অভিজ্ঞতা।",
    certifications: "কোর্স শেষে একটি সার্টিফিকেট প্রদান করা হবে।",
    enrolledStudents: [
      { name: "Student 1", image: "https://i.pravatar.cc/150?img=1" },
      { name: "Student 2", image: "https://i.pravatar.cc/150?img=2" },
      { name: "Student 3", image: "https://i.pravatar.cc/150?img=3" },
      // More student images...
    ],
  },
  // Other courses...
];

const saveEnrollmentToAPI = (values) => {
  console.log("Sending to API:", values); // Simulate API call
  notification.success({
    message: "এনরোলমেন্ট সফল হয়েছে!",
    description: `আপনি সফলভাবে ${values.courseTitle} কোর্সে এনরোল করেছেন।`,
  });
};

export default function CoursePage() {
  const [isEnrollModalVisible, setIsEnrollModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState([]);

  const fetchQuizeInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("/courses");
      if (response?.status === 200) {
        setLoading(false);
        const sortedData = response?.data?.courses?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        setCourseData(sortedData);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setIsEnrollModalVisible(true);
  };

  const closeEnrollModal = () => {
    setIsEnrollModalVisible(false);
    setSelectedCourse(null);
  };

  const handleEnrollSubmit = (values) => {
    saveEnrollmentToAPI({ ...values, courseTitle: selectedCourse.title });
    closeEnrollModal();
  };

  useEffect(() => {
    fetchQuizeInfo();
  }, []);

  const renderCourseCard = (course) => (
    <motion.div
      key={course.id}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white shadow-lg rounded-lg border hover:shadow-xl transition flex flex-col justify-between">
      <img
        src={"https://i.ibb.co/kSzpnXJ/unnamed.png"}
        alt={course.title}
        className="w-full h-[200px] object-cover rounded-t-md"
      />
      <div className="p-4 flex flex-col flex-grow ">
        <h3 className="text-2xl font-bold text-[#2D6A3F] bangla-text">
          {course.title}{" "}
          <span
            style={{
              position: "relative",
              top: "-213px",
              right: "-84px",
            }}
            className="text-xl text-white bg-[#80CC37] p-2 rounded-full w-8 text-white font-semibold">
            {"New"}
          </span>
        </h3>
        <p className="text-gray-600 text-md mb-2 flex-grow ">
          {course.description}
        </p>

        {/* Instructor Info */}
        <div className="flex items-center">
          <Avatar src={"https://i.pravatar.cc/150?img=1"} size="small" />
          <span className="ml-2">{course?.instructorName}</span>
        </div>

        {/* Course Duration, Start & End Date, Available Seats, Batch No */}

        {/* Enrolled Students - Manual Avatar Group */}
        <div className="mt-4 grid grid-cols-3">
          <div className="col-span-2">
            <h4 className="text-md font-semibold text-[#2D6A3F]">
              এনরোল্ড স্টুডেন্টস:
            </h4>
            <div className="flex space-x-2">
              <Avatar.Group>
                {course?.enrollments?.map((student, index) => (
                  <Tooltip key={index} title={student?.name}>
                    <Avatar
                      src={"https://i.pravatar.cc/150?img=1"}
                      size="small"
                    />
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          </div>
          <div className="">
            <p className="text-sm text-gray-600 text-right">
              <span>সময়কাল:</span> {course.duration}
            </p>
            {/* <p className="text-sm text-gray-600">
              <span>শুরু তারিখ:</span> {course.startDate}{" "}
              <span>শেষ তারিখ:</span> {course.endDate}
            </p> */}
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 mt-auto bangla-text">
        <Button
          size="small"
          type="primary"
          className="enroll-button hover:!bg-[#2D6A3F] hover:!text-white"
          onClick={() => handleEnrollClick(course)}>
          এনরোল করুন
        </Button>
        <Button
          size="small"
          className="details-button hover:!bg-[#2D6A3F] hover:!text-white"
          onClick={() => history.push(`/course/${course._id}`)}>
          বিস্তারিত
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#2D6A3F]">
        কোর্সসমূহ
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseData.map((course) => renderCourseCard(course))}
      </div>

      <EnrollmentModal
        visible={isEnrollModalVisible}
        onClose={closeEnrollModal}
        course={selectedCourse}
      />
    </div>
  );
}
