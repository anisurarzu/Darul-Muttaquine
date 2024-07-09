import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Flex, Progress, Result, Upload } from "antd";
import { coreAxios } from "../../../utilities/axios";
import { useFormik } from "formik";
import Scholarship from "../../scholarship/Scholarship";

const AddResult = () => {
  const formik = useFormik({
    initialValues: {
      scholarshipRollNumber: "",
      totalCorrectAns: 0,
      totalWrongAns: 0,
      totalGivenAns: 0,
      totalMarks: 0,
    }, // Ensure you have proper initial values
    onSubmit: async (values) => {
      console.log("values", values); // Check if values are received correctly
      try {
        const res = await coreAxios.post(`/add-result`, {
          scholarshipRollNumber: values?.scholarshipRollNumber,
          resultDetails: values,
        });
        if (res?.status === 200) {
          toast.success("Successfully Saved!");
          formik.resetForm();
        }
      } catch (err) {
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
    {
      id: "totalCorrectAns",
      name: "totalCorrectAns",
      type: "number",
      label: "Total Correct Answer",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "totalWrongAns",
      name: "totalWrongAns",
      type: "number",
      label: "Total Wrong Answer",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "totalGivenAns",
      name: "totalGivenAns",
      type: "number",
      label: "Total Given Answer",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "totalMarks",
      name: "totalMarks",
      type: "number",
      label: "Total Marks",
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResult;
