import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Select } from "antd";
import { coreAxios } from "../../../utilities/axios";
import { useFormik } from "formik";
import { Option } from "antd/es/mentions";

const UpdateOrderStatus = ({ handleCancel, rowData }) => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      orderStatus: rowData?.orderStatus || "",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await coreAxios.post(`/update-order-status`, {
          orderStatus: values?.orderStatus,
          orderID: rowData?._id,
        });
        if (res?.status === 200) {
          setLoading(false);
          toast.success("Successfully Updated!");
          formik.resetForm();
          handleCancel();
        }
      } catch (err) {
        setLoading(false);
        toast.error(err?.response?.data?.message || "An error occurred");
      }
    },
    enableReinitialize: true,
  });

  const userRoleList = ["Pending", "Processing", "Delivery", "Delivered"];

  return (
    <div>
      <div className="bg-white p-4 rounded">
        <div className="flex justify-center pt-2">
          <div>
            <p className="text-[14px] font-semibold text-center pb-4 text-orange-600">
              Update Order Status
            </p>
          </div>
        </div>
        <form
          className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
          onSubmit={formik.handleSubmit}>
          <div className="w-full mb-4">
            <label
              htmlFor="orderStatus"
              className="block text-black dark:text-black">
              Select Order Status <span className="text-meta-1">*</span>
            </label>
            <Select
              id="orderStatus"
              name="orderStatus"
              onChange={(value) => formik.setFieldValue("orderStatus", value)}
              value={formik.values.orderStatus}
              className="w-full rounded border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
              {userRoleList.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </div>

          {/* Submit Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1">
            <div></div>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full rounded bg-primary p-4 font-medium text-white border border-yellow-400 hover:bg-yellow-400 hover:text-white hover:shadow-md">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;
