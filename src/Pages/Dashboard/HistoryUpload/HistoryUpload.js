import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import { Alert, Button, Select, Spin, Upload } from "antd";
import { coreAxios } from "../../../utilities/axios";
const { Option } = Select;
const HistoryUpload = ({ onHide, fetchRolls, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [position, setPosition] = useState("start");

  const formik = useFormik({
    initialValues: {
      name: "",
      subtitle: "",
      description: "",
      image: "",
      projectName: "",
    }, // Ensure you have proper initial values
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (!fileList.length) {
          toast.error("Please upload an image");
        } else {
          const formData = new FormData();
          fileList.forEach((file) => {
            formData.append("image", file.originFileObj);
          });

          const response = await axios.post(
            "https://api.imgbb.com/1/upload?key=5bdcb96655462459d117ee1361223929",
            formData
          );
          if (response?.status === 200) {
            const allData = {
              ...values,
              image: response?.data?.data?.display_url,
            };

            console.log("====", allData);

            const res = await coreAxios.post(`/history-info`, allData);
            if (res?.status === 200) {
              setLoading(false);
              toast.success("Successfully Saved!");
              formik.resetForm();
              setFileList(null);
              handleCancel();
              // Use formik.resetForm() directly
            }
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
      id: "name",
      name: "name",
      type: "text",
      label: "History Name ",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "subtitle",
      name: "subtitle",
      type: "text",
      label: "Sub Title",
      errors: "",
      register: "",
      required: false,
    },
  ];

  const imageProjectList = [
    "শিহ্মাবৃত্তি",
    "ঈদের খুশি",
    "ওয়াজ মাহফিল",
    "আনন্দ ভ্রমণ",
    "স্বাবলম্বীকরণ",
  ];

  return (
    <div className="">
      <h1 className="text-[17px] font-bold text-center py-4">
        Added Histroy Information
      </h1>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form className="p-6.5 pt-1 px-1 " onSubmit={formik.handleSubmit}>
          <div className="py-2">
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
                <div className="w-full  mb-4">
                  <label
                    htmlFor="project"
                    className="block text-black dark:text-black">
                    Project <span className="text-meta-1">*</span>
                  </label>
                  <Select
                    id="projectName"
                    name="project Name"
                    onChange={(value) =>
                      formik.setFieldValue("projectName", value)
                    }
                    value={formik.values.projectName}
                    className="w-full rounded  border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                    {imageProjectList?.map((method) => (
                      <Option key={method} value={method}>
                        {method}
                      </Option>
                    ))}
                  </Select>
                </div>
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
                      <label className="block text-black dark:text-black">
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
                <div>
                  <p>Description</p>
                  <textarea
                    id="description"
                    name="description"
                    onChange={formik.handleChange}
                    value={formik.values?.description}
                    rows="4"
                    cols="50"
                    className="border border-gray-200"></textarea>
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
            <div></div>

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

export default HistoryUpload;
