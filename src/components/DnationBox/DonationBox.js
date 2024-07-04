import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import { Upload, Select } from "antd"; // Import Select from Ant Design

import useUserInfo from "../../hooks/useUserInfo";
import { coreAxios } from "../../utilities/axios";

const { Option } = Select; // Destructure Option from Select

const DonationBox = ({ onHide, fetchRolls, handleCancel }) => {
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
      amount: 0,
      paymentMethod: "", // Initialize paymentMethod
      userName: "",
      phone: 0,
      tnxID: "",
      status: "Pending",
    },
    onSubmit: async (values) => {
      toast.warn(
        "উক্ত প্রক্রিয়াটি নির্মানাধীন অবস্থায় রয়েছে। অনুগ্রহ পূর্বক আপনার অনুদানের জন্য আমাদেরমে ফোন অথবা মেইল করুন। ধন্যবাদ!"
      );
    },
    enableReinitialize: true,
  });

  const paymentMethods = ["bkash", "rocket", "nagad", "bankAccount", "cash"]; // Define payment methods

  return (
    <div className=" py-2 lg:py-8 xl:py-8 " style={{ background: "#F5F5F5" }}>
      <div
        className="rounded-lg border my-4 mx-2 lg:mx-28 xl:mx-28 p-8"
        style={{ background: "#FFFFFF" }}>
        <form
          className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-1 lg:gap-8 xl:gap-8 text-[12px] lg:text-[18px] xl:text-[18px]"
          onSubmit={formik.handleSubmit}>
          <div className="w-full  mb-4">
            <label
              htmlFor="project"
              className="block text-black dark:text-black py-1">
              অনুদানের প্রকল্প <span className="text-meta-1">*</span>
            </label>
            <Select
              id="project"
              name="project"
              onChange={(value) => formik.setFieldValue("project", value)}
              value={formik.values.project}
              className="w-full rounded  border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary lg:h-[43px] xl:h-[43px]">
              {projectList?.map((method) => (
                <Option key={method} value={method}>
                  {method}
                </Option>
              ))}
            </Select>
          </div>

          <div className="w-full mb-4">
            <label className="block text-black dark:text-black py-1">
              ফোন/ইমেইল <span className="text-meta-1">*</span>
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
            <label className="block text-black dark:text-black py-1">
              অনুদানের পরিমান <span className="text-meta-1 ">*</span>
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

          {/* Submit Button */}

          <button
            type="submit"
            className="justify-center rounded bg-primary  font-medium text-gray  border border-green-600 lg:ml-8 xl:ml-8 mt-12 p-3 lg:mb-4 lg:mr-8 xl:mb-4 xl:mr-8 rounded hover:bg-green-600 hover:text-white hover:shadow-md">
            দান করুন
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationBox;
