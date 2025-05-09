import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import { Upload, Select, DatePicker, Alert, Button } from "antd";
import { coreAxios } from "../../../utilities/axios";
import useUserInfo from "../../../hooks/useUserInfo";

const { Option } = Select;

const InsertDeposit = ({ onHide, fetchRolls, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchProjectDashboardInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("project-info");
      if (response?.status === 200) {
        const approvedProjects = response.data.filter(
          (project) => project.approvalStatus === "Approve"
        );
        const projectNames = approvedProjects?.map(
          (project) => project.projectName
        );
        const sortedProjectNames = projectNames.sort((a, b) => {
          const projectA = approvedProjects.find(
            (project) => project.projectName === a
          );
          const projectB = approvedProjects.find(
            (project) => project.projectName === b
          );
          return new Date(projectB?.createdAt) - new Date(projectA?.createdAt);
        });
        setProjectList(sortedProjectNames);
      }
    } catch (error) {
      console.error("Error fetching project info:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("users");
      if (response?.status === 200) {
        setUsersList(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDashboardInfo();
    fetchUsers();
  }, []);

  const userInfo = useUserInfo();

  const formik = useFormik({
    initialValues: {
      amount: 0,
      paymentMethod: "",
      userName: "",
      phone: 0,
      tnxID: "",
      status: "Pending",
      depositDate: "",
      project: "",
    },
    onSubmit: async (values) => {
      try {
        const allData = {
          ...values,
          userName: selectedUser
            ? selectedUser.username
            : userInfo?.username || "",
          userID: selectedUser ? selectedUser._id : userInfo?._id || "",
        };
        setLoading(true);
        const res = await coreAxios.post(`/deposit-info`, allData);
        if (res?.status === 201) {
          handleCancel();
          setLoading(false);
          toast.success("Successfully Saved!");
          formik.resetForm();
          setSelectedUser(null);
        }
      } catch (err) {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      }
    },
    enableReinitialize: true,
  });

  const paymentMethods = ["bkash", "rocket", "nagad", "bankAccount", "cash"];

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="p-2 text-[14px] text-center m-2">
          সাময়িক সময়ের জন্য আমরা ম্যানুয়ালি টাকা গ্রহণ করছি , শুরুতে আপনি আমাদের
          রকেট, বিকাশ ,নগদ নম্বরে টাকা পাঠিয়ে নিচের ঘরগুলো যথাযথ ভাবে পূরণ করুন,
          আমরা আপনাকে অতিশিঘ্রই কনফার্ম করবো। অবশ্যই ট্রানজেকশন আইডি ঘরে যথাযথ
          ট্রানজেকশন আইডি বসাবেন।
        </p>

        <Alert
          message={`রকেট/বিকাশ/নগদ নম্বর জানতে অনুগ্রহ করে প্রজেক্টে ক্লিক করুন`}
          type="success"
          className="text-center font-bold bangla-text text-[#2F5812] m-2"
        />

        {/* User Dropdown */}
        <div className="w-full mb-4 px-2">
          <label htmlFor="user" className="block text-black dark:text-black">
            Select User <span className="text-meta-1">*</span>
          </label>
          <Select
            id="user"
            name="user"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              const children = option.children || "";
              return children
                .toString()
                .toLowerCase()
                .includes(input.toLowerCase());
            }}
            onChange={(value) => {
              const user = usersList.find((u) => u._id === value);
              setSelectedUser(user);
            }}
            value={selectedUser?._id}
            className="w-full rounded border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
            <Option value="">Select User</Option>
            {usersList?.map((user) => (
              <Option key={user._id} value={user._id}>
                {user.username} ({user.uniqueId})
              </Option>
            ))}
          </Select>
        </div>

        <div className="w-full mb-4 px-2">
          <label htmlFor="project" className="block text-black dark:text-black">
            Project <span className="text-meta-1">*</span>
          </label>
          <Select
            id="project"
            name="project"
            onChange={(value) => formik.setFieldValue("project", value)}
            value={formik.values.project}
            className="w-full rounded border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
            {projectList?.map((method) => (
              <Option key={method} value={method}>
                {method}
              </Option>
            ))}
          </Select>
        </div>

        {formik?.values?.project === "ইসলামিক কুইজ" ||
        formik?.values?.project === "Scholarship 2024" ? (
          <div className="px-2">
            <div>
              {formik?.values?.project && (
                <Alert
                  message={`এই প্রকল্পের জন্য আমাদের রকেট/বিকাশ/নগদ নম্বর : 01838243941
                `}
                  type="info"
                  className="text-center font-bold bangla-text text-blue-700 m-2"
                />
              )}
            </div>
            <form
              className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
              onSubmit={formik.handleSubmit}>
              <div className="w-full mb-4">
                <label className="block text-black dark:text-black">
                  Amount <span className="text-meta-1">*</span>
                </label>
                <input
                  id={"amount"}
                  name={"amount"}
                  type={"number"}
                  required={true}
                  width="full"
                  onChange={formik.handleChange}
                  value={formik.values?.amount}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div className="w-full mb-4">
                <label
                  htmlFor="paymentMethod"
                  className="block text-black dark:text-black">
                  Payment Method <span className="text-meta-1">*</span>
                </label>
                <Select
                  id="paymentMethod"
                  name="paymentMethod"
                  onChange={(value) =>
                    formik.setFieldValue("paymentMethod", value)
                  }
                  value={formik.values.paymentMethod}
                  className="w-full rounded border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  {paymentMethods?.map((method) => (
                    <Option key={method} value={method}>
                      {method}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="w-full mb-4">
                <label className="block text-black dark:text-black">
                  Phone NO. / ACC NO. <span className="text-meta-1">*</span>
                </label>
                <input
                  id={"phone"}
                  name={"phone"}
                  type={"numbers"}
                  required={true}
                  width="full"
                  onChange={formik.handleChange}
                  value={formik.values?.phone}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="w-full mb-4">
                <label className="block text-black dark:text-black">
                  Transaction NO. <span className="text-meta-1">*</span>
                </label>
                <input
                  id={"tnxID"}
                  name={"tnxID"}
                  type={"text"}
                  required={true}
                  width="full"
                  onChange={formik.handleChange}
                  value={formik.values?.tnxID}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="w-full mb-4">
                <label className="block text-black dark:text-black">
                  Advance/Due Deposit Date <span className="text-meta-1"></span>
                </label>
                <DatePicker
                  value={formik.values.dateOfBirth}
                  onChange={(date) => formik.setFieldValue("depositDate", date)}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 ">
                <div></div>
                <button
                  type="submit"
                  className="justify-center rounded bg-primary p-3 font-medium text-gray border border-green-600 m-4 rounded hover:bg-green-600 hover:text-white hover:shadow-md">
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {formik?.values?.project && (
              <Alert
                message={`এই প্রকল্পের জন্য আমাদের রকেট/বিকাশ/নগদ নম্বর : 01791556184
                `}
                type="warning"
                className="text-center font-bold bangla-text text-yellow-700 m-2"
              />
            )}
            <form
              className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
              onSubmit={formik.handleSubmit}>
              <div className="w-full mb-4">
                <label className="block text-black dark:text-black">
                  Amount <span className="text-meta-1">*</span>
                </label>
                <input
                  id={"amount"}
                  name={"amount"}
                  type={"number"}
                  required={true}
                  width="full"
                  onChange={formik.handleChange}
                  value={formik.values?.amount}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <div className="w-full mb-4">
                <label
                  htmlFor="paymentMethod"
                  className="block text-black dark:text-black">
                  Payment Method <span className="text-meta-1">*</span>
                </label>
                <Select
                  id="paymentMethod"
                  name="paymentMethod"
                  onChange={(value) =>
                    formik.setFieldValue("paymentMethod", value)
                  }
                  required={true}
                  value={formik.values.paymentMethod}
                  className="w-full rounded border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                  {paymentMethods?.map((method) => (
                    <Option key={method} value={method}>
                      {method}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="w-full mb-4">
                <label className="block text-black dark:text-black">
                  Phone NO. / ACC NO. <span className="text-meta-1">*</span>
                </label>
                <input
                  id={"phone"}
                  name={"phone"}
                  type={"numbers"}
                  required={true}
                  width="full"
                  onChange={formik.handleChange}
                  value={formik.values?.phone}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="w-full mb-4">
                <label className="block text-black dark:text-black">
                  Transaction NO. <span className="text-meta-1">*</span>
                </label>
                <input
                  id={"tnxID"}
                  name={"tnxID"}
                  type={"text"}
                  required={true}
                  width="full"
                  onChange={formik.handleChange}
                  value={formik.values?.tnxID}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="w-full mb-4">
                <label className="block text-black dark:text-black">
                  Advance/Due Deposit Date <span className="text-meta-1"></span>
                </label>
                <DatePicker
                  value={formik.values.dateOfBirth}
                  onChange={(date) => formik.setFieldValue("depositDate", date)}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 ">
                <div></div>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full bg-green-600">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsertDeposit;
