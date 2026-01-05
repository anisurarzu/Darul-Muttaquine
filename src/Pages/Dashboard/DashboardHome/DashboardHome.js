import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { coreAxios } from "../../../utilities/axios";
import {
  Card,
  Statistic,
  Spin,
  Progress,
  Avatar,
  Divider,
  Skeleton,
  Empty,
  Result,
  Button,
  Modal,
  List,
  Tag,
} from "antd";
import {
  UserOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ProjectOutlined,
  WalletOutlined,
  PieChartOutlined,
  LineChartOutlined,
  IdcardOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import ProjectCard from "../Project/ProjectCard";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectInfo, setProjectInfo] = useState([]);
  const [depositData, setDepositData] = useState([]);
  const [singleDepositData, setSingleDepositData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [singleCostData, setSingleCostData] = useState([]);
  const [quizMoney, setQuizMoney] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonthDeposits, setSelectedMonthDeposits] = useState([]);
  const [selectedMonthName, setSelectedMonthName] = useState("");

  // Data fetching functions
  const getAllUserList = async () => {
    try {
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        setUsers(response?.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const getQuizMoneyInfo = async () => {
    try {
      const response = await coreAxios.get(`/quiz-money/${userInfo?.uniqueId}`);
      if (response?.status === 200) {
        const filteredData = response?.data?.filter(
          (item) => item.status !== "Paid"
        );
        setQuizMoney(filteredData || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getProjectInfo = async () => {
    try {
      const response = await coreAxios.get("project-info");
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        const approvedProjects = sortedData?.filter(
          (project) => project.approvalStatus === "Approve"
        );
        setProjectInfo(approvedProjects || []);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const fetchDepositInfo = async () => {
    try {
      const response = await coreAxios.get("deposit-info");
      if (response?.status === 200) {
        const approvedDeposits = response?.data.filter(
          (deposit) => deposit?.status === "Approved"
        );
        setDepositData(approvedDeposits || []);
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const getSingleDeposit = async () => {
    try {
      const response = await coreAxios.get(`deposit-info/${userInfo?._id}`);
      if (response?.status === 200) {
        setSingleDepositData(response?.data || { deposits: [] });
      }
    } catch (error) {
      console.error("Error fetching user deposits:", error);
      setSingleDepositData({ deposits: [] });
    }
  };

  const fetchCostInfo = async () => {
    try {
      const response = await coreAxios.get("cost-info");
      if (response?.status === 200) {
        const approvedDeposits = response?.data.filter(
          (deposit) => deposit.status === "Approved"
        );
        setCostData(approvedDeposits || []);
      }
    } catch (error) {
      console.error("Error fetching costs:", error);
    }
  };

  const getSingleCost = async () => {
    try {
      const response = await coreAxios.get(`cost-info/${userInfo?._id}`);
      if (response?.status === 200) {
        setSingleCostData(response?.data || { deposits: [] });
      }
    } catch (error) {
      console.error("Error fetching user costs:", error);
      setSingleCostData({ deposits: [] });
    }
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchDepositInfo(),
          getProjectInfo(),
          getAllUserList(),
          getSingleDeposit(),
          getSingleCost(),
          fetchCostInfo(),
          getQuizMoneyInfo(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.isVerification) {
      fetchData();
    }
  }, [userInfo?.isVerification]);

  // Calculate metrics with safe defaults
  const totalDepositAmount =
    depositData?.reduce(
      (total, deposit) => total + (deposit?.amount || 0),
      0
    ) || 0;

  const approvedUserDeposits =
    singleDepositData?.deposits?.filter(
      (deposit) => deposit?.status === "Approved"
    ) || [];

  const depositAmount =
    approvedUserDeposits?.reduce(
      (total, deposit) => total + (deposit?.amount || 0),
      0
    ) || 0;

  const totalCostAmount =
    costData?.reduce((total, cost) => total + (cost?.amount || 0), 0) || 0;

  const approvedUserCosts =
    singleCostData?.deposits?.filter((cost) => cost?.status === "Approved") ||
    [];

  const costAmount =
    approvedUserCosts?.reduce(
      (total, cost) => total + (cost?.amount || 0),
      0
    ) || 0;

  const totalQuizAmount =
    quizMoney?.reduce(
      (total, deposit) => Number(total) + (Number(deposit?.amount) || 0),
      0
    ) || 0;

  const currentBalance = Number(totalDepositAmount) - Number(totalCostAmount);

  // Month steps data with enhanced functionality
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getMonthData = (deposits) => {
    const monthData = {};

    // Initialize all months with 0 amount
    months.forEach((month) => {
      monthData[month] = {
        amount: 0,
        deposits: [],
      };
    });

    // Process each deposit
    deposits?.forEach((deposit) => {
      if (!deposit?.depositDate) return;

      const date = new Date(deposit.depositDate);
      if (isNaN(date.getTime())) return;

      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];

      if (monthData[monthName]) {
        monthData[monthName].amount += deposit.amount || 0;
        monthData[monthName].deposits.push(deposit);
      }
    });

    return monthData;
  };

  const monthData = getMonthData(approvedUserDeposits);

  const handleMonthClick = (monthName) => {
    if (monthData[monthName]?.deposits?.length > 0) {
      setSelectedMonthDeposits(monthData[monthName].deposits || []);
      setSelectedMonthName(monthName);
      setIsModalVisible(true);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (!userInfo?.isVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-2xl w-full">
          <Result
            icon={
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-full inline-block shadow-2xl">
                <ExclamationCircleOutlined className="text-white text-6xl" />
              </div>
            }
            title={
              <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                অ্যাকাউন্ট ভেরিফিকেশন প্রয়োজন
              </h2>
            }
            subTitle={
              <div className="text-base md:text-lg space-y-3 mt-4">
                <p className="text-gray-700 leading-relaxed">
                  ড্যাশবোর্ড এক্সেস করার জন্য আপনাকে প্রথমে আপনার প্রোফাইল ভেরিফাই
                  করতে হবে
                </p>
                <p className="text-gray-600 leading-relaxed">
                  নিচের বাটনে ক্লিক করে আপনার প্রোফাইলে যান এবং আইডি ভেরিফিকেশন
                  সম্পন্ন করুন
                </p>
              </div>
            }
            extra={
              <Link to="/dashboard/profile">
                <Button
                  type="primary"
                  size="large"
                  icon={<IdcardOutlined />}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 h-12 md:h-14 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8"
                >
                  প্রোফাইলে যান
                </Button>
              </Link>
            }
            className="text-center"
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-xl rounded-2xl border-2 border-gray-100 bg-white">
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="p-4 sm:p-6 lg:p-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Financial Dashboard
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                আপনার আর্থিক তথ্য এবং পরিসংখ্যান দেখুন
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border-2 border-blue-100">
                <p className="text-xs text-gray-500 mb-1">বর্তমান তারিখ</p>
                <p className="text-sm font-semibold text-gray-700">
                  {new Date().toLocaleDateString('bn-BD', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
      >
        {/* Total Users */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl border-2 border-blue-200/50 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-blue-100 text-sm md:text-base font-medium mb-1">মোট ব্যবহারকারী</p>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    {users?.length || 0}
                  </h3>
                  <p className="text-blue-100 text-xs md:text-sm">সকল নিবন্ধিত সদস্য</p>
                </div>
                <div className="p-4 md:p-5 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <UserOutlined className="text-white text-2xl md:text-3xl" />
                </div>
              </div>
              {userInfo?.userRole === "Super-Admin" && (
                <Link
                  to="/dashboard/users"
                  className="inline-flex items-center gap-2 text-white hover:text-blue-100 text-sm md:text-base font-semibold mt-4 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <span>সকল ব্যবহারকারী দেখুন</span>
                  <ArrowUpOutlined className="rotate-45" />
                </Link>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quiz Balance */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-emerald-100 text-sm md:text-base font-medium mb-1">কুইজ ব্যালেন্স</p>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    ৳{(totalQuizAmount || 0).toLocaleString()}
                  </h3>
                  <p className="text-emerald-100 text-xs md:text-sm">অনুল্লিখিত পুরস্কার</p>
                </div>
                <div className="p-4 md:p-5 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <LineChartOutlined className="text-white text-2xl md:text-3xl" />
                </div>
              </div>
              <Link
                to="/dashboard/scholarship"
                className="inline-flex items-center gap-2 text-white hover:text-emerald-100 text-sm md:text-base font-semibold mt-4 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span>বিস্তারিত দেখুন</span>
                <ArrowUpOutlined className="rotate-45" />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* My Deposit */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl border-2 border-purple-200/50 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-purple-100 text-sm md:text-base font-medium mb-1">আমার জমা</p>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    ৳{(depositAmount || 0).toLocaleString()}
                  </h3>
                  <p className="text-purple-100 text-xs md:text-sm">অনুমোদিত জমা</p>
                </div>
                <div className="p-4 md:p-5 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <WalletOutlined className="text-white text-2xl md:text-3xl" />
                </div>
              </div>
              <Link
                to="/dashboard/depositInfo"
                className="inline-flex items-center gap-2 text-white hover:text-purple-100 text-sm md:text-base font-semibold mt-4 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span>ইতিহাস দেখুন</span>
                <ArrowUpOutlined className="rotate-45" />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Total Deposit */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl border-2 border-indigo-200/50 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-600 overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-indigo-100 text-sm md:text-base font-medium mb-1">মোট জমা</p>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    ৳{(totalDepositAmount || 0).toLocaleString()}
                  </h3>
                  <p className="text-indigo-100 text-xs md:text-sm">সকল অনুমোদিত জমা</p>
                </div>
                <div className="p-4 md:p-5 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <ArrowUpOutlined className="text-white text-2xl md:text-3xl" />
                </div>
              </div>
              <Link
                to="/dashboard/depositInfo"
                className="inline-flex items-center gap-2 text-white hover:text-indigo-100 text-sm md:text-base font-semibold mt-4 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span>সকল দেখুন</span>
                <ArrowUpOutlined className="rotate-45" />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Approved Withdrawals */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl border-2 border-orange-200/50 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-orange-100 text-sm md:text-base font-medium mb-1">উত্তোলন</p>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    {costData?.length || 0}
                  </h3>
                  <p className="text-orange-100 text-xs md:text-sm">অনুমোদিত অনুরোধ</p>
                </div>
                <div className="p-4 md:p-5 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <ProjectOutlined className="text-white text-2xl md:text-3xl" />
                </div>
              </div>
              <Link
                to="/dashboard/withdraw"
                className="inline-flex items-center gap-2 text-white hover:text-orange-100 text-sm md:text-base font-semibold mt-4 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span>অনুরোধ দেখুন</span>
                <ArrowUpOutlined className="rotate-45" />
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Current Balance */}
        <motion.div variants={itemVariants}>
          <Card className={`h-full shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl border-2 overflow-hidden group relative ${
            currentBalance >= 0 
              ? "border-emerald-200/50 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600" 
              : "border-red-200/50 bg-gradient-to-br from-red-500 via-rose-600 to-pink-600"
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-white/90 text-sm md:text-base font-medium mb-1">বর্তমান ব্যালেন্স</p>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    ৳{(currentBalance || 0).toLocaleString()}
                  </h3>
                  <p className="text-white/80 text-xs md:text-sm">নেট ব্যালেন্স</p>
                </div>
                <div className="p-4 md:p-5 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <PieChartOutlined className="text-white text-2xl md:text-3xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <p className="text-white/70 text-xs mb-1">জমা</p>
                    <p className="text-white font-bold text-sm md:text-base">
                      ৳{(totalDepositAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <p className="text-white/70 text-xs mb-1">উত্তোলন</p>
                    <p className="text-white font-bold text-sm md:text-base">
                      ৳{(totalCostAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Deposit Timeline */}
      <motion.div variants={itemVariants} className="mb-6 md:mb-8">
        <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl border-2 border-gray-200/50 bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 md:p-6 -m-6 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white mb-1">
                  আপনার জমার সময়সূচী
                </h3>
                <p className="text-blue-100 text-sm md:text-base">
                  মাস অনুযায়ী জমার পরিসংখ্যান
                </p>
              </div>
              <Link
                to="/dashboard/depositInfo"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-4 py-2 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 transform hover:scale-105"
              >
                <span>বিস্তারিত দেখুন</span>
                <ArrowUpOutlined className="rotate-45" />
              </Link>
            </div>
          </div>
          <div className="px-2 md:px-4 pb-4">
            <div className="flex overflow-x-auto pb-4 scrollbar-hide gap-3 md:gap-4">
              {months.map((month, index) => {
                const hasDeposits = (monthData[month]?.amount || 0) > 0;
                const currentMonth = new Date().getMonth();
                const isCurrentMonth = index === currentMonth;

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMonthClick(month)}
                    className={`flex flex-col items-center px-4 md:px-6 py-4 md:py-5 rounded-2xl min-w-[100px] md:min-w-[120px] cursor-pointer transition-all duration-300 ${
                      hasDeposits
                        ? "bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 shadow-xl shadow-emerald-500/30 border-2 border-emerald-300/50"
                        : isCurrentMonth
                        ? "bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-300/50 shadow-lg"
                        : "bg-gray-100 border-2 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <span
                      className={`font-bold text-base md:text-lg mb-2 ${
                        hasDeposits
                          ? "text-white"
                          : isCurrentMonth
                          ? "text-blue-700"
                          : "text-gray-500"
                      }`}
                    >
                      {month}
                    </span>
                    {hasDeposits ? (
                      <>
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mb-2">
                          <DollarOutlined className="text-white text-xl md:text-2xl" />
                        </div>
                        <span className="text-white font-extrabold text-sm md:text-base">
                          ৳{(monthData[month]?.amount || 0).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      isCurrentMonth && (
                        <div className="bg-blue-200 p-2 rounded-lg">
                          <CalendarOutlined className="text-blue-600 text-xl md:text-2xl" />
                        </div>
                      )
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Month Deposit Details Modal */}
      <Modal
        title={
          <div className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {selectedMonthName} মাসের জমা
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 900 }}
        className="rounded-2xl"
        styles={{
          content: {
            borderRadius: '1rem',
            padding: 0,
          }
        }}
      >
        {selectedMonthDeposits?.length > 0 ? (
          <div className="p-4 md:p-6">
            <List
              itemLayout="horizontal"
              dataSource={selectedMonthDeposits}
              renderItem={(deposit, index) => (
                <List.Item className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <List.Item.Meta
                    avatar={
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
                        <Avatar 
                          icon={<DollarOutlined className="text-white" />} 
                          className="bg-transparent"
                          size={40}
                        />
                      </div>
                    }
                    title={
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-extrabold text-emerald-600">
                          ৳{(deposit.amount || 0).toLocaleString()}
                        </span>
                        <Tag color="green" className="text-xs md:text-sm">
                          অনুমোদিত
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="mt-3 space-y-2 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">পেমেন্ট পদ্ধতি:</span>
                          <span className="text-gray-600">{deposit.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">তারিখ:</span>
                          <span className="text-gray-600">
                            {new Date(deposit.depositDate).toLocaleDateString('bn-BD', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        {deposit.transactionId && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">লেনদেন আইডি:</span>
                            <span className="text-gray-600 font-mono text-xs">{deposit.transactionId}</span>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        ) : (
          <div className="p-8 md:p-12">
            <Empty 
              description={
                <span className="text-gray-600 text-base md:text-lg">
                  এই মাসে কোন জমা পাওয়া যায়নি
                </span>
              }
            />
          </div>
        )}
      </Modal>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
