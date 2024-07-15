import React from "react";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

const ViewAllResult = ({ leaderBoard }) => {
  const sortedResults = [...leaderBoard].sort(
    (a, b) => b.totalMarks - a.totalMarks
  );
  console.log("sortedResults", sortedResults);
  return (
    <div>
      <h3 className="bangla-text py-4 text-center">
        মোট অংশগ্রহণকারীঃ ( {sortedResults?.length} ) জন
      </h3>
      {sortedResults?.map((result, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-2 my-3 shadow-md border border-green-400 rounded-md p-2 ">
          <div className="col-span-1">
            {result?.totalMarks > 3 ? (
              <CaretUpOutlined className="text-green-400 text-[20px] pt-2 lg:pt-3 xl:pt-3" />
            ) : result?.totalMarks > 2 ? (
              <CaretDownOutlined className="text-yellow-400 text-[20px] pt-2 lg:pt-3 xl:pt-3" />
            ) : (
              <CaretDownOutlined className="text-red-400 text-[20px] pt-2 lg:pt-3 xl:pt-3" />
            )}
          </div>
          <h3 className="col-span-1 pt-2 lg:pt-3 xl:pt-3 uppercase font-semibold">
            {index + 1}
          </h3>
          <img
            className="col-span-2 lg:col-span-1 xl:col-span-1 w-12 h-12 lg:w-16 xl:h-16 rounded-full border border-green-100 "
            src={result?.image}
            alt=""
          />

          <h3 className="col-span-7 lg:col-span-8 xl:col-span-8 pt-3 uppercase text-[12px] lg:text-[15px] xl:text-[15px] ">
            {result?.name}
          </h3>
          <h3
            className={`col-span-1 pt-2 lg:pt-3 xl:pt-3 uppercase ${
              result?.totalMarks > 3
                ? "bg-green-400"
                : result?.totalMarks > 2
                ? "bg-yellow-400"
                : "bg-red-400"
            } bg-green-400 text-white rounded-full text-center w-12 lg:w-16 xl:w-16 shadow-lg font-semibold lg:text-[15px] xl:text-[15px]`}>
            {result?.totalMarks}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default ViewAllResult;
