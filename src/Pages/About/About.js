import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { toast } from "react-toastify";
import { Alert, Pagination, Spin, Steps, Modal, Select, Skeleton } from "antd";
import { motion } from "framer-motion";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Option } = Select;

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
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
      <Skeleton.Avatar active size={112} className="mb-4" />
      <Skeleton.Input active className="mb-2 w-3/4" />
      <Skeleton.Input active className="mb-4 w-1/2" size="small" />
      <Skeleton.Button active className="mt-4 w-full" />
    </div>
  );

  // Updated User Card Component
  const UserCard = ({ user }) => (
    <motion.div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center group cursor-pointer relative"
      whileHover={{ y: -5 }}
      onClick={() => showUserModal(user)}
    >
      {/* Blood Group Badge */}
      {user.bloodGroup && (
        <div
          className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-2xl font-bold border ${getBloodGroupColor(
            user.bloodGroup
          )}`}
        >
          {user.bloodGroup}
        </div>
      )}

      {/* Profile Image */}
      <div className="relative mb-4">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-100 group-hover:border-emerald-300 transition-colors">
          <img
            src={
              user.image ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user.firstName + " " + user.lastName) +
                "&background=10b981&color=fff&size=256"
            }
            alt={user.username || user.firstName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user.firstName + " " + user.lastName) +
                "&background=10b981&color=fff&size=256";
            }}
          />
        </div>
      </div>

      {/* Name and Role */}
      <h3 className="text-xl font-bold text-gray-800 mb-1">
        {user.firstName} {user.lastName}
      </h3>
      <p className="text-emerald-600 font-semibold mb-2 capitalize">
        {user.userRole?.toLowerCase()}
      </p>

      {/* Profession */}
      {user.profession && (
        <p className="text-gray-600 text-lg mb-4">{user.profession}</p>
      )}

      {/* Blood Group (if exists) */}
      {user.bloodGroup && (
        <div
          className={`mb-3 px-3 py-1 rounded-full text-lg font-medium ${getBloodGroupColor(
            user.bloodGroup
          )}`}
        >
          {t.bloodGroup}: {user.bloodGroup}
        </div>
      )}

      {/* View Profile Button */}
      <div className="mt-auto pt-4 w-full">
        <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium py-2 px-4 rounded-full transition-colors text-sm">
          {t.viewProfile}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="px-0 bg-gray-50">
      <div className="w-full">
        <div>
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 relative">
            {/* Language Toggle */}
            <div className="absolute top-4 right-4 z-10">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                    language === "bengali"
                      ? "bg-white text-emerald-700 border-white"
                      : "bg-emerald-800 text-white border-emerald-700 hover:bg-emerald-700"
                  }`}
                  onClick={() => setLanguage("bengali")}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                    language === "english"
                      ? "bg-white text-emerald-700 border-white"
                      : "bg-emerald-800 text-white border-emerald-700 hover:bg-emerald-700"
                  }`}
                  onClick={() => setLanguage("english")}
                >
                  English
                </button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="absolute top-4 left-4 z-10 flex space-x-2">
              <a
                href="#"
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <FacebookOutlined className="text-lg" />
              </a>
              <a
                href="#"
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <TwitterOutlined className="text-lg" />
              </a>
              <a
                href="#"
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <InstagramOutlined className="text-lg" />
              </a>
              <a
                href="#"
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <LinkedinOutlined className="text-lg" />
              </a>
              <a
                href="#"
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <YoutubeOutlined className="text-lg" />
              </a>
            </div>

            <h2 className="text-white font-semibold text-2xl md:text-3xl py-8 lg:py-12 xl:py-12 text-center bangla-text">
              {t.aboutUs}
            </h2>
          </div>

          {/* Announcement Section */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-8 md:py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Scholarship Program Announcement */}
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border-2 border-green-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl">
                    <TrophyOutlined className="text-white text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-green-800 bangla-text">
                      {language === "bengali" 
                        ? "২০২৬ শিক্ষাবৃত্তি প্রোগ্রাম" 
                        : "2026 Scholarship Program"}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      {language === "bengali" 
                        ? "আবেদন চলছে" 
                        : "Applications Open"}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed bangla-text">
                  {language === "bengali"
                    ? "দারুল মুত্তাক্বীন ফাউন্ডেশন ২০২৬ শিক্ষাবৃত্তি প্রোগ্রামের জন্য আবেদন গ্রহণ করা হচ্ছে। আগ্রহী শিক্ষার্থীরা ১০ ফেব্রুয়ারি, ২০২৬ পর্যন্ত আবেদন করতে পারবেন।"
                    : "Darul Muttaqine Foundation is accepting applications for the 2026 Scholarship Program. Interested students can apply until February 10, 2026."}
                </p>
                <div className="mt-4">
                  <a
                    href="/scholarship-public"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {language === "bengali" ? "আবেদন করুন" : "Apply Now"}
                    <ArrowRightOutlined />
                  </a>
                </div>
              </div>

              {/* Awards Section */}
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4 bangla-text">
                    {language === "bengali" 
                      ? "বর্ষসেরা পুরস্কার" 
                      : "Awards of the Year"}
                  </h3>
                  <p className="text-lg text-gray-700 bangla-text">
                    {language === "bengali"
                      ? "প্রতিটি ক্যাটাগরিতে ১ জন করে ৩,০০০ টাকা পুরস্কার পাবেন"
                      : "1 person from each category will receive 3,000 Taka prize"}
                  </p>
                </div>

                {/* Ayat-ul-'Ilm Excellence Award */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-emerald-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl">
                      <TrophyOutlined className="text-white text-3xl" />
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold text-emerald-800 bangla-text">
                        Ayat-ul-'Ilm Excellence Award
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {language === "bengali" 
                          ? "পুরস্কার: ৩,০০০ টাকা" 
                          : "Prize: 3,000 Taka"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 text-center bangla-text">
                    {language === "bengali"
                      ? "সকল প্রার্থী এই পুরস্কারের জন্য মনোনীত"
                      : "All nominees are nominated for this award"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      >
                        <div className="relative mb-4">
                          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                            <span className="text-gray-400 text-sm">
                              {language === "bengali" ? "ছবি" : "Image"}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            #{index}
                          </div>
                        </div>
                        <div className="text-center">
                          <h5 className="font-bold text-gray-800 text-lg mb-1">
                            {language === "bengali" 
                              ? `প্রার্থী ${index}` 
                              : `Nominee ${index}`}
                          </h5>
                          <p className="text-gray-600 text-sm">
                            {language === "bengali" 
                              ? "মনোনীত" 
                              : "Nominated"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ayat-ul-Amānah Membership Award */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-emerald-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl">
                      <UserOutlined className="text-white text-3xl" />
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold text-emerald-800 bangla-text">
                        Ayat-ul-Amānah Membership Award
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {language === "bengali" 
                          ? "পুরস্কার: ৩,০০০ টাকা" 
                          : "Prize: 3,000 Taka"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 text-center bangla-text">
                    {language === "bengali"
                      ? "সকল প্রার্থী এই পুরস্কারের জন্য মনোনীত"
                      : "All nominees are nominated for this award"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-2 border-gray-200 hover:border-green-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      >
                        <div className="relative mb-4">
                          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                            <span className="text-gray-400 text-sm">
                              {language === "bengali" ? "ছবি" : "Image"}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            #{index}
                          </div>
                        </div>
                        <div className="text-center">
                          <h5 className="font-bold text-gray-800 text-lg mb-1">
                            {language === "bengali" 
                              ? `প্রার্থী ${index}` 
                              : `Nominee ${index}`}
                          </h5>
                          <p className="text-gray-600 text-sm">
                            {language === "bengali" 
                              ? "মনোনীত" 
                              : "Nominated"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ayat-ul-Amānah Business Award */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-emerald-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl">
                      <DollarOutlined className="text-white text-3xl" />
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold text-emerald-800 bangla-text">
                        Ayat-ul-Amānah Business Award
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {language === "bengali" 
                          ? "পুরস্কার: ৩,০০০ টাকা" 
                          : "Prize: 3,000 Taka"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 text-center bangla-text">
                    {language === "bengali"
                      ? "সকল প্রার্থী এই পুরস্কারের জন্য মনোনীত"
                      : "All nominees are nominated for this award"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      >
                        <div className="relative mb-4">
                          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                            <span className="text-gray-400 text-sm">
                              {language === "bengali" ? "ছবি" : "Image"}
                            </span>
                          </div>
                          <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            #{index}
                          </div>
                        </div>
                        <div className="text-center">
                          <h5 className="font-bold text-gray-800 text-lg mb-1">
                            {language === "bengali" 
                              ? `প্রার্থী ${index}` 
                              : `Nominee ${index}`}
                          </h5>
                          <p className="text-gray-600 text-sm">
                            {language === "bengali" 
                              ? "মনোনীত" 
                              : "Nominated"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-7 py-8 bg-gray-50">
              <div className="md:col-span-2 mx-4 md:mx-12 py-4 md:py-8 md:pl-12 text-[16px] grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-3 border-b md:border-b-0 md:border-r border-gray-200 text-center md:text-left lg:text-left xl:text-left">
                <p
                  onClick={() => setTabNumber(0)}
                  className={`rounded-lg p-3 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors ${
                    tabNumber === 0
                      ? "bg-emerald-100 text-emerald-700 font-semibold"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {t.introduction}
                </p>
                <p
                  onClick={() => setTabNumber(1)}
                  className={`rounded-lg p-3 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors ${
                    tabNumber === 1
                      ? "bg-emerald-100 text-emerald-700 font-semibold"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {t.principles}
                </p>
                <p
                  onClick={() => setTabNumber(2)}
                  className={`rounded-lg p-3 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors ${
                    tabNumber === 2
                      ? "bg-emerald-100 text-emerald-700 font-semibold"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {t.goals}
                </p>
                <p
                  onClick={() => setTabNumber(3)}
                  className={`rounded-lg p-3 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors ${
                    tabNumber === 3
                      ? "bg-emerald-100 text-emerald-700 font-semibold"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {t.activities}
                </p>
                <p
                  onClick={() => setTabNumber(4)}
                  className={`rounded-lg p-3 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors ${
                    tabNumber === 4
                      ? "bg-emerald-100 text-emerald-700 font-semibold"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {t.funds}
                </p>
                <p
                  onClick={() => setTabNumber(5)}
                  className={`rounded-lg p-3 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors ${
                    tabNumber === 5
                      ? "bg-emerald-100 text-emerald-700 font-semibold"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {t.expenditure}
                </p>
              </div>

              <div className="md:col-span-5 rounded-lg shadow-lg p-6 bg-white mx-4 md:mx-12 my-4 md:my-8">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton active paragraph={{ rows: 4 }} />
                    <div className="flex justify-end items-center mt-6">
                      <div className="p-2 text-right">
                        <Skeleton active paragraph={{ rows: 1 }} />
                      </div>
                      <Skeleton.Avatar active size={80} />
                    </div>
                  </div>
                ) : tabNumber === 0 ? (
                  <div>
                    <h3 className="text-2xl md:text-2xl font-bold text-emerald-800 mb-4">
                      দারুল মুত্তাক্বীন ফাউন্ডেশন
                    </h3>
                    <p className="text-[16px] leading-8 text-gray-700 text-justify">
                      {language === "bengali"
                        ? `দারুল মুত্তাক্বীন ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক
                      শিক্ষা, দাওয়াহ ও পূর্ণত মানবকল্যাণে নিবেদিত সেবামূলক
                      প্রতিষ্ঠান। পরের মঙ্গল কামনা (অন্যের জন্য আল্লাহর নিকট
                      প্রার্থনা); পরের জন্য কিছু করার মানসিকতাই একদিন ব্যক্তি
                      আমিকে ভালো মানুষ হতে সহায়তা করে। আমরা সবাইকে ভালো মানুষ
                      হতে উপদেশ দিই কিন্তু ভালো মানুষ হয়ে উঠার পথ-পরিক্রমা অনেক
                      ক্ষেত্রেই বাতলে দিই না। (গরীব-অসহায়-দুঃস্থ-এতিম) আশেপাশের
                      মানুষের জন্য কিছু করতে চেষ্টা করলে যে নিজের অজান্তেই
                      মানসিক প্রশান্তি মিলে; ভালো মানুষ হওয়ার পথে যাত্রা শুরু
                      করা যায় তা বুঝি আমরা অনেকেই আজও ঠাহর করতে পারছিনা! ধরে
                      নিলাম আমাদের অনেকেরই ইচ্ছা আছে কিন্ত ফুরসত/সুযোগের অভাব।
                      নিজের জন্য/নিজেদের জন্য/আপনাদের জন্য এ ধরণের ফুরসত সৃষ্টি
                      করতে "দারুল মুত্তাক্বীন ফাউন্ডেশন (DMF)" এর যাত্রা শুরু
                      ২০২০ সালে। আমাদের লক্ষ্য: "শুধুমাত্র আল্লাহর সন্তুষ্টির
                      জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে
                      নিজেদের নিয়োজিত রাখা"`
                        : `Darul Muttakeen Foundation is a non-political, non-profit educational, Dawah, and fully dedicated humanitarian service organization. The mentality of wishing well for others (praying to Allah for others) and doing something for others one day helps a person become a good person. We all advise everyone to be good people, but in many cases, we don't outline the journey to becoming a good person. If we try to do something for the people around us (poor-helpless-distressed-orphans), we get mental peace without even realizing it; we can start the journey to becoming a good person, which I think many of us still can't comprehend! I assume many of us have the desire but lack the time/opportunity. To create such opportunities for yourself/ourselves/you, "Darul Muttakeen Foundation (DMF)" started its journey in 2020. Our goal: "To engage ourselves in religious education, propagation, and beneficial works solely for the pleasure of Allah."`}
                    </p>
                    <div className="flex justify-end items-center mt-6">
                      <div className="p-2 text-right">
                        <p className="font-semibold">আশিকুর রহমান</p>
                        <p className="text-sm text-gray-600">
                          {t.centralProjectDirector}
                        </p>
                        <div className="flex mt-2 space-x-3">
                          <a
                            href="#"
                            className="text-emerald-600 hover:text-emerald-800"
                          >
                            <FacebookOutlined />
                          </a>
                          <a
                            href="#"
                            className="text-emerald-600 hover:text-emerald-800"
                          >
                            <TwitterOutlined />
                          </a>
                          <a
                            href="mailto:contact@example.com"
                            className="text-emerald-600 hover:text-emerald-800"
                          >
                            <MailOutlined />
                          </a>
                        </div>
                      </div>
                      <img
                        className="w-20 h-20 rounded-full border-2 border-emerald-400"
                        src="https://i.ibb.co/sKV2T4H/IMG-20240704-WA0013.jpg"
                        alt=""
                        onError={(e) => {
                          e.target.src =
                            "https://ui-avatars.com/api/?name=আশিকুর+রহমান&background=10b981&color=fff&size=160";
                        }}
                      />
                    </div>
                  </div>
                ) : tabNumber === 1 ? (
                  <div>
                    <h3 className="text-2xl md:text-2xl font-bold text-emerald-800 mb-4">
                      {t.principles}
                    </h3>
                    <Steps
                      className="custom-steps"
                      progressDot
                      current={6}
                      direction="vertical"
                      items={items1}
                    />
                  </div>
                ) : tabNumber === 2 ? (
                  <div>
                    <h3 className="text-2xl md:text-2xl font-bold text-emerald-800 mb-4">
                      {t.goals}
                    </h3>
                    <Steps
                      className="custom-steps"
                      progressDot
                      current={6}
                      direction="vertical"
                      items={items2}
                    />
                  </div>
                ) : tabNumber === 3 ? (
                  <div>
                    <h3 className="text-2xl md:text-2xl font-bold text-emerald-800 mb-4">
                      {t.activities}
                    </h3>
                    <Steps
                      className="custom-steps"
                      progressDot
                      current={6}
                      direction="vertical"
                      items={items3}
                    />
                  </div>
                ) : tabNumber === 4 ? (
                  <div>
                    <h3 className="text-2xl md:text-2xl font-bold text-emerald-800 mb-4">
                      {t.funds}
                    </h3>
                    <Steps
                      className="custom-steps"
                      progressDot
                      current={6}
                      direction="vertical"
                      items={items4}
                    />
                  </div>
                ) : (
                  tabNumber === 5 && (
                    <div>
                      <h3 className="text-2xl md:text-2xl font-bold text-emerald-800 mb-4">
                        {t.expenditure}
                      </h3>
                      <Steps
                        className="custom-steps"
                        progressDot
                        current={6}
                        direction="vertical"
                        items={items5}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Active Members Section */}
        <div className=" py-12">
          <div className="mx-4 md:mx-[100px] lg:mx-[200px] xl:mx-[200px]">
            <h2 className="text-3xl md:text-4xl font-bold text-center py-8 text-emerald-800">
              {t.activeMembers} ({filteredUsers?.length})
            </h2>

            {/* Blood Donation Appeal */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-2xl text-red-700 bangla-text">
                    {t.bloodDonationAppeal}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center mb-8 gap-4">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  className="block py-4 ps-12 text-md text-gray-900 border border-gray-300 rounded-full w-full bg-white focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className="w-5 h-5 text-gray-500"
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
                </div>
              </div>

              <Select
                placeholder={t.filterByBlood}
                value={bloodGroupFilter || undefined}
                onChange={setBloodGroupFilter}
                allowClear
                className="w-full max-w-md"
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

            <div className="mx-4 md:mx-8 lg:mx-12 xl:mx-16">
              {userLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pt-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <UserCardSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pt-4">
                    {currentItems?.map((user, index) => (
                      <UserCard key={index} user={user} />
                    ))}
                  </div>

                  {filteredUsers?.length > itemsPerPage && (
                    <div className="flex justify-center p-2 my-8">
                      <Pagination
                        showQuickJumper
                        current={currentPage}
                        total={filteredUsers?.length}
                        pageSize={itemsPerPage}
                        onChange={onChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <Modal
        title={t.memberDetails}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <button
            key="close"
            onClick={handleCancel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded"
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
                    "&background=10b981&color=fff&size=256"
                }
                alt={selectedUser.username || selectedUser.firstName}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
                onError={(e) => {
                  e.target.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(
                      selectedUser.firstName + " " + selectedUser.lastName
                    ) +
                    "&background=10b981&color=fff&size=256";
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
                <span className="ml-2 text-emerald-600 capitalize">
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
                  <span className="font-semibold text-gray-700">
                    {t.email}:
                  </span>
                  <a
                    href={`mailto:${selectedUser.email}`}
                    className="ml-2 text-emerald-600 hover:underline flex items-center"
                  >
                    <MailOutlined className="mr-1" /> {selectedUser.email}
                  </a>
                </div>
              )}

              {selectedUser.phone && (
                <div>
                  <span className="font-semibold text-gray-700">
                    {t.phone}:
                  </span>
                  <a
                    href={`tel:${selectedUser.phone}`}
                    className="ml-2 text-emerald-600 hover:underline flex items-center"
                  >
                    <PhoneOutlined className="mr-1" /> 0{selectedUser.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap");

        .bangla-text {
          font-family: "Hind Siliguri", sans-serif;
        }

        :global(.custom-steps .ant-steps-item-title) {
          font-family: "Hind Siliguri", sans-serif;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
