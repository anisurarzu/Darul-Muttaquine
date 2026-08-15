import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Modal,
  Typography,
  Divider,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  HeartOutlined,
  GiftOutlined,
  LaptopOutlined,
  UserOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  DownloadOutlined,
  NotificationOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TrophyOutlined,
  GroupOutlined,
  GlobalOutlined,
  DollarCircleOutlined,
  PhoneOutlined,
  MobileOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { coreAxios } from "../../utilities/axios";
import "./home.css";

const { Option } = Select;
const { Text } = Typography;

// Helper function to normalize institute names (combine similar ones)
const normalizeInstituteName = (instituteName) => {
  if (!instituteName) return "";
  
  // Convert to lowercase and trim
  let normalized = instituteName.toString().toLowerCase().trim();
  
  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, " ");
  
  // Remove common suffixes/prefixes that might cause duplicates (both English and Bengali)
  const commonWords = [
    'school', 'high school', 'college', 'institute', 'academy', 
    'madrasah', 'madrasha', 'madrasa', 'madrasah', 'madrasa',
    'বিদ্যালয়', 'মাদ্রাসা', 'কলেজ', 'স্কুল', 'একাডেমী', 'একাডেমি'
  ];
  
  commonWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    normalized = normalized.replace(regex, "");
  });
  
  // Remove special characters except spaces and Bengali characters
  normalized = normalized.replace(/[^\w\s\u0980-\u09FF]/g, "");
  
  // Remove numbers at the end (like "School 1", "School 2")
  normalized = normalized.replace(/\s+\d+$/, "");
  
  // Trim again
  normalized = normalized.trim();
  
  return normalized;
};

// Class name to number (for scholarship qualification logic, same as ResultDetails)
const CLASS_NAME_TO_NUMBER = {
  Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8, Nine: 9,
  Ten: 10, Eleven: 11, Twelve: 12,
};
const getClassNumber = (instituteClass) => {
  if (instituteClass == null) return NaN;
  const s = String(instituteClass).trim();
  const n = parseInt(s, 10);
  if (!Number.isNaN(n)) return n;
  return CLASS_NAME_TO_NUMBER[s] ?? NaN;
};

// Improved Levenshtein distance calculation
const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return matrix[len1][len2];
};

// Calculate similarity using Levenshtein distance
const calculateSimilarity = (str1, str2) => {
  if (str1 === str2) return 1;
  if (str1.length === 0 || str2.length === 0) return 0;
  
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(str1, str2);
  const similarity = 1 - (distance / maxLen);
  
  // Also check if one contains the other (for partial matches)
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.includes(shorter) && shorter.length >= 3) {
    const containmentScore = shorter.length / longer.length;
    return Math.max(similarity, containmentScore * 0.9); // Weight containment slightly less
  }
  
  return similarity;
};

// Helper function to find similar institute names
const findSimilarInstitute = (instituteName, existingInstitutes) => {
  const normalized = normalizeInstituteName(instituteName);
  
  if (!normalized || normalized.length < 3) return null;
  
  // Check for exact match after normalization
  for (const existing of existingInstitutes) {
    const existingNormalized = normalizeInstituteName(existing);
    if (existingNormalized === normalized && existingNormalized.length > 0) {
      return existing;
    }
  }
  
  // Check for similarity (fuzzy matching) with lower threshold for better matching
  let bestMatch = null;
  let bestSimilarity = 0;
  
  for (const existing of existingInstitutes) {
    const existingNormalized = normalizeInstituteName(existing);
    if (existingNormalized.length < 3) continue;
    
    const similarity = calculateSimilarity(normalized, existingNormalized);
    
    // Use dynamic threshold based on string length
    // Shorter strings need higher similarity, longer strings can be more flexible
    const threshold = normalized.length < 10 ? 0.75 : 0.70;
    
    if (similarity > threshold && similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = existing;
    }
  }
  
  return bestMatch;
};

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
const Counter = ({ end, duration, label, icon, showPlus = true }) => {
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
        {count}{showPlus ? '+' : ''}
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
      examCenter: "পরীক্ষার কেন্দ্র: তক্তারচালা সবুজ বাংলা উচ্চ বিদ্যালয়, তক্তারচালা, সখীপুর, টাঙ্গাইল",
      writtenExamDate: "লিখিত পরীক্ষার তারিখ: ২৭ ফেব্রুয়ারি ২০২৬",
      vivaExamDate: "ভাইবা পরীক্ষা: পরবর্তী শুক্রবার। ভাইবার জন্য নির্বাচিতদের তালিকা ওয়েবসাইটে প্রকাশ করা হবে।",
      applicationPeriod:
        "আবেদনের সময়সীমা: ২৭ ডিসেম্বর ২০২৫ - ২৫ ফেব্রুয়ারি ২০২৬",
      participants: "অংশগ্রহণকারী: ৩য় থেকে ১২শ শ্রেণির সকল শিক্ষার্থী",

      examSchedule: {
        date: "২৭ ফেব্রুয়ারি ২০২৬",
        center: "Takter Chala Sabuj Bangla High School, Takter chala, Sakhipur, Tangail",
        slots: [
          { group: "চ ও ঙ গ্রুপ (৩য়–৫ম শ্রেণি)", time: "১০:০০ AM - ১০:৩০ AM" },
          { group: "৬ষ্ঠ–১২ শ্রেণি", time: "১০:৪৫ AM - ১১:৪৫ AM" },
        ],
      },

      importantDates: [
        {
          icon: <CalendarOutlined />,
          text: "লিখিত পরীক্ষা: ২৭ ফেব্রুয়ারি ২০২৬",
        },
        {
          icon: <ClockCircleOutlined />,
          text: "ভাইবা: পরবর্তী শুক্রবার (নির্বাচিতদের তালিকা ওয়েবসাইটে)",
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
      examCenter: "Exam Center: Taktarchala Sobuj Bangla High School, Taktarchala, Sakhipur, Tangail",
      writtenExamDate: "Written Exam Date: 27 February 2026",
      vivaExamDate: "Viva Exam: Next Friday. List of selected candidates for viva will be published on the website.",
      applicationPeriod:
        "Application Period: December 27, 2025 - February 25, 2026",
      participants: "Participants: Students from 3rd to 12th Grade",

      examSchedule: {
        date: "27 February 2026",
        center: "Takter Chala Sabuj Bangla High School, Takter chala, Sakhipur, Tangail",
        slots: [
          { group: "Cha & U Group (3rd–5th Grade)", time: "10:00 AM - 10:30 AM" },
          { group: "6th–12th Grade", time: "10:45 AM - 11:45 AM" },
        ],
      },

      importantDates: [
        {
          icon: <CalendarOutlined />,
          text: "Written Exam: 27 February 2026",
        },
        {
          icon: <ClockCircleOutlined />,
          text: "Viva: Next Friday (Selected list will be on website)",
        },
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

          {/* Exam Schedule - AdmitCard style */}
          {content.examSchedule && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <ClockCircleOutlined />
                {language === "bangla" ? "পরীক্ষার সময়সূচী" : "Exam Schedule"}
              </h2>
              <p className="font-semibold text-gray-800 mb-2">
                {language === "bangla" ? "তারিখ:" : "Date:"} {content.examSchedule.date}
              </p>
              <div className="space-y-3">
                {content.examSchedule.slots.map((slot, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-2 bg-white border border-green-200 rounded-lg px-4 py-3">
                    <span className="font-medium text-gray-800">{slot.group}</span>
                    <span className="text-green-700 font-semibold">{slot.time}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                {language === "bangla"
                  ? "ভাইবা পরীক্ষা পরবর্তী শুক্রবার। ভাইবার জন্য নির্বাচিতদের তালিকা ওয়েবসাইটে (ourdmf.com) প্রকাশ করা হবে — খেয়াল রাখুন।"
                  : "Viva exam on next Friday. List of selected candidates for viva will be published on the website (ourdmf.com) — stay tuned."}
              </p>
            </div>
          )}

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

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const galleryContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const galleryItem = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
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
      variant: "hero",
    },
    {
      src: "https://i.ibb.co.com/N2B4LW3n/1758013530203-1758013521553-9aa36e5-IMG-20250905-162026-344.jpg",
      title: language === "bangla" ? "ক্লাসরুম শিক্ষা" : "Classroom Education",
      description:
        language === "bangla"
          ? "আমাদের মানসম্মত ক্লাসরুম শিক্ষা কার্যক্রম"
          : "Our quality classroom education program",
      variant: "side",
    },
    {
      src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: language === "bangla" ? "শিক্ষক প্রশিক্ষণ" : "Teacher Training",
      description:
        language === "bangla"
          ? "শিক্ষকদের জন্য নিয়মিত প্রশিক্ষণের ব্যবস্থা"
          : "Regular training programs for teachers",
      variant: "side",
    },
    {
      src: "https://i.ibb.co.com/LdsjLT1f/1758013462786-1758013451531-9aa36e5-IMG-20250905-114921-957.jpg",
      title:
        language === "bangla" ? "সেমিনার ও ওয়ার্কশপ" : "Seminars & Workshops",
      description:
        language === "bangla"
          ? "বিভিন্ন শিক্ষামূলক সেমিনার ও ওয়ার্কশপ"
          : "Various educational seminars and workshops",
      variant: "wide",
    },
  ];

  return (
    <section className="home-section home-gallery">
      <div className="home-section__inner">
        <motion.div
          className="home-section__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
        >
          <div className="home-section__header-copy">
            <span className="home-section__eyebrow">
              {language === "bangla" ? "কার্যক্রম" : "Our Work"}
            </span>
            <h2 className={`home-section__title ${language === "bangla" ? "bangla-text" : ""}`}>
              {language === "bangla" ? "আমাদের কার্যক্রম" : "Our Activities"}
            </h2>
            <hr className="home-divider" />
            <p className={`home-section__lead ${language === "bangla" ? "bangla-text" : ""}`}>
              {language === "bangla"
                ? "শিক্ষা, প্রশিক্ষণ ও সমাজসেবার মাধ্যমে আমরা যে পরিবর্তন গড়ে তুলছি—তার একটি ঝলক।"
                : "A glimpse of the change we build through education, training, and community service."}
            </p>
          </div>
          <div className="home-gallery__index" aria-hidden="true">
            04
          </div>
        </motion.div>

        <motion.div
          className="home-gallery__mosaic"
          variants={galleryContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {galleryImages.map((image, index) => (
            <motion.article
              key={index}
              className={`home-gallery__tile home-gallery__tile--${image.variant}`}
              variants={galleryItem}
            >
              <img alt={image.title} src={image.src} loading="lazy" />
              <div className="home-gallery__tile-shade" />
              <div className="home-gallery__tile-content">
                <span className="home-gallery__tile-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className={language === "bangla" ? "bangla-text" : ""}>
                  {image.title}
                </h3>
                <div className="home-gallery__tile-line" />
                <p className={language === "bangla" ? "bangla-text" : ""}>
                  {image.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Donation Section Component
const DonationSection = ({ language }) => {
  const onFinish = (values) => {
    console.log("Donation details:", values);
  };

  return (
    <section className="home-section home-donation">
      <div className="home-section__inner">
        <motion.div
          className="home-section__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <span className="home-section__eyebrow">
            {language === "bangla" ? "সমর্থন" : "Support"}
          </span>
          <h2 className={`home-section__title ${language === "bangla" ? "bangla-text" : ""}`}>
            {language === "bangla" ? "দান করুন" : "Make Your Donation"}
          </h2>
          <hr className="home-divider" />
          <p className={`home-section__lead ${language === "bangla" ? "bangla-text" : ""}`} style={{ marginTop: "1rem" }}>
            {language === "bangla"
              ? "আপনার দান অসহায় মানুষদের সাহায্য করতে এবং শিক্ষা প্রসারে গুরুত্বপূর্ণ ভূমিকা পালন করে"
              : "Your donation plays a vital role in helping the underprivileged and promoting education"}
          </p>
        </motion.div>

        <div className="home-donation__layout">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <h3
              className={`home-section__title ${language === "bangla" ? "bangla-text" : ""}`}
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            >
              {language === "bangla"
                ? "দারুল মুত্তাক্বীন ফাউন্ডেশন"
                : "Darul Muttaqine Foundation"}
            </h3>
            <p className={`home-section__lead ${language === "bangla" ? "bangla-text" : ""}`}>
              {language === "bangla"
                ? "দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক প্রতিষ্ঠান যা শিক্ষা, দাওয়াহ ও মানবকল্যাণে নিবেদিত। বর্তমানে এটি সরকারের নিবন্ধন প্রক্রিয়াধীন রয়েছে।"
                : "Darul Muttaqine Foundation is a non-political, non-profit organization dedicated to education, da'wah, and human welfare. Government registration is currently under process."}
            </p>
            <p className={`home-donation__quote ${language === "bangla" ? "bangla-text" : ""}`}>
              {language === "bangla"
                ? "আপনার দান দারুল মুত্তাক্বীন ফাউন্ডেশনের শিক্ষা ও মানবকল্যাণমূলক কার্যক্রমে সহায়তা করবে।"
                : "Your donation will support Darul Muttaqine Foundation's education and welfare activities."}
            </p>
          </motion.div>

          <motion.div
            className="home-donation__form"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeUp}
          >
            <Form
              name="donation"
              onFinish={onFinish}
              layout="vertical"
              className="space-y-4"
            >
              <Form.Item
                label={language === "bangla" ? "দান তহবিল" : "Donation Fund"}
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
                  placeholder={language === "bangla" ? "নির্বাচন করুন" : "Select"}
                  size="large"
                >
                  <Option value="education">
                    {language === "bangla" ? "শিক্ষা তহবিল" : "Education Fund"}
                  </Option>
                  <Option value="orphan">
                    {language === "bangla" ? "এতিম তহবিল" : "Orphan Fund"}
                  </Option>
                  <Option value="food">
                    {language === "bangla" ? "খাদ্য বিতরণ" : "Food Distribution"}
                  </Option>
                  <Option value="general">
                    {language === "bangla" ? "সাধারণ তহবিল" : "General Fund"}
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={language === "bangla" ? "ফোন / ইমেইল" : "Phone / Email"}
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
                />
              </Form.Item>

              <Form.Item
                label={
                  language === "bangla" ? "দানের পরিমাণ" : "Donation Amount"
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
                    language === "bangla" ? "সংখ্যায় লিখুন" : "Write in number"
                  }
                  prefix={<DollarOutlined className="text-gray-400" />}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className="home-donation__submit"
                  icon={<HeartOutlined />}
                >
                  {language === "bangla" ? "দান করুন" : "Donate Now"}
                </Button>
              </Form.Item>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
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
    <section className="home-join">
      <div className="home-join__media">
        <img
          src="https://i.ibb.co.com/v4MdvZyX/1758086923536-1758086915189-714c07e-IMG-20250725-160733-154.jpg"
          alt=""
        />
        <div className="home-join__veil" />
      </div>

      <div className="home-join__content">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <h2 className={`home-join__title ${language === "bangla" ? "bangla-text" : ""}`}>
            {language === "bangla" ? "আমাদের সাথে যোগ দিন" : "Join Our Mission"}
          </h2>
          <p className={`home-join__lead ${language === "bangla" ? "bangla-text" : ""}`}>
            {language === "bangla"
              ? "আমাদের মিশনে অংশগ্রহণ করুন এবং শিক্ষা ও মানবকল্যাণে একটি ভালো পরিবর্তন আনতে সাহায্য করুন"
              : "Take part in our mission and help create lasting change through education and welfare"}
          </p>
          <div className="home-join__links">
            <a href="/contact" className="home-btn home-btn--primary">
              <UserOutlined />
              {language === "bangla" ? "স্বেচ্ছাসেবক হোন" : "Become a Volunteer"}
            </a>
            <a href="#donation" className="home-btn home-btn--ghost">
              <HeartOutlined />
              {language === "bangla" ? "দান করুন" : "Donate"}
            </a>
            <a href="/contact" className="home-btn home-btn--ghost">
              <TeamOutlined />
              {language === "bangla" ? "অংশীদার হন" : "Partner With Us"}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function Home() {
  const [language, setLanguage] = useState("bangla");
  const [isApplicationOpen, setIsApplicationOpen] = useState(true);
  const [globalTimeLeft, setGlobalTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  const [totalScholarshipRecipients, setTotalScholarshipRecipients] = useState(0);

  // Application period: Dec 27, 2025 2:00 PM to Feb 25, 2026 12:00 PM
  const applicationStart = new Date('2025-12-27T14:00:00');
  const applicationEnd = new Date('2026-02-25T12:00:00');

  // Fetch real scholarship data
  useEffect(() => {
    const fetchScholarshipData = async () => {
      try {
        const response = await coreAxios.get('/scholarship-info');
        if (response?.status === 200 && Array.isArray(response.data)) {
          // Sort data the same way as Scholarship.js to ensure consistent processing order
          const sortedData = response.data.sort((a, b) => {
            return new Date(b?.submittedAt) - new Date(a?.submittedAt);
          });

          setTotalApplicants(sortedData.length);

          // Count unique institutions using smart matching
          const uniqueInstitutesList = [];
          sortedData.forEach((student) => {
            if (student.institute && student.institute.trim()) {
              const similarInstitute = findSimilarInstitute(student.institute, uniqueInstitutesList);
              if (!similarInstitute) uniqueInstitutesList.push(student.institute);
            }
          });
          setTotalInstitutions(uniqueInstitutesList.length);

          // Count scholarship recipients (same logic as ResultDetails: written + viva ≥ threshold)
          const correct = (s) => s?.resultDetails?.[0]?.totalMarks ?? s?.correctAnswer ?? 0;
          const viva = (s) => s?.vibaMarks ?? s?.vivaMarks ?? s?.resultDetails?.[0]?.vibaMarks ?? 0;
          const qualified = sortedData.filter((s) => {
            const v = viva(s);
            if (v == null || v === "") return false;
            const c = Number(correct(s)) || 0;
            const total = c + Number(v);
            const classNum = getClassNumber(s.instituteClass);
            const minTotal = classNum >= 2 && classNum <= 5 ? 47.5 : (classNum >= 6 && classNum <= 10 ? 83 : 85);
            return total >= minTotal;
          });
          setTotalScholarshipRecipients(qualified.length);
        }
      } catch (error) {
        console.error("Error fetching scholarship data:", error);
        setTotalApplicants(0);
        setTotalInstitutions(0);
        setTotalScholarshipRecipients(0);
      }
    };

    fetchScholarshipData();
  }, []);

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
      scholarshipTitle: "শিক্ষাবৃত্তি লিখিত পরীক্ষা ২৭ ফেব্রুয়ারি ২০২৬",
      scholarshipText:
        "লিখিত পরীক্ষা ২৭ ফেব্রুয়ারি। ৩য়–৫ম: সকাল ১০:০০–১০:৩০। ৬ষ্ঠ–১২: সকাল ১০:৪৫–১১:৪৫।",
      examScheduleLabel: "পরীক্ষার সময়সূচী",
      vivaNotice: "ভাইবা পরীক্ষা পরবর্তী শুক্রবার। ভাইবার জন্য নির্বাচিতদের তালিকা ওয়েবসাইটে প্রকাশ করা হবে — খেয়াল রাখুন।",
      viewSeatPlan: "সিট প্ল্যান",
      viewAdmitCard: "প্রবেশপত্র",
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
          label: "২৫ ফেব্রুয়ারি, ২০২৬",
          children: "আবেদন শেষ",
          color: "blue",
        },
        {
          label: "২৭ ফেব্রুয়ারি, ২০২৬",
          children: "লিখিত পরীক্ষা (সময়সূচী নোটিসে)",
          color: "green",
        },
        {
          label: "পরবর্তী শুক্রবার",
          children: "ভাইবা পরীক্ষা — নির্বাচিতদের তালিকা ওয়েবসাইটে প্রকাশ",
          color: "purple",
        },
      ],
    },
    english: {
      title: "Darul Muttakin Foundation",
      description:
        "Darul Muttakin Foundation is a non-political, non-profit educational, Dawah and welfare service organization dedicated to human welfare. 'To engage ourselves in religious education, propagation and welfare work solely for the pleasure of Allah'",
      scholarshipTitle: "Scholarship Written Exam 27 February 2026",
      scholarshipText:
        "Written exam on 27 February. 3rd–5th: 10:00–10:30 AM. 6th–12th: 10:45–11:45 AM.",
      examScheduleLabel: "Exam Schedule",
      vivaNotice: "Viva exam next Friday. List of selected candidates for viva will be published on the website — stay tuned.",
      viewSeatPlan: "Seat Plan",
      viewAdmitCard: "Admit Card",
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
          label: "February 25, 2026",
          children: "Application closed",
          color: "blue",
        },
        {
          label: "February 27, 2026",
          children: "Written exam (see notice for schedule)",
          color: "green",
        },
        {
          label: "Next Friday",
          children: "Viva exam — selected list published on website",
          color: "purple",
        },
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
      {/* Hero — brand-first, full-bleed */}
      <section className="home-hero">
        <button
          type="button"
          className="home-lang-toggle"
          onClick={toggleLanguage}
          aria-label="Toggle language"
        >
          <GlobalOutlined style={{ marginRight: 6 }} />
          {currentContent.languageButton}
        </button>

        <div className="home-hero__media" aria-hidden="true">
          <img
            src="https://i.ibb.co/Zp6R4mm5/Banner-26.jpg"
            alt=""
          />
        </div>
        <div className="home-hero__veil" />
        <div className="home-hero__grain" />

        <div className="home-hero__content">
          <motion.h1
            className={`home-hero__brand ${language === "bangla" ? "bangla-text" : ""}`}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {language === "bangla"
              ? "দারুল মুত্তাক্বীন ফাউন্ডেশন"
              : "Darul Muttaquine Foundation"}
          </motion.h1>

          <motion.p
            className={`home-hero__headline ${language === "bangla" ? "bangla-text" : ""}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {language === "bangla"
              ? "শিক্ষা · দাওয়াহ · মানবকল্যাণ"
              : "Education · Da'wah · Human Welfare"}
          </motion.p>

          <motion.p
            className={`home-hero__support ${language === "bangla" ? "bangla-text" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {language === "bangla"
              ? "শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজে নিবেদিত।"
              : "Dedicated to religious education, outreach, and welfare solely for the pleasure of Allah."}
          </motion.p>

          <motion.div
            className="home-hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="/scholarship-public" className="home-btn home-btn--primary">
              <BookOutlined />
              {language === "bangla" ? "শিক্ষাবৃত্তি দেখুন" : "View Scholarship"}
            </a>
            <a href="#donation" className="home-btn home-btn--ghost">
              <HeartOutlined />
              {language === "bangla" ? "দান করুন" : "Donate"}
            </a>
          </motion.div>
        </div>

        <div className="home-hero__scroll" aria-hidden="true" />
      </section>

      {/* Scholarship impact */}
      <section className="home-impact">
        <div className="home-impact__inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <h2 className={`home-impact__title ${language === "bangla" ? "bangla-text" : ""}`}>
              {language === "bangla"
                ? "শিক্ষাবৃত্তি ২০২৬ — এই বছরের প্রভাব"
                : "Scholarship 2026 — This Year's Impact"}
            </h2>
            <p className={`home-impact__sub ${language === "bangla" ? "bangla-text" : ""}`}>
              {language === "bangla"
                ? "মেধাবী শিক্ষার্থীদের পাশে দাঁড়ানোর বাস্তব চিত্র"
                : "Real outcomes from standing beside meritorious students"}
            </p>
          </motion.div>

          <div className="home-impact__grid">
            {[
              {
                value: totalInstitutions,
                suffix: "",
                label:
                  language === "bangla"
                    ? "শিক্ষা প্রতিষ্ঠান অংশগ্রহণ করেছে"
                    : "Institutions participated",
              },
              {
                value: totalApplicants,
                suffix: "+",
                label:
                  language === "bangla"
                    ? "শিক্ষার্থী আবেদন করেছিল"
                    : "Students applied",
              },
              {
                value: totalScholarshipRecipients,
                suffix: "",
                label:
                  language === "bangla"
                    ? "জন বৃত্তি পেয়েছে"
                    : "Received scholarship",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="home-impact__item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                custom={index}
                variants={fadeUp}
              >
                <div className="home-impact__value">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className={`home-impact__label ${language === "bangla" ? "bangla-text" : ""}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Excellence Award — single refined section */}
      <section className="home-award">
        <div className="home-award__panel">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <span className="home-section__eyebrow">
              {language === "bangla" ? "স্বীকৃতি" : "Recognition"}
            </span>
            <h2 className="home-award__title">Ayat-ul-'Ilm Excellence Award</h2>
            <p className={`home-award__text ${language === "bangla" ? "bangla-text" : ""}`}>
              {language === "bangla"
                ? "বৃত্তিপ্রাপ্ত শিক্ষার্থীদের মধ্য থেকে এই পুরস্কারের জন্য মনোনীত করা হবে — জ্ঞান ও মেধার সর্বোচ্চ সম্মান।"
                : "Recipients will be nominated from among scholarship awardees — honouring the highest pursuit of knowledge."}
            </p>
          </motion.div>

          <motion.div
            className="home-award__prize"
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="home-award__prize-amount">10,000</div>
            <div className="home-award__prize-unit">
              {language === "bangla" ? "টাকা" : "Tk Prize"}
            </div>
          </motion.div>
        </div>
      </section>

      <ImageGallery language={language} />

      {/* Services */}
      <section className="home-section home-services">
        <div className="home-section__inner">
          <motion.div
            className="home-section__header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <span className="home-section__eyebrow">
              {language === "bangla" ? "সেবা" : "Services"}
            </span>
            <h2 className={`home-section__title ${language === "bangla" ? "bangla-text" : ""}`}>
              {language === "bangla" ? "আমাদের সেবাসমূহ" : "What We Offer"}
            </h2>
            <hr className="home-divider" />
            <p
              className={`home-section__lead ${language === "bangla" ? "bangla-text" : ""}`}
              style={{ marginTop: "1rem" }}
            >
              {language === "bangla"
                ? "মানবকল্যাণে আমাদের নিবেদিত সেবাসমূহ"
                : "Dedicated programmes for education and human welfare"}
            </p>
          </motion.div>

          <div className="home-services__grid">
            {currentContent.features.map((feature, index) => (
              <motion.article
                key={feature.title}
                className="home-services__item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={index}
                variants={fadeUp}
              >
                <div className="home-services__icon">{feature.icon}</div>
                <h3 className={language === "bangla" ? "bangla-text" : ""}>
                  {feature.title}
                </h3>
                <p className={language === "bangla" ? "bangla-text" : ""}>
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <div id="donation">
        <DonationSection language={language} />
      </div>

      <JoinUsSection language={language} />
    </div>
  );
}
