import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Progress,
  Divider,
  Tag,
  Avatar,
  Descriptions,
  Dropdown,
  Menu,
  Button,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  LineChartOutlined,
  PieChartOutlined,
  WalletOutlined,
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useHistory } from "react-router-dom";

// Translation content
const translations = {
  en: {
    title: "Investment Profile",
    subtitle: "Your overall investment status and growth",
    totalInvestment: "Total Investment",
    currentValue: "Current Value",
    totalProfit: "Total Profit",
    totalShare: "Total Share",
    investmentGrowth: "Investment Growth",
    monthlyGrowth: "Monthly Growth",
    investmentDistribution: "Investment Distribution",
    investmentBreakdown: "Investment Breakdown",
    recentTransactions: "Recent Transactions",
    date: "Date",
    description: "Description",
    amount: "Amount",
    status: "Status",
    completed: "Completed",
    pending: "Pending",
    email: "Email",
    phone: "Phone",
    profit: "Profit",
    specialProject: "Special Project",
    monthlyProfit: "Monthly Profit",
    yearlyProfit: "Yearly Profit",
    realEstate: "Real Estate",
    business: "Business",
    savings: "Savings",
    others: "Others",
    total: "Total",
    investmentId: "Investment ID",
  },
  bn: {
    title: "ইনভেস্টমেন্ট প্রোফাইল",
    subtitle: "আপনার ইনভেস্টমেন্টের সার্বিক অবস্থা ও প্রবৃদ্ধি",
    totalInvestment: "মোট ইনভেস্টমেন্ট",
    currentValue: "বর্তমান মূল্য",
    totalProfit: "মোট লাভ",
    totalShare: "মোট শেয়ার",
    investmentGrowth: "ইনভেস্টমেন্ট প্রবৃদ্ধি",
    monthlyGrowth: "মাসিক বৃদ্ধি",
    investmentDistribution: "ইনভেস্টমেন্ট বিতরণ",
    investmentBreakdown: "ইনভেস্টমেন্ট বিবরণ",
    recentTransactions: "সাম্প্রতিক লেনদেন",
    date: "তারিখ",
    description: "বিবরণ",
    amount: "পরিমাণ",
    status: "স্ট্যাটাস",
    completed: "সম্পন্ন",
    pending: "প্রক্রিয়াধীন",
    email: "ইমেইল",
    phone: "ফোন",
    profit: "লাভ",
    specialProject: "স্পেশাল প্রজেক্ট",
    monthlyProfit: "মাসিক লাভ",
    yearlyProfit: "বাৎসরিক লাভ",
    realEstate: "রিয়েল এস্টেট",
    business: "ব্যবসা",
    savings: "সঞ্চয়",
    others: "অন্যান্য",
    total: "মোট",
    investmentId: "ইনভেস্টমেন্ট আইডি",
  },
};

const InvestmentProfile = () => {
  const [language, setLanguage] = useState("bn");
  const [investmentId, setInvestmentId] = useState("");

  const history = useHistory();

  const handleLogout = () => {
    sessionStorage.removeItem("investmentAuth");
    history.push("/investment");
  };

  // Parse user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {
    firstName: "ব্যবহারকারী",
    lastName: "",
    email: "N/A",
    phone: "N/A",
    image: null,
  };

  // Parse investment info from sessionStorage
  const investmentInfo = JSON.parse(
    sessionStorage.getItem("investmentAuth")
  ) || {
    investmentID: 0,
    currentValue: 0,
    profit: 0,
    growthPercentage: 0,
    monthlyGrowth: 0,
  };

  // Sample data - replace with actual API data
  const investmentData = {
    totalInvestment: investmentInfo.totalInvestment || 125000,
    currentValue: investmentInfo.currentValue || 158000,
    profit: investmentInfo.profit || 33000,
    share: investmentInfo.share || 5,
    growthPercentage: investmentInfo.growthPercentage || 26.4,
    monthlyGrowth: investmentInfo.monthlyGrowth || 2.2,
    investments: [
      {
        name: translations[language].monthlyProfit,
        amount: 75000,
        color: "#4f46e5",
      },
      {
        name: translations[language].yearlyProfit,
        amount: 35000,
        color: "#10b981",
      },
      {
        name: translations[language].specialProject,
        amount: 15000,
        color: "#f59e0b",
      },
    ],
    timelineData: {
      labels: ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই"],
      datasets: [
        {
          label: translations[language].investmentGrowth,
          data: [50000, 65000, 80000, 95000, 110000, 125000, 158000],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    distributionData: {
      labels: [
        translations[language].realEstate,
        translations[language].business,
        translations[language].savings,
        translations[language].others,
      ],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"],
          borderWidth: 0,
        },
      ],
    },
  };

  const t = (key) => translations[language][key] || key;

  const languageMenu = (
    <Menu
      selectedKeys={[language]}
      onClick={({ key }) => setLanguage(key)}
      items={[
        { key: "bn", label: "বাংলা" },
        { key: "en", label: "English" },
      ]}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12 ">
      <div className="mx-4 md:mx-40">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t("title")}
            </h1>
            <p className="text-gray-600">{t("subtitle")}</p>
          </div>
          <Dropdown overlay={languageMenu} placement="bottomRight">
            <Button icon={<GlobalOutlined />}>
              {language === "bn" ? "বাংলা" : "English"}
            </Button>
          </Dropdown>
        </div>

        <Row gutter={[24, 24]}>
          {/* User Profile Section */}
          <Col xs={24} md={6}>
            <Card className="shadow-md border-0 rounded-xl sticky top-4">
              <div className="flex flex-col items-center mb-6">
                <Avatar
                  size={120}
                  src={userInfo.image}
                  icon={<UserOutlined />}
                  className="mb-4"
                />
                <h2 className="text-xl font-bold text-gray-800">
                  {userInfo.firstName} {userInfo.lastName}
                </h2>
                <Tag color="blue" icon={<IdcardOutlined />} className="mt-2">
                  {t("investmentId")}: {investmentInfo?.investmentID || "N/A"}
                </Tag>
              </div>

              <Descriptions column={1} bordered size="small">
                <Descriptions.Item
                  label={t("email")}
                  labelStyle={{ fontWeight: 600 }}
                >
                  <div className="flex items-center">
                    <MailOutlined className="mr-2" />
                    {userInfo.email}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item
                  label={t("phone")}
                  labelStyle={{ fontWeight: 600 }}
                >
                  <div className="flex items-center">
                    <PhoneOutlined className="mr-2" />
                    {userInfo.phone}
                  </div>
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <div className="text-center">
                <div className="text-center space-y-2">
                  <Tag color="green" className="text-lg py-2 px-4">
                    {t("totalShare")}: 0{investmentData.share.toLocaleString()}
                  </Tag>
                  <Tag color="green" className="text-lg py-2 px-4">
                    {t("totalProfit")}: ৳
                    {investmentData.profit.toLocaleString()}
                  </Tag>
                  <div style={{ marginTop: "1rem" }}>
                    <Button
                      onClick={handleLogout}
                      icon={<LogoutOutlined />}
                      className="font-medium text-gray-700  hover:text-black border border-gray-300 hover:border-gray-400 rounded-lg px-4 py-1"
                    >
                      লগআউট
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Investment Content Section */}
          <Col xs={24} md={18}>
            {/* Summary Cards */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} sm={12} md={8}>
                <Card className="shadow-md border-0 rounded-xl">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 mr-4">
                      <DollarOutlined className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">
                        {t("totalInvestment")}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        ৳{investmentData.totalInvestment.toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card className="shadow-md border-0 rounded-xl">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <LineChartOutlined className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">{t("currentValue")}</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        ৳{investmentData.currentValue.toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card className="shadow-md border-0 rounded-xl">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                      <WalletOutlined className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">{t("totalProfit")}</p>
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        ৳{investmentData.profit.toLocaleString()}
                        <Tag
                          color={
                            investmentData.growthPercentage >= 0
                              ? "green"
                              : "red"
                          }
                          className="ml-2 flex items-center"
                        >
                          {investmentData.growthPercentage >= 0 ? (
                            <ArrowUpOutlined className="mr-1" />
                          ) : (
                            <ArrowDownOutlined className="mr-1" />
                          )}
                          {Math.abs(investmentData.growthPercentage)}%
                        </Tag>
                      </h3>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Growth Chart */}
            <Card
              title={t("investmentGrowth")}
              className="shadow-md border-0 rounded-xl mb-6"
              extra={
                <Tag color="green">
                  {t("monthlyGrowth")}: {investmentData.monthlyGrowth}%
                </Tag>
              }
            >
              <div className="h-80">
                <Line
                  data={investmentData.timelineData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `৳${context.raw.toLocaleString()}`;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: function (value) {
                            return `৳${value.toLocaleString()}`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card>

            {/* Investment Distribution and Breakdown */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={24} md={12}>
                <Card
                  title={t("investmentDistribution")}
                  className="shadow-md border-0 rounded-xl h-full"
                >
                  <div className="h-64">
                    <Pie
                      data={investmentData.distributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                return `${context.label}: ${context.raw}%`;
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  title={t("investmentBreakdown")}
                  className="shadow-md border-0 rounded-xl h-full"
                >
                  <div className="space-y-4">
                    {investmentData.investments.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="font-bold">
                            ৳{item.amount.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          percent={
                            (item.amount / investmentData.totalInvestment) * 100
                          }
                          strokeColor={item.color}
                          showInfo={false}
                        />
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <div className="flex justify-between font-bold text-lg">
                    <span>{t("total")}:</span>
                    <span>
                      ৳{investmentData.totalInvestment.toLocaleString()}
                    </span>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Recent Transactions */}
            <Card
              title={t("recentTransactions")}
              className="shadow-md border-0 rounded-xl"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("date")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("description")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("amount")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      {
                        date:
                          language === "bn"
                            ? "১০ জুলাই, ২০২৩"
                            : "10 July, 2023",
                        description: t("monthlyProfit"),
                        amount: 5250,
                        status: "completed",
                      },
                      {
                        date:
                          language === "bn" ? "৫ জুলাই, ২০২৩" : "5 July, 2023",
                        description: t("specialProject"),
                        amount: 10000,
                        status: "completed",
                      },
                      {
                        date:
                          language === "bn" ? "১ জুলাই, ২০২৩" : "1 July, 2023",
                        description: t("yearlyProfit"),
                        amount: 12500,
                        status: "completed",
                      },
                      {
                        date:
                          language === "bn" ? "২৫ জুন, ২০২৩" : "25 June, 2023",
                        description: t("specialProject"),
                        amount: 7500,
                        status: "pending",
                      },
                    ].map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ৳{transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Tag
                            color={
                              transaction.status === "completed"
                                ? "green"
                                : "orange"
                            }
                            className="capitalize"
                          >
                            {t(transaction.status)}
                          </Tag>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default InvestmentProfile;
