import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Avatar, Button, Card, Modal, Tooltip, Skeleton, Progress } from "antd";
import Meta from "antd/es/card/Meta";
import { EyeOutlined, DollarCircleOutlined } from "@ant-design/icons";
import Details from "../DepositInfo/Details";

export default function ProjectCard({ rowData, depositData, costData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Filter and calculate amounts
  const projectDeposits = depositData?.filter(
    (deposit) => deposit?.project === rowData?.projectName
  );
  const totalAmount = projectDeposits?.reduce(
    (total, deposit) => total + deposit?.amount,
    0
  );

  const projectCost = costData?.filter(
    (cost) => cost?.project === rowData?.projectName
  );
  const totalCost = projectCost?.reduce(
    (total, cost) => total + cost?.amount,
    0
  );

  const balance = Number(totalAmount) - Number(totalCost) || 0;
  const formattedBalance = balance.toFixed(2);
  const formattedTotalAmount = totalAmount?.toFixed(2);
  const formattedTotalCost = totalCost?.toFixed(2);
  const balanceColor = balance >= 0 ? "green" : "red";

  const handleCancel = () => setIsModalOpen(false);

  return (
    <div className="w-full max-w-lg">
      <Card
        className="w-full h-[500px] border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
        cover={
          loading ? (
            <Skeleton.Image active className="h-[200px] w-full object-cover" />
          ) : (
            <img
              alt="Project"
              className="h-[200px] w-full object-cover"
              src={
                rowData?.image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyjidfyUc5wxz5Wcy_gFcDHLiiALXblri48A&s"
              }
            />
          )
        }>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <>
            <Meta
              avatar={<Avatar src={rowData?.projectLeaderImage} />}
              title={
                <Tooltip title={rowData?.projectName}>
                  <span className="text-lg font-semibold text-gray-800">
                    {rowData?.projectName}
                  </span>
                </Tooltip>
              }
            />
            <p className="py-3 text-base text-gray-700 text-justify leading-relaxed">
              {`${rowData?.details?.slice(0, 160)}...`}
            </p>

            <div className="flex justify-between items-center text-base text-gray-700 font-medium mb-2">
              <span>সমন্বয়কারীগণ:</span>
              <span className={`text-${balanceColor}-500 font-semibold`}>
                বর্তমান হিসাব: {formattedBalance} tk
              </span>
            </div>

            <div className="mb-2">
              <Avatar.Group
                max={{
                  count: 3,
                  style: {
                    color: "#3f8600",
                    backgroundColor: "#e6fffb",
                    cursor: "pointer",
                  },
                  popover: { trigger: "click" },
                }}>
                {rowData?.projectCoordinatorImages?.map((img, index) => (
                  <Avatar src={img} key={index} />
                ))}
              </Avatar.Group>
            </div>

            <Progress
              percent={
                totalAmount + totalCost > 0
                  ? Math.min(
                      (totalAmount / (totalAmount + totalCost)) * 100,
                      100
                    )
                  : 0
              }
              size="small"
              status="active"
              strokeColor={{ from: "#6ee7b7", to: "#059669" }}
              className="my-2"
              format={(percent) => `${percent.toFixed(2)}%`}
            />

            <div className="flex justify-between mt-4">
              <Button
                icon={<EyeOutlined />}
                onClick={() => setIsModalOpen(true)}
                className="border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700"
                type="default">
                Details
              </Button>
              <Link to="/dashboard/depositInfo">
                <Button
                  icon={<DollarCircleOutlined />}
                  className="bg-green-500 text-white hover:bg-green-600 border-none"
                  type="primary">
                  Donate
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>

      <Modal
        title="Project Details"
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={null}>
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
