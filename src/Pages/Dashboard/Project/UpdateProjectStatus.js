import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Flex, Progress, Result, Select, Upload } from "antd";

import { useFormik } from "formik";

import { Option } from "antd/es/mentions";
import { coreAxios } from "../../../utilities/axios";

const UpdateProjectStatus = ({ handleCancel, rowData }) => {
  console.log("values", rowData);
  const formik = useFormik({
    initialValues: {
      approvalStatus: "",
    }, // Ensure you have proper initial values
    onSubmit: async (values) => {
      // Check if values are received correctly
      try {
        const res = await coreAxios.post(`update-project-status`, {
          approvalStatus: values?.approvalStatus,
          projectID: rowData?._id,
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

  const statusList = ["Approve", "Reject", "Pending", "Hold"];

  return (
    <div className="">
      <div className="bg-white p-4 shadow rounded">
        Current Status:{rowData?.approvalStatus}
        <div className="flex justify-center pt-2">
          <div>
            <p className="text-[14px] font-semibold text-center pb-4 text-orange-600">
              Update Project Status
            </p>
          </div>
        </div>
        <form
          className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
          onSubmit={formik.handleSubmit}>
          <div className="w-full  mb-4">
            <label
              htmlFor="approvalStatus"
              className="block text-black dark:text-white">
              Select Status <span className="text-meta-1">*</span>
            </label>
            <Select
              id="approvalStatus"
              name="approvalStatus"
              onChange={(value) =>
                formik.setFieldValue("approvalStatus", value)
              }
              value={formik.values.approvalStatus}
              className="w-full rounded  border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
              {statusList?.map((method) => (
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

export default UpdateProjectStatus;
