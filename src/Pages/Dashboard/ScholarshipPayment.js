import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import {
  Card,
  Input,
  Button,
  Select,
  Divider,
  Skeleton,
  Alert,
  Typography,
  message,
  Descriptions,
} from "antd";
import * as Yup from "yup";
import { LoadingOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Html5Qrcode } from "html5-qrcode";
import { coreAxios } from "../../utilities/axios";

const { Title, Text } = Typography;
const { Option } = Select;

const ScholarshipPayment = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scholarshipDetails, setScholarshipDetails] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const scannerRef = useRef(null);
  const scannerId = "qr-reader";

  useEffect(() => {
    if (!scanning) return;

    const html5QrCode = new Html5Qrcode(scannerId);
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          const backCamera = cameras.find((camera) =>
            camera.label.toLowerCase().includes("back")
          );
          const cameraId = backCamera ? backCamera.id : cameras[0].id;

          await html5QrCode.start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              handleScanSuccess(decodedText);
            },
            (errorMessage) => {
              // ignore scan errors
            }
          );
        } else {
          setCameraError(true);
          message.error(
            "কোন ক্যামেরা পাওয়া যায়নি। আপনার ডিভাইস পরীক্ষা করুন।"
          );
        }
      } catch (err) {
        console.error("Camera error:", err);
        setCameraError(true);
        message.error(
          "ক্যামেরা অ্যাক্সেস করতে ব্যর্থ হয়েছে। অনুমতি পরীক্ষা করুন।"
        );
      }
    };

    const handleScanSuccess = async (decodedText) => {
      try {
        // Validate scanned ID format
        // if (!/^DMS\d{5}$/.test(decodedText)) {
        //   message.error("অবৈধ স্কলারশিপ আইডি ফরম্যাট");
        //   setScanning(false);
        //   return;
        // }

        // Stop scanner
        await scannerRef.current.stop();
        setScanning(false);

        // Process the scanned ID
        const details = await fetchScholarshipDetails(decodedText);
        if (details) {
          setScholarshipDetails(details);
          setPendingRequests(details.pendingRequests);
          setStep(2);
          message.success("স্কলারশিপ আইডি সফলভাবে যাচাই করা হয়েছে!");
        }
      } catch (err) {
        console.error("Error handling scan:", err);
        message.error("স্কলারশিপ আইডি যাচাই করতে ব্যর্থ হয়েছে");
        setScanning(false);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [scanning]);

  const fetchPendingRequests = async (scholarshipID) => {
    try {
      const response = await coreAxios.get(
        `/scholarship-cost-info/${scholarshipID}`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      return [];
    }
  };

  const determineScholarshipDetails = (studentData) => {
    const classNumber = parseInt(studentData.instituteClass);
    const totalMarks = studentData.resultDetails[0]?.totalMarks || 0;
    let grade = null;
    let withdrawalBalance = 0;
    let registrationBalance = 0;

    // For classes 3 to 5
    if (classNumber >= 3 && classNumber <= 5) {
      if (totalMarks >= 45 && totalMarks <= 48) {
        grade = "General Grade";
        withdrawalBalance = 700;
        registrationBalance = 3000;
      } else if (totalMarks >= 49 && totalMarks <= 50) {
        grade = "Talentpool Grade";
        withdrawalBalance = 1000;
        registrationBalance = 3500;
      }
    }
    // For classes 6 to 10
    else if (classNumber >= 6 && classNumber <= 10) {
      if (totalMarks >= 75 && totalMarks < 80) {
        grade = "General Grade";
        withdrawalBalance = 1000;
        registrationBalance = 3500;
      } else if (totalMarks >= 80 && totalMarks <= 100) {
        grade = "Talentpool Grade";
        withdrawalBalance = 1500;
        registrationBalance = 4000;
      }
    }

    return {
      scholarshipID: studentData.scholarshipRollNumber,
      studentName: studentData.name,
      program: studentData.institute,
      class: studentData.instituteClass,
      totalMarks,
      grade,
      withdrawalBalance,
      registrationBalance,
      eligible: grade !== null,
      image: studentData.image,
    };
  };

  const fetchScholarshipDetails = async (scholarshipID) => {
    setLoading(true);
    try {
      const [studentResponse, pendingRequests] = await Promise.all([
        coreAxios.get(`/search-result/${scholarshipID}`),
        fetchPendingRequests(scholarshipID),
      ]);

      const studentData = studentResponse.data;
      const details = determineScholarshipDetails(studentData);

      if (!details.eligible) {
        message.error("এই শিক্ষার্থী স্কলারশিপ পায়নি।");
        return null;
      }

      // Calculate available balance by subtracting pending requests
      const totalPending = pendingRequests.reduce(
        (sum, req) => sum + req.amount,
        0
      );

      const availableBalance = Math.max(
        0,
        details.withdrawalBalance - totalPending
      );

      return {
        ...details,
        availableBalance,
        pendingRequests,
        originalWithdrawalBalance: details.withdrawalBalance,
      };
    } catch (error) {
      console.error("Error fetching scholarship details:", error);
      message.error("স্কলারশিপ তথ্য পাওয়া যায়নি। আইডি চেক করুন।");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleScholarshipIDSubmit = async (values) => {
    try {
      const details = await fetchScholarshipDetails(values.scholarshipID);
      if (details) {
        setScholarshipDetails(details);
        setPendingRequests(details.pendingRequests);
        setStep(2);
      }
    } catch (error) {
      console.error("Error processing scholarship details:", error);
    }
  };

  const handleWithdrawalSubmit = async (values, { setSubmitting }) => {
    setLoading(true);

    const currentBalance = scholarshipDetails.availableBalance;

    // Validation: Check if amount exceeds current balance
    if (values.amount > currentBalance) {
      message.warning(
        "উত্তোলনের পরিমাণ বর্তমান ব্যালেন্সের চেয়ে বেশি হতে পারে না!"
      );
      setLoading(false);
      setSubmitting(false);
      return;
    }

    try {
      const response = await coreAxios.post("/cost-info-2", {
        scholarshipID: scholarshipDetails.scholarshipID,
        amount: values.amount,
        paymentMethod: values.paymentMethod,
        fundName: "withdrawal",
        currentBalance: currentBalance - values.amount,
        description: "Scholarship fund withdrawal",
        status: "pending",
      });

      // Changed this check to match backend response
      if (
        response.data.message ===
        "Cost and scholarship cost info submitted successfully"
      ) {
        message.success("উত্তোলনের অনুরোধ সফলভাবে জমা হয়েছে!");
        setStep(3);
      } else {
        throw new Error(response.data.message || "API request failed");
      }
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      message.error(
        error.response?.data?.message ||
          "উত্তোলনের অনুরোধ জমা করতে ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setScholarshipDetails(null);
    setPendingRequests([]);
    setStep(1);
  };

  const startQRScanner = () => {
    setScanning(true);
  };

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-green-200">
          <Title level={3} className="text-center mb-6 text-green-800">
            স্কলারশিপ ফান্ড ব্যবস্থাপনা
          </Title>

          <Alert
            message="📌 স্কলারশিপ ফান্ড ব্যবহারের গুরুত্বপূর্ণ নির্দেশনা"
            description={
              <div className="text-green-700">
                <p className="mb-2">
                  স্কলারশিপ ফান্ড ব্যবহারের আগে নিচের নির্দেশনাগুলো অনুসরণ করুন:
                </p>
                <ul className="pl-5 space-y-1">
                  <li>
                    <span className="font-bold">*</span> উইথড্রো করা অর্থ
                    শুধুমাত্র ব্যক্তিগত খরচের জন্য ব্যবহারযোগ্য।
                  </li>
                  <li>
                    <span className="font-bold">*</span> রেজিস্ট্রেশন ব্যালেন্স
                    শুধুমাত্র কোর্স রেজিস্ট্রেশনের জন্য।
                  </li>
                  <li>
                    <span className="font-bold">*</span> উইথড্রো রিকোয়েস্ট
                    প্রসেস হতে ৩-৫ কর্মদিবস সময় লাগতে পারে।
                  </li>
                  <li>
                    <span className="font-bold">*</span> সাবমিট করার আগে সকল
                    তথ্য ভালোভাবে যাচাই করে নিন।
                  </li>
                </ul>
              </div>
            }
            type="success"
            showIcon
            className="mb-6 border-green-300 bg-green-50"
          />

          {scanning && (
            <div className="mb-6">
              <p className="text-center font-semibold text-green-700 mb-2">
                স্কলারশিপ কিউআর কোড স্ক্যান করুন
              </p>
              {cameraError ? (
                <div className="text-center p-4 border rounded bg-gray-50">
                  <p className="text-red-500 mb-2">
                    ক্যামেরা অ্যাক্সেস ব্যর্থ হয়েছে
                  </p>
                  <Button
                    type="primary"
                    onClick={() => {
                      setCameraError(false);
                      setScanning(true);
                    }}
                  >
                    ক্যামেরা অ্যাক্সেস পুনরায় চেষ্টা করুন
                  </Button>
                </div>
              ) : (
                <div className="w-full h-[250px] border rounded bg-gray-50 flex items-center justify-center">
                  <div id={scannerId} className="w-full h-full" />
                </div>
              )}
              <div className="text-center mt-4">
                <Button onClick={() => setScanning(false)}>
                  স্ক্যান বাতিল করুন
                </Button>
              </div>
            </div>
          )}

          {!scanning && step === 1 && (
            <Formik
              initialValues={{ scholarshipID: "" }}
              onSubmit={handleScholarshipIDSubmit}
            >
              {({ errors, touched, setFieldValue }) => (
                <Form>
                  <div className="mb-6">
                    <label
                      htmlFor="scholarshipID"
                      className="block text-sm font-medium text-green-700 mb-2"
                    >
                      স্কলারশিপ আইডি লিখুন
                    </label>
                    <div className="flex gap-2">
                      <Field
                        as={Input}
                        name="scholarshipID"
                        placeholder="যেমন: DMS25000"
                        size="large"
                        className={`flex-1 ${
                          errors.scholarshipID && touched.scholarshipID
                            ? "border-red-500"
                            : "border-green-300"
                        }`}
                      />
                      <Button
                        type="default"
                        size="large"
                        icon={<QrcodeOutlined />}
                        onClick={startQRScanner}
                        className="border-green-300"
                      >
                        স্ক্যান করুন
                      </Button>
                    </div>
                    {errors.scholarshipID && touched.scholarshipID ? (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.scholarshipID}
                      </div>
                    ) : null}
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full bg-green-600 hover:bg-green-700 border-green-700"
                    loading={loading}
                  >
                    {loading ? "যাচাই করা হচ্ছে..." : "ব্যালেন্স চেক করুন"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {!scanning && step === 2 && scholarshipDetails && (
            <div>
              {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : (
                <>
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-4">
                      {scholarshipDetails.image && (
                        <img
                          src={scholarshipDetails.image}
                          alt="Student"
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                      )}
                      <div>
                        <Title level={4} className="mb-0 text-green-800">
                          {scholarshipDetails.studentName}
                        </Title>
                        <Text className="text-green-600">
                          {scholarshipDetails.program}
                        </Text>
                      </div>
                    </div>

                    <Descriptions
                      bordered
                      column={2}
                      size="small"
                      className="mb-4"
                    >
                      <Descriptions.Item label="শ্রেণী">
                        {scholarshipDetails.class}
                      </Descriptions.Item>
                      <Descriptions.Item label="প্রাপ্ত নম্বর">
                        {scholarshipDetails.totalMarks}
                      </Descriptions.Item>
                      <Descriptions.Item label="গ্রেড">
                        <span className="font-semibold">
                          {scholarshipDetails.grade}
                        </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="আইডি">
                        {scholarshipDetails.scholarshipID}
                      </Descriptions.Item>
                    </Descriptions>

                    {/* Pending Requests */}
                    {pendingRequests.filter((req) => req.status !== "approved")
                      .length > 0 && (
                      <Alert
                        message="মুলতুবি উত্তোলনের অনুরোধ"
                        description={
                          <div>
                            <p>আপনার নিম্নলিখিত মুলতুবি অনুরোধ আছে:</p>
                            <ul className="list-disc pl-5">
                              {pendingRequests
                                .filter((req) => req.status !== "approved")
                                .map((req, index) => (
                                  <li key={index}>
                                    {req.amount} টাকা ({req.paymentMethod}) -{" "}
                                    {new Date(
                                      req.requestDate
                                    ).toLocaleDateString()}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        }
                        type="warning"
                        showIcon
                        className="mb-4"
                      />
                    )}

                    {/* Received Requests */}
                    {pendingRequests.filter((req) => req.status === "approved")
                      .length > 0 && (
                      <Alert
                        message="গৃহীত উত্তোলনের তথ্য"
                        description={
                          <div>
                            <p>
                              আপনি ইতিমধ্যে নিম্নলিখিত উত্তোলনের অনুরোধ গ্রহণ
                              করেছেন:
                            </p>
                            <ul className="list-disc pl-5">
                              {pendingRequests
                                .filter((req) => req.status === "approved")
                                .map((req, index) => (
                                  <li key={index}>
                                    {req.amount} টাকা ({req.paymentMethod}) -{" "}
                                    {new Date(
                                      req.requestDate
                                    ).toLocaleDateString()}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        }
                        type="success"
                        showIcon
                        className="mb-4"
                      />
                    )}

                    <Divider className="my-4 border-green-200" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-100 rounded border border-green-200">
                        <Text strong className="text-green-700">
                          উত্তোলনের অর্থ:
                        </Text>
                        <p className="text-xl font-bold text-green-700">
                          {scholarshipDetails.availableBalance} টাকা
                        </p>
                        <Text className="text-green-600">
                          ব্যক্তিগত খরচের জন্য
                        </Text>
                      </div>
                      <div className="p-3 bg-green-50 rounded border border-green-200">
                        <Text strong className="text-green-700">
                          রেজিস্ট্রেশন ব্যালেন্স:
                        </Text>
                        <p className="text-xl font-bold text-green-700">
                          {scholarshipDetails.registrationBalance} টাকা
                        </p>
                        <Text className="text-green-600">
                          কোর্স রেজিস্ট্রেশনের জন্য
                        </Text>
                      </div>
                    </div>
                  </div>

                  <Formik
                    initialValues={{
                      amount: "",
                      purpose: "withdrawal",
                      paymentMethod: "",
                    }}
                    validationSchema={Yup.object({
                      amount: Yup.number()
                        .required("অর্থের পরিমাণ আবশ্যক")
                        .min(100, "সর্বনিম্ন ১০০ টাকা উত্তোলন করা যাবে")
                        .max(
                          scholarshipDetails.availableBalance,
                          `প্রাপ্ত ব্যালেন্সের বেশি উত্তোলন করা যাবে না (প্রাপ্ত ব্যালেন্স: ${scholarshipDetails.availableBalance} টাকা)`
                        ),
                      paymentMethod: Yup.string().required(
                        "পেমেন্ট পদ্ধতি নির্বাচন করুন"
                      ),
                    })}
                    onSubmit={handleWithdrawalSubmit}
                  >
                    {({
                      errors,
                      touched,
                      values,
                      isSubmitting,
                      setFieldValue,
                    }) => (
                      <Form>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-green-700 mb-2">
                            অনুরোধের ধরন
                          </label>
                          <Field
                            name="purpose"
                            as={Select}
                            size="large"
                            className="w-full border-green-300"
                            onChange={(value) =>
                              setFieldValue("purpose", value)
                            }
                          >
                            <Option value="withdrawal">ফান্ড উত্তোলন</Option>
                            <Option value="registration">
                              কোর্স রেজিস্ট্রেশন
                            </Option>
                          </Field>
                        </div>

                        {values.purpose === "withdrawal" && (
                          <>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-green-700 mb-2">
                                উত্তোলনের পরিমাণ (টাকা)
                              </label>
                              <Field
                                as={Input}
                                name="amount"
                                type="number"
                                placeholder="টাকার পরিমাণ লিখুন"
                                size="large"
                                className="w-full border-green-300"
                              />
                              {errors.amount && touched.amount ? (
                                <div className="text-red-500 text-sm mt-1">
                                  {errors.amount}
                                </div>
                              ) : null}
                              <Text className="block mt-1 text-green-600">
                                প্রাপ্ত ব্যালেন্স:{" "}
                                {scholarshipDetails.availableBalance} টাকা
                              </Text>
                            </div>

                            <div className="mb-6">
                              <label className="block text-sm font-medium text-green-700 mb-2">
                                পেমেন্ট পদ্ধতি
                              </label>
                              <Field
                                name="paymentMethod"
                                as={Select}
                                placeholder="পেমেন্ট পদ্ধতি নির্বাচন করুন"
                                size="large"
                                className="w-full border-green-300"
                                onChange={(value) =>
                                  setFieldValue("paymentMethod", value)
                                }
                              >
                                <Option value="bKash">bKash</Option>
                                <Option value="Nagad">Nagad</Option>
                                <Option value="Bank Transfer">
                                  ব্যাংক ট্রান্সফার
                                </Option>
                              </Field>
                              {errors.paymentMethod && touched.paymentMethod ? (
                                <div className="text-red-500 text-sm mt-1">
                                  {errors.paymentMethod}
                                </div>
                              ) : null}
                            </div>
                          </>
                        )}

                        {values.purpose === "registration" && (
                          <Alert
                            message="কোর্স রেজিস্ট্রেশন নোটিশ"
                            description="আপনার রেজিস্ট্রেশন ব্যালেন্স কোর্স রেজিস্ট্রেশনের সময় স্বয়ংক্রিয়ভাবে ব্যবহৃত হবে। আলাদাভাবে উত্তোলনের প্রয়োজন নেই।"
                            type="success"
                            showIcon
                            className="mb-6 border-green-300 bg-green-50"
                          />
                        )}

                        <div className="flex space-x-4">
                          <Button
                            onClick={resetForm}
                            size="large"
                            className="flex-1 border-green-500 text-green-700 hover:border-green-700"
                          >
                            পিছনে
                          </Button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="flex-1 bg-green-600 hover:bg-green-700 border-green-700"
                            loading={isSubmitting}
                            disabled={values.purpose === "registration"}
                          >
                            {isSubmitting ? (
                              <>
                                <LoadingOutlined /> প্রসেসিং...
                              </>
                            ) : (
                              "অনুরোধ সাবমিট করুন"
                            )}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </>
              )}
            </div>
          )}

          {!scanning && step === 3 && (
            <div className="text-center py-8">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 text-green-500 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <Title level={3} className="mb-2 text-green-800">
                অনুরোধ সফলভাবে জমা হয়েছে!
              </Title>
              <Text className="block mb-6 text-green-700">
                আপনার উত্তোলনের অনুরোধ প্রাপ্ত হয়েছে এবং প্রসেসিং চলছে।
              </Text>
              <Button
                type="primary"
                size="large"
                onClick={resetForm}
                className="bg-green-600 hover:bg-green-700 border-green-700"
              >
                আরেকটি অনুরোধ করুন
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ScholarshipPayment;
