import React, { useState } from "react";
import { formatDate } from "../../../utilities/dateFormate";
import { Image, Modal } from "antd";
import ProfileDetails from "./ProfileDetails";
import { coreAxios } from "../../../utilities/axios";

export default function ProfileCard({ rowData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleDepositData, setSingleDepositData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getSingleDeposit = async (rowData) => {
    try {
      setLoading(true);

      const response = await coreAxios.get(`deposit-info/${rowData?._id}`);
      if (response?.status === 200) {
        setSingleDepositData(response?.data);
        setLoading(false);
        setIsModalOpen(true);
      }
    } catch (error) {
      setIsModalOpen(true);
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
    setIsModalOpen(true);
  };

  return (
    <div>
      <div class="flex flex-col">
        <div class="bg-white border border-white shadow-lg  rounded-3xl p-4 m-4">
          <div class="flex gap-4 lg:gap-1 xl:gap-1">
            <div class=" relative h-32 w-32   sm:mb-0 mb-3 ">
              <Image
                width={80}
                height={80}
                className="rounded-xl"
                src={
                  rowData?.image ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_JmAXuH2Myq0ah2g_5ioG6Ku7aR02-mcvimzwFXuD25p2bjx7zhaL34oJ7H9khuFx50&usqp=CAU"
                }
              />
            </div>
            <div class="flex-auto sm:ml-5 justify-evenly">
              <div class="flex items-center justify-between sm:mt-2">
                <div class="flex items-center">
                  <div class="flex flex-col">
                    <div class="w-full flex-none text-lg text-gray-800 font-bold leading-none h-[20px]">
                      {rowData?.firstName} {rowData?.lastName} (
                      {rowData?.uniqueId})
                    </div>
                    <div class="flex-auto text-gray-500 my-1">
                      <span class="mr-3 ">{rowData?.userRole}</span>
                      <span class="mr-3 border-r border-gray-200  max-h-0"></span>
                      <span>{rowData?.profession}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <p>Phone : 0{rowData?.phone}</p>
                <p className="bg-red-400 p-1 w-[25px] h-[25px] rounded-full text-white text-center text-[13px] ">
                  {rowData?.bloodGroup || " N/A"}
                </p>
              </div>
              <div class="flex pt-2  text-sm text-gray-500">
                <div class="flex-1 inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clip-rule="evenodd"></path>
                  </svg>
                  <p class="">Join : {formatDate(rowData?.createdAt)}</p>
                </div>
                <button
                  class="flex-no-shrink bg-green-400 hover:bg-green-500 px-5 ml-4 py-2 text-[10px] shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-300 hover:border-green-500 text-white rounded-lg transition ease-in duration-300"
                  onClick={() => {
                    getSingleDeposit(rowData);
                  }}>
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Profile Information"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
        <ProfileDetails
          handleCancel={handleCancel}
          singleDepositData={singleDepositData}
          rowData={rowData}
        />
      </Modal>
    </div>
  );
}
