import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Modal,
  Tooltip,
  Skeleton,
  Progress,
  Tag,
  Divider,
  Alert,
} from "antd";
import {
  EyeOutlined,
  DollarCircleOutlined,
  UserOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Details from "../DepositInfo/Details";
import { coreAxios } from "../../../utilities/axios";

export default function ProjectCard({ rowData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [depositData, setDepositData] = useState([]);

  const [costData, setCostData] = useState([]);

  const fetchDepositInfo = async () => {
    try {
      const response = await coreAxios.get("deposit-info");
      if (response?.status === 200) {
        const approvedDeposits = response?.data.filter(
          (deposit) => deposit?.status === "Approved"
        );
        setDepositData(approvedDeposits);
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const fetchCostInfo = async () => {
    try {
      const response = await coreAxios.get("cost-info");
      if (response?.status === 200) {
        const approvedDeposits = response?.data.filter(
          (deposit) => deposit.status === "Approved"
        );
        setCostData(approvedDeposits);
      }
    } catch (error) {
      console.error("Error fetching costs:", error);
    }
  };

  useEffect(() => {
    fetchDepositInfo();
    fetchCostInfo();
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  // Validate and calculate financial data
  const calculateFinancials = () => {
    try {
      if (!rowData || !rowData.projectName) {
        throw new Error("Project data is incomplete");
      }

      // Ensure depositData and costData are arrays
      const safeDepositData = Array.isArray(depositData) ? depositData : [];
      const safeCostData = Array.isArray(costData) ? costData : [];

      // Filter deposits and costs for this project (case insensitive)
      const projectDeposits = safeDepositData.filter(
        (deposit) =>
          deposit?.project?.toLowerCase() === rowData.projectName.toLowerCase()
      );

      const projectCosts = safeCostData.filter(
        (cost) =>
          cost?.project?.toLowerCase() === rowData.projectName.toLowerCase()
      );

      // Calculate totals with proper number conversion
      const totalAmount = projectDeposits.reduce(
        (total, deposit) => total + (Number(deposit?.amount) || 0),
        0
      );

      const totalCost = projectCosts.reduce(
        (total, cost) => total + (Number(cost?.amount) || 0),
        0
      );

      const balance = totalAmount - totalCost;

      // Calculate progress percentage (avoid division by zero)
      const progressPercent =
        totalAmount + totalCost > 0
          ? Math.min((totalAmount / (totalAmount + totalCost)) * 100, 100)
          : 0;

      return {
        totalAmount,
        totalCost,
        balance,
        progressPercent,
        hasData: projectDeposits.length > 0 || projectCosts.length > 0,
      };
    } catch (err) {
      setError(err.message);
      return {
        totalAmount: 0,
        totalCost: 0,
        balance: 0,
        progressPercent: 0,
        hasData: false,
      };
    }
  };

  const { totalAmount, totalCost, balance, progressPercent, hasData } =
    calculateFinancials();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Format currency consistently
  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (error) {
    return (
      <Card className="w-full max-w-md lg:max-w-lg border-0 rounded-xl">
        <Alert
          message="Error Loading Project"
          description={error}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
        />
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Card
        className="w-full h-full border-0 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        cover={
          loading ? (
            <Skeleton.Image
              active
              className="!h-48 !w-full"
              style={{ minHeight: "192px" }}
            />
          ) : (
            <div className="relative h-48 w-full overflow-hidden group">
              <img
                alt="Project"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={
                  rowData?.image ||
                  "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                }
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <Tag color="#059669" className="font-semibold text-sm">
                  <CheckCircleOutlined className="mr-1" />
                  Approved Project
                </Tag>
              </div>
            </div>
          )
        }
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="flex items-start mb-3">
              <Avatar
                size={48}
                src={rowData?.projectLeaderImage}
                icon={<UserOutlined />}
                className="border-2 border-white shadow-md"
                onError={() => true} // Prevent broken image icon
              />
              <div className="ml-3 flex-1">
                <Tooltip title={rowData?.projectName}>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                    {rowData?.projectName || "Unnamed Project"}
                  </h3>
                </Tooltip>
                <p className="text-sm text-gray-500 flex items-center">
                  <InfoCircleOutlined className="mr-1" />
                  {rowData?.location || "Location not specified"}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4 text-justify leading-relaxed line-clamp-3">
              {rowData?.details || "No description available"}
            </p>

            <Divider dashed className="my-3" />

            {/* Financial Info */}
            <div className="mb-4">
              {/* {!hasData && (
                <Alert
                  message="No financial data available"
                  type="info"
                  showIcon
                  className="mb-3"
                />
              )} */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Funds Collected:
                </span>
                <span className="font-semibold text-green-600">
                  ৳{formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Expenses:
                </span>
                <span className="font-semibold text-amber-600">
                  ৳{formatCurrency(totalCost)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Current Balance:
                </span>
                <span
                  className={`font-semibold ${
                    balance >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  ৳{formatCurrency(balance)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <Progress
                percent={progressPercent}
                strokeColor={{
                  "0%": "#6ee7b7",
                  "100%": "#059669",
                }}
                strokeWidth={6}
                format={(percent) => (
                  <span className="text-xs font-medium text-gray-600">
                    {percent.toFixed(1)}% Funded
                  </span>
                )}
              />
            </div>

            {/* Coordinators */}
            {rowData?.projectCoordinatorImages?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Coordinators:
                </p>
                <Avatar.Group
                  maxCount={3}
                  maxStyle={{
                    backgroundColor: "#059669",
                    color: "white",
                    cursor: "pointer",
                  }}
                  size="large"
                >
                  {rowData.projectCoordinatorImages.map((img, index) => (
                    <Tooltip key={index} title={`Coordinator ${index + 1}`}>
                      <Avatar
                        src={img}
                        onError={() => true} // Prevent broken image icon
                      />
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-auto flex space-x-3">
              <Button
                icon={<EyeOutlined />}
                onClick={showModal}
                className="flex-1 border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 h-10 flex items-center justify-center"
                type="default"
              >
                View Details
              </Button>
              <Link
                to="/dashboard/depositInfo"
                className="flex-1"
                state={{ project: rowData?.projectName }} // Pass project name to donation page
              >
                <Button
                  icon={<DollarCircleOutlined />}
                  className="w-full bg-green-600 hover:bg-green-700 border-none text-white h-10 flex items-center justify-center"
                  type="primary"
                >
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>

      {/* Modal for Detailed View */}
      <Modal
        title={
          <div className="flex items-center">
            <Avatar
              src={rowData?.projectLeaderImage}
              size="large"
              className="mr-3"
              onError={() => true} // Prevent broken image icon
            />
            <div>
              <h3 className="text-lg font-bold mb-0">
                {rowData?.projectName || "Project Details"}
              </h3>
              <p className="text-sm text-gray-500">
                {rowData?.location || "Location not specified"}
              </p>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        width={900}
        footer={null}
        centered
        destroyOnClose
      >
        <Details
          handleCancel={handleCancel}
          rowData={rowData}
          depositData={depositData}
          costData={costData}
        />
      </Modal>
    </div>
  );
}
