import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Input, Button, Select, DatePicker } from "antd";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { coreAxios } from "../../utilities/axios";

const { Option } = Select;

export default function InsertQuizMoney({ handleCancel }) {
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    amount: Yup.number().required("Amount is required"),

    userID: Yup.string().required("User ID is required"),
    phone: Yup.string().required("Phone number is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const response = await coreAxios?.post(`/quiz-money`, values);
      if (response?.status === 200) {
        toast?.success("Successfully Insert!");
        resetForm();
        setLoading(false);
        handleCancel();
      }
    } catch (err) {
      setLoading(false);
      toast?.error(err);
    }
  };

  return (
    <div className="">
      <div className="bg-white p-8 rounded-lg shadow-lg ">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Money Form</h2>
        <Formik
          initialValues={{
            amount: "",
            userName: "",
            userID: "",
            phone: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ errors, touched }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700">Amount</label>
                <Field
                  name="amount"
                  as={Input}
                  placeholder="Enter amount"
                  className={`${
                    errors.amount && touched.amount
                      ? "border-red-500"
                      : "border-gray-300"
                  } w-full`}
                />
                {errors.amount && touched.amount && (
                  <div className="text-red-500 text-sm">{errors.amount}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">User Name</label>
                <Field
                  name="userName"
                  as={Input}
                  placeholder="Enter user name"
                  className={`${
                    errors.userName && touched.userName
                      ? "border-red-500"
                      : "border-gray-300"
                  } w-full`}
                />
                {errors.userName && touched.userName && (
                  <div className="text-red-500 text-sm">{errors.userName}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">User ID</label>
                <Field
                  name="userID"
                  as={Input}
                  placeholder="Enter user ID"
                  className={`${
                    errors.userID && touched.userID
                      ? "border-red-500"
                      : "border-gray-300"
                  } w-full`}
                />
                {errors.userID && touched.userID && (
                  <div className="text-red-500 text-sm">{errors.userID}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <Field
                  name="phone"
                  as={Input}
                  placeholder="Enter phone number"
                  className={`${
                    errors.phone && touched.phone
                      ? "border-red-500"
                      : "border-gray-300"
                  } w-full`}
                />
                {errors.phone && touched.phone && (
                  <div className="text-red-500 text-sm">{errors.phone}</div>
                )}
              </div>

              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="w-full bg-[#93E073] border-white hover:bg-[#8FE53E]">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
