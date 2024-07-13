import { Alert, Image, Spin, Steps } from "antd";
import React, { useState } from "react";
import { formatDate } from "../../../utilities/dateFormate";

export default function ProfileDetails({
  singleDepositData,
  rowData,
  loading,
}) {
  console.log("singleDepositData", singleDepositData);
  console.log("rowData", rowData);
  const [direction, setDirection] = useState("vertical");

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

  const data = singleDepositData?.deposits?.filter(
    (deposit) => deposit.status === "Approved"
  );

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
  console.log("updatedStepsData", updatedStepsData);
  return (
    <div>
      <div class="flex flex-col">
        <div class="bg-white border border-white   rounded-3xl p-4 m-4">
          <div class="flex gap-4">
            <div class="">
              <Image
                width={120}
                height={120}
                className="rounded-xl"
                src={
                  rowData?.image ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_JmAXuH2Myq0ah2g_5ioG6Ku7aR02-mcvimzwFXuD25p2bjx7zhaL34oJ7H9khuFx50&usqp=CAU"
                }
              />
            </div>
            <div>
              <h3 className="text-[15px] lg:text-[20px] xl:text-[20px] bangla-text ">
                {rowData?.firstName} {rowData?.lastName}
              </h3>
              <div class="flex-auto text-gray-500 my-1">
                <span class="mr-3 ">{rowData?.userRole}</span>
                <span class="mr-3 border-r border-gray-200  max-h-0"></span>
                <span>{rowData?.profession}</span>
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
              </div>
            </div>
          </div>
          <p className="py-4 text-center bangla-text">
            Payment Status (monthly wise)
          </p>

          <div className="grid grid-cols-6  gap-2 lg:gap-4 xl:gap-4 my-2 ">
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
        </div>
      </div>
    </div>
  );
}
