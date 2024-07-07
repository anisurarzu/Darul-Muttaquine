import React, { useState } from "react";
import { formatDate } from "../../../utilities/dateFormate";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Avatar, Button, Card, Modal, Tooltip } from "antd";
import Details from "../DepositInfo/Details";
import Meta from "antd/es/card/Meta";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export default function ProjectCard({ rowData, depositData, costData }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Filter deposits based on the current project
  const projectDeposits = depositData?.filter(
    (deposit) => deposit?.project === rowData?.projectName
  );

  // Calculate the total amount of deposits for the current project
  const totalAmount = projectDeposits?.reduce(
    (total, deposit) => total + deposit?.amount,
    0
  );

  /* ------cost calculation-------- */
  // Filter deposits based on the current project
  const projectCost = costData?.filter(
    (deposit) => deposit?.project === rowData?.projectName
  );

  // Calculate the total amount of deposits for the current project
  const totalCost = projectCost?.reduce(
    (total, cost) => total + cost?.amount,
    0
  );

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Card
        /* style={{
          width: 260,
        }} */
        className="w-full h-[430px]    mr-12 lg:ml-0 xl:ml-0 my-2 lg:my-2 xl:my-2"
        cover={
          <img
            alt="example"
            className="h-[200px]"
            src={`${
              rowData?.image
                ? rowData?.image
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyjidfyUc5wxz5Wcy_gFcDHLiiALXblri48A&s"
            }`}
          />
        }>
        <Meta
          avatar={<Avatar src={rowData?.projectLeaderImage} />}
          title={rowData?.projectName}
          // description={`${rowData?.details?.slice(0, 80)}.....`}
        />
        <p className="py-3 text-[10px] text-justify">{`${rowData?.details?.slice(
          0,
          150
        )}.....`}</p>
        <div className="flex justify-between">
          <p className="pb-2 text-[10px] font-semibold text-justify text-gray-700">
            সমন্বয়কারীগণ :
          </p>
          <p className="pb-2 text-[10px] font-semibold text-justify text-gray-700">
            বর্তমান হিসাব : {Number(totalAmount) - Number(totalCost) || 0} tk
          </p>
        </div>
        <div className=" flex  gap-2 justify-content-center ">
          <Avatar.Group
            size=""
            max={{
              count: 2,
              style: {
                color: "#f56a00",
                backgroundColor: "#fde3cf",
                cursor: "pointer",
              },
              popover: { trigger: "click" },
            }}>
            {rowData?.projectCoordinatorImages?.map((img, index) => (
              <Avatar src={img} />
            ))}
          </Avatar.Group>
        </div>

        <div className="flex mt-[15px] justify-between">
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="border-yellow-400 text-yellow-500"
            type="default">
            Details
          </Button>
          <Link to="/dashboard/depositInfo">
            <Button className="border-green-500 text-green-500" type="default">
              Donate
            </Button>
          </Link>
        </div>
      </Card>

     

      <Modal
        title="Please Provided Valid Information"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
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
