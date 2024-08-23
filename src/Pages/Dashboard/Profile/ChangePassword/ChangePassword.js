import React, { useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { coreAxios } from "../../../../utilities/axios";

const ChangePassword = ({ onHide, fetchRolls, handleCancel }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      savePassword: false, // Added checkbox field
    },
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        setLoading(true);
        const finalData = {
          oldPassword: values?.oldPassword,
          newPassword: values?.newPassword,
          storePassword: values?.savePassword ? values?.newPassword : null, // Conditionally store the password
          email: userInfo?.email,
        };
        const res = await coreAxios.post(`/change-password`, finalData);
        if (res?.status === 200) {
          toast.success("Successfully Updated!");
          handleCancel();
          formik.resetForm();
          setLoading(false);

          // Use formik.resetForm() directly
        }
      } catch (err) {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      }
    },
    enableReinitialize: true,
  });

  const inputData = [
    {
      id: "oldPassword",
      name: "oldPassword",
      type: "password",
      label: "Old Password",
      required: true,
    },
    {
      id: "newPassword",
      name: "newPassword",
      type: "password",
      label: "New Password",
      required: true,
    },
  ];

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form
          className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
          onSubmit={formik.handleSubmit}>
          {inputData.map(({ id, name, type, label, required }) => (
            <div className="w-full mb-4" key={id}>
              <label className="block text-black dark:text-black">
                {label} <span className="text-meta-1">*</span>
              </label>
              <input
                id={id}
                name={name}
                type={type}
                required={required}
                onChange={formik.handleChange}
                value={formik.values[id]}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          ))}

          <div className="w-full mb-4">
            <label className="flex items-center text-black dark:text-black">
              <input
                type="checkbox"
                id="savePassword"
                name="savePassword"
                onChange={formik.handleChange}
                checked={formik.values.savePassword}
                className="mr-2"
              />
              Save password for future use
            </label>
          </div>

          {/* Submit Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 ">
            <div></div>
            <button
              loading={loading}
              type="submit"
              className="justify-center rounded bg-primary p-3 font-medium text-gray border border-green-600 m-4 rounded hover:bg-green-600 hover:text-white hover:shadow-md">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
