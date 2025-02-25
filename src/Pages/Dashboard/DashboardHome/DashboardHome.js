import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { coreAxios } from "../../../utilities/axios";
import {
  Alert,
  Avatar,
  Card,
  Col,
  Progress,
  Row,
  Statistic,
  Steps,
} from "antd";

import { Spin } from "antd";

import ProfileCard from "../Profile/ProfileCard";
import ProjectCard from "../Project/ProjectCard";
import { Link } from "react-router-dom";
import {
  ShoppingCartOutlined,
  DollarCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import Title from "antd/es/skeleton/Title";

export default function DashboardHome() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [users, setUsers] = useState([]);
  const [scholarShipInfo, setScholarShipInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState([]);
  const [depositData, setDepositData] = useState([]);
  const [singleDepositData, setSingleDepositData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [singleCostData, setSingleCostData] = useState([]);
  const [quizMoney, setQuizMoney] = useState([]);

  const getAllUserList = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        setLoading(false);
        setUsers(response?.data);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    }
  };
  const getQuizMoneyInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/quiz-money/${userInfo?.uniqueId}`);

      if (response?.status === 200) {
        const filteredData = response?.data?.filter(
          (item) => item.status !== "Paid"
        );
        setQuizMoney(filteredData);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      // toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  const getScholarShipInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/scholarship-info`);
      if (response?.status === 200) {
        setLoading(false);
        setScholarShipInfo(response?.data);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message);
    }
  };
  const getProjectInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("project-info");
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        const approvedProjects = sortedData?.filter(
          (project) => project.approvalStatus === "Approve"
        );
        setProjectInfo(approvedProjects);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  /* deposit info */
  const fetchDepositInfo = async () => {
    try {
      setLoading(true);
      const uri = "deposit-info";
      const response = await coreAxios.get(uri);
      if (response?.status === 200) {
        const approvedDeposits = response?.data.filter(
          (deposit) => deposit?.status === "Approved"
        );
        setDepositData(approvedDeposits);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };

  const getSingleDeposit = async () => {
    try {
      setLoading(true);

      const response = await coreAxios.get(`deposit-info/${userInfo?._id}`);
      if (response?.status === 200) {
        setSingleDepositData(response?.data);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };

  /* cost info */
  const fetchCostInfo = async () => {
    try {
      setLoading(true);
      const uri = "cost-info";
      const response = await coreAxios.get(uri);
      if (response?.status === 200) {
        const approvedDeposits = response?.data.filter(
          (deposit) => deposit.status === "Approved"
        );
        setCostData(approvedDeposits);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };
  const getSingleCost = async () => {
    try {
      setLoading(true);

      const response = await coreAxios.get(`cost-info/${userInfo?._id}`);
      if (response?.status === 200) {
        setSingleCostData(response?.data);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };
  // Calculate the total amount
  const totalDepositAmount = depositData?.reduce(
    (total, deposit) => total + deposit?.amount,
    0
  );

  const data = singleDepositData?.deposits?.filter(
    (deposit) => deposit.status === "Approved"
  );
  console.log("---", data);
  const depositAmount = data?.reduce(
    (total, deposit) => total + deposit?.amount,
    0
  );

  // Calculate the cost amount
  const totalCostAmount = costData?.reduce(
    (total, cost) => total + cost?.amount,
    0
  );

  const data2 = singleCostData?.deposits?.filter(
    (cost) => cost?.status === "Approved"
  );
  const costAmount =
    data2?.reduce((total, cost) => total + cost?.amount, 0) || 0;

  const percentage = ((Number(scholarShipInfo?.length) / 306) * 100).toFixed(2);

  // Calculate the quiz amount
  const totalQuizAmount = quizMoney?.reduce(
    (total, deposit) => Number(total) + Number(deposit?.amount),
    0 || 0
  );

  useEffect(() => {
    fetchDepositInfo();
    getProjectInfo();
    getAllUserList();
    getScholarShipInfo();
    getSingleDeposit();
    getSingleCost();
    fetchCostInfo();
    getQuizMoneyInfo();
  }, []);
  const [stepsCount, setStepsCount] = useState(12);
  const [stepsGap, setStepsGap] = useState(12);
  const [stepsData, setStepsData] = useState([
    { title: "Jan", status: "finish" },

    { title: "Feb", status: "wait" },
    { title: "Mar", status: "wait" },
    { title: "Apr", status: "wait" },
    { title: "May", status: "wait" },
    { title: "June", status: "wait" },
    { title: "July", status: "wait" },
    { title: "Aug", status: "wait" },
    { title: "Sep", status: "wait" },
    { title: "Oct", status: "wait" },
    { title: "Nov", status: "wait" },
    { title: "Dec", status: "wait" },
  ]);
  const [direction, setDirection] = useState("vertical");

  const getMonthCount = (dateString) => {
    const date = new Date(dateString);
    return date.getMonth() + 1; // getMonth() returns 0 for January, so we add 1
  };

  const finishedMonths = data?.map((item) => getMonthCount(item?.depositDate));
  const updatedStepsData = stepsData?.map((step, index) => ({
    ...step,
    status: finishedMonths?.includes(index + 1) ? "finish" : "wait",
    amount: finishedMonths?.amount,
  }));

  return (
    <div className="lg:mr-8 xl:mr-8">
      <Title
        level={2}
        className="mb-4 lg:mb-6 text-[#8ABF55] text-center lg:text-left">
        Dashboard Overview
      </Title>

      {/* Statistics */}
      {/* <Row gutter={16} className="mb-6 ">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={1200}
              prefix={<ShoppingCartOutlined style={{ color: "#8ABF55" }} />}
              valueStyle={{ color: "#8ABF55" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="My Deposit"
              value={depositAmount}
              prefix={<DollarCircleOutlined style={{ color: "#8ABF55" }} />}
              valueStyle={{ color: "#8ABF55" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Deposit"
              value={totalDepositAmount}
              prefix={<DollarCircleOutlined style={{ color: "#8ABF55" }} />}
              valueStyle={{ color: "#8ABF55" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={users?.length}
              prefix={<UsergroupAddOutlined style={{ color: "#8ABF55" }} />}
              valueStyle={{ color: "#8ABF55" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Approved Withdrawal Request"
              value={costData?.length}
              prefix={<UsergroupAddOutlined style={{ color: "#8ABF55" }} />}
              valueStyle={{ color: "#8ABF55" }}
            />
          </Card>
        </Col>
      </Row> */}
      {loading ? (
        <Spin tip="Loading...">
          <Alert
            message="Alert message title"
            description="Further details about the context of this alert."
            type="info"
          />
        </Spin>
      ) : (
        <div className="">
          <div className="grid grid-cols-6 lg:grid-cols-12 xl:grid-cols-12 gap-2 my-2 mx-[15px] lg:mx-0 xl:mx-0">
            {updatedStepsData?.map((data, idx) => (
              <div
                className={` px-2  rounded-md ${
                  data?.status === "finish"
                    ? "bg-green-400 text-white"
                    : "text-green-400 border border-green-400"
                }`}
                key={idx}>
                <p className="text-center text-[12px] lg:text-[15px] xl:text-[15px] ">
                  {data?.title}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 mx-4 lg:mx-0 xl:mx-0">
            <div className="col-span-12 lg:col-span-12 xl:col-span-12 ">
              <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6 p-2 ">
                <div class="bg-green-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                  <div class="flex justify-between mb-6">
                    <div>
                      <div class="flex items-center mb-1">
                        <div class="text-3xl font-semibold">
                          {scholarShipInfo?.length}
                        </div>
                      </div>
                      <div class="text-[14px] font-medium text-green-800">
                        Total Applications Of Scholarship-2025
                      </div>
                    </div>
                  </div>

                  <p class="text-[#f84525] font-medium text-lg hover:text-red-800">
                    {percentage}% of prev (306)
                  </p>
                </div>
                <div class="bg-green-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                  <div class="flex justify-between mb-6">
                    <div>
                      <div class="flex items-center mb-1">
                        <div class="text-3xl font-semibold">
                          {users?.length}
                        </div>
                      </div>
                      <div class="text-[14px] font-medium text-green-800">
                        Users
                      </div>
                    </div>
                  </div>

                  <a
                    href="/gebruikers"
                    class="text-[#f84525] font-medium text-sm hover:text-red-800">
                    View
                  </a>
                </div>
                {/* dmf banking start */}
                <div class="bg-blue-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                  <div class="flex justify-between mb-4">
                    <div>
                      <div class="flex items-center mb-1">
                        <div class="text-3xl font-semibold">
                          ৳{totalQuizAmount}
                        </div>
                        <div class="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[14px] font-semibold leading-none ml-2"></div>
                      </div>
                      <div class="text-[14px] font-medium text-blue-800">
                        Quiz Balance
                      </div>
                    </div>
                    <div class="dropdown">
                      <button
                        type="button"
                        class="dropdown-toggle text-gray-400 hover:text-gray-600">
                        <i class="ri-more-fill"></i>
                      </button>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/scholarship"
                    class="text-[#f84525] font-medium text-sm hover:text-red-800">
                    View
                  </Link>
                </div>
                {/* dmf banking end */}
                <div class="bg-purple-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                  <div class="flex justify-between mb-6">
                    <div>
                      <div class="text-3xl font-semibold mb-1">
                        ৳{depositAmount}
                      </div>
                      <div class="text-[14px] font-medium text-purple-800">
                        My Deposit
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/depositInfo"
                    class="text-[#f84525] font-medium text-sm hover:text-red-800">
                    View
                  </Link>
                </div>
                <div class="bg-yellow-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                  <div class="flex justify-between mb-6">
                    <div>
                      <div class="text-3xl font-semibold mb-1">
                        ৳{totalDepositAmount}
                      </div>
                      <div class="text-[14px] font-medium text-yellow-800">
                        Total Deposit
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/depositInfo"
                    class="text-[#f84525] font-medium text-sm hover:text-red-800">
                    View
                  </Link>
                </div>
              </div>

              {/* ----------------- 2nd div ---------------------*/}

              <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6 p-2 ">
                <div class="bg-green-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                  <div class="flex justify-between mb-6">
                    <div>
                      <div class="flex items-center mb-1">
                        <div class="text-3xl font-semibold">
                          {costData?.length}
                        </div>
                      </div>
                      <div class="text-[14px] font-medium text-green-800">
                        Approved Withdrawal Request
                      </div>
                    </div>
                  </div>

                  <a
                    href="/gebruikers"
                    class="text-[#f84525] font-medium text-sm hover:text-red-800">
                    View
                  </a>
                </div>

                <div class="bg-purple-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                  <div class="flex justify-between mb-6">
                    <div>
                      <div class="text-3xl font-semibold mb-1">
                        ৳{costAmount}
                      </div>
                      <div class="text-[14px] font-medium text-purple-800">
                        My Withdrawal
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/withdraw"
                    class="text-[#f84525] font-medium text-sm hover:text-red-800">
                    View
                  </Link>
                </div>
                <div class="bg-blue-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                  <div class="flex justify-between mb-4">
                    <div>
                      <div class="flex items-center mb-1">
                        <div class="text-3xl font-semibold">
                          ৳{totalCostAmount}
                        </div>
                        <div class="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[14px] font-semibold leading-none ml-2"></div>
                      </div>
                      <div class="text-[14px] font-medium text-blue-800">
                        Withdrawal Amount
                      </div>
                    </div>
                    <div class="dropdown">
                      <button
                        type="button"
                        class="dropdown-toggle text-gray-400 hover:text-gray-600">
                        <i class="ri-more-fill"></i>
                      </button>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/withdraw"
                    class="text-[#f84525] font-medium text-sm hover:text-red-800">
                    View
                  </Link>
                </div>
                <div class="bg-yellow-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
                  <div class="flex justify-between mb-6">
                    <div>
                      <div class="text-3xl font-semibold mb-1">
                        ৳{Number(totalDepositAmount) - Number(totalCostAmount)}
                      </div>
                      <div class="text-[14px] font-medium text-yellow-800">
                        Current Balance
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/depositInfo"
                    class="text-[#f84525] font-medium text-sm hover:text-red-800">
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-8 lg:mx-0 xl:mx-0">
            {/* ----------------1st div------------- */}

            <h2 className="py-2 text-[17px] font-semibold text-center">
              Running DMF Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 lg:gap-8 xl:gap-8">
              {/* {projectInfo?.map((project, index) => (
                <div key={index}>
                  <ProjectCard
                    rowData={project}
                    depositData={depositData}
                    costData={costData}
                  />
                </div>
              ))} */}
              {projectInfo?.map((project, index) => (
                <div key={index}>
                  <ProjectCard
                    rowData={project}
                    depositData={depositData}
                    costData={costData}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
