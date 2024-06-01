import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import { Alert, Button, DatePicker, Spin, Upload } from "antd";
import { coreAxios } from "../../../utilities/axios";
const AddProject = ({ handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [position, setPosition] = useState("start");

  const formik = useFormik({
    initialValues: {
      projectName: "",
      startDate: "",
      endDate: "",
      projectLeader: "",
      projectFund: "",
      image: "",
      details: "",
      approvalStatus: "Pending",
      yesVote: 0,
      noVote: 0,
    }, // Ensure you have proper initial values
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (!fileList.length) {
          toast.error("Please select a file");
          return;
        }

        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append("image", file.originFileObj);
        });
        /*  formData.append("name", historyName);
        formData.append("date", historyDate);
        formData.append("details", historyDetails); */

        const response = await axios.post(
          "https://api.imgbb.com/1/upload?key=5bdcb96655462459d117ee1361223929",
          formData
        );
        if (response?.status === 200) {
          console.log("response", response?.data?.data?.display_url);
          const allData = {
            ...values,
            image: response?.data?.data?.display_url,
          };
          console.log("allData", allData);

          const res = await coreAxios.post(`add-project-info`, allData);
          if (res?.status === 200) {
            setLoading(false);
            toast.success("Successfully Saved!");
            formik.resetForm();
            setFileList(null);
            handleCancel(); // Use formik.resetForm() directly
          }
        }
      } catch (err) {
        setLoading(false);
        toast.error(err.response.data?.message);
      }
    },
    enableReinitialize: true,
  });

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const imgWindow = window.open(src);
    imgWindow?.document.write(`<img src="${src}" alt="Preview" />`);
  };

  const inputData = [
    {
      id: "projectName",
      name: "projectName",
      type: "text",
      label: "Project Name ",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "projectLeader",
      name: "projectLeader",
      type: "text",
      label: "Project Manager",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "projectFund",
      name: "projectFund",
      type: "number",
      label: "Project Budget",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "details",
      name: "details",
      type: "text",
      label: "Details",
      errors: "",
      register: "",
      required: true,
    },
  ];

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form className="p-6.5 pt-1 px-1 " onSubmit={formik.handleSubmit}>
          <div>
            {loading ? (
              <Spin tip="Loading...">
                <Alert
                  message="Alert message title"
                  description="Further details about the context of this alert."
                  type="info"
                />
              </Spin>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
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
                      <label className="block text-black dark:text-white">
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
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  )
                )}
                <div className="w-full mb-4">
                  <label className="block text-black dark:text-white">
                    Start Date <span className="text-meta-1">*</span>
                  </label>
                  <DatePicker
                    value={formik.values.startDate}
                    onChange={(date) => formik.setFieldValue("startDate", date)}
                    className="w-full"
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="block text-black dark:text-white">
                    End Date <span className="text-meta-1">*</span>
                  </label>
                  <DatePicker
                    value={formik.values.endDate}
                    onChange={(date) => formik.setFieldValue("endDate", date)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          <Upload
            action=""
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            beforeUpload={() => false}>
            {fileList?.length < 5 && "+ Upload"}
          </Upload>

          {/* Submit Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 ">
            <button
              type="submit"
              className=" justify-center rounded bg-primary p-3 font-medium text-gray  border border-green-600 m-4 rounded hover:bg-green-600 hover:text-white hover:shadow-md">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
