import React, { useState, useRef } from "react";
import {
  Modal,
  Input,
  Button,
  Select,
  notification,
  Skeleton,
  Descriptions,
  Alert,
} from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { coreAxios } from "../../utilities/axios";

const { Option } = Select;

export default function EnrollmentModal({ visible, onClose, course }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [scholarshipDetails, setScholarshipDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const formikRef = useRef();

  // Payment numbers for display
  const paymentNumbers = {
    Bkash: "017XXXXXXXX",
    Rocket: "017XXXXXXXX",
    Nagad: "017XXXXXXXX",
    Support: "017XXXXXXXX",
  };

  // Yup Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("আপনার নাম লিখুন"),
    lastInstitute: Yup.string().required("শেষ শিক্ষাপ্রতিষ্ঠানের নাম লিখুন"),
    studentClass: Yup.string().required("আপনার শ্রেণী লিখুন"),
    phone: Yup.string()
      .required("ফোন নম্বর লিখুন")
      .matches(/^[0-9]{11}$/, "ফোন নম্বর সঠিক ফরম্যাটে লিখুন"),
    email: Yup.string().email("সঠিক ইমেইল দিন"),
    paymentMethod: Yup.string()
      .required("পেমেন্ট পদ্ধতি নির্বাচন করুন")
      .oneOf(
        ["Bkash", "Rocket", "Nagad", "Bank", "Cash", "ScholarshipCoupon"],
        "সঠিক পদ্ধতি নির্বাচন করুন"
      ),
    transactionNumber: Yup.string().when("paymentMethod", {
      is: (method) => method && !["Cash", "ScholarshipCoupon"].includes(method),
      then: (schema) =>
        schema
          .required("লেনদেন নম্বর লিখুন")
          .matches(/^[0-9A-Za-z]+$/, "লেনদেন নম্বর সঠিক ফরম্যাটে লিখুন"),
      otherwise: (schema) => schema.notRequired(),
    }),
    scholarshipRollNumber: Yup.string().when("paymentMethod", {
      is: "ScholarshipCoupon",
      then: (schema) => schema.required("স্কলারশিপ রোল নম্বর দিন"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const resetForm = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
    setPaymentMethod("");
    setScholarshipDetails(null);
    setLoading(false);
    setFetching(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const fetchScholarshipDetails = async (scholarshipID) => {
    setFetching(true);
    try {
      const response = await coreAxios.get(`/search-result/${scholarshipID}`);
      return response.data;
    } catch (error) {
      notification.error({
        message: "স্কলারশিপ তথ্য পাওয়া যায়নি",
        description: "আইডি চেক করুন বা অন্য পেমেন্ট পদ্ধতি ব্যবহার করুন",
      });
      return null;
    } finally {
      setFetching(false);
    }
  };

  const handleScholarshipRollNumberChange = async (e, setFieldValue) => {
    const rollNumber = e.target.value;
    if (rollNumber.length > 5) {
      const details = await fetchScholarshipDetails(rollNumber);
      if (details) {
        setScholarshipDetails(details);
        setFieldValue("name", details.name);
        setFieldValue("parentsName", details.parentsName || "");
        setFieldValue("lastInstitute", details.institute || "");
        setFieldValue("studentClass", details.instituteClass || "");
        setFieldValue("phone", details.phone || "");
        setFieldValue(
          "scholarshipRollNumber",
          details.scholarshipRollNumber || ""
        );
      }
    }
  };

  const handlePaymentMethodChange = (value, setFieldValue) => {
    setPaymentMethod(value);
    setFieldValue("paymentMethod", value);
    setScholarshipDetails(null);
    if (value !== "ScholarshipCoupon") {
      setFieldValue("scholarshipRollNumber", "");
    }
    if (["Cash", "ScholarshipCoupon"].includes(value)) {
      setFieldValue("transactionNumber", "");
    }
  };

  const renderBalanceWarning = (balance) => {
    if (balance < course?.price) {
      return (
        <div className="mb-4">
          <Alert
            message="অপর্যাপ্ত ব্যালেন্স"
            description={
              <>
                <p>
                  আপনার ব্যালেন্স পর্যাপ্ত নয়। কোর্সে এনরোল করতে কমপক্ষে ৳
                  {course?.price}
                  প্রয়োজন।
                </p>
                <p className="mt-2 font-semibold">
                  অনুগ্রহ করে নিচের নম্বরে টাকা রিচার্জ করুন:
                </p>
                <div className="mt-2 space-y-1">
                  <p>বিকাশ: 01791556184 (Personal)</p>
                  <p>রকেট: 01791556184 (Personal)</p>
                  <p>নগদ: 01791556184 (Personal)</p>
                </div>
                <p className="mt-2">
                  টাকা পাঠানোর পর আমাদের কল করুন: 01791556184
                </p>
                <p className="mt-1">
                  যেকোনো জিজ্ঞাসার জন্য কল করুন: 01791556184
                </p>
              </>
            }
            type="error"
            showIcon
          />
        </div>
      );
    }
    return null;
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      if (values.paymentMethod === "ScholarshipCoupon") {
        if (!scholarshipDetails) {
          notification.error({
            message: "স্কলারশিপ তথ্য পাওয়া যায়নি",
            description: "আইডি চেক করুন বা অন্য পেমেন্ট পদ্ধতি ব্যবহার করুন",
          });
          return;
        }

        const courseFund = scholarshipDetails.resultDetails[0]?.courseFund || 0;

        if (courseFund < course.price) {
          notification.error({
            message: "অপর্যাপ্ত ব্যালেন্স",
            description: `কোর্সে এনরোল করতে কমপক্ষে ৳${course?.price} প্রয়োজন। অনুগ্রহ করে রিচার্জ করুন।`,
          });
          return;
        }

        const remainingBalance = courseFund - course.price;

        if (remainingBalance < 0) {
          notification.error({
            message: "অপর্যাপ্ত ব্যালেন্স",
            description: `আপনার কোর্স ফান্ডে পর্যাপ্ত টাকা নেই। প্রয়োজন ${Math.abs(
              remainingBalance
            )} টাকা বেশি`,
          });
          return;
        }
      }

      // Enroll first
      const response = await coreAxios.post("/enroll", {
        ...values,
        courseId: course._id,
        courseFee: course.price,
        paymentStatus:
          values.paymentMethod === "ScholarshipCoupon" ? "Paid" : "Pending",
      });

      if (response.status === 200) {
        // Only update fund after successful enrollment
        if (values.paymentMethod === "ScholarshipCoupon") {
          const courseFund =
            scholarshipDetails.resultDetails[0]?.courseFund || 0;
          const remainingBalance = courseFund - course.price;

          await coreAxios.post("/update-course-fund", {
            scholarshipRollNumber: values.scholarshipRollNumber,
            courseFund: remainingBalance,
          });
        }

        notification.success({
          message: "এনরোলমেন্ট সফল হয়েছে!",
          description: `আপনি সফলভাবে ${course.title} কোর্সে এনরোল করেছেন।`,
        });

        resetForm();
        handleClose();
      }
    } catch (error) {
      notification.error({
        message: "এনরোলমেন্টে সমস্যা",
        description:
          error.response?.data?.message ||
          "কিছু ভুল হয়েছে, দয়া করে আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentInstructions = (
    <div className="bg-gray-100 p-4 rounded mb-4">
      <h3 className="text-lg font-semibold text-[#2D6A3F] mb-2">
        পেমেন্ট নির্দেশাবলী:
      </h3>
      {fetching ? (
        <Skeleton paragraph={{ rows: 2 }} active />
      ) : (
        <p className="text-gray-700">
          {paymentMethod === "ScholarshipCoupon" ? (
            "আপনার স্কলারশিপ ব্যালেন্স থেকে কোর্স ফি কেটে নেওয়া হবে"
          ) : (
            <>
              সাময়িক সময়ের জন্য আমরা ম্যানুয়ালি টাকা গ্রহণ করছি।
              <br />
              শুরুতে আপনি আমাদের <strong>রকেট</strong>, <strong>বিকাশ</strong>,
              বা <strong>নগদ</strong> নম্বরে টাকা পাঠিয়ে নিচের ঘরগুলো যথাযথ ভাবে
              পূরণ করুন।
              <br />
              অবশ্যই <strong>ট্রানজেকশন আইডি</strong> ঘরে যথাযথ ট্রানজেকশন আইডি
              বসাবেন।
            </>
          )}
        </p>
      )}
    </div>
  );

  return (
    <Modal
      title={
        <span className="text-[#2D6A3F]">{course?.title} - এনরোল ফর্ম</span>
      }
      visible={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose={true}
    >
      {course ? (
        <Formik
          innerRef={formikRef}
          initialValues={{
            name: "",
            parentsName: "N/A",
            lastInstitute: "",
            studentClass: "",
            phone: "",
            email: "",
            paymentMethod: "",
            transactionNumber: "",
            scholarshipRollNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Course Fee */}
              <div className="mb-4 text-lg font-bold text-[#2D6A3F]">
                কোর্স ফি: ৳ {course.price}
                {paymentMethod === "ScholarshipCoupon" &&
                  scholarshipDetails && (
                    <span className="ml-4">
                      ব্যালেন্স: ৳{" "}
                      {scholarshipDetails.resultDetails[0]?.courseFund || 0}
                    </span>
                  )}
              </div>

              {/* Show balance warning if balance < 500 */}
              {paymentMethod === "ScholarshipCoupon" &&
                scholarshipDetails &&
                renderBalanceWarning(
                  scholarshipDetails.resultDetails[0]?.courseFund || 0
                )}

              {/* Payment Method */}
              <div className="mb-4">
                <label>পেমেন্ট পদ্ধতি</label>
                <Field name="paymentMethod">
                  {({ field }) => (
                    <Select
                      {...field}
                      placeholder="পেমেন্ট পদ্ধতি নির্বাচন করুন"
                      onChange={(value) =>
                        handlePaymentMethodChange(value, setFieldValue)
                      }
                      value={values.paymentMethod}
                      style={{ width: "100%" }}
                    >
                      <Option value="ScholarshipCoupon">স্কলারশিপ কুপন</Option>
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

              {/* Scholarship Roll Number */}
              {paymentMethod === "ScholarshipCoupon" && (
                <div className="mb-4">
                  <label>স্কলারশিপ রোল নম্বর</label>
                  <Input
                    name="scholarshipRollNumber"
                    placeholder="স্কলারশিপ রোল নম্বর"
                    value={values.scholarshipRollNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue("scholarshipRollNumber", value);
                      handleScholarshipRollNumberChange(e, setFieldValue);
                    }}
                  />
                  <ErrorMessage
                    name="scholarshipRollNumber"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              )}

              {paymentInstructions}

              {fetching ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : (
                <>
                  {/* Scholarship Details Preview */}
                  {paymentMethod === "ScholarshipCoupon" &&
                    scholarshipDetails && (
                      <div className="mb-4 p-4 bg-green-50 rounded border border-green-200">
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="ছাত্র/ছাত্রীর নাম">
                            {scholarshipDetails.name}
                          </Descriptions.Item>
                          <Descriptions.Item label="প্রতিষ্ঠান">
                            {scholarshipDetails.institute}
                          </Descriptions.Item>
                          <Descriptions.Item label="শ্রেণী">
                            {scholarshipDetails.instituteClass}
                          </Descriptions.Item>
                          <Descriptions.Item label="বর্তমান ব্যালেন্স">
                            ৳{" "}
                            {scholarshipDetails.resultDetails[0]?.courseFund ||
                              0}
                          </Descriptions.Item>
                          <Descriptions.Item label="কোর্স ফি">
                            ৳ {course.price}
                          </Descriptions.Item>
                          <Descriptions.Item label="পরবর্তী ব্যালেন্স">
                            ৳{" "}
                            {(scholarshipDetails.resultDetails[0]?.courseFund ||
                              0) - course.price}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    )}

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
                    <Field
                      name="studentClass"
                      as={Input}
                      placeholder="আপনার শ্রেণী"
                    />
                    <ErrorMessage
                      name="studentClass"
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
                    <Field
                      name="email"
                      as={Input}
                      placeholder="ইমেইল (ঐচ্ছিক)"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Transaction Number */}
                  {paymentMethod &&
                    !["Cash", "ScholarshipCoupon"].includes(paymentMethod) && (
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
                </>
              )}

              {/* Submit Button */}
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#80CC37",
                  borderColor: "#80CC37",
                  width: "100%",
                }}
                loading={loading}
                disabled={
                  paymentMethod === "ScholarshipCoupon" &&
                  scholarshipDetails &&
                  (scholarshipDetails.resultDetails[0]?.courseFund || 0) < 500
                }
              >
                জমা দিন
              </Button>

              {/* Support information */}
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>যেকোনো জিজ্ঞাসার জন্য কল করুন: {paymentNumbers.Support}</p>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <Skeleton active paragraph={{ rows: 10 }} />
      )}
    </Modal>
  );
}
