import React, { useState } from "react";
import { formatDate } from "../../../utilities/dateFormate";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Modal } from "antd";

export default function Details({ rowData, depositData, costData }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  console.log("depositData", depositData);

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

  return (
    <div>
      <div className="flex flex-col">
        <div className="bg-white border border-white  rounded-3xl lg:p-4 xl:p-4 lg:m-4 xl:p-4">
          <div className="px-0 object-cover sm:mb-0 mb-3 grid grid-cols-2 gap-2">
            <img
              src={rowData?.image}
              alt="project"
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="flex items-center justify-between sm:mt-2 lg:pl-2 xl:pl-2">
              <div>
                <div>
                  <div className="w-full flex-none text-lg text-gray-800 font-bold leading-none lg:text-[17px] xl:text-[17px] ">
                    {rowData?.projectName}
                  </div>
                  <div className="text-gray-500 my-1 ">
                    <span className="mr-3 ">Project Manager</span>
                    <span className="mr-3 border-r border-gray-200 max-h-0"></span>
                    <span>{rowData?.projectLeader}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-none sm:flex pt-2">
            <div className="flex-auto  justify-evenly">
              <div className="flex flex-row items-center text-justify">
                <p className="text-[10px] lg:text-[14px] xl:text-[14px] pt-2">
                  {rowData?.details}
                </p>
              </div>
              <div>
                <p className="underline">CoorDinators:</p>
                {Array.isArray(rowData.projectCoordinators)
                  ? rowData.projectCoordinators.join(", ")
                  : ""}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <p className=" text-red-900 ">
                  End Date : {formatDate(rowData?.endDate)}
                </p>
                {userInfo?.uniqueId && (
                  <div className="">
                    <h3 className="text-[14px] text-green-900 font-semibold">
                      Total Deposit : ৳{totalAmount}
                    </h3>
                    <h3 className="text-[14px] text-green-900 font-semibold">
                      Total Withdraw : ৳{totalCost}
                    </h3>
                    <h3 className="text-[14px] text-green-900 font-semibold">
                      Balance : ৳{Number(totalAmount) - Number(totalCost)}
                    </h3>
                  </div>
                )}
              </div>
              {userInfo?.uniqueId && (
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <h3 className="py-1 font-semibold text-[14px] underline">
                      History Of Deposit :
                    </h3>
                    <ul className="list-disc  mt-2">
                      {projectDeposits?.map((deposit) => (
                        <li key={deposit._id}>
                          {deposit?.username || deposit?.userName} - ৳
                          {deposit?.amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="py-1 font-semibold text-[14px] underline">
                      History Of Withdraw :
                    </h3>
                    <ul className="list-disc  mt-2">
                      {projectCost?.map((cost) => (
                        <li key={cost._id}>
                          {cost?.username || cost?.userName} - ৳{cost?.amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div className="flex pt-8 text-sm text-red-500">
                <div className="flex-1 inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clipRule="evenodd"></path>
                  </svg>
                  <p className="text-[14px] font-bold text-red-900">
                    Budget : ৳{rowData?.projectFund}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
