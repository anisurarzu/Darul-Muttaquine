import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import { Upload, Select } from "antd"; // Import Select from Ant Design
import { coreAxios } from "../../../utilities/axios";
import useUserInfo from "../../../hooks/useUserInfo";
import Withdraw from "./Withdraw";
import Loader from "../../../components/Loader/Loader";

const { Option } = Select; // Destructure Option from Select

const InsertWithdraw = ({ onHide, fetchRolls, handleCancel }) => {
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

  const formik = useFormik({
    initialValues: {
      amount: 0,
      userName: "",
      userID: "",
      dmfID: "",

      invoice: "",
      paymentMethod: "",
      project: "",
      description: "",
      status: "Pending",
      reason: "",
      phone: 0,
    },
    onSubmit: async (values) => {
      try {
        const allData = {
          ...values,
          userName: userInfo?.username || "",
          userID: userInfo?._id || "",
          dmfID: userInfo?.uniqueId || "",
          phone: userInfo?.phone || 0,
        };
        setLoading(true);
        const res = await coreAxios.post(`/cost-info`, allData);
        if (res?.status === 201) {
          setLoading(false);
          toast.success("Successfully Saved!");
          formik.resetForm();
          handleCancel();
        }
      } catch (err) {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      }
    },
    enableReinitialize: true,
  });

  const paymentMethods = [
    "bkash",
    "rocket",
    "nagad",
    "bankAccount",
    "cash",
    "recharge",
  ]; // Define payment methods

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {loading ? (
          <Loader />
        ) : (
          <form
            className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
            onSubmit={formik.handleSubmit}>
            <div className="w-full mb-4">
              <label className="block text-black dark:text-black">
                Withdrawal/Cost Amount <span className="text-meta-1">*</span>
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
              <label className="block text-black dark:text-black">
                Withdrawal/Cost Reason <span className="text-meta-1">*</span>
              </label>
              <input
                id={"reason"}
                name={"reason"}
                type={"text"}
                required={true}
                width="full"
                onChange={formik.handleChange}
                value={formik.values?.reason}
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
                className="w-full h-16 rounded  border-stroke bg-transparent py-0  px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                {paymentMethods?.map((method) => (
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
                className="justify-center rounded bg-primary p-3 font-medium text-gray  border border-green-600 m-4 rounded hover:bg-green-600 hover:text-white hover:shadow-md">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InsertWithdraw;
