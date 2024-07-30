import React from "react";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const ViewAllResult = ({ leaderBoard }) => {
  // Sort results first by totalMarks (descending), then by answerTime (ascending)
  const sortedResults = [...leaderBoard].sort((a, b) => {
    if (b.totalMarks === a.totalMarks) {
      // If totalMarks are the same, sort by answerTime
      return a.answerTime - b.answerTime;
    }
    return b.totalMarks - a.totalMarks;
  });

  console.log("sortedResults", sortedResults);

  return (
    <div className="container mx-auto p-4">
      <h3 className="bangla-text py-4 text-center text-xl font-bold">
        মোট অংশগ্রহণকারীঃ ( {sortedResults?.length} ) জন
      </h3>
      {sortedResults?.map((result, index) => (
        <div
          key={index}
          className={`grid grid-cols-12 gap-2 my-3 shadow-md border ${
            index > 4 ? "border-yellow-400" : "border-green-500"
          } rounded-md p-4 items-center`}>
          <div className="col-span-1 flex justify-center">
            {result?.totalMarks > 3 ? (
              <CaretUpOutlined className="text-green-400 text-[20px]" />
            ) : result?.totalMarks > 2 ? (
              <CaretDownOutlined className="text-yellow-400 text-[20px]" />
            ) : (
              <CaretDownOutlined className="text-red-400 text-[20px]" />
            )}
          </div>
          <h3 className="col-span-1 text-center font-semibold">{index + 1}</h3>
          <img
            className="col-span-2 w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-green-100"
            src={result?.image}
            alt=""
          />
          <div className="col-span-6 lg:col-span-7 text-left">
            <h3 className="uppercase text-[12px] lg:text-[15px] font-semibold">
              {result?.name}
            </h3>
            <p className="text-[10px] lg:text-[12px] text-gray-600">
              সময়: {result?.answerTime} সেকেন্ড
            </p>
          </div>
          <Tooltip title={`Total Marks: ${result?.totalMarks}`}>
            <h3
              className={`col-span-1 text-center font-semibold rounded-full w-12 lg:w-16 xl:w-16 shadow-lg text-white ${
                result?.totalMarks > 3
                  ? "bg-green-400"
                  : result?.totalMarks > 2
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}>
              {result?.totalMarks}
            </h3>
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

export default ViewAllResult;
