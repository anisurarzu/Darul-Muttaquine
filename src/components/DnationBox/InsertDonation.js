import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import { Upload, Select, DatePicker, Alert, Button } from "antd"; // Import Select from Ant Design
import { coreAxios } from "../../utilities/axios";
import useUserInfo from "../../hooks/useUserInfo";

const { Option } = Select; // Destructure Option from Select

const InsertDonation = ({ handleCancel, values }) => {
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);

  const fetchProjectDashboardInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("project-info");
      if (response?.status === 200) {
        // Filter the projects with approval status "Approve"
        const approvedProjects = response.data.filter(
          (project) => project.approvalStatus === "Approve"
        );

        // Create an array containing only the project names
        const projectNames = approvedProjects?.map(
          (project) => project.projectName
        );

        // Sort the project names by the createdAt field in descending order
        const sortedProjectNames = projectNames.sort((a, b) => {
          const projectA = approvedProjects.find(
            (project) => project.projectName === a
          );
          const projectB = approvedProjects.find(
            (project) => project.projectName === b
          );
          return new Date(projectB?.createdAt) - new Date(projectA?.createdAt);
        });

        // Set the sorted project names
        setProjectList(sortedProjectNames);
      }
    } catch (error) {
      console.error("Error fetching project info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDashboardInfo();
  }, []);

  const userInfo = useUserInfo();
  console?.log("userInfo", userInfo);

  const formik = useFormik({
    initialValues: {
      amount: values?.amount,
      paymentMethod: "", // Initialize paymentMethod
      userName: "",
      phone: values?.phone,
      tnxID: "",
      status: "Pending",
      depositDate: "",
      project: values?.project || "",
    },
    onSubmit: async (values) => {
      if (values?.project) {
        try {
          setLoading(true);
          const allData = {
            ...values,
            userName: userInfo?.username || "anonymous",
            userID: userInfo?._id || "anonymous",
          };

          const res = await coreAxios.post(`/deposit-info`, allData);
          if (res?.status === 201) {
            handleCancel();
            setLoading(false);
            toast.success("Your Donation Complete!");
            formik.resetForm();
          }
        } catch (err) {
          setLoading(false);
          toast.error(err?.response?.data?.message);
        }
      } else {
        toast.error(" অনুগ্রহ করে একটি প্রজেক্ট সিলেক্ট করুন");
      }
    },
    enableReinitialize: true,
  });

  const paymentMethods = ["bkash", "rocket", "nagad", "bankAccount", "cash"]; // Define payment methods

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <p className="p-2 text-[14px] text-center m-2">
          আপনি যদি আপনার অনুদান ট্র্যাক করতে চান তাহলে অনুগ্রহ করে আমাদের সাইটে
          একটি অ্যাকাউন্ট তৈরি করুন তারপর দান করুন, অ্যাকাউন্ট তৈরির জন্য{" "}
          <a
            href="https://ourdmf.xyz/registration"
            className="text-blue-500 underline">
            এটিতে ক্লিক করুন
          </a>
        </p>

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

        <div className="w-full  mb-4 px-2">
          <label htmlFor="project" className="block text-black dark:text-black">
            Project <span className="text-meta-1">*</span>
          </label>
          <Select
            id="project"
            name="project"
            onChange={(value) => formik.setFieldValue("project", value)}
            value={formik.values.project}
            className="w-full rounded  border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
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

              <div className="w-full  mb-4">
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
                  className="w-full rounded  border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
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
                  Transaction NO.
                  <span className="text-meta-1">*</span>
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

              {/* Submit Button */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 ">
                <div></div>
                <button
                  type="submit"
                  className="justify-center rounded bg-primary p-3 font-medium text-gray  border border-green-600 m-4 rounded hover:bg-green-600 hover:text-white hover:shadow-md">
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

              <div className="w-full  mb-4">
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
                  className="w-full rounded  border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
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
                  Transaction NO.
                  <span className="text-meta-1">*</span>
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

              {/* Submit Button */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 ">
                <div></div>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading} // Add loading prop here
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

export default InsertDonation;
