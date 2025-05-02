import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Divider,
  Table,
  Typography,
  Input,
  Form,
  Row,
  Col,
  Alert,
} from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { coreAxios } from "../../../utilities/axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const { Text, Title } = Typography;

// Function to convert numbers to Bengali numerals
const convertToBengali = (number) => {
  const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(number).replace(/\d/g, (digit) => bengaliNumerals[digit]);
};

const ResultPage = () => {
  const [resultData, setResultData] = useState({});
  const [loading, setLoading] = useState(false);
  const resultCardRef = useRef(null);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await coreAxios.get(
        `search-result/${values?.scholarshipRollNumber}`
      );
      if (res?.status === 200) {
        setLoading(false);
        toast.success("Result fetched successfully");
        form.resetFields();
        setResultData(res?.data);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message || "Error fetching result");
    }
  };

  // Scholarship condition and message
  const getScholarshipStatus = () => {
    const totalMarks = resultData?.resultDetails?.[0]?.totalMarks || 0;
    const classNumber = parseInt(resultData?.instituteClass) || 0;

    // For classes 3 to 5
    if (classNumber >= 3 && classNumber <= 5) {
      if (totalMarks >= 45 && totalMarks <= 48) {
        return { status: "General Grade", scholarship: true };
      } else if (totalMarks >= 49 && totalMarks <= 50) {
        return { status: "Talentpool Grade", scholarship: true };
      }
    }
    // For classes 6 to 8
    else if (classNumber >= 6 && classNumber <= 8) {
      if (totalMarks >= 75 && totalMarks < 80) {
        return { status: "General Grade", scholarship: true };
      } else if (totalMarks >= 80 && totalMarks <= 100) {
        return { status: "Talentpool Grade", scholarship: true };
      }
    }
    // For classes 9 to 10
    else if (classNumber >= 9 && classNumber <= 10) {
      if (totalMarks >= 75 && totalMarks < 80) {
        return { status: "General Grade", scholarship: true };
      } else if (totalMarks >= 80 && totalMarks <= 100) {
        return { status: "Talentpool Grade", scholarship: true };
      }
    }
    return { status: "Not Qualified", scholarship: false };
  };

  // Download result as PDF
  const downloadResultAsPDF = () => {
    const input = resultCardRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`dmf-result-${resultData?.scholarshipRollNumber}.pdf`);
    });
  };

  // Table data
  const resultTableData = [
    { key: "1", label: "নাম", value: resultData?.name || "-" },
    {
      key: "2",
      label: "শিক্ষা প্রতিষ্ঠান",
      value: resultData?.institute || "-",
    },
    {
      key: "3",
      label: "শ্রেণী",
      value: convertToBengali(resultData?.instituteClass) || "-",
    },
    {
      key: "4",
      label: "রোল নম্বর",
      value:
        convertToBengali(
          resultData?.resultDetails?.[0]?.scholarshipRollNumber
        ) || "-",
    },
    {
      key: "5",
      label: "সঠিক উত্তর",
      value:
        convertToBengali(resultData?.resultDetails?.[0]?.totalCorrectAns) ||
        "-",
    },
    {
      key: "6",
      label: "ভুল উত্তর",
      value:
        convertToBengali(resultData?.resultDetails?.[0]?.totalWrongAns) || "-",
    },
    {
      key: "7",
      label: "প্রাপ্ত নম্বর",
      value:
        convertToBengali(resultData?.resultDetails?.[0]?.totalMarks) || "-",
    },
    {
      key: "8",
      label: "স্ট্যাটাস",
      value: getScholarshipStatus().status,
    },
  ];

  const columns = [
    {
      title: "বিবরণ",
      dataIndex: "label",
      key: "label",
      width: "40%",
      render: (text) => (
        <Text className="tt" style={{ fontSize: "16px" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "ফলাফল",
      dataIndex: "value",
      key: "value",
      width: "60%",
      render: (text) => (
        <Text className="tt" style={{ fontSize: "16px" }}>
          {text}
        </Text>
      ),
    },
  ];

  // Scholarship criteria information
  const scholarshipCriteria = [
    {
      class: "৩য়-৫ম শ্রেণী",
      general: "৪৫-৪৮ নম্বর",
      talentpool: "৪৯-৫০ নম্বর",
    },
    {
      class: "৬ষ্ঠ-৮ম শ্রেণী",
      general: "৭৫-৭৯ নম্বর",
      talentpool: "৮০-১০০ নম্বর",
    },
    {
      class: "৯ম-১০ম শ্রেণী",
      general: "৭৫-৭৯ নম্বর",
      talentpool: "৮০-১০০ নম্বর",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 mx-0 xl:mx-24 ">
      {/* Header with white title */}
      <div className=" p-4 mb-6 rounded">
        <Title
          level={3}
          className="text-center text-white tt mb-0"
          style={{ fontSize: "24px" }}>
          দারুল মুত্তাক্বীন শিক্ষাবৃত্তি ফলাফল ২০২৫
        </Title>
      </div>

      {/* Challenge Notice */}
      <Alert
        message={
          <span className="tt" style={{ fontSize: "16px" }}>
            আপনার ফলাফল নিয়ে আপত্তি থাকলে এই{" "}
            <a
              href="https://ourdmf.xyz/contact"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1890ff", fontWeight: "bold" }}>
              লিংক
            </a>{" "}
            এ ক্লিক করে আপনার রোল নম্বর সহ মেসেজ পাঠান।
          </span>
        }
        type="info"
        showIcon
        className="mb-6"
      />

      {/* Scholarship Criteria Card */}
      <Card className="mb-6">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="scholarshipRollNumber"
            label={
              <span className="tt" style={{ fontSize: "16px" }}>
                শিক্ষাবৃত্তি রোল নম্বর
              </span>
            }
            rules={[{ required: true, message: "রোল নম্বর দিন" }]}>
            <Input
              placeholder="রোল নম্বর লিখুন"
              className="tt"
              size="large"
              style={{ fontSize: "16px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
              block
              style={{ height: "45px", fontSize: "16px" }}>
              ফলাফল দেখুন
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {Object.keys(resultData).length > 0 && (
        <Card>
          <div
            ref={resultCardRef}
            className="p-4 border border-gray-300 bg-white">
            {/* Header */}
            <div className="text-center mb-6">
              <Title level={4} className="tt mb-1" style={{ fontSize: "20px" }}>
                দারুল মুত্তাক্বীন ফাউন্ডেশন
              </Title>
              <Text className="tt" style={{ fontSize: "16px" }}>
                শিক্ষাবৃত্তি পরীক্ষা ২০২৫ - ফলাফল
              </Text>
              <Divider className="my-3 bg-gray-300" />
            </div>

            {/* Result Table */}
            <Table
              columns={columns}
              dataSource={resultTableData}
              pagination={false}
              bordered
              size="small"
              className="mb-6"
            />

            {/* Islamic Messages based on scholarship status */}
            {getScholarshipStatus().scholarship ? (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-600">
                <Title
                  level={5}
                  className="tt text-green-800"
                  style={{ fontSize: "18px" }}>
                  <span className="text-xl">🎉</span> মাবরুক! আপনি শিক্ষাবৃত্তি
                  পেয়েছেন
                </Title>
                <Text className="tt block" style={{ fontSize: "16px" }}>
                  <strong>কুরআনুল কারীম:</strong> "যে ব্যক্তি আল্লাহকে ভয় করে,
                  আল্লাহ তার জন্য উত্তরণের পথ বের করে দেন এবং তাকে তার ধারণাতীত
                  জায়গা থেকে রিজিক দান করেন।" (সূরা তালাক: ২-৩)
                </Text>
                <Text className="tt block mt-2" style={{ fontSize: "16px" }}>
                  <strong>হাদীস:</strong> "যখন আল্লাহ তাআলা কোন বান্দার কল্যাণ
                  চান, তখন তিনি তাকে দ্বীনের বুঝ দান করেন।" (বুখারী, হাদীস: ৭১)
                </Text>
                <Text className="tt block mt-2" style={{ fontSize: "16px" }}>
                  আপনার এই সাফল্য আল্লাহর বিশেষ রহমত। এটাকে কেবলই দুনিয়াবী
                  সাফল্য মনে না করে আখিরাতের সাফল্য অর্জনের মাধ্যম হিসেবে গ্রহণ
                  করুন। জ্ঞানার্জনকে ইবাদত হিসেবে গণ্য করে আরও বেশি করে আল্লাহর
                  সন্তুষ্টি অর্জনের চেষ্টা করুন।
                </Text>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <Title
                  level={5}
                  className="tt text-blue-800"
                  style={{ fontSize: "18px" }}>
                  <span className="text-xl">🤲</span> আল্লাহর উপর ভরসা রাখুন
                </Title>
                <Text className="tt block" style={{ fontSize: "16px" }}>
                  <strong>হাদীস:</strong> "মুমিনের বিষয়টি আশ্চর্যজনক! তার সকল
                  কাজই ভালো। এটি শুধুমাত্র মুমিনের জন্যই প্রযোজ্য। যদি সে সুখ
                  পায়, সে শুকরিয়া আদায় করে, আর তা তার জন্য কল্যাণকর হয়। আর
                  যদি সে কষ্ট পায়, সে ধৈর্য ধারণ করে, আর সেটাও তার জন্য
                  কল্যাণকর হয়।" (সহীহ মুসলিম, হাদীস: ২৯৯৯)
                </Text>
                <Text className="tt block mt-2" style={{ fontSize: "16px" }}>
                  <strong>কুরআনুল কারীম:</strong> "নিশ্চয়ই কষ্টের সাথে স্বস্তি
                  আছে। নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।" (সূরা আল-ইনশিরাহ: ৫-৬)
                </Text>
                <Text className="tt block mt-2" style={{ fontSize: "16px" }}>
                  এইবার আপনি শিক্ষাবৃত্তি পেতে পারেননি, কিন্তু ইনশাআল্লাহ
                  ভবিষ্যতে আরও ভালো করার সুযোগ আছে। আল্লাহর উপর ভরসা রাখুন এবং
                  নিয়তকে শুদ্ধ রাখুন। জ্ঞানার্জন কোনো প্রতিযোগিতা নয়, বরং এটি
                  আল্লাহর সন্তুষ্টি অর্জনের মাধ্যম।
                </Text>
              </div>
            )}

            {/* Footer */}
            <Divider className="my-3 bg-gray-300" />
            <div className="text-center">
              <Text className="block text-xs mt-1">
                © 2025 Darul Muttakin Foundation
              </Text>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={downloadResultAsPDF}
              className="border border-gray-400"
              style={{ height: "45px", fontSize: "16px" }}>
              ফলাফল ডাউনলোড করুন
            </Button>
          </div>
        </Card>
      )}
      <Card
        title={
          <span className="tt" style={{ fontSize: "20px" }}>
            শিক্ষাবৃত্তি প্রাপ্তির মানদণ্ড
          </span>
        }
        className="mb-6">
        <Table
          columns={[
            {
              title: (
                <span className="tt" style={{ fontSize: "16px" }}>
                  শ্রেণী
                </span>
              ),
              dataIndex: "class",
              key: "class",
              render: (text) => (
                <Text className="tt" style={{ fontSize: "16px" }}>
                  {text}
                </Text>
              ),
            },
            {
              title: (
                <span className="tt" style={{ fontSize: "16px" }}>
                  সাধারণ গ্রেড
                </span>
              ),
              dataIndex: "general",
              key: "general",
              render: (text) => (
                <Text className="tt" style={{ fontSize: "16px" }}>
                  {text}
                </Text>
              ),
            },
            {
              title: (
                <span className="tt" style={{ fontSize: "16px" }}>
                  ট্যালেন্টপুল গ্রেড
                </span>
              ),
              dataIndex: "talentpool",
              key: "talentpool",
              render: (text) => (
                <Text className="tt" style={{ fontSize: "16px" }}>
                  {text}
                </Text>
              ),
            },
          ]}
          dataSource={scholarshipCriteria}
          pagination={false}
          size="small"
          bordered
        />
        <Text className="tt block mt-4" style={{ fontSize: "16px" }}>
          <strong>নোট:</strong> উপরোক্ত নম্বর প্রাপ্ত শিক্ষার্থীরা শিক্ষাবৃত্তি
          পাবেন।
        </Text>
      </Card>
    </div>
  );
};

export default ResultPage;
