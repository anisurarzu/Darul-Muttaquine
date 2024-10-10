import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Alert, Button, Flex, Input, Progress, Result, Upload } from "antd";
import { coreAxios } from "../../../utilities/axios";
import { useFormik } from "formik";
import Scholarship from "../../scholarship/Scholarship";
import MainLoader from "../../../components/Loader/MainLoader";

// Function to convert numbers to Bengali numerals
const convertToBengali = (number) => {
  const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(number).replace(/\d/g, (digit) => bengaliNumerals[digit]);
};

const ResultPage = () => {
  const [resultData, setResultData] = useState({});
  const [loading, setLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const formik = useFormik({
    initialValues: {
      scholarshipRollNumber: "",
    },
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        setLoading(true);
        const res = await coreAxios.get(
          `search-result/${values?.scholarshipRollNumber}`
        );
        if (res?.status === 200) {
          setLoading(false);
          toast.success("Successfully Get!");
          formik.resetForm();
          setResultData(res?.data);
        }
      } catch (err) {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      }
    },
    enableReinitialize: true,
  });

  const inputData = [
    {
      id: "scholarshipRollNumber",
      name: "scholarshipRollNumber",
      type: "text",
      label: "Scholarship Roll Number",
      errors: "",
      register: "",
      required: true,
    },
  ];

  // Scholarship condition and message
  const getScholarshipMessage = () => {
    const marks = resultData?.resultDetails?.[0]?.totalMarks;
    const classLevel = resultData?.instituteClass;
    const convertedMarks = convertToBengali(marks);

    if (classLevel >= 5 && classLevel <= 6) {
      return marks >= 65
        ? `আলহামদুলিল্লাহ! অভিনন্দন! তুমি স্কলারশিপ অর্জন করতে সক্ষম হয়েছ ${convertedMarks} নম্বর পেয়ে! তোমার পরিশ্রমের এই স্বীকৃতি সত্যিই প্রশংসনীয়।`
        : `দুঃখিত! স্কলারশিপের জন্য তোমার কমপক্ষে ৬৫ নম্বর প্রয়োজন। তুমি ${convertedMarks}% নম্বর পেয়েছ। পরবর্তীতে আরও ভালো করার আশা করছি।`;
    } else if (classLevel >= 7 && classLevel <= 8) {
      return marks >= 70
        ? `আলহামদুলিল্লাহ! অভিনন্দন! তুমি স্কলারশিপ অর্জন করতে সক্ষম হয়েছ ${convertedMarks} নম্বর পেয়ে! তুমি সত্যিই দুর্দান্ত করেছে।`
        : `দুঃখিত! স্কলারশিপের জন্য তোমার ৭০ নম্বর প্রয়োজন ছিল। তুমি ${convertedMarks} নম্বর পেয়েছ। আশা করি ভবিষ্যতে আরও ভালো করবে।`;
    } else if (classLevel >= 9 && classLevel <= 10) {
      return marks >= 80
        ? `আলহামদুলিল্লাহ! অভিনন্দন! তুমি ${convertedMarks} নম্বর পেয়ে স্কলারশিপ অর্জন করেছ। তোমার এই সাফল্য ভবিষ্যতের জন্য অনুপ্রেরণা।`
        : `দুঃখিত! স্কলারশিপের জন্য তোমার ৮০ নম্বর প্রয়োজন ছিল, কিন্তু তুমি ${convertedMarks} নম্বর পেয়েছ। চেষ্টা চালিয়ে যাও, আরও ভালো কিছু অপেক্ষা করছে।`;
    } else {
      return "দয়া করে সঠিক শ্রেণী এবং নম্বর সহ ফলাফল যাচাই করুন।";
    }
  };

  return (
    <div className="">
      <div style={{ background: "#BDDE98" }}>
        <h2
          className="text-white font-semibold text-2xl md:text-[33px] py-4 lg:py-12 xl:py-12 text-center bangla-text"
          style={{ color: "#2F5811" }}>
          ফলাফল
        </h2>
      </div>
      <div className="p-4 shadow rounded mx-4 lg:mx-24 xl:mx-24 mt-8">
        <div className="flex justify-center pt-2">
          <div>
            <h2 className="text-[18px] font-bold py-2 text-green-600">
              দারুল মুত্তাক্বীন শিহ্মাবৃত্তি ২০২৪
            </h2>
            <p className="text-[14px] font-semibold text-center pb-4 text-orange-600">
              এখান থেকে আপনার ফলাফল দেখুন!
            </p>
          </div>
        </div>
        {loading && <MainLoader />}
        {userInfo?.uniqueId === "DMF-4890" && (
          <div>
            <form
              className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
              onSubmit={formik.handleSubmit}>
              {inputData?.map(
                ({
                  id,
                  name,
                  type,
                  label,
                  labelFor,
                  errors,
                  register,
                  required,
                  optionLabel = "",
                  selectedAutoValue,
                  setSelectedAutoValue,
                  autoCompleteMethod,
                  autoFilteredValue,
                }) => (
                  <div className="w-full mb-4" key={id}>
                    <label className="block text-black dark:text-black text-[12px] py-1">
                      {label} <span className="text-meta-1">*</span>
                    </label>
                    <input
                      id={id}
                      name={name}
                      type={type}
                      required={required}
                      width="full"
                      onChange={formik.handleChange}
                      value={formik.values?.[id]}
                      className="w-full lg:w-[400px] xl:w-[400px] h-[45px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                )
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 ">
                <div></div>
                <button
                  type="submit"
                  className=" justify-center rounded bg-primary p-4 font-medium text-gray  border border-green-600 m-8 rounded hover:bg-green-600 hover:text-white hover:shadow-md">
                  Search
                </button>
              </div>
            </form>
          </div>
        )}

        <Alert
          message={`Result Not Publish Yet,, Expected Result Date: 11-10-2024 `}
          description=""
          type="info"
          showIcon
          className="mb-2"
        />
      </div>

      <div className="bg-white p-4 shadow rounded mt-4 mx-4 lg:mx-24 xl:mx-24">
        <div className="text-justify bangla-text">
          <Result status="success" title={getScholarshipMessage()} />
        </div>
        <div className="flex justify-center">
          <h1 className="text-center text-[17px]">
            Welcome to DMF Scholarship Result Dashboard
          </h1>
        </div>

        <div className=" text-[14px]  px-8 pt-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-2">
          {/* 1st div */}
          <div className="grid grid-cols-2  w-full">
            <div className="border border-green-500 p-4 ">
              <div className="border-b border-green-400 p-1 ">Name:</div>
              <div className="border-b border-green-400 p-1 bg-green-50">
                Institute Name
              </div>
              <div className="border-b border-green-400 p-1">Class</div>
              <div className="border-b border-green-400 p-1 bg-green-50">
                Scholarship Roll
              </div>
              <div className="border-b border-green-400 p-1">
                Institute Roll
              </div>
            </div>
            <div className="border-t border-b border-r border-green-500 p-4">
              <div className="border-b border-green-400 p-1">
                {resultData?.name}
              </div>
              <div className="border-b border-green-400 p-1 bg-green-50">
                {resultData?.institute}
              </div>
              <div className="border-b border-green-400 p-1">
                {resultData?.instituteClass}
              </div>
              <div className="border-b border-green-400 p-1 bg-green-50">
                {resultData?.resultDetails?.[0]?.scholarshipRollNumber}
              </div>
              <div className="border-b border-green-400 p-1">
                {resultData?.instituteRollNumber}
              </div>
            </div>
          </div>

          {/* 2nd div */}
          <div className="grid grid-cols-2  w-full pt-2">
            <div className="border border-orange-500 p-4 ">
              <div className="border-b border-orange-400 p-1 bg-orange-50 bangla-text">
                সঠিক উত্তর
              </div>
              <div className="border-b border-orange-400 p-1 bangla-text">
                ভুল উত্তর
              </div>
              <div className="border-b border-orange-400 p-1 bg-orange-50 bangla-text">
                প্রাপ্ত নম্বর
              </div>
            </div>
            <div className="border-t border-b border-r border-orange-500 p-4">
              <div className="border-b border-orange-400 p-1 bg-orange-50">
                {convertToBengali(
                  resultData?.resultDetails?.[0]?.totalCorrectAns
                )}
              </div>
              <div className="border-b border-orange-400 p-1">
                {convertToBengali(
                  resultData?.resultDetails?.[0]?.totalWrongAns
                )}
              </div>
              <div className="border-b border-orange-400 p-1 bg-orange-50">
                {convertToBengali(resultData?.resultDetails?.[0]?.totalMarks)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
