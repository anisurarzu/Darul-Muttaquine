import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Typography,
  Input,
  Form,
  Row,
  Col,
  Alert,
  Spin,
  QRCode,
} from "antd";
import { DownloadOutlined, SearchOutlined, TrophyOutlined, CrownOutlined, ReloadOutlined } from "@ant-design/icons";
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

// CSS for result badge and leaderboard (no animations)
const resultPageStyles = `
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
    box-shadow: 0 0 14px rgba(16, 185, 129, 0.35);
  }
  /* Institute Leaderboard */
  .leaderboard-row {
    padding: 1.5px;
    border-radius: 10px;
    margin-bottom: 8px;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .leaderboard-row:last-child { margin-bottom: 0; }
  .leaderboard-row.lb-soft-0 { background: linear-gradient(135deg, rgba(167, 243, 208, 0.55) 0%, rgba(187, 247, 208, 0.45) 100%); }
  .leaderboard-row.lb-soft-0:hover { box-shadow: 0 1px 6px rgba(34, 197, 94, 0.08); }
  .leaderboard-row.lb-soft-1 { background: linear-gradient(135deg, rgba(165, 243, 252, 0.5) 0%, rgba(207, 250, 254, 0.45) 100%); }
  .leaderboard-row.lb-soft-1:hover { box-shadow: 0 1px 6px rgba(6, 182, 212, 0.08); }
  .leaderboard-row.lb-soft-2 { background: linear-gradient(135deg, rgba(196, 181, 253, 0.45) 0%, rgba(221, 214, 254, 0.4) 100%); }
  .leaderboard-row.lb-soft-2:hover { box-shadow: 0 1px 6px rgba(129, 140, 248, 0.08); }
  .leaderboard-row.lb-soft-3 { background: linear-gradient(135deg, rgba(253, 186, 116, 0.4) 0%, rgba(254, 215, 170, 0.35) 100%); }
  .leaderboard-row.lb-soft-3:hover { box-shadow: 0 1px 6px rgba(251, 146, 60, 0.08); }
  .leaderboard-row.lb-soft-4 { background: linear-gradient(135deg, rgba(167, 243, 208, 0.4) 0%, rgba(204, 251, 241, 0.4) 100%); }
  .leaderboard-row.lb-soft-4:hover { box-shadow: 0 1px 6px rgba(20, 184, 166, 0.08); }
  .leaderboard-row-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    background: #fff;
  }
  .leaderboard-detail-name {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
    line-height: 1.3;
  }
  .leaderboard-detail-stats { display: flex; flex-wrap: wrap; gap: 6px 8px; font-size: 11px; }
  .leaderboard-detail-stat {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 6px;
    color: #fff;
    font-weight: 500;
  }
  .leaderboard-detail-stat .label { font-size: 10px; opacity: 0.95; }
  .leaderboard-detail-stat .value { font-weight: 700; font-size: 11px; }
  .leaderboard-detail-stat.s-0 { background: #059669; }
  .leaderboard-detail-stat.s-1 { background: #0891b2; }
  .leaderboard-detail-stat.s-2 { background: #7c3aed; }
  .leaderboard-detail-stat.s-3 { background: #d97706; }
  .leaderboard-detail-stat.s-4 { background: #0d9488; }
  .leaderboard-rank-badge {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    color: #fff;
    background: #94a3b8;
  }
  .leaderboard-rank-badge.top { background: #059669; }
  /* PDF export: smaller standard text so download fits and looks clean */
  .pdf-export .result-pdf-header-org { font-size: 14px !important; }
  .pdf-export .result-pdf-header-title { font-size: 16px !important; }
  .pdf-export .result-pdf-header-sub { font-size: 13px !important; }
  .pdf-export .result-pdf-roll-label { font-size: 12px !important; }
  .pdf-export .result-pdf-roll-digit { font-size: 18px !important; }
  .pdf-export .result-pdf-table { font-size: 12px !important; }
  .pdf-export .result-pdf-table td { font-size: 12px !important; padding: 6px 10px !important; }
  .pdf-export .result-pdf-msg-title { font-size: 14px !important; }
  .pdf-export .result-pdf-msg-body { font-size: 11px !important; }
  .pdf-export .result-pdf-footer { font-size: 10px !important; }
  .pdf-export .result-pdf-logo { height: 48px !important; max-height: 48px !important; }
  .pdf-export .result-pdf-qr { width: 48px !important; height: 48px !important; }
  .pdf-export .result-pdf-qr svg { width: 48px !important; height: 48px !important; }
  .pdf-export .border-b-2 { padding-bottom: 8px !important; margin-bottom: 8px !important; }
  .pdf-export .p-6 { padding: 12px 16px !important; }
  .pdf-export .mb-6 { margin-bottom: 10px !important; }
  .pdf-export .mb-4 { margin-bottom: 8px !important; }
  .pdf-export .result-selected-viva-badge { font-size: 12px !important; padding: 2px 8px !important; }
  @media print {
    body, .result-page-root { margin: 0 !important; padding: 0 !important; min-height: 0 !important; height: auto !important; background: #fff !important; }
    .no-print { display: none !important; }
    .result-page-root > *:not(.result-print-card) { display: none !important; }
    .result-print-card { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
    .result-sheet-print { page-break-inside: avoid; }
  }
`;

// Written result: published 2 March 2 PM (search always open)
const RESULT_PUBLISH_LABEL = "লিখিত পরীক্ষার ফলাফল প্রকাশ — ২ মার্চ দুপুর ২টায়";
const DMF_LOGO = "https://i.ibb.co/F4XV8dKL/1.png";
// ভাইভা স্থান (শুধু ভাইভায় সিলেক্টদের জন্য দেখানো হয়)
const VIVA_LOCATION_LINE1 = "দারুল মুত্তাক্বীন ফাউন্ডেশন";
const VIVA_LOCATION_LINE2 = "হতেয়া রোড (তক্তারচালা দাখিল মাদ্রাসার পূর্ব পাশে)";

// শ্রেণী অনুযায়ী ভাইভা রুম ও সময় (অ্যানেক্স অনুযায়ী)
const getVivaSlotByClass = (classNumber) => {
  const n = classNumber != null ? Number(classNumber) : 0;
  if (n >= 9 && n <= 12) return { room: "রুম: ১", timeSlot: "০৯:০০ - ১০:৩০", roomEn: "Room 1" };
  if (n === 5) return { room: "রুম: ২", timeSlot: "০৯:০০ - ১০:০০", roomEn: "Room 2" };
  if (n >= 6 && n <= 8) return { room: "রুম: ৩", timeSlot: "১০:৩০ - ১১:৩০", roomEn: "Room 3" };
  if (n >= 3 && n <= 4) return { room: "রুম: ২", timeSlot: "১০:৩০ - ১১:৩০", roomEn: "Room 2" }; // Three, Four
  if (n === 2) return { room: "রুম: ৩", timeSlot: "০৯:০০ - ১০:৩০", roomEn: "Room 3" };
  return { room: "রুম: ৩", timeSlot: "০৯:০০ - ১০:৩০", roomEn: "Room 3" };
};

// Next Friday's date (শুক্রবার = 5)
const BENGALI_MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
const getNextFridayDate = () => {
  const d = new Date();
  let daysUntil = (5 - d.getDay() + 7) % 7;
  if (daysUntil === 0) daysUntil = 7;
  const next = new Date(d);
  next.setDate(d.getDate() + daysUntil);
  const day = next.getDate();
  const month = BENGALI_MONTHS[next.getMonth()];
  const year = next.getFullYear();
  const dayBn = convertToBengali(day);
  const yearBn = convertToBengali(year);
  return `শুক্রবার, ${dayBn} ${month} ${yearBn}`;
};

const ResultPage = () => {
  const [resultData, setResultData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const resultCardRef = useRef(null);
  const [form] = Form.useForm();
  const [leaderboard, setLeaderboard] = useState({
    class3To5: { totalApplications: 0, totalNumberOfInstitutions: 0, institutes: [] },
    others: { totalApplications: 0, totalNumberOfInstitutions: 0, institutes: [] },
  });
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [isPdfExport, setIsPdfExport] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLeaderboardLoading(true);
      const res = await coreAxios.get("/institute-wise-stats");
      if (res?.status === 200 && res?.data?.success && res?.data?.data) {
        const d = res.data.data;
        setLeaderboard({
          class3To5: d.class3To5 ?? { totalApplications: 0, totalNumberOfInstitutions: 0, institutes: [] },
          others: d.others ?? { totalApplications: 0, totalNumberOfInstitutions: 0, institutes: [] },
        });
      }
    } catch (err) {
      console.error("Institute leaderboard fetch error:", err);
      setLeaderboard({
        class3To5: { totalApplications: 0, totalNumberOfInstitutions: 0, institutes: [] },
        others: { totalApplications: 0, totalNumberOfInstitutions: 0, institutes: [] },
      });
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const isSearchAllowed = () => true;

  const onFinish = async (values) => {
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

  // Viva: class 6–10 → 65%; other classes → 75%. Interview slot only when selected.
  const getVivaStatus = () => {
    if (!totalMarksForExam || correctAnswer == null) {
      return { status: "No Result", selected: false, percentage: null, threshold: null };
    }
    const obtained = Number(correctAnswer);
    const percentage = (obtained / totalMarksForExam) * 100;
    const isClass6To10 = classNumber >= 6 && classNumber <= 10;
    const threshold = isClass6To10 ? 65 : 75;
    if (percentage >= threshold) {
      return {
        status: "Selected for Viva",
        selected: true,
        percentage,
        threshold,
      };
    }
    return {
      status: "Not Selected for Viva",
      selected: false,
      percentage,
      threshold,
    };
  };

  // Download result as PDF: use smaller standard text for a clean, compact PDF
  const downloadResultAsPDF = () => {
    const input = resultCardRef.current;
    if (!input) return;
    setIsPdfExport(true);
    const finish = () => setIsPdfExport(false);
    requestAnimationFrame(() => {
      setTimeout(() => {
        html2canvas(input, { useCORS: true }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`dmf-result-${resultData?.scholarshipRollNumber || resultData?.resultDetails?.[0]?.scholarshipRollNumber || "result"}.pdf`);
        }).finally(finish);
      }, 120);
    });
  };

  const rollDisplay =
    resultData?.scholarshipRollNumber ||
    resultData?.resultDetails?.[0]?.scholarshipRollNumber ||
    "";
  const isSelectedForViva = getVivaStatus().selected;
  const vivaSlot = getVivaSlotByClass(classNumber);

  return (
    <div className="result-page-root bg-gray-50 min-h-screen p-4 mx-0 xl:mx-24">
      <style>{resultPageStyles}</style>
      {/* Header with white title */}
      <div className="no-print p-4 mb-6 rounded">
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

      {/* Objection / Recheck Notice */}
      <Alert
        className="no-print mb-6"
        message={
          <div className="tt" style={{ fontSize: "16px" }}>
            <div className="mb-1">
              আপনার ফলাফল নিয়ে আপত্তি থাকলে আমাদের ইমেইল করুন{" "}
              <strong style={{ color: "#0ea5e9" }}>ourdmf@gmail.com</strong>-এ আপনার রোল নম্বর সহ লিখে পাঠান।
            </div>
            <div style={{ fontSize: "14px", color: "#475569", marginTop: "6px" }}>
              ফলাফল প্রকাশের পর রিচেক আবেদনের সময় থাকবে ২ (দুই) দিন। এর পর আবেদন বিবেচনা করা হবে না।
            </div>
          </div>
        }
        type="info"
        showIcon
      />

      {/* Scholarship Criteria Card */}
      <Card className="no-print mb-6">
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
        <Card className="result-print-card overflow-visible">
          <div
            ref={resultCardRef}
            className={`max-w-4xl mx-auto bg-white border-2 border-green-600 relative overflow-visible print:border-green-700 result-sheet-print ${isPdfExport ? "pdf-export" : ""}`}>
            <div className="p-6 print:p-6">
              {/* Header - same as Admit Card */}
              <div className="border-b-2 border-green-600 pb-5 mb-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <img src={DMF_LOGO} alt="DMF Logo" className="result-pdf-logo h-[80px] object-contain" crossOrigin="anonymous" />
                  </div>
                  <div className="flex-1 text-center">
                    <p className="result-pdf-header-org text-xl md:text-2xl font-bold text-green-800 mb-1 tt">দারুল মুত্তাক্বীন ফাউন্ডেশন</p>
                    <h1 className="result-pdf-header-title text-2xl md:text-3xl font-bold text-green-800 tt">শিক্ষাবৃত্তি পরীক্ষা ২০২৬</h1>
                    <p className="result-pdf-header-sub text-lg font-semibold text-green-700 tt mt-1">ফলাফল</p>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <QRCode type="svg" value={rollDisplay || "DMF2026"} size={80} className="result-pdf-qr border-2 border-green-600 p-1" />
                  </div>
                </div>
              </div>

              {/* Roll Number - large display like Admit Card */}
              {rollDisplay && (
                <div className="text-center mb-6">
                  <div className="flex justify-center items-baseline gap-2 flex-wrap">
                    <p className="result-pdf-roll-label font-semibold text-green-700 tt" style={{ lineHeight: "1", paddingTop: "8px", fontSize: "18px" }}>রোল নম্বর -</p>
                    {String(rollDisplay).split("").map((ch, idx) => (
                      <span key={idx} className="result-pdf-roll-digit font-bold text-green-800 border-2 border-green-600 px-3 py-2 bg-green-50 inline-flex items-center justify-center tt" style={{ lineHeight: "1", fontSize: "28px" }}>{ch}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Result table - Admit Card style green bordered */}
              <table className="result-pdf-table w-full text-lg border-2 border-green-600 tt mb-6" style={{ fontSize: "18px" }}>
                <tbody>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 w-2/5 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>নাম:</td>
                    <td className="py-3 px-4 font-semibold" style={{ fontSize: "18px" }}>{resultData?.name || "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>শিক্ষা প্রতিষ্ঠান:</td>
                    <td className="py-3 px-4" style={{ fontSize: "18px" }}>{resultData?.institute || "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>শ্রেণী:</td>
                    <td className="py-3 px-4" style={{ fontSize: "18px" }}>{resultData?.instituteClass || "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>রোল নম্বর:</td>
                    <td className="py-3 px-4 font-semibold" style={{ fontSize: "18px" }}>{rollDisplay || "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>মোট নম্বর:</td>
                    <td className="py-3 px-4" style={{ fontSize: "18px" }}>{totalMarksForExam != null ? String(totalMarksForExam) : "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>সঠিক উত্তর:</td>
                    <td className="py-3 px-4" style={{ fontSize: "18px" }}>{correctAnswer != null ? String(correctAnswer) : "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>ভুল উত্তর:</td>
                    <td className="py-3 px-4" style={{ fontSize: "18px" }}>{wrongAnswer != null ? String(wrongAnswer) : "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>প্রাপ্ত নম্বর:</td>
                    <td className="py-3 px-4 font-semibold" style={{ fontSize: "18px" }}>{correctAnswer != null ? String(correctAnswer) : "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>স্ট্যাটাস:</td>
                    <td className="py-3 px-4" style={{ fontSize: "18px" }}>
                      {isSelectedForViva ? (
                        <span className="result-selected-viva-badge tt font-semibold">✨ Selected for Viva ✨</span>
                      ) : (
                        <span className="tt">Not Selected for Viva</span>
                      )}
                    </td>
                  </tr>
                  {isSelectedForViva && (
                    <>
                      <tr className="border-b border-green-600">
                        <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "15px" }}>ভাইভা পরীক্ষার তারিখ ও সময়:</td>
                        <td className="py-3 px-4 font-semibold text-green-700" style={{ fontSize: "15px" }}>{getNextFridayDate()}, সকাল {vivaSlot.timeSlot}</td>
                      </tr>
                      <tr className="border-b border-green-600">
                        <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "15px" }}>ভাইভা রুম:</td>
                        <td className="py-3 px-4 font-semibold text-green-700" style={{ fontSize: "15px" }}>{vivaSlot.room}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "15px" }}>ভাইভা পরীক্ষার স্থান:</td>
                        <td className="py-3 px-4 font-semibold text-green-700" style={{ fontSize: "15px" }}>
                          {VIVA_LOCATION_LINE1}<br />{VIVA_LOCATION_LINE2}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>

              {/* Messages based on viva selection */}
              {getVivaStatus().selected ? (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-600 tt">
                  <Title level={5} className="result-pdf-msg-title tt text-green-800 mb-2" style={{ fontSize: "18px" }}><span className="text-xl">🎉</span> মাবরুক! আপনি ভাইভা পরীক্ষার জন্য নির্বাচিত হয়েছেন</Title>
                  <Text className="result-pdf-msg-body tt block" style={{ fontSize: "15px" }}>ইনশাআল্লাহ {getNextFridayDate()} অনুষ্ঠিতব্য ভাইভা পরীক্ষায় অংশগ্রহণ করার জন্য আপনার রেজাল্ট যথেষ্ট ভালো হয়েছে (কমপক্ষে {getVivaStatus().threshold}% নম্বর)।</Text>
                  <Text className="result-pdf-msg-body tt block mt-2" style={{ fontSize: "15px" }}>নির্ধারিত তারিখ ও সময়ে প্রয়োজনীয় কাগজপত্রসহ উপস্থিত থাকবেন। আল্লাহ তাআলা আপনার জন্য বরকতময় ভবিষ্যৎ নির্ধারণ করুন। আমীন।</Text>
                  <Text className="result-pdf-msg-body tt block mt-2" style={{ fontSize: "15px" }}><strong>যোগাযোগ:</strong> 01927920081 (আশিকুর রহমান), 01918737415 (সাইফুল্লাহ সাদী), 01838243941 (তানভীর)</Text>
                </div>
              ) : (
                <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 tt">
                  <Title level={5} className="result-pdf-msg-title tt text-blue-800 mb-2" style={{ fontSize: "20px" }}><span className="text-xl">🤲</span> এইবার ভাইভার জন্য নির্বাচিত হননি</Title>
                  <Text className="result-pdf-msg-body tt block" style={{ fontSize: "18px" }}>আপনার এই রেজাল্ট অনুযায়ী আপনি ভাইভা পরীক্ষার জন্য নির্বাচিত হননি (প্রয়োজনীয় নম্বরের চেয়ে কম)। নিয়তকে শুদ্ধ রেখে জ্ঞানার্জনের প্রচেষ্টা চালিয়ে যান এবং আল্লাহর উপর ভরসা রাখুন। ইনশাআল্লাহ পরবর্তীতে আরও ভালোভাবে প্রস্তুতি নিলে উত্তম ফল পাবেন।</Text>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 mt-4 border-t-2 border-green-600 text-center">
                <Text className="result-pdf-footer tt text-gray-600" style={{ fontSize: "16px" }}>© 2026 Darul Muttaquine Foundation</Text>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-4 no-print">
            <Button type="default" icon={<DownloadOutlined />} onClick={downloadResultAsPDF} className="border-2 border-green-600 text-green-800 hover:border-green-700 hover:text-green-900" style={{ height: "45px", fontSize: "16px" }}>
              ফলাফল ডাউনলোড করুন
            </Button>
          </div>
        </Card>
      )}

      {/* Institute Leaderboard — ভাইভা পরীক্ষার জন্য, ভাইভার পর অটো আপডেট */}
      <Card
        className="no-print mb-6 overflow-hidden"
        style={{
          borderRadius: 16,
          border: "1px solid rgba(5, 150, 105, 0.25)",
          background: "linear-gradient(145deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)",
          boxShadow: "0 2px 12px rgba(5, 150, 105, 0.06)",
        }}
        title={
          <div className="tt w-full">
            <div className="flex items-center justify-center gap-2" style={{ fontSize: "17px" }}>
              <TrophyOutlined style={{ color: "#059669" }} />
              প্রতিষ্ঠানভিত্তিক লিডারবোর্ড
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined spin={leaderboardLoading} />}
                onClick={() => fetchLeaderboard()}
                disabled={leaderboardLoading}
                style={{ marginLeft: 4 }}
              >
                রিফ্রেশ
              </Button>
            </div>
            <p className="tt text-center mb-0 mt-1.5 text-gray-500" style={{ fontSize: "12px" }}>
              কেবল ভাইভা পরীক্ষার জন্য। ভাইভা পরীক্ষার পর এটি স্বয়ংক্রিয়ভাবে আপডেট হবে।
            </p>
          </div>
        }>
        <Spin spinning={leaderboardLoading} tip="লোড হচ্ছে...">
          {!leaderboardLoading && (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div className="rounded-lg border border-gray-200 bg-white p-3" style={{ minHeight: 260 }}>
                  <div className="tt flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-800" style={{ fontSize: "14px" }}>৩য়–৫ম শ্রেণী</span>
                    <Text type="secondary" style={{ fontSize: 11 }}>{leaderboard.class3To5?.totalApplications ?? 0} আবেদন · {leaderboard.class3To5?.totalNumberOfInstitutions ?? 0} প্রতিষ্ঠান</Text>
                  </div>
                  {leaderboard.class3To5?.institutes?.length > 0 ? (
                    <div className="max-h-[380px] overflow-y-auto -mx-1 px-1">
                      {leaderboard.class3To5.institutes.map((inst, idx) => (
                        <div key={`c35-${inst.rank}-${inst.institute}`} className={`leaderboard-row tt lb-soft-${idx % 5}`}>
                          <div className="leaderboard-row-inner">
                            <div className="flex-1 min-w-0">
                              <div className="leaderboard-detail-name">{inst.institute || "—"}</div>
                              <div className="leaderboard-detail-stats">
                                <span className="leaderboard-detail-stat s-0"><span className="label">আবেদন</span><span className="value">{inst.applicationCount}</span></span>
                                <span className="leaderboard-detail-stat s-1"><span className="label">উপস্থিত</span><span className="value">{inst.presentCount} ({inst.presentPercentOfOwn}%)</span></span>
                                <span className="leaderboard-detail-stat s-2"><span className="label">রেজাল্ট</span><span className="value">{inst.resultAddedRatioPercent}%</span></span>
                                <span className="leaderboard-detail-stat s-3"><span className="label">পাস</span><span className="value">{inst.passRatioPercent}%</span></span>
                                <span className="leaderboard-detail-stat s-4"><span className="label">৭০%+</span><span className="value">{inst.got70RatioPercent}%</span></span>
                              </div>
                            </div>
                            <div className={`leaderboard-rank-badge ${inst.rank <= 3 ? "top" : ""}`}>
                              {inst.rank === 1 ? <CrownOutlined style={{ fontSize: 16 }} /> : inst.rank}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12 text-gray-500 tt">কোন ডেটা নেই</div>
                  )}
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="rounded-lg border border-gray-200 bg-white p-3" style={{ minHeight: 260 }}>
                  <div className="tt flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-800" style={{ fontSize: "14px" }}>অন্যান্য (৬ষ্ঠ–১২)</span>
                    <Text type="secondary" style={{ fontSize: 11 }}>{leaderboard.others?.totalApplications ?? 0} আবেদন · {leaderboard.others?.totalNumberOfInstitutions ?? 0} প্রতিষ্ঠান</Text>
                  </div>
                  {leaderboard.others?.institutes?.length > 0 ? (
                    <div className="max-h-[380px] overflow-y-auto -mx-1 px-1">
                      {leaderboard.others.institutes.map((inst, idx) => (
                        <div key={`oth-${inst.rank}-${inst.institute}`} className={`leaderboard-row tt lb-soft-${idx % 5}`}>
                          <div className="leaderboard-row-inner">
                            <div className="flex-1 min-w-0">
                              <div className="leaderboard-detail-name">{inst.institute || "—"}</div>
                              <div className="leaderboard-detail-stats">
                                <span className="leaderboard-detail-stat s-0"><span className="label">আবেদন</span><span className="value">{inst.applicationCount}</span></span>
                                <span className="leaderboard-detail-stat s-1"><span className="label">উপস্থিত</span><span className="value">{inst.presentCount} ({inst.presentPercentOfOwn}%)</span></span>
                                <span className="leaderboard-detail-stat s-2"><span className="label">রেজাল্ট</span><span className="value">{inst.resultAddedRatioPercent}%</span></span>
                                <span className="leaderboard-detail-stat s-3"><span className="label">পাস</span><span className="value">{inst.passRatioPercent}%</span></span>
                                <span className="leaderboard-detail-stat s-4"><span className="label">৭০%+</span><span className="value">{inst.got70RatioPercent}%</span></span>
                              </div>
                            </div>
                            <div className={`leaderboard-rank-badge ${inst.rank <= 3 ? "top" : ""}`}>
                              {inst.rank === 1 ? <CrownOutlined style={{ fontSize: 16 }} /> : inst.rank}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12 text-gray-500 tt">কোন ডেটা নেই</div>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default ResultPage;
