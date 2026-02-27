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

// Normalize roll: DMS26580F / DMS26580M → DMS26580; DMS26580 stays as is
const normalizeRollNumber = (roll) => {
  if (!roll || typeof roll !== "string") return roll?.trim() ?? "";
  const trimmed = roll.trim();
  if (trimmed.length < 2) return trimmed;
  const last = trimmed.slice(-1).toUpperCase();
  if (last === "F" || last === "M") return trimmed.slice(0, -1).trim();
  return trimmed;
};

// Function to convert numbers to Bengali numerals
const convertToBengali = (number) => {
  const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(number).replace(/\d/g, (digit) => bengaliNumerals[digit]);
};

// Normalize class (e.g. "Six", "7", "Eleven") to a numeric value
const normalizeClassToNumber = (className) => {
  if (!className) return null;
  const classStr = className.toString().toLowerCase().trim();

  // Handle numeric prefix like "6", "7th", "10 science"
  const numMatch = classStr.match(/^(\d+)/);
  if (numMatch) {
    return parseInt(numMatch[1], 10);
  }

  // Handle text class names
  const classMap = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
  };

  return classMap[classStr] ?? null;
};

// CSS for status highlight and result joy animation
const resultPageStyles = `
  @keyframes statusGlow {
    0%, 100% { filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.6)); }
    50% { filter: drop-shadow(0 0 12px rgba(34, 197, 94, 0.9)); }
  }
  @keyframes resultPop {
    0% { opacity: 0; transform: scale(0.96); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes sparkle {
    0%, 100% { opacity: 0.4; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes fireworkBurst {
    0% { opacity: 0; transform: scale(0) rotate(0deg); }
    30% { opacity: 1; transform: scale(1.1) rotate(0deg); }
    70% { opacity: 0.9; transform: scale(1) rotate(0deg); }
    100% { opacity: 0; transform: scale(1.3) rotate(0deg); }
  }
  @keyframes fireworkRay {
    0% { opacity: 0; transform: scale(0.5); }
    40% { opacity: 0.9; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.2); }
  }
  .result-card-enter { animation: resultPop 0.5s ease-out forwards; }
  .atos-left, .atos-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 56px;
    height: 56px;
    pointer-events: none;
    z-index: 1;
  }
  .atos-left { left: -28px; }
  .atos-right { right: -28px; transform: translateY(-50%) scaleX(-1); }
  .atos-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: fireworkBurst 2s ease-out infinite;
  }
  .atos-dot:nth-child(1) { left: 50%; top: 50%; margin: -4px 0 0 -4px; background: #f59e0b; animation-delay: 0s; }
  .atos-dot:nth-child(2) { left: 20%; top: 15%; background: #10b981; animation-delay: 0.15s; }
  .atos-dot:nth-child(3) { left: 75%; top: 20%; background: #ef4444; animation-delay: 0.3s; }
  .atos-dot:nth-child(4) { left: 15%; top: 70%; background: #8b5cf6; animation-delay: 0.45s; }
  .atos-dot:nth-child(5) { left: 80%; top: 75%; background: #ec4899; animation-delay: 0.6s; }
  .atos-dot:nth-child(6) { left: 50%; top: 5%; background: #06b6d4; animation-delay: 0.2s; }
  .atos-dot:nth-child(7) { left: 50%; top: 90%; background: #eab308; animation-delay: 0.35s; }
  .atos-dot:nth-child(8) { left: 5%; top: 50%; background: #f97316; animation-delay: 0.5s; }
  .atos-dot:nth-child(9) { left: 92%; top: 50%; background: #14b8a6; animation-delay: 0.25s; }
  .atos-emoji {
    position: absolute;
    font-size: 22px;
    animation: fireworkBurst 2.2s ease-out infinite;
  }
  .atos-left .atos-emoji:nth-child(10) { left: 50%; top: 50%; transform: translate(-50%, -50%); animation-delay: 0.1s; }
  .atos-left .atos-emoji:nth-child(11) { left: 10%; top: 25%; animation-delay: 0.4s; }
  .atos-left .atos-emoji:nth-child(12) { left: 25%; top: 80%; animation-delay: 0.7s; }
  .atos-right .atos-emoji:nth-child(10) { left: 50%; top: 50%; transform: translate(-50%, -50%); animation-delay: 0.1s; }
  .atos-right .atos-emoji:nth-child(11) { right: 10%; left: auto; top: 25%; animation-delay: 0.4s; }
  .atos-right .atos-emoji:nth-child(12) { right: 25%; left: auto; top: 80%; animation-delay: 0.7s; }
  .result-selected-viva-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    font-size: 16px;
    color: #047857;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.25) 100%);
    padding: 4px 12px;
    border-radius: 8px;
    border: 1px solid rgba(16, 185, 129, 0.4);
    animation: statusGlow 2s ease-in-out infinite;
    box-shadow: 0 0 14px rgba(16, 185, 129, 0.35);
  }
  .sparkle-dot { animation: sparkle 1.2s ease-in-out infinite; }
  .sparkle-dot:nth-child(2) { animation-delay: 0.2s; }
  .sparkle-dot:nth-child(3) { animation-delay: 0.4s; }
  .sparkle-dot:nth-child(4) { animation-delay: 0.6s; }
  .sparkle-dot:nth-child(5) { animation-delay: 0.8s; }
`;

// Written result: published 2 March 2 PM; search allowed from 2 March 12 PM
const RESULT_PUBLISH_LABEL = "লিখিত পরীক্ষার ফলাফল প্রকাশ — ২ মার্চ দুপুর ২টায়";
const SEARCH_AVAILABLE_FROM = new Date(2026, 2, 2, 12, 0, 0); // 2 March 2026, 12:00 PM

const ResultPage = () => {
  const [resultData, setResultData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const resultCardRef = useRef(null);
  const [form] = Form.useForm();

  const isSearchAllowed = () => new Date() >= SEARCH_AVAILABLE_FROM;

  const onFinish = async (values) => {
    if (!isSearchAllowed()) {
      toast.warning("লিখিত পরীক্ষার ফলাফল ২ মার্চ দুপুর ২টায় প্রকাশিত হবে। দুপুর ১২টার পর খুঁজতে পারবেন।");
      return;
    }
    try {
      setLoading(true);
      const normalizedRoll = normalizeRollNumber(values?.scholarshipRollNumber);
      const res = await coreAxios.get(`search-result/${normalizedRoll}`);
      if (res?.status === 200) {
        setLoading(false);
        toast.success("Result fetched successfully");
        form.resetFields();
        setResultData(res?.data);
        setShowCelebration(true);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message || "Error fetching result");
    }
  };

  // correctAnswer is used for both সঠিক উত্তর and প্রাপ্ত নম্বর
  const correctAnswer =
    resultData?.correctAnswer ?? resultData?.resultDetails?.[0]?.correctAnswer;
  const classNumber = normalizeClassToNumber(resultData?.instituteClass) || 0;
  // For class 6–12 total = 100, others = 45
  const totalMarksForExam =
    classNumber >= 6 && classNumber <= 12 ? 100 : 45;
  const wrongAnswer =
    totalMarksForExam != null && correctAnswer != null
      ? Math.max(0, totalMarksForExam - Number(correctAnswer))
      : null;

  // Viva selection condition and message (70% or above of total marks)
  const getVivaStatus = () => {
    if (!totalMarksForExam || correctAnswer == null) {
      return { status: "No Result", selected: false, percentage: null };
    }
    const obtained = Number(correctAnswer);
    const percentage = (obtained / totalMarksForExam) * 100;
    if (percentage >= 70) {
      return {
        status: "Selected for Viva",
        selected: true,
        percentage,
      };
    }
    return {
      status: "Not Selected for Viva",
      selected: false,
      percentage,
    };
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
      pdf.save(`dmf-result-${resultData?.scholarshipRollNumber || resultData?.resultDetails?.[0]?.scholarshipRollNumber || "result"}.pdf`);
    });
  };

  // Table data: correctAnswer for সঠিক উত্তর & প্রাপ্ত নম্বর; wrongAnswer = totalMarksForExam - correctAnswer
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
      value: resultData?.instituteClass || "-",
    },
    {
      key: "4",
      label: "রোল নম্বর",
      value:
        resultData?.scholarshipRollNumber ||
        resultData?.resultDetails?.[0]?.scholarshipRollNumber ||
        "-",
    },
    {
      key: "5",
      label: "মোট নম্বর",
      value:
        totalMarksForExam != null ? String(totalMarksForExam) : "-",
    },
    {
      key: "6",
      label: "সঠিক উত্তর",
      value:
        correctAnswer != null ? String(correctAnswer) : "-",
    },
    {
      key: "7",
      label: "ভুল উত্তর",
      value: wrongAnswer != null ? String(wrongAnswer) : "-",
    },
    {
      key: "8",
      label: "প্রাপ্ত নম্বর",
      value:
        correctAnswer != null ? String(correctAnswer) : "-",
    },
    {
      key: "9",
      label: "স্ট্যাটাস",
      value: getVivaStatus().status,
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
      render: (text, record) => {
        if (record?.label === "স্ট্যাটাস" && text === "Selected for Viva") {
          return (
            <span className="result-selected-viva-badge tt">
              ✨ {text} ✨
            </span>
          );
        }
        return (
          <Text className="tt" style={{ fontSize: "16px" }}>
            {text}
          </Text>
        );
      },
    },
  ];

  const isSelectedForViva = getVivaStatus().selected;

  return (
    <div className="bg-gray-50 min-h-screen p-4 mx-0 xl:mx-24 ">
      <style>{resultPageStyles}</style>
      {/* Header with white title */}
      <div className=" p-4 mb-6 rounded">
        <Title
          level={3}
          className="text-center text-white tt mb-0"
          style={{ fontSize: "24px" }}>
          দারুল মুত্তাক্বীন শিক্ষাবৃত্তি ফলাফল ২০২৬
        </Title>
        <p className="text-center text-white/90 tt mt-2 mb-0" style={{ fontSize: "15px" }}>
          {RESULT_PUBLISH_LABEL}
        </p>
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
              disabled={!isSearchAllowed()}
              block
              style={{ height: "45px", fontSize: "16px" }}>
              ফলাফল দেখুন
            </Button>
            {!isSearchAllowed() && (
              <p className="tt text-center text-gray-500 mt-2 mb-0" style={{ fontSize: "14px" }}>
                ২ মার্চ দুপুর ১২টার পর খুঁজতে পারবেন
              </p>
            )}
          </Form.Item>
        </Form>
      </Card>

      {Object.keys(resultData).length > 0 && (
        <Card className={`overflow-visible ${showCelebration ? "result-card-enter" : ""}`}>
          <div
            ref={resultCardRef}
            className="p-4 border border-gray-300 bg-white relative overflow-visible">
            {isSelectedForViva && (
              <>
                <div className="absolute top-2 right-3 flex gap-1 text-lg select-none" style={{ pointerEvents: "none" }}>
                  <span className="sparkle-dot">✨</span>
                  <span className="sparkle-dot">⭐</span>
                  <span className="sparkle-dot">✨</span>
                  <span className="sparkle-dot">🎉</span>
                  <span className="sparkle-dot">✨</span>
                </div>
                {/* Left side atos baji (fireworks) */}
                <div className="atos-left select-none">
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-emoji">🎆</span>
                  <span className="atos-emoji">✨</span>
                  <span className="atos-emoji">🎇</span>
                </div>
                {/* Right side atos baji (fireworks) */}
                <div className="atos-right select-none">
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-dot" />
                  <span className="atos-emoji">🎆</span>
                  <span className="atos-emoji">✨</span>
                  <span className="atos-emoji">🎇</span>
                </div>
              </>
            )}
            {/* Header */}
            <div className="text-center mb-6">
              <Title level={4} className="tt mb-1" style={{ fontSize: "20px" }}>
                দারুল মুত্তাক্বীন ফাউন্ডেশন
              </Title>
              <Text className="tt" style={{ fontSize: "16px" }}>
                শিক্ষাবৃত্তি পরীক্ষা ২০২৬ - ফলাফল
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

            {/* Messages based on viva selection status */}
            {getVivaStatus().selected ? (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-600">
                <Title
                  level={5}
                  className="tt text-green-800"
                  style={{ fontSize: "18px" }}>
                  <span className="text-xl">🎉</span> মাবরুক! আপনি ভাইভা পরীক্ষার
                  জন্য নির্বাচিত হয়েছেন
                </Title>
                <Text className="tt block" style={{ fontSize: "16px" }}>
                  ইনশাআল্লাহ আগামী শুক্রবার অনুষ্ঠিতব্য ভাইভা পরীক্ষায় অংশগ্রহণ
                  করার জন্য আপনার রেজাল্ট যথেষ্ট ভালো হয়েছে (কমপক্ষে ৭০% নম্বর)।
                </Text>
                <Text className="tt block mt-2" style={{ fontSize: "16px" }}>
                  <strong>দয়া করে নোট করুন:</strong> নির্ধারিত তারিখ ও সময়ে
                  প্রয়োজনীয় কাগজপত্রসহ উপস্থিত থাকবেন।
                </Text>
                <Text className="tt block mt-2" style={{ fontSize: "16px" }}>
                  আল্লাহ তাআলা আপনার জন্য আরও বরকতময় ভবিষ্যৎ নির্ধারণ করুন। আমীন।
                </Text>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                <Title
                  level={5}
                  className="tt text-blue-800"
                  style={{ fontSize: "18px" }}>
                  <span className="text-xl">🤲</span> এইবার ভাইভার জন্য নির্বাচিত
                  হননি
                </Title>
                <Text className="tt block" style={{ fontSize: "16px" }}>
                  আপনার এই রেজাল্ট অনুযায়ী আপনি ভাইভা পরীক্ষার জন্য নির্বাচিত
                  হননি (৭০% এর কম নম্বর)। তবে এটি আপনার জন্য শেষ নয়, বরং
                  ভবিষ্যতে আরও ভালো করার একটি সুযোগ।
                </Text>
                <Text className="tt block mt-2" style={{ fontSize: "16px" }}>
                  নিয়তকে শুদ্ধ রেখে জ্ঞানার্জনের প্রচেষ্টা চালিয়ে যান এবং
                  আল্লাহর উপর ভরসা রাখুন।
                </Text>
                <Text className="tt block mt-2" style={{ fontSize: "16px" }}>
                  ইনশাআল্লাহ পরবর্তীতে আরও ভালোভাবে প্রস্তুতি নিলে আল্লাহ তাআলা
                  আপনাকে উত্তম ফল দান করবেন।
                </Text>
              </div>
            )}

            {/* Footer */}
            <Divider className="my-3 bg-gray-300" />
            <div className="text-center">
              <Text className="block text-xs mt-1">
                © 2026 Darul Muttakin Foundation
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
    </div>
  );
};

export default ResultPage;
