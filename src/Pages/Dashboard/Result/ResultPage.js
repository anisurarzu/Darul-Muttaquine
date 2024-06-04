import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Flex, Progress, Result, Upload } from "antd";
import { coreAxios } from "../../../utilities/axios";
import { useFormik } from "formik";
import Scholarship from "../../scholarship/Scholarship";

const ResultPage = () => {
  const [resultData, setResultData] = useState({});
  const formik = useFormik({
    initialValues: {
      scholarshipRollNumber: "",
    }, // Ensure you have proper initial values
    onSubmit: async (values) => {
      console.log("values", values); // Check if values are received correctly
      try {
        const res = await coreAxios.get(
          `search-result/${values?.scholarshipRollNumber}`
        );
        if (res?.status === 200) {
          toast.success("Successfully Get!");
          formik.resetForm();
          setResultData(res?.data);
        }
      } catch (err) {
        toast.error(err.response.data?.message);
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

  return (
    <div className="">
      <div className="bg-white p-4 shadow rounded">
        <div className="flex justify-center pt-2">
          <div>
            <h2 className="text-[18px] font-bold py-2 text-green-600">
              Darul Muttaquine Scholarship
            </h2>
            <p className="text-[14px] font-semibold text-center pb-4 text-orange-600">
              Check Your Result From Here!
            </p>
          </div>
        </div>
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
              <div className="w-full mb-4">
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
                  className="w-[400px] h-[45px] rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            )
          )}

          {/* Submit Button */}
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

      <div className="bg-white p-4 shadow rounded mt-4">
        <div>
          <Result
            status="success"
            title={`${
              resultData?.resultDetails?.[0]?.totalMarks > 79
                ? "Alhamdulillah! Congratulations! You get an Scholarship with "
                : resultData?.resultDetails?.[0]?.totalMarks > 0
                ? "Sorry! Your performance was Really Good! You don't get any scholarship. But Hopefully you will come back strongly Ing Sha Allah."
                : "Please search Your result with valid Scholarship Roll Number"
            }${
              resultData?.resultDetails?.[0]?.totalMarks > 0 &&
              resultData?.resultDetails?.[0]?.totalMarks
            } % marks!`}
          />
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
                {resultData?.scholarshipRollNumber}
              </div>
              <div className="border-b border-green-400 p-1">
                {resultData?.instituteRollNumber}
              </div>
            </div>
          </div>
          {/* 2nd div */}
          <div>
            <Progress percent={resultData?.resultDetails?.[0]?.totalMarks} />
            <div className="grid grid-cols-2  w-full pt-2">
              <div className="border border-orange-500 p-4 ">
                <div className="border-b border-orange-400 p-1 ">
                  Total Answered:
                </div>
                <div className="border-b border-orange-400 p-1 bg-orange-50">
                  Correct Answer
                </div>
                <div className="border-b border-orange-400 p-1">
                  Wrong Answer
                </div>
                <div className="border-b border-orange-400 p-1 bg-orange-50">
                  Total Marks
                </div>
              </div>
              <div className="border-t border-b border-r border-orange-500 p-4">
                <div className="border-b border-orange-400 p-1">
                  {resultData?.resultDetails?.[0]?.totalGivenAns}
                </div>
                <div className="border-b border-orange-400 p-1 bg-orange-50">
                  {resultData?.resultDetails?.[0]?.totalCorrectAns}
                </div>
                <div className="border-b border-orange-400 p-1">
                  {resultData?.resultDetails?.[0]?.totalWrongAns}
                </div>
                <div className="border-b border-orange-400 p-1 bg-orange-50">
                  {resultData?.resultDetails?.[0]?.totalMarks}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
