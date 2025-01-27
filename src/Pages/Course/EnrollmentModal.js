import React, { useState } from "react";
import { Modal, Input, Button, Select, notification } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { coreAxios } from "../../utilities/axios";

const { Option } = Select;

export default function EnrollmentModal({ visible, onClose, course }) {
  const [paymentMethod, setPaymentMethod] = useState("");

  // Yup Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required("আপনার নাম লিখুন"),
    parentsName: Yup.string().required("পিতামাতার নাম লিখুন"),
    lastInstitute: Yup.string().required("শেষ শিক্ষাপ্রতিষ্ঠানের নাম লিখুন"),
    class: Yup.string().required("আপনার শ্রেণী লিখুন"),
    phone: Yup.string()
      .required("ফোন নম্বর লিখুন")
      .matches(/^[0-9]{11}$/, "ফোন নম্বর সঠিক ফরম্যাটে লিখুন"),
    email: Yup.string().email("সঠিক ইমেইল দিন"),
    paymentMethod: Yup.string()
      .required("পেমেন্ট পদ্ধতি নির্বাচন করুন")
      .oneOf(
        ["Bkash", "Rocket", "Nagad", "Bank", "Cash"],
        "সঠিক পদ্ধতি নির্বাচন করুন"
      ),
    transactionNumber: Yup.string().when("paymentMethod", {
      is: (value) => value && value !== "Cash",
      then: Yup.string()
        .required("লেনদেন নম্বর লিখুন")
        .matches(/^[0-9A-Za-z]+$/, "লেনদেন নম্বর সঠিক ফরম্যাটে লিখুন"),
      otherwise: Yup.string().nullable(),
    }),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await coreAxios.post("/enroll", {
        ...values,
        courseId: course._id, // Send the course ID to enroll in
        courseFee: course.fee, // Send the course fee (optional)
      });

      if (response.data.message) {
        notification.success({
          message: "এনরোলমেন্ট সফল হয়েছে!",
          description: `আপনি সফলভাবে ${course.title} কোর্সে এনরোল করেছেন।`,
        });
        onClose();
      } else {
        notification.error({
          message: "এনরোলমেন্টে সমস্যা",
          description: response.data.message || "অনুগ্রহ করে আবার চেষ্টা করুন",
        });
      }
    } catch (error) {
      notification.error({
        message: "এনরোলমেন্টে সমস্যা",
        description: "কিছু ভুল হয়েছে, দয়া করে আবার চেষ্টা করুন।",
      });
    }
  };

  const paymentInstructions = (
    <div className="bg-gray-100 p-4 rounded mb-4">
      <h3 className="text-lg font-semibold text-[#2D6A3F] mb-2">
        পেমেন্ট নির্দেশাবলী:
      </h3>
      <p className="text-gray-700">
        সাময়িক সময়ের জন্য আমরা ম্যানুয়ালি টাকা গ্রহণ করছি।
        <br />
        শুরুতে আপনি আমাদের <strong>রকেট</strong>, <strong>বিকাশ</strong>, বা{" "}
        <strong>নগদ</strong> নম্বরে টাকা পাঠিয়ে নিচের ঘরগুলো যথাযথ ভাবে পূরণ
        করুন।
        <br />
        অবশ্যই <strong>ট্রানজেকশন আইডি</strong> ঘরে যথাযথ ট্রানজেকশন আইডি
        বসাবেন।
        <br />
        আমরা আপনাকে অতিশিঘ্রই কনফার্ম করবো।
        <br />
      </p>
    </div>
  );

  return (
    <Modal
      title={
        <span className="text-[#2D6A3F]">{course?.title} - এনরোল ফর্ম</span>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}>
      {course && (
        <>
          {paymentInstructions}
          <Formik
            initialValues={{
              name: "",
              parentsName: "",
              lastInstitute: "",
              class: "",
              phone: "",
              email: "",
              paymentMethod: "",
              transactionNumber: "",
            }}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ setFieldValue }) => (
              <Form>
                <div className="mb-4 text-lg font-bold text-[#2D6A3F]">
                  কোর্স ফি: ৳ {course.fee}
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label>আপনার নাম</label>
                  <Field name="name" as={Input} placeholder="আপনার নাম" />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Parent's Name */}
                <div className="mb-4">
                  <label>আপনার পিতামাতার নাম</label>
                  <Field
                    name="parentsName"
                    as={Input}
                    placeholder="পিতামাতার নাম"
                  />
                  <ErrorMessage
                    name="parentsName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Last Institute */}
                <div className="mb-4">
                  <label>শেষ শিক্ষাপ্রতিষ্ঠানের নাম</label>
                  <Field
                    name="lastInstitute"
                    as={Input}
                    placeholder="শেষ শিক্ষাপ্রতিষ্ঠানের নাম"
                  />
                  <ErrorMessage
                    name="lastInstitute"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Class */}
                <div className="mb-4">
                  <label>শ্রেণী</label>
                  <Field name="class" as={Input} placeholder="আপনার শ্রেণী" />
                  <ErrorMessage
                    name="class"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Phone */}
                <div className="mb-4">
                  <label>ফোন নম্বর</label>
                  <Field
                    name="phone"
                    as={Input}
                    placeholder="আপনার ফোন নম্বর"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label>ইমেইল (যদি থাকে)</label>
                  <Field name="email" as={Input} placeholder="ইমেইল (ঐচ্ছিক)" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                  <label>পেমেন্ট পদ্ধতি</label>
                  <Field name="paymentMethod">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="পেমেন্ট পদ্ধতি নির্বাচন করুন"
                        onChange={(value) => {
                          setFieldValue("paymentMethod", value);
                          setPaymentMethod(value);
                        }}
                        style={{ width: "100%" }}>
                        <Option value="Bkash">Bkash</Option>
                        <Option value="Rocket">Rocket</Option>
                        <Option value="Nagad">Nagad</Option>
                        <Option value="Bank">Bank</Option>
                        <Option value="Cash">Cash</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="paymentMethod"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Transaction Number */}
                {paymentMethod && paymentMethod !== "Cash" && (
                  <div className="mb-4">
                    <label>লেনদেন নম্বর</label>
                    <Field
                      name="transactionNumber"
                      as={Input}
                      placeholder="লেনদেন নম্বর"
                    />
                    <ErrorMessage
                      name="transactionNumber"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: "#80CC37",
                    borderColor: "#80CC37",
                    width: "100%",
                  }}>
                  জমা দিন
                </Button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </Modal>
  );
}
