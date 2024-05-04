import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Upload } from "antd";
import { coreAxios } from "../../../utilities/axios";
import { useFormik } from "formik";

const HistoryUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [historyName, setHistoryName] = useState("");
  const [historyDate, setHistoryDate] = useState("");
  const [historyDetails, setHistoryDetails] = useState("");

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

  const uploadFile = async () => {
    try {
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

      // Assuming imgbb returns the image URL in response.data.data.url
      toast.success("Upload successful!");
      console.log("Uploaded image URL:", response.data.data.url);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      parentName: "",
      institute: "",
      instituteClass: "",
      instituteRollNumber: "",
      gender: "",
      phone: 0,
      bloodGroup: "",
      presentAddress: "",
    }, // Ensure you have proper initial values
    onSubmit: async (values) => {
      console.log("values", values); // Check if values are received correctly
      try {
        const res = await coreAxios.post(`/scholarship-info`, values);
        if (res?.status === 201) {
          toast.success("Successfully Saved!");
          formik.resetForm();
        }
      } catch (err) {
        toast.error(err.response.data?.message);
      }
    },
    enableReinitialize: true,
  });

  const inputData = [
    {
      id: "historyName",
      name: "historyName",
      type: "text",
      label: "Title",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "historyDetails",
      name: "historyDetails",
      type: "text",
      label: "Details",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "institute",
      name: "institute",
      type: "text",
      label: "Institute Name",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "instituteClass",
      name: "instituteClass",
      type: "text",
      label: "Institute Class",
      errors: "",
      register: "",
      required: true,
    },
  ];

  return (
    <div className="bg-white p-4 shadow rownded">
      {/* <input
        type="text"
        placeholder="History Name"
        value={historyName}
        onChange={(e) => setHistoryName(e.target.value)}
      />
      <input
        type="text"
        placeholder="History Date"
        value={historyDate}
        onChange={(e) => setHistoryDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="History Details"
        value={historyDetails}
        onChange={(e) => setHistoryDetails(e.target.value)}
      /> */}
      <form
        className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
        onSubmit={formik.handleSubmit}>
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
      <button onClick={uploadFile}>Upload</button>

      <div>
        <Upload
          action=""
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          beforeUpload={() => false}>
          {fileList.length < 5 && "+ Upload"}
        </Upload>
      </div>
    </div>
  );
};

export default HistoryUpload;
