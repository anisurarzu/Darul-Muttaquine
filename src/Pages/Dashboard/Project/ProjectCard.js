import React, { useState } from "react";
import { formatDate } from "../../../utilities/dateFormate";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Avatar, Modal, Tooltip } from "antd";
import Details from "../DepositInfo/Details";

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
      <div className="flex flex-col">
        <div className="bg-white border border-white shadow-lg rounded-3xl p-4 m-4">
          <div className="px-4 object-cover sm:mb-0 mb-3 grid grid-cols-2 gap-2">
            <img
              src={rowData?.image}
              alt="project"
              className="w-full h-[90px] object-cover rounded-2xl"
            />
            <div className="flex items-center justify-between sm:mt-2">
              <div>
                <div>
                  <div className="w-full flex-none text-[13px] text-gray-800 font-bold leading-none">
                    {rowData?.projectName}
                  </div>
                  <div className="text-gray-500 my-1 flex gap-2">
                    <span className="text-center pt-4 text-[10px]">
                      Project Manager
                    </span>
                    <span className=" border-r border-gray-200 max-h-0"></span>
                    <span>
                      <img
                        src={`${rowData?.projectLeaderImage}`}
                        alt={"product.name"}
                        className="w-[42px] h-[42px] rounded-full border border-green-300"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-none sm:flex pt-3 h-[210px]">
            <div className="flex-auto sm:ml-5 justify-evenly">
              <div className="flex flex-row items-center text-justify">
                <p className="h-[100px]">
                  {rowData?.details?.slice(0, 300)}.....{" "}
                  <span
                    className="text-blue-800 cursor-ponter"
                    onClick={() => {
                      setIsModalOpen(true);
                    }}>
                    See More
                  </span>
                </p>
              </div>
              <div>
                <p className="underline pb-2">CoorDinators:</p>

                {/* {Array.isArray(rowData.projectCoordinators)
                  ? rowData.projectCoordinators.join(", ")
                  : ""} */}

                {/* <img
                      src={`${img}`}
                      alt={"product.name"}
                      className="w-[30px] h-[30px] rounded-full"
                    /> */}

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
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <p>End Date : {formatDate(rowData?.endDate)}</p>
                <div className="">
                  {userInfo?.uniqueId && (
                    <div>
                      <h3 className="text-[12px] text-green-900 font-semibold">
                        Balance : ৳
                        {Number(totalAmount) - Number(totalCost) || 0}
                      </h3>
                    </div>
                  )}

                  {/*  <ul className="list-disc ml-5 mt-2">
                    {projectDeposits?.map((deposit) => (
                      <li key={deposit._id}>
                        {deposit?.username || deposit?.userName} -{" "}
                        {deposit?.amount}
                      </li>
                    ))}
                  </ul> */}
                </div>
              </div>

              <div className="flex pt-2 justify-between text-[12px]">
                <div
                  className="flex-no-shrink bg-yellow-400 hover:bg-yellow-500 px-5  py-2 text-xs shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-yellow-300 hover:border-yellow-500 text-white rounded-full transition ease-in duration-300 cursor-pointer"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}>
                  Details
                </div>
                <div className="flex  text-sm text-red-500">
                  <div className="flex-1 inline-flex items-center">
                    <p className="text-[12px] font-bold text-red-900">
                      Budget : ৳{rowData?.projectFund}
                    </p>
                  </div>
                </div>

                <Link to="/dashboard/depositInfo">
                  <button className="flex-no-shrink bg-green-400 hover:bg-green-500 px-5 ml-4 py-2 text-xs shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-300 hover:border-green-500 text-white rounded-full transition ease-in duration-300">
                    Donate
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

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
