import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, DatePicker, Select, Upload } from "antd";
import { useFormik } from "formik";
import { Option } from "antd/es/mentions";
import { coreAxios } from "../../../utilities/axios";
import dayjs from "dayjs";

const UpdateProjectStatus = ({ handleCancel, rowData }) => {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    try {
      const res = await coreAxios.get(`usersDropdown`);
      if (res?.status === 200) {
        setUsersList(res?.data);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const formik = useFormik({
    initialValues: {
      projectName: rowData?.projectName || "",
      startDate: rowData?.startDate ? dayjs(rowData?.startDate) : null,
      endDate: rowData?.endDate ? dayjs(rowData?.endDate) : null,
      projectLeader: rowData?.projectLeader || "",
      projectCoordinators: rowData?.projectCoordinators || [],
      projectFund: rowData?.projectFund || "",
      image: "",
      details: rowData?.details || "",
      approvalStatus: rowData?.approvalStatus || "",
      yesVote: 0,
      noVote: 0,
    },
    onSubmit: async (values) => {
      try {
        const res = await coreAxios.post(`update-project-status`, {
          approvalStatus: values?.approvalStatus,
          projectID: rowData?._id,
        });
        if (res?.status === 200) {
          updateProjectInfo(values);
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

  const updateProjectInfo = async (values) => {
    try {
      const response = await coreAxios?.put(
        `/update-project-info/${rowData?._id}`,
        {
          projectName: values?.projectName || rowData?.projectName || "",
          startDate: values?.startDate || rowData?.startDate || "",
          endDate: values?.endDate || rowData?.endDate || "",
          projectLeader: values?.projectLeader || rowData?.projectLeader || "",
          projectCoordinators:
            values?.projectCoordinators || rowData?.projectCoordinators || "",
          projectFund: values?.projectFund || rowData?.projectFund || "",
          details: values?.details || rowData?.details || "",
          approvalStatus:
            values?.approvalStatus || rowData?.approvalStatus || "",
          yesVote: 0,
          noVote: 0,
          image: rowData?.image || "",
        }
      );
      if (response?.status === 200) {
        toast.success("Successfully Updated Project Information");
      }
    } catch (err) {
      toast.error("Failed to update project information");
    }
  };

  const inputData = [
    {
      id: "projectName",
      name: "projectName",
      type: "text",
      label: "Project Name",
      required: true,
    },

    {
      id: "projectFund",
      name: "projectFund",
      type: "number",
      label: "Project Budget",
      required: true,
    },
  ];

  return (
    <div className="">
      <div className="bg-white p-4 shadow rounded">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-2">
          {inputData?.map(({ id, name, type, label, required }) => (
            <div key={id} className="w-full mb-4">
              <label className="block text-black dark:text-black">
                {label} {required && <span className="text-meta-1">*</span>}
              </label>
              <input
                id={id}
                name={name}
                type={type}
                required={required}
                onChange={formik.handleChange}
                value={formik.values[id]}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          ))}
          <div className="w-full  mb-4">
            <label
              htmlFor="projectLeader"
              className="block text-black dark:text-black">
              Project Manager <span className="text-meta-1">*</span>
            </label>
            <Select
              id="projectLeader"
              name="projectLeader"
              onChange={(value) => formik.setFieldValue("projectLeader", value)}
              value={formik.values.projectLeader}
              className="w-full rounded border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              options={usersList?.map((user) => ({
                value: user?.username,
                label: user?.username,
              }))}
            />
          </div>
          <div className="w-full mb-4">
            <label className="block text-black dark:text-black">
              Project Coordinators <span className="text-meta-1">*</span>
            </label>
            <Select
              mode="multiple"
              allowClear
              placeholder="Select Coordinators"
              onChange={(value) =>
                formik.setFieldValue("projectCoordinators", value)
              }
              value={formik.values.projectCoordinators}
              className="w-full rounded border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
              {usersList?.map((user) => (
                <Option key={user._id} value={user.username}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-2">
          <div className="w-full mb-4">
            <label className="block text-black dark:text-black">
              Start Date <span className="text-meta-1">*</span>
            </label>
            <DatePicker
              value={formik.values.startDate}
              onChange={(date) => formik.setFieldValue("startDate", date)}
              className="w-full"
            />
          </div>
          <div className="w-full mb-4">
            <label className="block text-black dark:text-black">
              End Date <span className="text-meta-1">*</span>
            </label>
            <DatePicker
              value={formik.values.endDate}
              onChange={(date) => formik.setFieldValue("endDate", date)}
              className="w-full"
            />
          </div>

          <textarea
            id="details"
            name="details"
            onChange={formik.handleChange}
            value={formik.values.details}
            rows="6"
            cols="10"
            className="border border-gray-200 p-2 col-span-2"></textarea>
        </div>
      </div>
      <div className="bg-white p-4 shadow rounded">
        Current Status: {rowData?.approvalStatus}
        <div className="flex justify-center pt-2">
          <div>
            <p className="text-[14px] font-semibold text-center pb-4 text-orange-600">
              Update Project Status
            </p>
          </div>
        </div>
        <form
          className="p-6.5 pt-1 px-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
          onSubmit={formik.handleSubmit}>
          <div className="w-full mb-4">
            <label
              htmlFor="approvalStatus"
              className="block text-black dark:text-black">
              Select Status <span className="text-meta-1">*</span>
            </label>
            <Select
              id="approvalStatus"
              name="approvalStatus"
              onChange={(value) =>
                formik.setFieldValue("approvalStatus", value)
              }
              value={formik.values.approvalStatus}
              className="w-full rounded border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
              {statusList?.map((method) => (
                <Option key={method} value={method}>
                  {method}
                </Option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1">
            <div></div>
            <button
              type="submit"
              className="justify-center rounded bg-primary p-4 font-medium text-gray border border-green-600 m-8 hover:bg-green-600 hover:text-white hover:shadow-md">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProjectStatus;
