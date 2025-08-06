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
      <div className="flex items-center justify-center min-h-screen p-4">
        <Result
          icon={
            <ExclamationCircleOutlined className="text-yellow-500 text-6xl" />
          }
          title="অ্যাকাউন্ট ভেরিফিকেশন প্রয়োজন"
          subTitle={
            <div className="text-lg">
              <p>
                ড্যাশবোর্ড এক্সেস করার জন্য আপনাকে প্রথমে আপনার প্রোফাইল ভেরিফাই
                করতে হবে
              </p>
              <p className="mt-4">
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
                className="bg-blue-500 hover:bg-blue-600 h-12 text-lg"
              >
                প্রোফাইলে যান
              </Button>
            </Link>
          }
          className="max-w-2xl text-center"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-lg">
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Financial Dashboard
        </h1>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* Total Users */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-lg font-medium">Total Users</p>
                <h3 className="text-3xl font-bold text-blue-900 mt-2">
                  {users?.length || 0}
                </h3>
              </div>
              <div className="p-4 rounded-full bg-blue-100">
                <UserOutlined className="text-blue-600 text-2xl" />
              </div>
            </div>
            <Divider className="my-4 border-blue-200" />
            {userInfo?.userRole === "Super-Admin" && (
              <Link
                to="/dashboard/users"
                className="text-blue-600 hover:text-blue-800 text-lg font-medium flex items-center"
              >
                View all users <ArrowUpOutlined className="ml-2 rotate-45" />
              </Link>
            )}
          </Card>
        </motion.div>

        {/* Quiz Balance */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-lg font-medium">
                  Quiz Balance
                </p>
                <h3 className="text-3xl font-bold text-green-900 mt-2">
                  ৳{(totalQuizAmount || 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-4 rounded-full bg-green-100">
                <LineChartOutlined className="text-green-600 text-2xl" />
              </div>
            </div>
            <Divider className="my-4 border-green-200" />
            <Link
              to="/dashboard/scholarship"
              className="text-green-600 hover:text-green-800 text-lg font-medium flex items-center"
            >
              View details <ArrowUpOutlined className="ml-2 rotate-45" />
            </Link>
          </Card>
        </motion.div>

        {/* My Deposit */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-lg font-medium">
                  My Deposit
                </p>
                <h3 className="text-3xl font-bold text-purple-900 mt-2">
                  ৳{(depositAmount || 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-4 rounded-full bg-purple-100">
                <WalletOutlined className="text-purple-600 text-2xl" />
              </div>
            </div>
            <Divider className="my-4 border-purple-200" />
            <Link
              to="/dashboard/depositInfo"
              className="text-purple-600 hover:text-purple-800 text-lg font-medium flex items-center"
            >
              View history <ArrowUpOutlined className="ml-2 rotate-45" />
            </Link>
          </Card>
        </motion.div>

        {/* Total Deposit */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-700 text-lg font-medium">
                  Total Deposit
                </p>
                <h3 className="text-3xl font-bold text-indigo-900 mt-2">
                  ৳{(totalDepositAmount || 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-4 rounded-full bg-indigo-100">
                <ArrowUpOutlined className="text-indigo-600 text-2xl" />
              </div>
            </div>
            <Divider className="my-4 border-indigo-200" />
            <Link
              to="/dashboard/depositInfo"
              className="text-indigo-600 hover:text-indigo-800 text-lg font-medium flex items-center"
            >
              View all <ArrowUpOutlined className="ml-2 rotate-45" />
            </Link>
          </Card>
        </motion.div>

        {/* Approved Withdrawals */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 text-lg font-medium">
                  Withdrawals
                </p>
                <h3 className="text-3xl font-bold text-orange-900 mt-2">
                  {costData?.length || 0}
                </h3>
                <p className="text-orange-600 text-sm mt-1">
                  Approved requests
                </p>
              </div>
              <div className="p-4 rounded-full bg-orange-100">
                <ProjectOutlined className="text-orange-600 text-2xl" />
              </div>
            </div>
            <Divider className="my-4 border-orange-200" />
            <Link
              to="/dashboard/withdraw"
              className="text-orange-600 hover:text-orange-800 text-lg font-medium flex items-center"
            >
              View requests <ArrowUpOutlined className="ml-2 rotate-45" />
            </Link>
          </Card>
        </motion.div>

        {/* Current Balance */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-700 text-lg font-medium">
                  Current Balance
                </p>
                <h3
                  className={`text-3xl font-bold mt-2 ${
                    currentBalance >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  ৳{(currentBalance || 0).toLocaleString()}
                </h3>
              </div>
              <div className="p-4 rounded-full bg-cyan-100">
                <PieChartOutlined className="text-cyan-600 text-2xl" />
              </div>
            </div>
            <Divider className="my-4 border-cyan-200" />
            <div className="flex justify-between">
              <span className="text-cyan-700 text-lg">
                Deposits: ৳{(totalDepositAmount || 0).toLocaleString()}
              </span>
              <span className="text-cyan-700 text-lg">
                Withdrawals: ৳{(totalCostAmount || 0).toLocaleString()}
              </span>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Deposit Timeline */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Your Deposit Timeline
            </h3>
            <Link
              to="/dashboard/depositInfo"
              className="text-blue-600 text-lg flex items-center"
            >
              View details <ArrowUpOutlined className="ml-2 rotate-45" />
            </Link>
          </div>
          <div className="flex overflow-x-auto pb-2 scrollbar-hide">
            {months.map((month, index) => {
              const hasDeposits = (monthData[month]?.amount || 0) > 0;
              const currentMonth = new Date().getMonth();
              const isCurrentMonth = index === currentMonth;

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleMonthClick(month)}
                  className={`flex flex-col items-center mx-2 px-5 py-4 rounded-xl min-w-[90px] cursor-pointer ${
                    hasDeposits
                      ? "bg-gradient-to-br from-green-100 to-green-50 shadow-md shadow-green-100/50 border border-green-200"
                      : isCurrentMonth
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span
                    className={`font-medium text-lg ${
                      hasDeposits
                        ? "text-green-700"
                        : isCurrentMonth
                        ? "text-blue-700"
                        : "text-gray-500"
                    }`}
                  >
                    {month}
                  </span>
                  {hasDeposits ? (
                    <>
                      <DollarOutlined className="text-green-500 mt-2 text-xl" />
                      <span className="text-green-700 font-semibold mt-1">
                        ৳{(monthData[month]?.amount || 0).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    isCurrentMonth && (
                      <CalendarOutlined className="text-blue-500 mt-2 text-xl" />
                    )
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Month Deposit Details Modal */}
      <Modal
        title={`Deposits for ${selectedMonthName}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedMonthDeposits?.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={selectedMonthDeposits}
            renderItem={(deposit) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<DollarOutlined />} />}
                  title={`৳${(deposit.amount || 0).toLocaleString()}`}
                  description={
                    <>
                      <div>Method: {deposit.paymentMethod}</div>
                      <div>
                        Date:{" "}
                        {new Date(deposit.depositDate).toLocaleDateString()}
                      </div>
                      <div>Transaction ID: {deposit.transactionId}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No deposits found for this month" />
        )}
      </Modal>
    </motion.div>
  );
};

export default DashboardHome;
