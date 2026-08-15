import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { toast } from "react-toastify";
import { Pagination, Modal, Select, Skeleton, Steps } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  FacebookOutlined,
  TwitterOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "./About.css";

const { Option } = Select;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function About() {
  const [language, setLanguage] = useState("bengali");
  const [searchQuery, setSearchQuery] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tabNumber, setTabNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Translation dictionary
  const translations = {
    bengali: {
      aboutUs: "আমাদের সম্পর্কে",
      introduction: "পরিচিতি",
      principles: "নীতি ও আদর্শ",
      goals: "লক্ষ্য ও উদ্দেশ্য",
      activities: "কার্যক্রম",
      funds: "তহবিল ও আয়",
      expenditure: "ব্যয়ের নীতিমালা",
      activeMembers: "সক্রিয় সদস্যগণ",
      search: "নাম, পেশা বা রোল অনুসন্ধান করুন...",
      searchBlood: "রক্তের গ্রুপ অনুসন্ধান করুন...",
      centralProjectDirector: "কেন্দ্রীয় প্রকল্প পরিচালক",
      viewProfile: "প্রোফাইল দেখুন",
      contact: "যোগাযোগ",
      email: "ইমেইল",
      phone: "ফোন",
      close: "বন্ধ",
      memberDetails: "সদস্যের বিস্তারিত তথ্য",
      profession: "পেশা",
      role: "ভূমিকা",
      joinDate: "যোগদানের তারিখ",
      bloodGroup: "রক্তের গ্রুপ",
      filterByBlood: "রক্তের গ্রুপ দ্বারা ফিল্টার করুন",
      allBloodGroups: "সব রক্তের গ্রুপ",
      bloodDonationAppeal:
        "জরুরী রক্তের প্রয়োজন! আপনার রক্ত একটি জীবন বাঁচাতে পারে। রক্তদান করুন, জীবন বাঁচান।",
    },
    english: {
      aboutUs: "About Us",
      introduction: "Introduction",
      principles: "Principles & Ideology",
      goals: "Goals & Objectives",
      activities: "Activities",
      funds: "Funds & Income",
      expenditure: "Expenditure Policy",
      activeMembers: "Active Members",
      search: "Search by name, profession or role...",
      searchBlood: "Search by blood group...",
      centralProjectDirector: "Central Project Director",
      viewProfile: "View Profile",
      contact: "Contact",
      email: "Email",
      phone: "Phone",
      close: "Close",
      memberDetails: "Member Details",
      profession: "Profession",
      role: "Role",
      joinDate: "Join Date",
      bloodGroup: "Blood Group",
      filterByBlood: "Filter by Blood Group",
      allBloodGroups: "All Blood Groups",
      bloodDonationAppeal:
        "Urgent need for blood! Your blood can save a life. Donate blood, save lives.",
    },
  };

  const t = translations[language];

  // Blood groups for filter
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const items1 = [
    {
      title:
        language === "bengali"
          ? ` পবিত্র কুরআন ও আল্লাহর রাসুল মুহাম্মাদ (সাল্লাল্লাহু আলাইহি
                    ওয়া সাল্লাম)-এর সুন্নাহ তথা কর্মনীতিই দারুল মুত্তাক্বীন ফাউন্ডেশনের
                    মূল আদর্শ।`
          : `The Holy Quran and the Sunnah of Allah's Messenger Muhammad (peace be upon him) are the core ideology of Darul Muttakeen Foundation.`,
    },
    {
      title:
        language === "bengali"
          ? `কুরআন-সুন্নাহকে সালাফে সালিহীনের ব্যাখ্যার আলোকে গ্রহণ করা।`
          : `Accepting the Quran and Sunnah according to the understanding of the righteous predecessors.`,
    },
    {
      title:
        language === "bengali"
          ? `আহলুস-সুন্নাহ ওয়াল-জামা‘আহর আক্বীদা ও দৃষ্টিভঙ্গি লালন করা।`
          : `Nurturing the creed and perspective of Ahlus-Sunnah wal-Jama'ah.`,
    },
    {
      title:
        language === "bengali"
          ? `শিরকমুক্ত ঈমান ও বিদ‘আতমুক্ত আমলের প্রতি আহ্বান করা।`
          : `Calling to faith free from shirk and practices free from innovation.`,
    },
    {
      title:
        language === "bengali"
          ? `উম্মাহর ঐক্য ও সংহতির জন্যে কাজ করা।`
          : `Working for the unity and solidarity of the Ummah.`,
    },
    {
      title:
        language === "bengali"
          ? `রাজনৈতিক কর্ম ও অবস্থান গ্রহণ থেকে বিরত থাকা এবং দলমত নির্বিশেষে সকলের বৃহত্তর কল্যাণে কাজ করে যাওয়া।`
          : `Refraining from political activities and positions, and working for the greater good of all regardless of party affiliation.`,
    },
  ];

  const items2 = [
    {
      title:
        language === "bengali"
          ? ` দরিদ্র ও অসহায় পরিবারের জন্য খাদ্য, বস্ত্র ও আশ্রয়ের
                  ব্যবস্থা করা।`
          : `Arranging food, clothing, and shelter for poor and helpless families.`,
    },
    {
      title:
        language === "bengali"
          ? `মেধাবী ও আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের জন্য শিক্ষা বৃত্তি
  প্রদান করা।`
          : `Providing educational scholarships for meritorious and financially disadvantaged students.`,
    },
    {
      title:
        language === "bengali"
          ? `সাধারণ ও ইসলামিক শিক্ষার সমন্বয়ে একটি আধুনিক মাদ্রাসা
  প্রতিষ্ঠা করা।`
          : `Establishing a modern madrasah combining general and Islamic education.`,
    },
    {
      title:
        language === "bengali"
          ? `স্বাস্থ্যসেবা ও চিকিৎসা সহায়তা প্রদান।`
          : `Providing healthcare and medical assistance.`,
    },
    {
      title:
        language === "bengali"
          ? `প্রাকৃতিক দুর্যোগ ও জরুরি পরিস্থিতিতে ত্রাণ সহায়তা প্রদান।`
          : `Providing relief assistance during natural disasters and emergency situations.`,
    },
    {
      title:
        language === "bengali"
          ? `সাধারণ শিক্ষা ও ইসলামিক শিক্ষার প্রচার ও প্রসার।`
          : `Promoting and spreading general and Islamic education.`,
    },
  ];

  const items3 = [
    {
      title:
        language === "bengali"
          ? ` প্রাজ্ঞ আলেম ও নিবেদিতপ্রাণ দা‘য়ী ইলাল্লাহ গড়ে তুলতে কুরআন-সুন্নাহর মৌলিক শিক্ষা সম্বলিত আধুনিক যুগোপযোগী পাঠক্রম ও পাঠ্যপুস্তক প্রণয়ন এবং মাদরাসা প্রতিষ্ঠা।`
          : `Developing modern, era-appropriate curricula and textbooks containing the fundamental teachings of the Quran and Sunnah, and establishing madrasahs to produce wise scholars and dedicated callers to Allah.`,
    },
    {
      title:
        language === "bengali"
          ? `মেধাবী ও আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের জন্য শিক্ষা বৃত্তি
  প্রদান করা।`
          : `Providing educational scholarships for meritorious and financially disadvantaged students.`,
    },
    {
      title:
        language === "bengali"
          ? `স্বাস্থ্যসেবা ও চিকিৎসা সহায়তা প্রদান।`
          : `Providing healthcare and medical assistance.`,
    },
    {
      title:
        language === "bengali"
          ? `প্রাকৃতিক দুর্যোগ ও জরুরি পরিস্থিতিতে ত্রাণ সহায়তা প্রদান।`
          : `Providing relief assistance during natural disasters and emergency situations.`,
    },
    {
      title:
        language === "bengali"
          ? `উচ্চতর ইলমী গবেষণাকেন্দ্র।`
          : `Establishing higher Islamic research centers.`,
    },
    {
      title:
        language === "bengali"
          ? `সাধারণ শিক্ষা ও ইসলামিক শিক্ষার প্রচার ও প্রসার।`
          : `Promoting and spreading general and Islamic education.`,
    },
  ];

  const items4 = [
    {
      title:
        language === "bengali"
          ? ` ফাউন্ডেশনের প্রতিষ্ঠাতা সদস্যগণের দানের অর্থে ক্রীত সম্পত্তি ও তহবিল দিয়ে যাত্রা শুরু।`
          : `Starting the journey with properties purchased and funds donated by the founding members of the foundation.`,
    },
    {
      title:
        language === "bengali"
          ? `সদস্য, সমর্থক ও শুভাকাঙ্ক্ষীদের এককালীন ও নিয়মিত অনুদান।`
          : `One-time and regular donations from members, supporters, and well-wishers.`,
    },
    {
      title:
        language === "bengali"
          ? `ফাউন্ডেশনর যে কোন প্রকল্প থেকে অর্জিত হয়।`
          : `Income generated from any project of the foundation.`,
    },
    {
      title:
        language === "bengali"
          ? `জনসাধারণ কর্তৃক বিশেষ কোনো খাতে প্রদত্ত অনুদান।`
          : `Donations from the public for specific sectors.`,
    },
    {
      title:
        language === "bengali"
          ? `সচ্ছল মুসলিমদের প্রদেয় যাকাত, ফিতরা।`
          : `Zakat and Fitrah from affluent Muslims.`,
    },
    {
      title:
        language === "bengali"
          ? `বিভিন্ন প্রজেক্ট পরিচালনা বাবদ সংশ্লিষ্ট প্রজেক্ট থেকে কর্তনকৃত ১০% অ্যডমিনিস্ট্রেটিভ খরচ।`
          : `10% administrative cost deducted from relevant projects for project management.`,
    },
  ];

  const items5 = [
    {
      title:
        language === "bengali"
          ? `দাতাগণ যে খাতের জন্য দান করে থাকেন, সে খাতেই ব্যায় করা হয়। এক খাতের অর্থ অন্য খাতে ব্যয় করা হয় না।`
          : `Funds are spent only in the sector for which donors have donated. Funds from one sector are not spent in another sector.`,
    },
    {
      title:
        language === "bengali"
          ? `প্রতিটি প্রকল্প শুর হবার আগে এবং পরের আয়-ব্যয়ের বিস্তারিত হিসাব সংরক্ষণ করা হয়।`
          : `Detailed accounts of income and expenditure are maintained before and after each project.`,
    },
    {
      title:
        language === "bengali"
          ? `সকল সক্রিয় সদস্যদের সমন্বয়ে গঠিত টীমের তত্ত্বাবধানে দারুল মুত্তাক্বীন ফাউন্ডেশনের সকল আর্থিক কার্যক্রম মনিটরিং করা হয়।`
          : `All financial activities of Darul Muttakeen Foundation are monitored under the supervision of a team formed with all active members.`,
    },
  ];

  const getAllUserList = async () => {
    try {
      setUserLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });

        const filteredData = sortedData?.filter(
          (item) => item?.uniqueId !== "DMF-4232"
        );
        setUserLoading(false);
        setUsers(filteredData);
      }
    } catch (err) {
      setUserLoading(false);
      toast.error(err?.response?.data?.message);
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
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllProject();
    getAllUserList();
  }, []);

  // Filter out users with a userRole that is not "Visitor"
  const filteredUsers = users?.filter((user) => user.userRole !== "Visitor");

  // Apply search and blood group filters
  const filteredRolls = filteredUsers?.filter((roll) => {
    const matchesSearch = searchQuery
      ? Object.values(roll)
          .join("")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    const matchesBloodGroup = bloodGroupFilter
      ? roll.bloodGroup === bloodGroupFilter
      : true;

    return matchesSearch && matchesBloodGroup;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRolls.slice(indexOfFirstItem, indexOfLastItem);

  const onChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Show modal with user details
  const showUserModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(
      language === "bengali" ? "bn-BD" : "en-US",
      options
    );
  };

  // Get blood group color class based on blood type
  const getBloodGroupColor = (bloodGroup) => {
    if (!bloodGroup) return "bg-gray-200 text-gray-800";

    const group = bloodGroup.toUpperCase();
    if (group.includes("A")) return "bg-red-100 text-red-800 border-red-300";
    if (group.includes("B")) return "bg-blue-100 text-blue-800 border-blue-300";
    if (group.includes("AB"))
      return "bg-purple-100 text-purple-800 border-purple-300";
    if (group.includes("O"))
      return "bg-green-100 text-green-800 border-green-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };


  // Skeleton Loading Component
  const UserCardSkeleton = () => (
    <div className="about-user-card">
      <Skeleton.Avatar active size={96} className="mb-4" />
      <Skeleton.Input active className="mb-2 w-3/4" />
      <Skeleton.Input active className="mb-4 w-1/2" size="small" />
      <Skeleton.Button active className="mt-4 w-full" />
    </div>
  );

  const UserCard = ({ user, index }) => (
    <motion.div
      className="about-user-card relative"
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      onClick={() => showUserModal(user)}
    >
      {user.bloodGroup && (
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-sm font-bold border ${getBloodGroupColor(
            user.bloodGroup
          )}`}
        >
          {user.bloodGroup}
        </div>
      )}

      <div className="about-user-card__avatar">
        <img
          src={
            user.image ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(user.firstName + " " + user.lastName) +
              "&background=1f6b45&color=fff&size=256"
          }
          alt={user.username || user.firstName}
          onError={(e) => {
            e.target.src =
              "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(user.firstName + " " + user.lastName) +
              "&background=1f6b45&color=fff&size=256";
          }}
        />
      </div>

      <h3>
        {user.firstName} {user.lastName}
      </h3>
      <p className="about-user-card__role">{user.userRole?.toLowerCase()}</p>
      {user.profession && (
        <p className="about-user-card__meta">{user.profession}</p>
      )}
      <button type="button" className="about-user-card__btn">
        {t.viewProfile}
      </button>
    </motion.div>
  );

  const tabs = [
    { id: 0, label: t.introduction },
    { id: 1, label: t.principles },
    { id: 2, label: t.goals },
    { id: 3, label: t.activities },
    { id: 4, label: t.funds },
    { id: 5, label: t.expenditure },
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      );
    }

    if (tabNumber === 0) {
      return (
        <motion.div
          key="intro"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className={`about-panel__title ${language === "bengali" ? "bangla-text" : ""}`}>
            {language === "bengali"
              ? "দারুল মুত্তাক্বীন ফাউন্ডেশন"
              : "Darul Muttaquine Foundation"}
          </h3>
          <p className={`about-panel__text ${language === "bengali" ? "bangla-text" : ""}`}>
            {language === "bengali"
              ? `দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক শিক্ষা, দাওয়াহ ও পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক প্রতিষ্ঠান। পরের মঙ্গল কামনা (অন্যের জন্য আল্লাহর নিকট প্রার্থনা); পরের জন্য কিছু করার মানসিকতাই একদিন ব্যক্তি আমিকে ভালো মানুষ হতে সহায়তা করে। আমরা সবাইকে ভালো মানুষ হতে উপদেশ দিই কিন্তু ভালো মানুষ হয়ে উঠার পথ-পরিক্রমা অনেক ক্ষেত্রেই বাতলে দিই না। (গরীব-অসহায়-দুঃস্থ-এতিম) আশেপাশের মানুষের জন্য কিছু করতে চেষ্টা করলে যে নিজের অজান্তেই মানসিক প্রশান্তি মিলে; ভালো মানুষ হওয়ার পথে যাত্রা শুরু করা যায় তা বুঝি আমরা অনেকেই আজও ঠাহর করতে পারছিনা! ধরে নিলাম আমাদের অনেকেরই ইচ্ছা আছে কিন্ত ফুরসত/সুযোগের অভাব। নিজের জন্য/নিজেদের জন্য/আপনাদের জন্য এ ধরণের ফুরসত সৃষ্টি করতে "দারুল মুত্তাক্বীন ফাউন্ডেশন (DMF)" এর যাত্রা শুরু ২০২০ সালে। আমাদের লক্ষ্য: "শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে নিজেদের নিয়োজিত রাখা"`
              : `Darul Muttakeen Foundation is a non-political, non-profit educational, Dawah, and fully dedicated humanitarian service organization. The mentality of wishing well for others (praying to Allah for others) and doing something for others one day helps a person become a good person. We all advise everyone to be good people, but in many cases, we don't outline the journey to becoming a good person. If we try to do something for the people around us (poor-helpless-distressed-orphans), we get mental peace without even realizing it; we can start the journey to becoming a good person, which I think many of us still can't comprehend! I assume many of us have the desire but lack the time/opportunity. To create such opportunities for yourself/ourselves/you, "Darul Muttakeen Foundation (DMF)" started its journey in 2020. Our goal: "To engage ourselves in religious education, propagation, and beneficial works solely for the pleasure of Allah."`}
          </p>
          <div className="about-panel__signature">
            <div className="about-panel__signature-text">
              <p className={language === "bengali" ? "bangla-text" : ""}>
                আশিকুর রহমান
              </p>
              <p className={language === "bengali" ? "bangla-text" : ""}>
                {t.centralProjectDirector}
              </p>
              <div className="flex justify-end mt-2 space-x-3">
                <a href="#" className="text-emerald-700 hover:text-emerald-900">
                  <FacebookOutlined />
                </a>
                <a href="#" className="text-emerald-700 hover:text-emerald-900">
                  <TwitterOutlined />
                </a>
                <a
                  href="mailto:contact@example.com"
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  <MailOutlined />
                </a>
              </div>
            </div>
            <img
              src="https://i.ibb.co/sKV2T4H/IMG-20240704-WA0013.jpg"
              alt=""
              onError={(e) => {
                e.target.src =
                  "https://ui-avatars.com/api/?name=আশিকুর+রহমান&background=1f6b45&color=fff&size=160";
              }}
            />
          </div>
        </motion.div>
      );
    }

    const stepMap = {
      1: { title: t.principles, items: items1 },
      2: { title: t.goals, items: items2 },
      3: { title: t.activities, items: items3 },
      4: { title: t.funds, items: items4 },
      5: { title: t.expenditure, items: items5 },
    };

    const current = stepMap[tabNumber];
    if (!current) return null;

    return (
      <motion.div
        key={tabNumber}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className={`about-panel__title ${language === "bengali" ? "bangla-text" : ""}`}>
          {current.title}
        </h3>
        <Steps
          className="custom-steps"
          progressDot
          current={current.items.length}
          direction="vertical"
          items={current.items}
        />
      </motion.div>
    );
  };

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-lang" role="group" aria-label="Language">
          <button
            type="button"
            className={language === "bengali" ? "is-active" : ""}
            onClick={() => setLanguage("bengali")}
          >
            বাংলা
          </button>
          <button
            type="button"
            className={language === "english" ? "is-active" : ""}
            onClick={() => setLanguage("english")}
          >
            English
          </button>
        </div>

        <div className="about-hero__media" aria-hidden="true">
          <img src="https://i.ibb.co/Zp6R4mm5/Banner-26.jpg" alt="" />
        </div>
        <div className="about-hero__veil" />

        <div className="about-hero__content">
          <motion.span
            className="about-hero__eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Darul Muttaquine
          </motion.span>
          <motion.h1
            className={`about-hero__title ${language === "bengali" ? "bangla-text" : ""}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
          >
            {t.aboutUs}
          </motion.h1>
          <motion.p
            className={`about-hero__lead ${language === "bengali" ? "bangla-text" : ""}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            {language === "bengali"
              ? "শিক্ষা, দাওয়াহ ও মানবকল্যাণে নিবেদিত একটি অরাজনৈতিক সেবামূলক প্রতিষ্ঠান।"
              : "A non-political service organization dedicated to education, da'wah, and human welfare."}
          </motion.p>
        </div>
      </section>

      <section className="about-section about-content">
        <div className="about-section__inner">
          <motion.div
            className="about-section__header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <span className="about-section__eyebrow">
              {language === "bengali" ? "পরিচিতি" : "Identity"}
            </span>
            <h2 className={`about-section__title ${language === "bengali" ? "bangla-text" : ""}`}>
              {language === "bengali"
                ? "কে আমরা, কী বিশ্বাস করি"
                : "Who We Are & What We Believe"}
            </h2>
            <hr className="about-divider" />
          </motion.div>

          <div className="about-content__layout">
            <nav className="about-nav" aria-label="About sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`about-nav__item ${language === "bengali" ? "bangla-text" : ""} ${
                    tabNumber === tab.id ? "is-active" : ""
                  }`}
                  onClick={() => setTabNumber(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="about-panel">
              <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section about-members">
        <div className="about-section__inner">
          <motion.div
            className="about-section__header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <span className="about-section__eyebrow">
              {language === "bengali" ? "টিম" : "Team"}
            </span>
            <h2 className={`about-section__title ${language === "bengali" ? "bangla-text" : ""}`}>
              {t.activeMembers} ({filteredRolls?.length || 0})
            </h2>
            <hr className="about-divider" />
          </motion.div>

          <div className={`about-members__appeal ${language === "bengali" ? "bangla-text" : ""}`}>
            <span aria-hidden="true">!</span>
            <p style={{ margin: 0 }}>{t.bloodDonationAppeal}</p>
          </div>

          <div className="about-members__tools">
            <div className="about-members__search">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select
              placeholder={t.filterByBlood}
              value={bloodGroupFilter || undefined}
              onChange={setBloodGroupFilter}
              allowClear
              className="w-full max-w-xs"
              dropdownStyle={{ zIndex: 2000 }}
            >
              <Option value="">{t.allBloodGroups}</Option>
              {bloodGroups.map((group) => (
                <Option key={group} value={group}>
                  {group}
                </Option>
              ))}
            </Select>
          </div>

          {userLoading ? (
            <div className="about-members__grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <UserCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <div className="about-members__grid">
                {currentItems?.map((user, index) => (
                  <UserCard key={user._id || index} user={user} index={index} />
                ))}
              </div>

              {filteredRolls?.length > itemsPerPage && (
                <div className="flex justify-center p-2 my-8">
                  <Pagination
                    showQuickJumper
                    current={currentPage}
                    total={filteredRolls?.length}
                    pageSize={itemsPerPage}
                    onChange={onChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Modal
        title={t.memberDetails}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <button
            key="close"
            onClick={handleCancel}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 px-4 rounded"
          >
            {t.close}
          </button>,
        ]}
        width={400}
      >
        {selectedUser && (
          <div className="py-4">
            <div className="flex justify-center mb-4">
              <img
                src={
                  selectedUser.image ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(
                      selectedUser.firstName + " " + selectedUser.lastName
                    ) +
                    "&background=1f6b45&color=fff&size=256"
                }
                alt={selectedUser.username || selectedUser.firstName}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
                onError={(e) => {
                  e.target.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(
                      selectedUser.firstName + " " + selectedUser.lastName
                    ) +
                    "&background=1f6b45&color=fff&size=256";
                }}
              />
            </div>

            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              {selectedUser.firstName} {selectedUser.lastName}
            </h3>

            {selectedUser.bloodGroup && (
              <div className="text-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getBloodGroupColor(
                    selectedUser.bloodGroup
                  )}`}
                >
                  {t.bloodGroup}: {selectedUser.bloodGroup}
                </span>
              </div>
            )}

            <div className="space-y-3 mt-4">
              <div>
                <span className="font-semibold text-gray-700">{t.role}:</span>
                <span className="ml-2 text-emerald-700 capitalize">
                  {selectedUser.userRole?.toLowerCase()}
                </span>
              </div>

              {selectedUser.profession && (
                <div>
                  <span className="font-semibold text-gray-700">
                    {t.profession}:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {selectedUser.profession}
                  </span>
                </div>
              )}

              <div>
                <span className="font-semibold text-gray-700">
                  {t.joinDate}:
                </span>
                <span className="ml-2 text-gray-600">
                  {formatDate(selectedUser.createdAt)}
                </span>
              </div>

              {selectedUser.email && (
                <div>
                  <span className="font-semibold text-gray-700">{t.email}:</span>
                  <a
                    href={`mailto:${selectedUser.email}`}
                    className="ml-2 text-emerald-700 hover:underline inline-flex items-center"
                  >
                    <MailOutlined className="mr-1" /> {selectedUser.email}
                  </a>
                </div>
              )}

              {selectedUser.phone && (
                <div>
                  <span className="font-semibold text-gray-700">{t.phone}:</span>
                  <a
                    href={`tel:${selectedUser.phone}`}
                    className="ml-2 text-emerald-700 hover:underline inline-flex items-center"
                  >
                    <PhoneOutlined className="mr-1" /> 0{selectedUser.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
