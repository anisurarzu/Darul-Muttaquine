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
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const ScholarshipPayment = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scholarshipDetails, setScholarshipDetails] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
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
        // Stop scanner
        await scannerRef.current.stop();
        setScanning(false);

        // Process the scanned ID
        const details = await fetchScholarshipDetails(decodedText);
        if (details) {
          setScholarshipDetails(details);
          setStep(2);
          message.success("স্কলারশিপ আইডি সফলভাবে যাচাই করা হয়েছে!");
        }
      } catch (err) {
        console.error("Error handling scan:", err);
        message.error("স্কলারশিপ আইডি যাচাই করতে ব্যর্থ হয়েছে");
        setScanning(false);
      }
    };

    console.log("scholarshipdetails", scholarshipDetails);

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [scanning]);

  const determineScholarshipDetails = (studentData) => {
    const classNumber = parseInt(studentData.instituteClass);
    const resultDetails = studentData.resultDetails[0] || {};

    const totalMarks = resultDetails.totalMarks || 0;
    const courseFund = resultDetails.courseFund || 0;
    const prizeMoney = resultDetails.prizeMoney || 0;

    let grade = null;
    let registrationBalance = courseFund;

    // Determine grade based on marks and class
    // For classes 3 to 5
    if (classNumber >= 3 && classNumber <= 5) {
      if (totalMarks >= 45 && totalMarks <= 48) {
        grade = "General Grade";
      } else if (totalMarks >= 49 && totalMarks <= 50) {
        grade = "Talentpool Grade";
      }
    }
    // For classes 6 to 10
    else if (classNumber >= 6 && classNumber <= 10) {
      if (totalMarks >= 75 && totalMarks < 80) {
        grade = "General Grade";
      } else if (totalMarks >= 80 && totalMarks <= 100) {
        grade = "Talentpool Grade";
      }
    }

    return {
      scholarshipID: studentData.scholarshipRollNumber,
      studentName: studentData.name,
      program: studentData.institute,
      class: studentData.instituteClass,
      totalMarks,
      grade,
      registrationBalance,
      eligible: grade !== null,
      image: studentData.image,
      courseFund,
      prizeMoney,
      needsRecharge: courseFund < 500, // Flag to indicate if balance needs recharge
    };
  };

  const fetchScholarshipDetails = async (scholarshipID) => {
    setLoading(true);
    try {
      const studentResponse = await coreAxios.get(
        `/search-result/${scholarshipID}`
      );
      const studentData = studentResponse.data;
      const details = determineScholarshipDetails(studentData);

      if (!details.eligible) {
        message.error("এই শিক্ষার্থী স্কলারশিপ পায়নি।");
        return null;
      }

      return details;
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
        setStep(2);
      }
    } catch (error) {
      console.error("Error processing scholarship details:", error);
    }
  };

  const resetForm = () => {
    setScholarshipDetails(null);
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
            স্কলারশিপ কোর্স রেজিস্ট্রেশন
          </Title>

          <Alert
            message="📌 কোর্স রেজিস্ট্রেশন সম্পর্কে নির্দেশনা"
            description={
              <div className="text-green-700">
                <p className="mb-2">
                  কোর্স রেজিস্ট্রেশনের আগে নিচের নির্দেশনাগুলো অনুসরণ করুন:
                </p>
                <ul className="pl-5 space-y-1">
                  <li>
                    <span className="font-bold">*</span> রেজিস্ট্রেশন ব্যালেন্স
                    শুধুমাত্র কোর্স রেজিস্ট্রেশনের জন্য ব্যবহারযোগ্য।
                  </li>
                  <li>
                    <span className="font-bold">*</span> কোর্স নির্বাচন করার পর
                    রেজিস্ট্রেশন ফি স্বয়ংক্রিয়ভাবে কেটে নেওয়া হবে।
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

                    <Divider className="my-4 border-green-200" />

                    <div className="text-center">
                      <div className="p-3 bg-green-100 rounded border border-green-200 inline-block">
                        <Text strong className="text-green-700">
                          রেজিস্ট্রেশন ব্যালেন্স:
                        </Text>
                        <p className="text-3xl font-bold text-green-700 my-2">
                          {scholarshipDetails.registrationBalance} টাকা
                        </p>
                        {scholarshipDetails.needsRecharge && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <Text strong className="text-yellow-700 block mb-2">
                              আপনার ব্যালেন্স অপর্যাপ্ত! কোর্স রেজিস্ট্রেশনের
                              জন্য নূন্যতম ৫০০ টাকা প্রয়োজন।
                            </Text>
                            <Text className="text-yellow-700 block mb-1">
                              বিকাশ/নগদ/রকেটে পেমেন্ট করুন:{" "}
                              <strong>০১৭১২-৩৪৫৬৭৮</strong>
                            </Text>
                            <Text className="text-yellow-700 block">
                              পেমেন্টের পর কল করুন:{" "}
                              <strong>০১৭১২-৩৪৫৬৭৮</strong>
                            </Text>
                          </div>
                        )}
                        <Text className="text-green-600">
                          কোর্স রেজিস্ট্রেশনের জন্য
                        </Text>
                      </div>
                    </div>

                    <Divider className="my-4 border-green-200" />
                    <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xl font-bold text-blue-700 my-1">
                        প্রাইজ মানি: {scholarshipDetails.prizeMoney} টাকা
                      </p>
                      <Text className="text-blue-600">
                        আপনি ইতিমধ্যে এই অর্থ/টাকা পেয়ে গিয়েছেন
                      </Text>
                    </div>
                  </div>

                  <div className="text-center">
                    <Link to="/courses">
                      <Button
                        type="primary"
                        size="large"
                        className="bg-green-600 hover:bg-green-700 border-green-700"
                        disabled={scholarshipDetails.needsRecharge}
                      >
                        কোর্স সিলেক্ট করুন
                      </Button>
                    </Link>
                    <Button
                      onClick={resetForm}
                      size="large"
                      className="ml-4 border-green-500 text-green-700 hover:border-green-700"
                    >
                      পিছনে
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ScholarshipPayment;
