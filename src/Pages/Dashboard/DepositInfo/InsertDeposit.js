import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import { Upload, Select } from "antd"; // Import Select from Ant Design
import { coreAxios } from "../../../utilities/axios";
import useUserInfo from "../../../hooks/useUserInfo";

const { Option } = Select; // Destructure Option from Select

const InsertDeposit = ({ onHide, fetchRolls, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const userInfo = useUserInfo();
  console?.log("userInfo", userInfo);

  const formik = useFormik({
    initialValues: {
      amount: 0,
      paymentMethod: "bankAccount", // Initialize paymentMethod
      userID: "",
      phone: 0,
      tnxID: "",
    },
    onSubmit: async (values) => {
      try {
        const allData = {
          ...values,
          userID: userInfo?._id || "",
        };
        setLoading(true);
        const res = await coreAxios.post(`/deposit-info`, allData);
        if (res?.status === 201) {
          setLoading(false);
          toast.success("Successfully Saved!");
          formik.resetForm();
          handleCancel();
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

  const paymentMethods = ["bkash", "rocket", "nagad", "bankAccount"]; // Define payment methods

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form
          className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
          onSubmit={formik.handleSubmit}>
          <div className="w-full mb-4">
            <label className="block text-black dark:text-white">
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
              className="block text-black dark:text-white">
              Payment Method <span className="text-meta-1">*</span>
            </label>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              onChange={(value) => formik.setFieldValue("paymentMethod", value)}
              value={formik.values.paymentMethod}
              className="w-full rounded  border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
              {paymentMethods.map((method) => (
                <Option key={method} value={method}>
                  {method}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-full mb-4">
            <label className="block text-black dark:text-white">
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
            <label className="block text-black dark:text-white">
              Transaction NO. <span className="text-meta-1">*</span>
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
    </div>
  );
};

export default InsertDeposit;
