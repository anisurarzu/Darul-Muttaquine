import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Flex, Progress, Result, Select, Upload } from "antd";
import { coreAxios } from "../../../utilities/axios";
import { useFormik } from "formik";
import Scholarship from "../../scholarship/Scholarship";
import { Option } from "antd/es/mentions";
import ProfileCard from "../Profile/ProfileCard";

const UpdateDepositStatus = ({ handleCancel, rowData }) => {
  console.log("values", rowData);
  const formik = useFormik({
    initialValues: {
      userRole: "",
    }, // Ensure you have proper initial values
    onSubmit: async (values) => {
      // Check if values are received correctly
      try {
        const res = await coreAxios.post(`update-deposit-status`, {
          status: values?.status,
          id: rowData?._id,
        });
        if (res?.status === 200) {
          toast.success("Successfully Updated!");
          formik.resetForm();
          handleCancel();
        }
      } catch (err) {
        toast.error(err.response.data?.message);
      }
    },
    enableReinitialize: true,
  });

  const depositStatus = ["Pending", "Rejected", "Approved", "Hold"];

  return (
    <div className="">
      <div className="bg-white p-4 shadow rounded">
        <div className="flex justify-center pt-2">
          <div>
            <p className="text-[14px] font-semibold text-center pb-4 text-orange-600">
              Current Deposit Status ({rowData?.status})
            </p>
          </div>
        </div>
        <form
          className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
          onSubmit={formik.handleSubmit}>
          <div className="w-full  mb-4">
            <label
              htmlFor="userRole"
              className="block text-black dark:text-white">
              Select Status <span className="text-meta-1">*</span>
            </label>
            <Select
              id="status"
              name="status"
              onChange={(value) => formik.setFieldValue("status", value)}
              value={formik.values.status}
              className="w-full rounded  border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
              {depositStatus?.map((method) => (
                <Option key={method} value={method}>
                  {method}
                </Option>
              ))}
            </Select>
          </div>

          {/* Submit Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 ">
            <div></div>
            <button
              type="submit"
              className=" justify-center rounded bg-primary p-4 font-medium text-gray  border border-green-600 m-8 rounded hover:bg-green-600 hover:text-white hover:shadow-md">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDepositStatus;