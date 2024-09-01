import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Flex, Progress, Result, Select, Upload } from "antd";
import { coreAxios } from "../../../utilities/axios";
import { useFormik } from "formik";
import Scholarship from "../../scholarship/Scholarship";
import { Option } from "antd/es/mentions";
import ProfileCard from "../Profile/ProfileCard";
import Loader from "../../../components/Loader/Loader";

const UpdateWithdraw = ({ handleCancel, rowData }) => {
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);

  console.log("values", rowData);

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
  const formik = useFormik({
    initialValues: {
      userRole: "",
    }, // Ensure you have proper initial values
    onSubmit: async (values) => {
      console.log("first", values);
      if (values?.project === "ইসলামিক কুইজ" && values?.status === "Approved") {
        updateQuizMoneyStatus(rowData, values);
      } else {
        try {
          const res = await coreAxios.post(`update-cost-status`, {
            status: values?.status || rowData?.status || "",
            project: values?.project || rowData?.project || "",
            id: rowData?._id,
          });
          if (res?.status === 200) {
            toast.success("Successfully Updated!");
            formik.resetForm();
            handleCancel();
          }
        } catch (err) {
          toast.error(err?.response?.data?.message);
        }
      }
    },
    enableReinitialize: true,
  });

  const depositStatus = ["Pending", "Rejected", "Approved", "Hold"];

  const updateQuizMoneyStatus = async (rowData, values) => {
    try {
      console.log("Updating status for userID:", rowData?.dmfID); // Debug log

      const response = await coreAxios.put(
        `/quiz-money/${rowData?.dmfID}/status`,
        {
          status: "Paid",
          amount: rowData?.amount, // Include amount in the request payload
        }
      );

      if (response?.status === 200) {
        updateQuizDepoStatus(values);

        // Check the response message to handle success
        if (
          response.data.message === "Insufficient balance for requested amount"
        ) {
          toast.error("Insufficient balance for the requested amount.");
        } else {
          toast.success("Quiz Payment Successful!");
        }
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (err) {
      // Handle errors
      toast.error(err?.response?.data?.message || "An error occurred");
    }
  };

  const updateQuizDepoStatus = async (values) => {
    try {
      const res = await coreAxios.post(`update-cost-status`, {
        status: values?.status || rowData?.status || "",
        project: values?.project || rowData?.project || "",
        id: rowData?._id,
      });
      if (res?.status === 200) {
        toast.success("Successfully Updated!");
        formik.resetForm();
        handleCancel();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className="">
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white p-4 shadow rounded">
          <div className="flex justify-center pt-2">
            <div>
              <p className="text-[14px] font-semibold text-center pb-4 text-orange-600">
                Current Withdrawal Request Status ({rowData?.status})
              </p>
            </div>
          </div>
          <form
            className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
            onSubmit={formik.handleSubmit}>
            <div className="w-full  mb-4">
              <label
                htmlFor="project"
                className="block text-black dark:text-black">
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
            <div className="w-full  mb-4">
              <label
                htmlFor="userRole"
                className="block text-black dark:text-black">
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
      )}
    </div>
  );
};

export default UpdateWithdraw;
