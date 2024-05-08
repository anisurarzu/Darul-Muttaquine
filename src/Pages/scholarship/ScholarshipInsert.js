import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { coreAxios } from "../../utilities/axios";
import { Upload } from "antd";
const ScholarshipInsert = ({ onHide, fetchRolls, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

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

          const res = await coreAxios.post(`/scholarship-info`, allData);
          if (res?.status === 201) {
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
      id: "name",
      name: "name",
      type: "text",
      label: "Student Name ",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "parentName",
      name: "parentName",
      type: "text",
      label: "Parent Name",
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
    {
      id: "instituteRollNumber",
      name: "instituteRollNumber",
      type: "text",
      label: "Institute Roll",
      errors: "",
      register: "",
      required: true,
    },
    {
      id: "phone",
      name: "phone",
      type: "number",
      label: "Phone Number",
      errors: "",
      register: "",
      required: false,
    },
    {
      id: "gender",
      name: "gender",
      type: "text",
      label: "Gender",
      errors: "",
      register: "",
      required: false,
    },
    {
      id: "bloodGroup",
      name: "bloodGroup",
      type: "text",
      label: "Blood Group",
      errors: "",
      register: "",
      required: false,
    },
    {
      id: "presentAddress",
      name: "presentAddress",
      type: "text",
      label: "Present Address",
      errors: "",
      register: "",
      required: true,
    },
  ];

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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

export default ScholarshipInsert;
