import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Tag,
  Timeline,
  Alert,
  Row,
  Col,
  Form,
  Input,
  Select,
  Modal,
  Divider,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  GlobalOutlined,
  RocketOutlined,
  DollarOutlined,
  HeartOutlined,
  GiftOutlined,
  LaptopOutlined,
  ToolOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  BankOutlined,
  UserSwitchOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
  MailOutlined,
  FilePdfOutlined,
  EyeOutlined,
  DownloadOutlined,
  NotificationOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TrophyOutlined,
  DollarCircleOutlined,
  GroupOutlined,
  MobileOutlined,
  FireOutlined,
} from "@ant-design/icons";
import ReviewsSection from "./ReviewsSection";
import CommitteeMembersSection from "./CommitteeMembersSection";

const { Option } = Select;
const { Text } = Typography;

// CountdownTimer Component
const CountdownTimer = ({ targetDate, onComplete, language }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        if (onComplete) onComplete();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (timeLeft.isCompleted) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-xl text-center">
        <Text strong className="text-white text-lg md:text-xl">
          {language === "bangla" ? "আবেদন বন্ধ!" : "Application Closed!"}
        </Text>
      </div>
    );
  }

  return (
      <div className="flex flex-wrap justify-center gap-3 md:gap-5">
      <div className="bg-green-100 text-green-800 rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px] text-center shadow-lg transform hover:scale-110 transition-all duration-300">
        <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1">
          {String(timeLeft.days).padStart(2, '0')}
        </div>
        <div className="text-xs md:text-sm font-semibold uppercase tracking-wide">
          {language === "bangla" ? "দিন" : "Days"}
        </div>
      </div>
      <div className="bg-green-100 text-green-800 rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px] text-center shadow-lg transform hover:scale-110 transition-all duration-300">
        <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <div className="text-xs md:text-sm font-semibold uppercase tracking-wide">
          {language === "bangla" ? "ঘণ্টা" : "Hours"}
        </div>
      </div>
      <div className="bg-green-100 text-green-800 rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px] text-center shadow-lg transform hover:scale-110 transition-all duration-300">
        <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <div className="text-xs md:text-sm font-semibold uppercase tracking-wide">
          {language === "bangla" ? "মিনিট" : "Minutes"}
        </div>
      </div>
      <div className="bg-green-100 text-green-800 rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px] text-center shadow-lg transform hover:scale-110 transition-all duration-300">
        <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div className="text-xs md:text-sm font-semibold uppercase tracking-wide">
          {language === "bangla" ? "সেকেন্ড" : "Seconds"}
        </div>
      </div>
    </div>
  );
};

// Counter Component
const Counter = ({ end, duration, label, icon }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime = null;
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentCount = Math.floor(progress * end);

            setCount(currentCount);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [end, duration]);

  return (
    <div
      ref={countRef}
      className="text-center p-5 md:p-7 bg-white/95 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
    >
      <div className="text-3xl md:text-4xl font-bold mb-3 text-green-600">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-green-800 mb-2">
        {count}+
      </div>
      <div className="text-base md:text-lg font-semibold text-gray-700 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};

// Scholarship Notice Component
const ScholarshipNotice = ({ language, isOpen, onClose }) => {
  const noticeContent = {
    bangla: {
      title: "দারুল মুত্তাক্বীন শিক্ষাবৃত্তি ২০২৬",
      subtitle: "বিস্তারিত তথ্য ও নির্দেশিকা",
      organizer: "আয়োজনে: দারুল মুত্তাক্বীন ফাউন্ডেশন",
      examCenter: "পরীক্ষার কেন্দ্র: তক্তারচালা সবুজ বাংলা উচ্চ বিদ্যালয়",
      writtenExamDate: "লিখিত পরীক্ষার তারিখ: এখনও নির্ধারিত হয়নি",
      vivaExamDate: "ভাইবা পরীক্ষার তারিখ: এখনও নির্ধারিত হয়নি",
      applicationPeriod:
        "আবেদনের সময়সীমা: ২৭ ডিসেম্বর ২০২৫ - ৩১ জানুয়ারি ২০২৬",
      participants: "অংশগ্রহণকারী: ৩য় থেকে ১২শ শ্রেণির সকল শিক্ষার্থী",

      importantDates: [
        {
          icon: <CalendarOutlined />,
          text: "আবেদন শুরু: ২৭ ডিসেম্বর ২০২৫ (দুপুর ২টা)",
        },
        { icon: <CalendarOutlined />, text: "আবেদন শেষ: ৩১ জানুয়ারি ২০২৬" },
        {
          icon: <ClockCircleOutlined />,
          text: "লিখিত পরীক্ষা: এখনও নির্ধারিত হয়নি",
        },
        {
          icon: <ClockCircleOutlined />,
          text: "ভাইবা পরীক্ষা: এখনও নির্ধারিত হয়নি",
        },
      ],

      groups: [
        { name: "চ গ্রুপ", classes: "৩য় ও ৪র্থ শ্রেণি", fee: "৫০ টাকা" },
        { name: "ঙ গ্রুপ", classes: "৫ম শ্রেণি", fee: "৫০ টাকা" },
        { name: "ঘ গ্রুপ", classes: "৬ষ্ঠ ও ৭ম শ্রেণি", fee: "১০০ টাকা" },
        { name: "গ গ্রুপ", classes: "৮ম শ্রেণি", fee: "১০০ টাকা" },
        { name: "খ গ্রুপ", classes: "৯ম ও ১০ম শ্রেণি", fee: "১০০ টাকা" },
        { name: "ক গ্রুপ", classes: "১১শ ও ১২শ শ্রেণি", fee: "১০০ টাকা" },
      ],

      importantNotes: [
        {
          icon: <InfoCircleOutlined />,
          title: "পরীক্ষার নির্দেশনা",
          points: [
            "একাধিক গ্রুপের জন্য একই বই সিলেবাস হিসেবে থাকলেও, বিভিন্ন গ্রুপের জন্য আলাদা প্রশ্নপত্র",
            "ছেলে-মেয়ে আলাদা কক্ষে পরীক্ষা দেওয়ার ব্যবস্থা",
            "শিক্ষার্থীদের নির্ধারিত আসনে বসে পরীক্ষা দিতে হবে",
          ],
        },
        {
          icon: <CheckCircleOutlined />,
          title: "যোগ্যতা ও মানবন্টন",
          points: [
            "লিখিত পরীক্ষায় ৭০% নম্বর পেলে ভাইবার জন্য ডাকা হবে",
            "ভুল উত্তরের জন্য নম্বর কর্তন করা হবে না",
            "প্রতিটি গ্রুপের জন্য আলাদা প্রশ্নপত্র",
          ],
        },
        {
          icon: <TrophyOutlined />,
          title: "পুরস্কার ও স্বীকৃতি",
          points: [
            "নগদ অর্থ পুরস্কার",
            "ক্রেস্ট ও সনদপত্র",
            "বিশেষ মেধাবৃত্তির সুযোগ",
          ],
        },
      ],

      applicationProcess: {
        title: "আবেদন পদ্ধতি",
        methods: [
          {
            type: "অনলাইন আবেদন",
            steps: [
              "ওয়েবসাইট: ourdmf.com",
              "শিক্ষাবৃত্তি অপশনে ক্লিক করুন",
              "অনলাইন ফর্ম পূরণ করুন",
              "অনলাইন পেমেন্ট সম্পন্ন করুন",
            ],
          },
          {
            type: "অফলাইন আবেদন",
            steps: [
              "দারুল মুত্তাক্বীন অফিসে সরাসরি আবেদন",
              "হতেয়া রোড, তক্তারচালা দাখিল মাদ্রাসার পূর্ব পাশে",
              "স্ব-স্ব শিক্ষাপ্রতিষ্ঠানে আবেদন",
            ],
          },
        ],
      },

      requirements: [
        {
          text: "আবেদন ফর্ম ইংরেজি বর্ণে পূরণ করতে হবে",
          icon: <BookOutlined />,
        },
        {
          text: "আবেদন ফি প্রদান (মোবাইল ব্যাংকিং/ক্যাশ)",
          icon: <DollarCircleOutlined />,
        },
        { text: "পাসপোর্ট সাইজের ছবি (ঐচ্ছিক)", icon: <UserOutlined /> },
      ],

      benefits: [
        "বিভিন্ন প্রতিষ্ঠানের সাথে প্রতিযোগিতামূলক পরীক্ষার অভিজ্ঞতা",
        "ইসলামিক ও জেনারেল বিষয়ে জ্ঞান বৃদ্ধি",
        "ভবিষ্যতের এডমিশন ও চাকরির জন্য উপযোগী",
        "পাবলিক পরীক্ষাভীতি দূরীকরণ",
        "মেধা যাচাইয়ের অনন্য সুযোগ",
      ],

      contact: {
        title: "যোগাযোগ",
        facebook: {
          page: "Facebook Page: Darul Muttaquine",
          group: "Facebook Group: Darul Muttaquine Foundation",
          youth: "দারুল মুত্তাক্বীন যুব সংঘ",
        },
        phoneNumbers: [
          { name: "আশিকুর রহমান (সভাপতি, DMF)", number: "01927-920081" },
          { name: "সাইফুল্লাহ সাদী (সহ-সভাপতি, DMF)", number: "01918737415" },
          { name: "তানভীর হোসেন (যুব সংঘ সভাপতি)", number: "01838243941" },
        ],
      },

      downloadLink: "https://drive.google.com/drive/folders/your-folder-link",
    },
    english: {
      title: "Darul Muttaqine Scholarship 2026",
      subtitle: "Detailed Information & Guidelines",
      organizer: "Organized by: Darul Muttaqine Foundation",
      examCenter: "Exam Center: Taktarchala Sobuj Bangla High School",
      writtenExamDate: "Written Exam Date: Not fixed yet",
      vivaExamDate: "Viva Exam Date: Not fixed yet",
      applicationPeriod:
        "Application Period: December 27, 2025 - January 31, 2026",
      participants: "Participants: Students from 3rd to 12th Grade",

      importantDates: [
        {
          icon: <CalendarOutlined />,
          text: "Application Starts: December 27, 2025 (2:00 PM)",
        },
        {
          icon: <CalendarOutlined />,
          text: "Application Ends: January 31, 2026",
        },
        {
          icon: <ClockCircleOutlined />,
          text: "Written Exam: Not fixed yet",
        },
        { icon: <ClockCircleOutlined />, text: "Viva Exam: Not fixed yet" },
      ],

      groups: [
        { name: "Cha Group", classes: "3rd & 4th Grade", fee: "50 Taka" },
        { name: "U Group", classes: "5th Grade", fee: "50 Taka" },
        { name: "Gh Group", classes: "6th & 7th Grade", fee: "100 Taka" },
        { name: "G Group", classes: "8th Grade", fee: "100 Taka" },
        { name: "Kha Group", classes: "9th & 10th Grade", fee: "100 Taka" },
        { name: "Ka Group", classes: "11th & 12th Grade", fee: "100 Taka" },
      ],

      importantNotes: [
        {
          icon: <InfoCircleOutlined />,
          title: "Exam Instructions",
          points: [
            "Separate question papers for different groups",
            "Separate rooms for boys and girls",
            "Students must sit in assigned seats",
          ],
        },
        {
          icon: <CheckCircleOutlined />,
          title: "Eligibility & Marks Distribution",
          points: [
            "70% marks required for viva exam",
            "No negative marking for wrong answers",
            "Different question papers for each group",
          ],
        },
        {
          icon: <TrophyOutlined />,
          title: "Prizes & Recognition",
          points: [
            "Cash prizes",
            "Crest & Certificates",
            "Special scholarship opportunities",
          ],
        },
      ],

      applicationProcess: {
        title: "Application Process",
        methods: [
          {
            type: "Online Application",
            steps: [
              "Website: ourdmf.com",
              "Click on Scholarship option",
              "Fill online form",
              "Complete online payment",
            ],
          },
          {
            type: "Offline Application",
            steps: [
              "Apply directly at Darul Muttaqine office",
              "Hoteya Road, east side of Taktarchala Dakhil Madrasa",
              "Apply at respective educational institutions",
            ],
          },
        ],
      },

      requirements: [
        {
          text: "Application form must be filled in English",
          icon: <BookOutlined />,
        },
        {
          text: "Application fee payment (Mobile Banking/Cash)",
          icon: <DollarCircleOutlined />,
        },
        { text: "Passport size photo (Optional)", icon: <UserOutlined /> },
      ],

      benefits: [
        "Experience of competitive exams with various institutions",
        "Knowledge enhancement in Islamic and general subjects",
        "Useful for future admission and job exams",
        "Reduction of public exam fear",
        "Unique opportunity for talent assessment",
      ],

      contact: {
        title: "Contact Information",
        facebook: {
          page: "Facebook Page: Darul Muttaquine",
          group: "Facebook Group: Darul Muttaquine Foundation",
          youth: "Darul Muttaqine Youth Union",
        },
        phoneNumbers: [
          { name: "Ashikur Rahman (President, DMF)", number: "01927-920081" },
          {
            name: "Saifullah Sadi (Vice President, DMF)",
            number: "01918737415",
          },
          {
            name: "Tanvir Hossain (Youth Union President)",
            number: "01838243941",
          },
        ],
      },

      downloadLink: "https://drive.google.com/drive/folders/your-folder-link",
    },
  };

  const content = noticeContent[language];

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width="95%"
      style={{
        maxWidth: "1200px",
        top: 20,
        padding: 0,
      }}
      bodyStyle={{
        padding: 0,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
      closeIcon={
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <CloseOutlined className="text-gray-700 text-lg" />
          </button>
        </div>
      }
    >
      <div className="scholarship-notice-modal">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <NotificationOutlined className="text-2xl" />
                  </div>
                  <span className="text-lg font-medium bg-white/20 px-3 py-1 rounded-full">
                    {language === "bangla"
                      ? "অফিসিয়াল নোটিস"
                      : "Official Notice"}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {content.title}
                </h1>
                <p className="text-blue-100 text-lg">{content.subtitle}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 w-full md:w-auto">
                <div className="flex flex-wrap gap-4">
                  {content.importantDates.map((date, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="text-blue-300">{date.icon}</div>
                      <span className="text-sm md:text-base">{date.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOutlined className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {language === "bangla" ? "পরীক্ষার কেন্দ্র" : "Exam Center"}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {content.examCenter}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <GroupOutlined className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {language === "bangla" ? "অংশগ্রহণকারী" : "Participants"}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {content.participants}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <CalendarOutlined className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {language === "bangla"
                      ? "আবেদনের সময়"
                      : "Application Period"}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {content.applicationPeriod}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrophyOutlined className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {language === "bangla" ? "আয়োজক" : "Organizer"}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {content.organizer}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Groups & Important Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Exam Groups */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                  <GroupOutlined className="text-blue-600" />
                  {language === "bangla"
                    ? "পরীক্ষার গ্রুপ সমূহ"
                    : "Exam Groups"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {content.groups.map((group, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 transition-colors border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {group.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {group.classes}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                          {group.fee}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {language === "bangla" ? "আবেদন ফি" : "Application Fee"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100">
                  {language === "bangla"
                    ? "গুরুত্বপূর্ণ তথ্য"
                    : "Important Information"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {content.importantNotes.map((note, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            index === 0
                              ? "bg-blue-100 text-blue-600"
                              : index === 1
                              ? "bg-green-100 text-green-600"
                              : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          {note.icon}
                        </div>
                        <h3 className="font-semibold text-gray-800">
                          {note.title}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {note.points.map((point, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Process */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
                  <BookOutlined className="text-green-600" />
                  {content.applicationProcess.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.applicationProcess.methods.map((method, index) => (
                    <div key={index} className="space-y-4">
                      <div
                        className={`p-4 rounded-lg ${
                          index === 0
                            ? "bg-green-50 border border-green-100"
                            : "bg-blue-50 border border-blue-100"
                        }`}
                      >
                        <h3 className="font-bold text-gray-800 mb-3">
                          {method.type}
                        </h3>
                        <ul className="space-y-2">
                          {method.steps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                  index === 0
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <span className="text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Requirements */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircleOutlined className="text-purple-600" />
                  {language === "bangla"
                    ? "প্রয়োজনীয় কাগজপত্র"
                    : "Required Documents"}
                </h2>
                <div className="space-y-3">
                  {content.requirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="text-purple-600 mt-1">{req.icon}</div>
                      <span className="text-gray-700">{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrophyOutlined className="text-blue-600" />
                  {language === "bangla" ? "সুবিধা সমূহ" : "Benefits"}
                </h2>
                <ul className="space-y-3">
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PhoneOutlined className="text-green-600" />
                  {content.contact.title}
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <NotificationOutlined />
                      <span className="font-medium">Facebook:</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <p className="text-sm text-gray-700">
                        {content.contact.facebook.page}
                      </p>
                      <p className="text-sm text-gray-700">
                        {content.contact.facebook.group}
                      </p>
                      <p className="text-sm text-gray-700">
                        {content.contact.facebook.youth}
                      </p>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MobileOutlined />
                      <span className="font-medium">
                        {language === "bangla"
                          ? "যোগাযোগ নম্বর"
                          : "Contact Numbers"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {content.contact.phoneNumbers.map((phone, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-gray-800 text-sm">
                            {phone.name}
                          </p>
                          <p className="text-blue-600 font-bold">
                            {phone.number}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="text-center">
                  <FilePdfOutlined className="text-3xl mb-3" />
                  <h3 className="font-bold text-lg mb-2"  >
                    
                    {language === "bangla"
                      ? "সম্পূর্ণ নোটিস ডাউনলোড"
                      : "Download Full Notice"}
                  </h3>
                  <p className="text-blue-100 text-sm mb-4">
                    {language === "bangla"
                      ? "বিস্তারিত তথ্যের জন্য আমাদের Google Drive থেকে ডাউনলোড করুন"
                      : "Download complete details from our Google Drive"}
                  </p>
                  <a
                    href={'https://drive.google.com/file/d/1ECZU-7SvYJD77rColdg8eqHibsrn6OQa/view?usp=sharing'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors w-full justify-center"
                  >
                    <DownloadOutlined />
                    {language === "bangla"
                      ? "গুগল ড্রাইভ থেকে ডাউনলোড"
                      : "Download from Google Drive"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <InfoCircleOutlined className="text-yellow-600 text-xl mt-1" />
              <div>
                <h4 className="font-bold text-gray-800 mb-2">
                  {language === "bangla"
                    ? "গুরুত্বপূর্ণ নোট"
                    : "Important Note"}
                </h4>
                <p className="text-gray-700">
                  {language === "bangla"
                    ? "সমস্ত তথ্য পরিবর্তনের অধিকার সংরক্ষিত। যে কোন পরিবর্তনের জন্য আমাদের ওয়েবসাইট নিয়মিত চেক করুন।"
                    : "All information is subject to change. Please check our website regularly for any updates."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Image Gallery Component
const ImageGallery = ({ language }) => {
  const galleryImages = [
    {
      src: "https://i.ibb.co.com/QFY2C5HM/1758013725527-1758013718578-9aa36e5-IMG-20250627-123122-396.jpg",
      title:
        language === "bangla"
          ? "শিক্ষাবৃত্তি প্রদান"
          : "Scholarship Distribution",
      description:
        language === "bangla"
          ? "মেধাবী শিক্ষার্থীদের মধ্যে শিক্ষাবৃত্তি বিতরণ"
          : "Scholarship distribution among meritorious students",
    },
    {
      src: "https://i.ibb.co.com/N2B4LW3n/1758013530203-1758013521553-9aa36e5-IMG-20250905-162026-344.jpg",
      title: language === "bangla" ? "ক্লাসরুম শিক্ষা" : "Classroom Education",
      description:
        language === "bangla"
          ? "আমাদের মানসম্মত ক্লাসরুম শিক্ষা কার্যক্রম"
          : "Our quality classroom education program",
    },
    {
      src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: language === "bangla" ? "শিক্ষক প্রশিক্ষণ" : "Teacher Training",
      description:
        language === "bangla"
          ? "শিক্ষকদের জন্য নিয়মিত প্রশিক্ষণের ব্যবস্থা"
          : "Regular training programs for teachers",
    },
    {
      src: "https://i.ibb.co.com/LdsjLT1f/1758013462786-1758013451531-9aa36e5-IMG-20250905-114921-957.jpg",
      title:
        language === "bangla" ? "সেমিনার ও ওয়ার্কশপ" : "Seminars & Workshops",
      description:
        language === "bangla"
          ? "বিভিন্ন শিক্ষামূলক সেমিনার ও ওয়ার্কশপ"
          : "Various educational seminars and workshops",
    },
  ];

  return (
    <div className="w-full py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-green-800">
            {language === "bangla" ? "আমাদের কার্যক্রম" : "Our Activities"}
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
            >
              <div className="relative h-56 md:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                  alt={image.title}
                  src={image.src}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-white font-bold text-lg md:text-xl mb-1 drop-shadow-lg">
                    {image.title}
                  </h3>
                </div>
              </div>
              <div className="p-5 md:p-6 group-hover:bg-gradient-to-br group-hover:from-green-50 group-hover:to-emerald-50 transition-colors duration-300">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                  {image.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Donation Section Component
const DonationSection = ({ language }) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [donationFund, setDonationFund] = useState("");

  const onFinish = (values) => {
    console.log("Donation details:", values);
  };

  return (
    <div className="w-full py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-white via-green-50/30 to-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-green-800">
            {language === "bangla" ? "দান করুন" : "Make Your Donation"}
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {language === "bangla"
              ? "আপনার দান অসহায় মানুষদের সাহায্য করতে এবং শিক্ষা প্রসারে গুরুত্বপূর্ণ ভূমিকা পালন করে"
              : "Your donation plays a vital role in helping the underprivileged and promoting education"}
          </p>
        </div>

        <div className="bg-green-50 rounded-3xl p-8 md:p-12 shadow-lg border-2 border-green-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            {/* Left side content */}
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 md:mb-8">
                {language === "bangla"
                  ? "দারুল মুত্তাক্বীন ফাউন্ডেশন"
                  : "Darul Muttaqine Foundation"}
              </h3>
              <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
                {language === "bangla"
                  ? "দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক প্রতিষ্ঠান যা শিক্ষা, দাওয়াহ ও মানবকল্যাণে নিবেদিত। বর্তমানে এটি সরকারের নিবন্ধন প্রক্রিয়াধীন রয়েছে।"
                  : "Darul Muttaqine Foundation is a non-political, non-profit organization dedicated to education, da'wah, and human welfare. Government registration is currently under process."}
              </p>
              <div className="p-6 md:p-8 bg-white rounded-2xl shadow-xl border-2 border-green-200 transform hover:scale-105 transition-transform duration-300">
                <p className="text-green-700 font-semibold text-lg md:text-xl flex items-start gap-4">
                  <HeartOutlined className="text-green-600 mt-1 text-2xl" />
                  <span>
                    {language === "bangla"
                      ? "আপনার দান দারুল মুত্তাক্বীন ফাউন্ডেশনের শিক্ষা ও মানবকল্যাণমূলক কার্যক্রমে সহায়তা করবে।"
                      : "Your donation will support Darul Muttaqine Foundation's education and welfare activities."}
                  </span>
                </p>
              </div>
            </div>

            {/* Right side form */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border-2 border-gray-100">
              <Form
                name="donation"
                onFinish={onFinish}
                layout="vertical"
                className="space-y-4 md:space-y-6"
              >
                <Form.Item
                  label={
                    <span className="text-base md:text-lg font-semibold">
                      {language === "bangla" ? "দান তহবিল" : "Donation Fund"}
                    </span>
                  }
                  name="fund"
                  rules={[
                    {
                      required: true,
                      message:
                        language === "bangla"
                          ? "অনুগ্রহ করে একটি তহবিল নির্বাচন করুন"
                          : "Please select a fund",
                    },
                  ]}
                >
                  <Select
                    placeholder={
                      language === "bangla" ? "নির্বাচন করুন" : "Select"
                    }
                    size="large"
                    onChange={setDonationFund}
                    className="h-12 md:h-14 text-base md:text-lg rounded-lg"
                  >
                    <Option value="education">
                      {language === "bangla"
                        ? "শিক্ষা তহবিল"
                        : "Education Fund"}
                    </Option>
                    <Option value="orphan">
                      {language === "bangla" ? "এতিম তহবিল" : "Orphan Fund"}
                    </Option>
                    <Option value="food">
                      {language === "bangla"
                        ? "খাদ্য বিতরণ"
                        : "Food Distribution"}
                    </Option>
                    <Option value="general">
                      {language === "bangla" ? "সাধারণ তহবিল" : "General Fund"}
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-base md:text-lg font-semibold">
                      {language === "bangla" ? "ফোন / ইমেইল" : "Phone / Email"}
                    </span>
                  }
                  name="contact"
                  rules={[
                    {
                      required: true,
                      message:
                        language === "bangla"
                          ? "অনুগ্রহ করে আপনার যোগাযোগের তথ্য দিন"
                          : "Please provide your contact information",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={
                      language === "bangla"
                        ? "মোবাইল/ইমেইল লিখুন"
                        : "Type mobile/email"
                    }
                    className="h-12 md:h-14 text-base md:text-lg rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-base md:text-lg font-semibold">
                      {language === "bangla"
                        ? "দানের পরিমাণ"
                        : "Donation Amount"}
                    </span>
                  }
                  name="amount"
                  rules={[
                    {
                      required: true,
                      message:
                        language === "bangla"
                          ? "অনুগ্রহ করে দানের পরিমাণ লিখুন"
                          : "Please enter donation amount",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    type="number"
                    placeholder={
                      language === "bangla"
                        ? "সংখ্যায় লিখুন"
                        : "Write in number"
                    }
                    onChange={(e) => setDonationAmount(e.target.value)}
                    prefix={<DollarOutlined className="text-gray-400" />}
                    className="h-12 md:h-14 text-base md:text-lg rounded-lg"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full bg-green-600 hover:bg-green-700 h-14 md:h-16 text-base md:text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    icon={<HeartOutlined className="text-xl" />}
                  >
                    {language === "bangla" ? "দান করুন" : "Donate Now"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Blog Section Component
const BlogSection = ({ language }) => {
  const blogPosts = [
    {
      id: 1,
      title:
        language === "bangla"
          ? "শিক্ষার গুরুত্ব"
          : "The Importance of Education",
      excerpt:
        language === "bangla"
          ? "শিক্ষা是人类进步的阶梯，它不仅能改变个人的命运，还能推动整个社会的发展。"
          : "Education is the ladder of human progress. It can not only change individual destiny but also promote the development of the entire society.",
      date: "15 March 2024",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      category: language === "bangla" ? "শিক্ষা" : "Education",
    },
    {
      id: 2,
      title:
        language === "bangla"
          ? "দান করার উপকারিতা"
          : "Benefits of Giving Charity",
      excerpt:
        language === "bangla"
          ? "দান不仅可以帮助需要帮助的人，还可以给捐赠者带来内心的平静和满足感。"
          : "Charity not only helps those in need but also brings inner peace and satisfaction to the donor.",
      date: "10 March 2024",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      category: language === "bangla" ? "দান" : "Charity",
    },
    {
      id: 3,
      title: language === "bangla" ? "সমাজসেবা" : "Community Service",
      excerpt:
        language === "bangla"
          ? "সমাজসেবা是建设更美好世界的重要途径，它能够增强社区凝聚力，改善人们的生活质量。"
          : "Community service is an important way to build a better world. It can enhance community cohesion and improve people's quality of life.",
      date: "5 March 2024",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      category: language === "bangla" ? "সমাজসেবা" : "Community",
    },
    {
      id: 4,
      title: language === "bangla" ? "স্বাস্থ্য সচেতনতা" : "Health Awareness",
      excerpt:
        language === "bangla"
          ? "স্বাস্থ্য সচেতনতা是预防疾病和维护整体健康的关键，通过教育和宣传可以提高公众的健康意识。"
          : "Health awareness is key to preventing diseases and maintaining overall health. Public health awareness can be improved through education and promotion.",
      date: "1 March 2024",
      image:
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      category: language === "bangla" ? "স্বাস্থ্য" : "Health",
    },
  ];

  return (
    <div className="py-12 md:py-24 px-4 md:px-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {language === "bangla"
              ? "সাম্প্রতিক ব্লগ পোস্ট"
              : "Recent Blog Posts"}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {language === "bangla"
              ? "আমাদের সংস্থার কার্যক্রম এবং সাম্প্রতিক খবর সম্পর্কে জানুন"
              : "Learn about our organization's activities and recent news"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  alt={post.title}
                  src={post.image}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 md:p-6 flex-grow">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <div className="px-4 md:px-6 pb-4 md:pb-6 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm md:text-base flex items-center">
                    <CalendarOutlined className="mr-2" />
                    {post.date}
                  </span>
                  <button className="text-green-600 font-semibold text-sm md:text-base flex items-center hover:text-green-700">
                    {language === "bangla" ? "আরও পড়ুন" : "Read More"}
                    <ArrowRightOutlined className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 md:py-4 md:px-8 rounded-2xl text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
            {language === "bangla" ? "সমস্ত ব্লগ দেখুন" : "View All Blogs"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Join Us Section Component
const JoinUsSection = ({ language }) => {
  return (
    <div
      className="py-16 md:py-28 px-4 md:px-6 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://i.ibb.co.com/v4MdvZyX/1758086923536-1758086915189-714c07e-IMG-20250725-160733-154.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>

      <div className="max-w-7xl mx-auto relative z-10 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
          {language === "bangla" ? "আমাদের সাথে যোগ দিন" : "Join Us"}
        </h2>
        <p className="text-lg md:text-xl mb-8 md:mb-12 max-w-4xl mx-auto">
          {language === "bangla"
            ? "আমাদের মিশনে অংশগ্রহণ করুন এবং একটি ভালো পরিবর্তন আনতে সাহায্য করুন"
            : "Participate in our mission and help make a positive change"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 h-full transform hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="text-4xl md:text-5xl mb-4 md:mb-6 text-green-400">
              <UserOutlined />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
              {language === "bangla" ? "স্বেচ্ছাসেবক" : "Volunteer"}
            </h3>
            <p className="mb-4 md:mb-6 text-base md:text-lg opacity-90">
              {language === "bangla"
                ? "আপনার সময় এবং দক্ষতা দান করুন আমাদের বিভিন্ন কার্যক্রমে সাহায্য করার জন্য"
                : "Donate your time and skills to help with our various activities"}
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl text-base md:text-lg w-full transition-all duration-300 shadow-lg hover:shadow-xl">
              {language === "bangla" ? "যোগ দিন" : "Join Now"}
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 h-full transform hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="text-4xl md:text-5xl mb-4 md:mb-6 text-green-400">
              <HeartOutlined />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
              {language === "bangla" ? "দান করুন" : "Donate"}
            </h3>
            <p className="mb-4 md:mb-6 text-base md:text-lg opacity-90">
              {language === "bangla"
                ? "আর্থিকভাবে আমাদের মিশন সমর্থন করুন এবং একটি পার্থক্য তৈরি করুন"
                : "Support our mission financially and make a difference"}
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl text-base md:text-lg w-full transition-all duration-300 shadow-lg hover:shadow-xl">
              {language === "bangla" ? "দান করুন" : "Donate Now"}
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 h-full transform hover:scale-105 transition-all duration-300 border border-white/20">
            <div className="text-4xl md:text-5xl mb-4 md:mb-6 text-green-400">
              <TeamOutlined />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
              {language === "bangla" ? "অংশীদার হন" : "Partner With Us"}
            </h3>
            <p className="mb-4 md:mb-6 text-base md:text-lg opacity-90">
              {language === "bangla"
                ? "আমাদের সাথে অংশীদারিত্ব করুন এবং আমাদের প্রভাব বৃদ্ধি করুন"
                : "Partner with us and amplify our impact"}
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-2xl text-base md:text-lg w-full transition-all duration-300 shadow-lg hover:shadow-xl">
              {language === "bangla" ? "যোগাযোগ করুন" : "Contact Us"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [language, setLanguage] = useState("bangla");
  const [noticeModalVisible, setNoticeModalVisible] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(true);
  const [globalTimeLeft, setGlobalTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Application period: Dec 27, 2025 2:00 PM to Jan 31, 2026 12:00 AM
  const applicationStart = new Date('2025-12-27T14:00:00');
  const applicationEnd = new Date('2026-01-31T00:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = applicationEnd.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setGlobalTimeLeft({ days, hours, minutes, seconds });
        setIsApplicationOpen(true);
      } else {
        setGlobalTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsApplicationOpen(false);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const content = {
    bangla: {
      title: "দারুল মুত্তাক্বীন ফাউন্ডেশন",
      description:
        "দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক শিক্ষা, দাওয়াহ ও পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক প্রতিষ্ঠান। 'শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে নিজেদের নিয়োজিত রাখা'",
      scholarshipTitle: "আসন্ন দারুল মুত্তাক্বীন ফাউন্ডেশন শিক্ষাবৃত্তি ২০২৬",
      scholarshipText:
        "রেজিস্ট্রেশন শুরু হবে ২৭ ডিসেম্বর ২০২৫ দুপুর ২.০০ টা থেকে ৩১ জানুয়ারি ২০২৬। আগ্রহী শিক্ষার্থীরা এখনই রেজিস্ট্রেশন করুন।",
      scholarshipSubtext: "বাকি সময়ঃ",
      registerButton: "রেজিস্ট্রেশন করুন",
      languageButton: "English",
      features: [
        {
          title: "শিক্ষাবৃত্তি প্রোগ্রাম",
          description:
            "মেধাবী কিন্তু আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের জন্য সম্পূর্ণ বিনামূল্যে শিক্ষাবৃত্তি প্রদান।",
          icon: (
            <DollarOutlined className="text-2xl md:text-3xl text-green-600" />
          ),
          color: "green",
        },
        {
          title: "দরিদ্রদের স্বাবলম্বীকরণ",
          description:
            "দরিদ্র ও অসহায় মানুষদের আত্মনির্ভরশীল করে গড়ে তোলার জন্য বিভিন্ন প্রশিক্ষণ ও আর্থিক সহায়তা প্রদান।",
          icon: <UserOutlined className="text-2xl md:text-3xl text-blue-600" />,
          color: "blue",
        },
        {
          title: "খাদ্য সহায়তা",
          description:
            "দুঃস্থ ও প্রয়োজনীয় মানুষের মধ্যে বিনামূল্যে খাদ্য বিতরণের কার্যক্রম।",
          icon: (
            <GiftOutlined className="text-2xl md:text-3xl text-orange-600" />
          ),
          color: "orange",
        },
        {
          title: "ফ্রি অনলাইন/অফলাইন কোর্স",
          description:
            "ইংরেজি ও আইসিটি বিষয়ে বিনামূল্যে অনলাইন এবং অফলাইন প্রশিক্ষণ প্রদান。",
          icon: (
            <LaptopOutlined className="text-2xl md:text-3xl text-purple-600" />
          ),
          color: "purple",
        },
      ],
      timeline: [
        {
          label: "২৭ ডিসেম্বর, ২০২৫ (২:০০ PM)",
          children: "রেজিস্ট্রেশন শুরু",
          color: "green",
        },
        {
          label: "৩১ জানুয়ারি, ২০২৬",
          children: "প্রাথমিক আবেদন শেষ তারিখ",
          color: "blue",
        },
        {
          label: "নির্ধারিত হয়নি",
          children: "স্কলারশিপ পরীক্ষা",
          color: "purple",
        },
      ],
      stats: [
        { value: 500, label: "শিক্ষার্থী", icon: <TeamOutlined /> },
        { value: 50, label: "শিক্ষক", icon: <UserSwitchOutlined /> },
        { value: 30, label: "শিক্ষা প্রতিষ্ঠান", icon: <BankOutlined /> },
        { value: 5, label: "বছর", icon: <CalendarOutlined /> },
      ],
    },
    english: {
      title: "Darul Muttakin Foundation",
      description:
        "Darul Muttakin Foundation is a non-political, non-profit educational, Dawah and welfare service organization dedicated to human welfare. 'To engage ourselves in religious education, propagation and welfare work solely for the pleasure of Allah'",
      scholarshipTitle: "Upcoming DMF Scholarship 2026",
      scholarshipText:
        "Registration starts from December 27, 2:00 PM to January 31, 2026. Interested students can register now.",
      scholarshipSubtext: "Time remaining:",
      registerButton: "Register Now",
      languageButton: "বাংলা",
      features: [
        {
          title: "Scholarship Program",
          description:
            "Full scholarships for talented but financially disadvantaged students.",
          icon: (
            <DollarOutlined className="text-2xl md:text-3xl text-green-600" />
          ),
          color: "green",
        },
        {
          title: "Poverty Alleviation",
          description:
            "Training and financial support to make poor and helpless people self-reliant.",
          icon: <UserOutlined className="text-2xl md:text-3xl text-blue-600" />,
          color: "blue",
        },
        {
          title: "Food Donation",
          description:
            "Free food distribution programs for the distressed and needy people.",
          icon: (
            <GiftOutlined className="text-2xl md:text-3xl text-orange-600" />
          ),
          color: "orange",
        },
        {
          title: "Free Online/Offline Courses",
          description:
            "Free training in English and ICT through online and offline platforms.",
          icon: (
            <LaptopOutlined className="text-2xl md:text-3xl text-purple-600" />
          ),
          color: "purple",
        },
      ],
      timeline: [
        {
          label: "December 27, 2025 (2:00 PM)",
          children: "Registration begins",
          color: "green",
        },
        {
          label: "January 31, 2026",
          children: "Initial application deadline",
          color: "blue",
        },
        {
          label: "Not fixed yet",
          children: "Scholarship test",
          color: "purple",
        },
      ],
      stats: [
        { value: 500, label: "Students", icon: <TeamOutlined /> },
        { value: 50, label: "Teachers", icon: <UserSwitchOutlined /> },
        { value: 30, label: "Institutions", icon: <BankOutlined /> },
        { value: 5, label: "Years", icon: <CalendarOutlined /> },
      ],
    },
  };

  const handleRegistrationClick = () => {
    window.location.href = "/scholarship-public";
  };

  const toggleLanguage = () => {
    setLanguage(language === "bangla" ? "english" : "bangla");
  };

  const currentContent = content[language];

  return (
    <div className="home-container">
      {/* Scholarship Announcement Banner */}
      <div className="w-full relative bg-gradient-to-b from-green-700 via-green-600 to-green-500 text-white py-12 md:py-20 px-4 md:px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-6 md:mb-8 animate-fade-in">
            <span className="inline-flex items-center bg-yellow-400 text-green-900 text-sm md:text-lg font-bold px-5 md:px-7 py-2 md:py-3 rounded-full shadow-xl transform hover:scale-105 transition-transform duration-300">
              <RocketOutlined className="mr-2 text-xl" />
              {language === "bangla" ? "শিক্ষাবৃত্তি ২০২৬ এর আবেদন চলছে" : "Scholarship 2026 Application is Ongoing"}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8 leading-tight drop-shadow-2xl">
            {currentContent.scholarshipTitle}
          </h2>

          <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed opacity-95">
            {currentContent.scholarshipText}
          </p>

          {/* Countdown Timer Section */}
          <div className="mb-8 md:mb-12">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-5 md:px-7 py-3 md:py-4 mb-6 shadow-lg">
              <ClockCircleOutlined className="text-white mr-3 text-xl md:text-2xl" />
              <Text strong className="text-white text-base md:text-xl font-semibold">
                {currentContent.scholarshipSubtext}
              </Text>
            </div>
            
            <div className="flex justify-center mb-8">
              <CountdownTimer 
                targetDate={applicationEnd}
                onComplete={() => setIsApplicationOpen(false)}
                language={language}
              />
            </div>

            {/* <div className="flex justify-center">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 md:p-4 inline-block">
                <Text className="text-white text-sm md:text-base">
                  <CalendarOutlined className="mr-2" />
                  {language === "bangla" ? "আবেদনের সময়সীমা" : "Application Period"}: 
                  <br className="md:hidden" />
                  <span className="font-bold ml-1 md:ml-2">
                    ২৭ ডিসেম্বর - ১৩ জানুয়ারি
                  </span>
                </Text>
              </div>
            </div> */}
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-10 md:mb-16">
            <button
              onClick={handleRegistrationClick}
              disabled={!isApplicationOpen}
              className={`font-bold border-0 px-8 md:px-12 py-4 md:py-5 text-base md:text-xl rounded-2xl transition-all duration-300 flex items-center shadow-lg w-full md:w-auto justify-center transform hover:scale-105 active:scale-95 ${
                isApplicationOpen 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isApplicationOpen 
                ? currentContent.registerButton 
                : (language === "bangla" ? "আবেদন বন্ধ" : "Application Closed")}
              <ArrowRightOutlined className="ml-2 md:ml-3 text-xl" />
            </button>

            <button
              onClick={toggleLanguage}
              className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-6 md:px-10 py-3 md:py-4 text-base md:text-lg rounded-2xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center w-full md:w-auto shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <GlobalOutlined className="mr-2 md:mr-3" />
              {currentContent.languageButton}
            </button>
          </div>

          {/* Stats Section with Animated Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-12">
            {currentContent.stats.map((stat, index) => (
              <Counter
                key={index}
                end={stat.value}
                duration={2000}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scholarship Notice Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white py-10 md:py-14 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center flex-1">
              <div className="bg-white/20 backdrop-blur-sm p-4 md:p-5 rounded-2xl mr-4 md:mr-6 shadow-lg">
                <NotificationOutlined className="text-3xl md:text-4xl" />
              </div>
              <div>
                <h3 className="text-xl md:text-3xl font-extrabold mb-2 md:mb-3">
                  {language === "bangla"
                    ? "শিক্ষাবৃত্তি নোটিস"
                    : "Scholarship Notice"}
                </h3>
                <p className="text-base md:text-xl opacity-95 leading-relaxed">
                  {language === "bangla"
                    ? "দারুল মুত্তাক্বীন শিক্ষাবৃত্তি ২০২৬ এর সম্পূর্ণ তথ্য"
                    : "Complete information about Darul Muttaqine Scholarship 2026"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 md:gap-5 w-full md:w-auto">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="large"
                onClick={() => setNoticeModalVisible(true)}
                className="bg-green-100 text-green-800 hover:bg-green-200 border-0 font-bold h-12 md:h-14 px-6 md:px-8 text-base md:text-lg flex-1 md:flex-none rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="hidden md:inline">
                  {language === "bangla" ? "নোটিস দেখুন" : "View Notice"}
                </span>
                <span className="md:hidden">
                  {language === "bangla" ? "দেখুন" : "View"}
                </span>
              </Button>

              <Button
                type="default"
                icon={<FilePdfOutlined />}
                size="large"
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1ECZU-7SvYJD77rColdg8eqHibsrn6OQa/view?usp=sharing",
                    "_blank"
                  )
                }
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-bold h-12 md:h-14 px-6 md:px-8 text-base md:text-lg flex-1 md:flex-none rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="hidden md:inline">
                  {language === "bangla" ? "PDF ডাউনলোড" : "Download PDF"}
                </span>
                <span className="md:hidden">
                  {language === "bangla" ? "PDF" : "PDF"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <ImageGallery language={language} />

      {/* Features Section */}
      <div className="w-full py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-green-800">
              {language === "bangla" ? "আমাদের সেবাসমূহ" : "Our Services"}
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto rounded-full"></div>
            <p className="text-gray-700 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
              {language === "bangla" 
                ? "মানবকল্যাণে আমাদের নিবেদিত সেবাসমূহ" 
                : "Our dedicated services for human welfare"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {currentContent.features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-24 rounded-xl flex items-center justify-center mx-auto mb-4 bg-green-100">
                    <div className="text-green-600 text-2xl md:text-3xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="w-full py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-green-800">
              {language === "bangla"
                ? "স্কলারশিপ সময়সূচী ২০২৬"
                : "Scholarship Timeline"}
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto rounded-full"></div>
          </div>

          <div className="px-2 md:px-0 bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-200">
            <Timeline
              items={currentContent.timeline}
              mode="alternate"
              className="scholarship-timeline"
            />
          </div>
        </div>
      </div>

      {/* Donation Section */}
      <DonationSection language={language} />

      {/* Blog Section */}
      {/* <BlogSection language={language} /> */}

      {/* Join Us Section */}
      <JoinUsSection language={language} />

      {/* Reviews Section */}
      {/* <ReviewsSection language={language} /> */}

      {/* Committee Members Section */}
      <CommitteeMembersSection language={language} />

      {/* Scholarship Notice Modal */}
      <ScholarshipNotice
        language={language}
        isOpen={noticeModalVisible}
        onClose={() => setNoticeModalVisible(false)}
      />

      {/* Mobile Alert */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden animate-bounce">
        <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white p-5 rounded-2xl shadow-xl max-w-xs border-2 border-white/20 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <NotificationOutlined className="text-xl flex-shrink-0" />
            </div>
            <div>
              <p className="text-sm font-bold mb-2">
                {language === "bangla"
                  ? "শিক্ষাবৃত্তি নোটিস"
                  : "Scholarship Notice"}
              </p>
              <button
                onClick={() => setNoticeModalVisible(true)}
                className="text-green-100 hover:text-white text-sm font-semibold underline decoration-2"
              >
                {language === "bangla" ? "এখানে ক্লিক করুন" : "Click here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}