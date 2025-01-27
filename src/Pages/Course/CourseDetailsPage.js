import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button } from "antd";

const coursesData = [
  {
    id: 1,
    title: "কোর্স অফ আইসিটি (ইন্টার)",
    category: "আইসিটি",
    description:
      "আইসিটির বিভিন্ন বিষয় সম্পর্কে বিস্তারিত ধারণা এবং ব্যবহারিক জ্ঞান।",
    instructor: "মোহাম্মদ হাসান",
    instructorProfession: "আইসিটি বিশেষজ্ঞ",
    instructorEducation: "বিএসসি ইন কম্পিউটার সায়েন্স",
    startDate: "২০২৪-০১-১৫",
    endDate: "২০২৪-০২-১৫",
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
      {
        classNumber: 2,
        topics: [
          "ডেটা কমিউনিকেশন এর ধারণা",
          "ব্যান্ড উইডথ",
          "কো- এক্সিয়াল",
          "টুস্টেড পেয়ার",
          "মাইক্রোয়েব",
          "ওয়্যারলেস কমিউনিকেশন সিস্টেম",
          "ওয়াই ম্যাক্স",
          "নেটওয়ার্ক টপোলজি",
        ],
        description: "------------- এগুলো সম্পর্কে জাস্ট ধারণা দেওয়া",
      },
    ],
    image: "https://i.ibb.co/kSzpnXJ/unnamed.png",
    qualifications: "মৌলিক কম্পিউটার জ্ঞান এবং ইন্টারনেট ব্যবহারের অভিজ্ঞতা।",
    certifications: "কোর্স শেষে একটি সার্টিফিকেট প্রদান করা হবে।",
  },
];

export default function CourseDetailsPage() {
  const { id } = useParams();
  const history = useHistory();

  const course = coursesData.find((c) => c.id === parseInt(id));

  // if (!course) {
  //   return <div>কোর্স পাওয়া যায়নি</div>;
  // }

  const handleEnroll = () => {
    history.push(`/checkout/${id}`);
  };

  return (
    <div className="container mx-auto py-12 px-8 bg-gray-50">
      <Button
        onClick={() => history.goBack()}
        className="mb-8 text-lg font-semibold"
        style={{
          borderColor: "#2D6A3F",
          color: "#2D6A3F",
          padding: "10px 20px",
          fontSize: "18px",
        }}>
        ← পেছনে যান
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bangla-text">
        <div className="relative">
          <img
            src={course?.image}
            alt={course?.title}
            className="w-full h-[440px] object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-[#2D6A3F] mb-6">
            {course?.title}
          </h1>
          <p className="text-lg text-gray-700 mb-4">{course?.description}</p>

          <div className="mb-4">
            <p className="text-xl font-semibold text-gray-800">
              <span className="font-normal">ইন্সট্রাক্টর:</span>{" "}
              {course?.instructor}
            </p>
            <p className="text-xl font-semibold text-gray-800">
              <span className="font-normal">পেশা:</span>{" "}
              {course?.instructorProfession}
            </p>
            <p className="text-xl font-semibold text-gray-800">
              <span className="font-normal">শিক্ষাগত যোগ্যতা:</span>{" "}
              {course?.instructorEducation}
            </p>
            <p className="text-xl font-semibold text-gray-800">
              <span className="font-normal">শুরু তারিখ:</span>{" "}
              {course?.startDate}
            </p>
            <p className="text-xl font-semibold text-gray-800">
              <span className="font-normal">শেষ তারিখ:</span> {course?.endDate}
            </p>
            <p className="text-xl font-semibold text-gray-800">
              <span className="font-normal">যোগ্যতা:</span>{" "}
              {course?.qualifications}
            </p>
            <p className="text-xl font-semibold text-gray-800">
              <span className="font-normal">সার্টিফিকেশন:</span>{" "}
              {course?.certifications}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-[#2D6A3F] mb-6">
          কোর্সের বিষয়বস্তু
        </h2>
        {course?.outline?.map((item, index) => (
          <div key={index} className="mb-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {item?.classNumber}ম ক্লাস:
            </h3>
            <ul className="list-disc list-inside text-lg text-gray-700">
              {item?.topics?.map((topic, idx) => (
                <li key={idx} className="mb-2">
                  {topic}
                </li>
              ))}
            </ul>
            {item.description && (
              <p className="text-lg text-gray-500 mt-2">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Button
          onClick={handleEnroll}
          className="bg-[#2D6A3F] text-white py-3 px-6 rounded-lg text-xl hover:bg-green-700 transition duration-300">
          কোর্সে অংশগ্রহণ করুন
        </Button>
      </div>
    </div>
  );
}
