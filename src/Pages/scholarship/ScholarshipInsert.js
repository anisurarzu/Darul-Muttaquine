import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { coreAxios } from "../../utilities/axios";
const ScholarshipInsert = ({ onHide, fetchRolls }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        const res = await coreAxios.post(`/scholarship-info`, values);
        if (res?.status === 201) {
          toast.success("Successfully Saved!");
          formik?.resetForm();
        }
      } catch (err) {
        toast.error(err.response.data?.message);
      }
    },
    enableReinitialize: true,
  });

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
      type: "text",
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
                  value={formik.values[id]}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            )
          )}

          {/* Student Name */}

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
