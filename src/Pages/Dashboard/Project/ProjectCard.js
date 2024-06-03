import React, { useState } from "react";
import { formatDate } from "../../../utilities/dateFormate";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Modal } from "antd";
import Details from "../DepositInfo/Details";

export default function ProjectCard({ rowData, depositData }) {
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
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="flex items-center justify-between sm:mt-2">
              <div>
                <div>
                  <div className="w-full flex-none text-lg text-gray-800 font-bold leading-none">
                    {rowData?.projectName}
                  </div>
                  <div className="text-gray-500 my-1">
                    <span className="mr-3">Project Manager</span>
                    <span className="mr-3 border-r border-gray-200 max-h-0"></span>
                    <span>{rowData?.projectLeader}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-none sm:flex pt-2 ">
            <div className="flex-auto sm:ml-5 justify-evenly">
              <div className="flex flex-row items-center text-justify">
                <p>{rowData?.details?.slice(0,400)}..... <span className='text-blue-800 cursor-ponter' onClick={()=>{setIsModalOpen(true)}}>See More</span></p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <p>End Date : {formatDate(rowData?.endDate)}</p>
                <div className="">
                 {userInfo?.uniqueId && <h3 className="text-[12px] text-green-900 font-semibold">
                    Balance : ৳{totalAmount}
                  </h3>}

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
              <div className="flex pt-2 text-sm text-red-500">
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
                  <p className="text-[12px] font-bold text-red-900">
                    Budget : ৳{rowData?.projectFund}
                  </p>
                </div>
                
              </div>
              <div className="flex pt-2 justify-between text-[12px]">
              <div className="flex-no-shrink bg-yellow-400 hover:bg-yellow-500 px-5  py-2 text-xs shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-yellow-300 hover:border-yellow-500 text-white rounded-full transition ease-in duration-300 cursor-pointer" onClick={()=>{
                setIsModalOpen(true)

              }} >
                    Details
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
        <Details handleCancel={handleCancel} rowData={rowData} depositData={depositData} />
      </Modal>
    </div>
  );
}
