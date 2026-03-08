import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Alert,
  Button,
  Card,
  Typography,
  Input,
  Form,
  Row,
  Col,
  Spin,
  QRCode,
  Modal,
  Table,
  Progress,
} from "antd";
import { DownloadOutlined, SearchOutlined, TrophyOutlined, CrownOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import { coreAxios } from "../../../utilities/axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const { Text, Title } = Typography;

// Same as ResultDetails: class number and institute canonical for viva institute leaderboard
const CLASS_NAME_TO_NUMBER = {
  Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8, Nine: 9,
  Ten: 10, Eleven: 11, Twelve: 12,
};
const getClassNumber = (instituteClass) => {
  if (instituteClass == null) return NaN;
  const s = String(instituteClass).trim();
  const n = parseInt(s, 10);
  if (!Number.isNaN(n)) return n;
  return CLASS_NAME_TO_NUMBER[s] ?? NaN;
};
const normalizeInstituteKey = (name) => {
  if (name == null) return "";
  return String(name)
    .replace(/\r\n|\r|\n/g, " ")
    .replace(/\u00A0/g, " ")
    .trim()
    .replace(/^[.,;:\s]+|[.,;:\s]+$/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};
const buildInstituteCanonicalMap = (students) => {
  const byNormalized = {};
  (students || []).forEach((s) => {
    const inst = s.institute ?? "Unknown";
    let norm = normalizeInstituteKey(inst);
    if (norm.includes("razabari") && norm.includes("adarsha") && norm.includes("high school")) {
      norm = "razabari adarsha high school";
    }
    if (norm.includes("razabari") && norm.includes("adorsho") && norm.includes("high school")) {
      norm = "razabari adorsho high school";
    }
    if (!byNormalized[norm]) byNormalized[norm] = {};
    byNormalized[norm][inst] = (byNormalized[norm][inst] || 0) + 1;
  });
  const map = {};
  Object.entries(byNormalized).forEach(([, variants]) => {
    const canonical = Object.entries(variants).sort((a, b) => b[1] - a[1])[0][0];
    Object.keys(variants).forEach((orig) => { map[orig] = canonical; });
  });
  return map;
};

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

// Full result (written + viva) visible from 9 March 2026, 11:00 AM Bangladesh time (UTC+6)
const RESULT_LIVE_AT = new Date("2026-03-09T11:00:00+06:00");
const isResultLive = () => new Date() >= RESULT_LIVE_AT;
const RESULT_PUBLISH_LABEL = "লিখিত পরীক্ষার ফলাফল প্রকাশ — ২ মার্চ দুপুর ২টায়";
const RESULT_NOT_YET_MESSAGE = "ফলাফল ৯ মার্চ ২০২৬ সকাল ১১টা থেকে দেখা যাবে। তার আগে ফলাফল দেখানো হবে না।";
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
  // Institute leaderboard: same rank as ResultDetails PDF (Junior Class 2–5, Senior Class 6–12; rank by scholarship count then credit point)
  const [leaderboard, setLeaderboard] = useState({
    junior: { institutes: [] },
    senior: { institutes: [] },
  });
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [isPdfExport, setIsPdfExport] = useState(false);
  const [instituteDetailsModal, setInstituteDetailsModal] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLeaderboardLoading(true);
      const res = await coreAxios.get("/scholarship-info");
      if (res?.status !== 200 || !Array.isArray(res?.data)) {
        setLeaderboard({ junior: { institutes: [] }, senior: { institutes: [] } });
        return;
      }
      const data = (res.data || []).slice().sort(
        (a, b) => new Date(b?.submittedAt) - new Date(a?.submittedAt)
      );
      // Same as ResultDetails vivaLeaderboard: correct/viva, minTotal (47.5 / 83 for 6–10 / 85 for 11–12), sort by _total desc, tie-break by submittedAt desc
      const correct = (s) => s?.resultDetails?.[0]?.totalMarks ?? s?.correctAnswer ?? 0;
      const viva = (s) => s?.vibaMarks ?? s?.vivaMarks ?? s?.resultDetails?.[0]?.vibaMarks ?? 0;
      const canonicalMap = buildInstituteCanonicalMap(data);
      const qualified = data.filter((s) => {
        const v = viva(s);
        if (v == null || v === "") return false;
        const c = Number(correct(s)) || 0;
        const total = c + Number(v);
        const classNum = getClassNumber(s.instituteClass);
        const minTotal = classNum >= 2 && classNum <= 5 ? 47.5 : (classNum >= 6 && classNum <= 10 ? 83 : 85);
        return total >= minTotal;
      });
      const withTotal = qualified.map((s) => ({
        ...s,
        institute: canonicalMap[s.institute] ?? s.institute ?? "Unknown",
        _total: (Number(correct(s)) || 0) + (Number(viva(s)) || 0),
        _classNum: getClassNumber(s.instituteClass),
      }));
      withTotal.sort((a, b) => {
        const d = (b._total ?? 0) - (a._total ?? 0);
        if (d !== 0) return d;
        return new Date(b?.submittedAt || 0) - new Date(a?.submittedAt || 0);
      });
      const juniorList = withTotal.filter((s) => s._classNum >= 2 && s._classNum <= 5);
      const seniorList = withTotal.filter((s) => s._classNum >= 6 && s._classNum <= 12);
      const getRoll = (r) => String(r.scholarshipRollNumber ?? r.rollNumber ?? r.resultDetails?.[0]?.rollNumber ?? "").trim();
      const addRank = (arr) => arr.map((row, i) => ({ ...row, _normalizedRoll: normalizeRollNumber(getRoll(row)), _meritRank: i + 1 }));
      const meritOrderJunior = addRank(juniorList);
      const meritOrderSenior = addRank(seniorList);
        const toInstituteRank = (list, group) => {
          const isJunior = group === "junior";
          const stats = {};
          list.forEach((r) => {
            const inst = r.institute ?? "Unknown";
            if (!stats[inst]) stats[inst] = { count: 0, totalMarks: 0, rollDetails: [] };
            stats[inst].count += 1;
            stats[inst].totalMarks += Number(r._total) || 0;
            const roll = getRoll(r);
            const grade = (isJunior && (r._total ?? 0) >= 52.5) || (!isJunior && (r._total ?? 0) >= 100) ? "Talentpool" : "General";
            const g = (r.gender ?? "").toString().toLowerCase();
            const genderSuffix = g === "male" ? "M" : g === "female" ? "F" : "";
            if (roll) stats[inst].rollDetails.push({ roll, grade, genderSuffix });
          });
          return Object.entries(stats)
            .sort((a, b) => {
              if (b[1].count !== a[1].count) return b[1].count - a[1].count;
              return b[1].totalMarks - a[1].totalMarks;
            })
            .map(([name, s], idx) => ({
              rank: idx + 1,
              institute: name,
              count: s.count,
              creditPoint: (s.totalMarks / 10).toFixed(1),
              rollDetails: s.rollDetails || [],
            }));
        };
      setLeaderboard({
        junior: { institutes: toInstituteRank(juniorList, "junior"), meritOrder: meritOrderJunior },
        senior: { institutes: toInstituteRank(seniorList, "senior"), meritOrder: meritOrderSenior },
      });
    } catch (err) {
      console.error("Institute leaderboard fetch error:", err);
      setLeaderboard({ junior: { institutes: [] }, senior: { institutes: [] } });
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

  // Written + Viva for scholarship (same as ResultDetails viva leaderboard)
  const writtenMarks =
    resultData?.resultDetails?.[0]?.totalMarks ?? resultData?.correctAnswer ?? resultData?.resultDetails?.[0]?.correctAnswer;
  const vivaMarksRaw =
    resultData?.vibaMarks ?? resultData?.vivaMarks ?? resultData?.resultDetails?.[0]?.vibaMarks;
  const vivaMarks = vivaMarksRaw != null && vivaMarksRaw !== "" ? Number(vivaMarksRaw) : null;
  const totalMarksCombined =
    (Number(writtenMarks) || 0) + (vivaMarks != null ? vivaMarks : 0);

  // বৃত্তি প্রাপ্ত: ভাইভা নম্বর থাকা সাপেক্ষে লিখিত+ভাইভা মোট অনুযায়ী (Junior ≥47.5, Class 6–12 ≥83)
  const getScholarshipResult = () => {
    if (vivaMarks == null) {
      return { qualified: false, grade: null, hasVivaMarks: false };
    }
    const minTotal =
      classNumber >= 2 && classNumber <= 5 ? 47.5 : (classNumber >= 6 && classNumber <= 12 ? 83 : 47.5);
    if (totalMarksCombined < minTotal) {
      return { qualified: false, grade: null, hasVivaMarks: true };
    }
    const isJunior = classNumber >= 2 && classNumber <= 5;
    const talentpoolThreshold = isJunior ? 52.5 : 100;
    const grade =
      totalMarksCombined >= talentpoolThreshold ? "Talentpool" : "General";
    return { qualified: true, grade, hasVivaMarks: true };
  };
  const scholarshipResult = getScholarshipResult();

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
  const currentNormalizedRoll = rollDisplay ? normalizeRollNumber(rollDisplay) : "";
  const meritOrder = classNumber >= 2 && classNumber <= 5 ? leaderboard?.junior?.meritOrder : leaderboard?.senior?.meritOrder;
  const meritPosition = (Array.isArray(meritOrder) && currentNormalizedRoll)
    ? (meritOrder.find((r) => r._normalizedRoll === currentNormalizedRoll)?._meritRank ?? null)
    : null;

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
          {isResultLive() ? RESULT_PUBLISH_LABEL : "ফলাফল ৯ মার্চ ২০২৬ সকাল ১১টা থেকে দেখা যাবে"}
        </p>
      </div>

      {/* পরীক্ষার নম্বর ও বৃত্তি গ্রেড মানদণ্ড */}
      <Card
        className="no-print mb-6"
        title={
          <span className="tt font-semibold" style={{ fontSize: "17px" }}>
            পরীক্ষার নম্বর ও বৃত্তি গ্রেড মানদণ্ড
          </span>
        }
        style={{
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: "12px 16px 16px" }}>
        <Row gutter={[16, 8]} className="tt" style={{ fontSize: "14px", lineHeight: 1.55 }}>
          <Col xs={24} md={12}>
            <div className="font-semibold text-green-800 mb-1" style={{ fontSize: "15px" }}>📝 কোন পরীক্ষায় কত নম্বর</div>
            <ul className="list-none pl-0 mb-0" style={{ marginTop: 4 }}>
              <li style={{ marginBottom: 2 }}>• <strong>জুনিয়র (২–৫):</strong> লিখিত <strong>৪৫</strong>, ভাইভা <strong>১৫</strong> নম্বর</li>
              <li style={{ marginBottom: 2 }}>• <strong>সিনিয়র (৬–১২):</strong> লিখিত <strong>১০০</strong>, ভাইভা <strong>২০</strong> নম্বর</li>
              <li style={{ marginBottom: 0 }}>• লিখিত + ভাইভা যোগ করে মোট ধরা হয়।</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <div className="font-semibold text-green-800 mb-1" style={{ fontSize: "15px" }}>🏆 বৃত্তি নির্বাচন ও গ্রেড</div>
            <ul className="list-none pl-0 mb-0" style={{ marginTop: 4 }}>
              <li style={{ marginBottom: 2 }}>• <strong>জুনিয়র:</strong> মোট <strong>৪৭.৫+</strong> বৃত্তি। <strong>৫২.৫+</strong> → <span className="text-green-700 font-medium">ট্যালেন্টপুল</span>; <strong>৪৭.৫ থেকে ৫২.৫ এর নিচে</strong> → <span className="text-blue-700 font-medium">জেনারেল</span></li>
              <li style={{ marginBottom: 0 }}>• <strong>ক্লাস ৬–১২:</strong> মোট <strong>৮৩+</strong> বৃত্তি। <strong>১০০+</strong> → <span className="text-green-700 font-medium">ট্যালেন্টপুল</span>; <strong>৮৩ থেকে ১০০ এর নিচে</strong> → <span className="text-blue-700 font-medium">জেনারেল</span></li>
            </ul>
          </Col>
        </Row>
      </Card>

      {/* Before result time: message + disabled search */}
      {!isResultLive() && (
        <Alert
          className="no-print mb-6 tt"
          message={RESULT_NOT_YET_MESSAGE}
          type="info"
          showIcon
          style={{ fontSize: "15px" }}
        />
      )}

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
              disabled={!isResultLive()}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
              block
              disabled={!isResultLive()}
              style={{ height: "45px", fontSize: "16px" }}>
              ফলাফল দেখুন
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {Object.keys(resultData).length > 0 && isResultLive() && (
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
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>প্রাপ্ত নম্বর (লিখিত):</td>
                    <td className="py-3 px-4 font-semibold" style={{ fontSize: "18px" }}>{writtenMarks != null ? String(writtenMarks) : "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>ভাইভা নম্বর:</td>
                    <td className="py-3 px-4" style={{ fontSize: "18px" }}>{vivaMarks != null ? String(vivaMarks) : "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>মোট নম্বর (লিখিত+ভাইভা):</td>
                    <td className="py-3 px-4 font-semibold" style={{ fontSize: "18px" }}>{scholarshipResult.hasVivaMarks ? String(totalMarksCombined) : "-"}</td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>বৃত্তি প্রাপ্ত:</td>
                    <td className="py-3 px-4 font-semibold" style={{ fontSize: "18px" }}>
                      {scholarshipResult.qualified ? (
                        <span className="tt text-green-700">
                          হ্যাঁ — <span className="font-bold">{scholarshipResult.grade} Grade</span>
                        </span>
                      ) : scholarshipResult.hasVivaMarks ? (
                        <span className="tt text-amber-700">না</span>
                      ) : (
                        <span className="tt text-gray-600">ভাইভা নম্বর প্রাপ্তির পর নির্ধারিত হবে</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-green-600">
                    <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 text-green-800" style={{ fontSize: "18px" }}>মেরিট পজিশন:</td>
                    <td className="py-3 px-4 font-semibold" style={{ fontSize: "18px" }}>
                      {meritPosition != null ? (
                        <span className="tt text-green-800">{(classNumber >= 2 && classNumber <= 5 ? "জুনিয়র " : "সিনিয়র ")}{meritPosition}</span>
                      ) : (
                        <span className="tt text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Messages: বৃত্তি পেয়েছেন / সান্ত্বনা (না পেলে) / ভাইভা নির্বাচিত */}
              {scholarshipResult.qualified ? (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-600 tt">
                  <Title level={5} className="result-pdf-msg-title tt text-green-800 mb-2" style={{ fontSize: "18px" }}><span className="text-xl">🎉</span> মাবরুক! আপনি শিক্ষাবৃত্তি পেয়েছেন — {scholarshipResult.grade} Grade</Title>
                  <Text className="result-pdf-msg-body tt block" style={{ fontSize: "15px" }}>লিখিত ও ভাইভা মিলে মোট {totalMarksCombined} নম্বর অনুযায়ী আপনাকে বৃত্তির জন্য নির্বাচিত করা হয়েছে। আল্লাহ তাআলা আপনার জ্ঞান ও পরিশ্রমে বরকত দিন। আমীন।</Text>
                </div>
              ) : scholarshipResult.hasVivaMarks ? (
                <div className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-500 tt">
                  <Title level={5} className="result-pdf-msg-title tt text-amber-800 mb-2" style={{ fontSize: "18px" }}><span className="text-xl">🤲</span> এইবার বৃত্তি পাননি</Title>
                  <Text className="result-pdf-msg-body tt block" style={{ fontSize: "15px" }}>লিখিত ও ভাইভার মোট নম্বর অনুযায়ী এইবার বৃত্তির তালিকায় আসেনি। হতাশ হবেন না — নিয়ত শুদ্ধ রেখে পড়াশোনা চালিয়ে যান। আল্লাহর উপর ভরসা রাখুন, ইনশাআল্লাহ পরবর্তীতে আরও ভালো ফল আসবে। আপনাকে শুভকামনা।</Text>
                </div>
              ) : getVivaStatus().selected ? (
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

      {/* Ayat-ul-'Ilm Excellence Award — লিডারবোর্ডের ওপরে */}
      <Card
        className="no-print mb-4"
        size="small"
        style={{
          borderRadius: 12,
          border: "1px solid rgba(120, 53, 15, 0.2)",
          background: "linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)",
          boxShadow: "0 1px 8px rgba(120, 53, 15, 0.06)",
        }}
        bodyStyle={{ padding: "12px 16px" }}>
        <div className="tt" style={{ fontSize: "14px", lineHeight: 1.6, color: "#78350f" }}>
          <div className="font-semibold mb-2" style={{ fontSize: "15px", color: "#92400e" }}>
            Ayat-ul-'Ilm Excellence Award
          </div>
          <p style={{ margin: 0 }}>
            লিখিত ও ভাইভা পরীক্ষায় শীর্ষ হওয়ায় কেবল এই পুরস্কারের জন্য বিবেচিত হবেন — এমন নয়; এই পুরস্কারের সাথে শিক্ষাবৃত্তির কোনো সম্পর্ক নেই। পুরস্কার প্রদান সম্পূর্ণভাবে <strong>Ayat-ul-'Ilm Award Committee</strong>-র সিদ্ধান্ত। বৃত্তিপ্রাপ্ত শিক্ষার্থীদের মধ্য থেকে জুনিয়র (২–৫) থেকে <strong>১ জন</strong> ও সিনিয়র (৬–১২) থেকে <strong>১ জন</strong> — মোট দুজনকে এই পুরস্কার দেওয়া হবে। বিবেচনায় বিভিন্ন বিষয় রাখা হবে, যা সম্পূর্ণ গোপনীয়। তাই এই পুরস্কার নিয়ে কেউ যেন বিব্রত না হন — বিনীত অনুরোধ।
          </p>
          <div style={{ marginTop: 12, textAlign: "right", fontStyle: "italic" }}>
            অনুরোধক্রমে<br />
            <strong>Anisur Rahman</strong><br />
            Director, Ayatul Ilm Award Committee
          </div>
        </div>
      </Card>

      {/* Institute Leaderboard — ভাইভা পরীক্ষার জন্য, ভাইভার পর অটো আপডেট (শুধু ফলাফল লাইভ হলে দেখাবে) */}
      {isResultLive() && (
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
          </div>
        }>
        <Spin spinning={leaderboardLoading} tip="লোড হচ্ছে...">
          {!leaderboardLoading && (() => {
            const juniorStudents = (leaderboard.junior?.institutes || []).reduce((s, i) => s + (i.count || 0), 0);
            const seniorStudents = (leaderboard.senior?.institutes || []).reduce((s, i) => s + (i.count || 0), 0);
            const total = juniorStudents + seniorStudents;
            const juniorPercent = total > 0 ? Math.round((juniorStudents / total) * 100) : 50;
            return (
            <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                <span style={{ color: "#15803d", fontWeight: 600 }}>Junior (Class 2–5): {juniorStudents} শিক্ষার্থী</span>
                <span style={{ color: "#1d4ed8", fontWeight: 600 }}>Senior (Class 6–12): {seniorStudents} শিক্ষার্থী</span>
              </div>
              <Progress
                percent={100}
                showInfo={false}
                strokeColor="#2563eb"
                success={{ percent: juniorPercent, strokeColor: "#16a34a" }}
                strokeWidth={14}
                style={{ marginBottom: 0 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "#64748b" }}>
                <span>{juniorPercent}%</span>
                <span>{100 - juniorPercent}%</span>
              </div>
            </div>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div className="rounded-lg border border-gray-200 bg-white p-3" style={{ minHeight: 260 }}>
                  <div className="tt flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-800" style={{ fontSize: "14px" }}>Junior (Class 2–5)</span>
                    <Text type="secondary" style={{ fontSize: 11 }}>{leaderboard.junior?.institutes?.length ?? 0} প্রতিষ্ঠান</Text>
                  </div>
                  {leaderboard.junior?.institutes?.length > 0 ? (
                    <div className="max-h-[380px] overflow-y-auto -mx-1 px-1">
                      {leaderboard.junior.institutes.map((inst, idx) => (
                        <div key={`junior-${inst.rank}-${inst.institute}`} className={`leaderboard-row tt lb-soft-${idx % 5}`}>
                          <div className="leaderboard-row-inner">
                            <div className="flex-1 min-w-0">
                              <div className="leaderboard-detail-name">{inst.institute || "—"}</div>
                              <div className="leaderboard-detail-stats">
                                <span className="leaderboard-detail-stat s-0"><span className="label">Scholarship</span><span className="value">{inst.count}</span></span>
                                <span className="leaderboard-detail-stat s-1"><span className="label">Credit Point</span><span className="value">{inst.creditPoint}</span></span>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                              <Button
                                type="default"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => setInstituteDetailsModal({ institute: inst.institute, group: "Junior (Class 2–5)", rollDetails: inst.rollDetails || [] })}
                                style={{ fontSize: 11, color: "#15803d", borderColor: "#86efac" }}
                              >
                                View details
                              </Button>
                              <div className={`leaderboard-rank-badge ${inst.rank <= 3 ? "top" : ""}`}>
                                {inst.rank === 1 ? <CrownOutlined style={{ fontSize: 16 }} /> : inst.rank}
                              </div>
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
                    <span className="font-semibold text-gray-800" style={{ fontSize: "14px" }}>Senior (Class 6–12)</span>
                    <Text type="secondary" style={{ fontSize: 11 }}>{leaderboard.senior?.institutes?.length ?? 0} প্রতিষ্ঠান</Text>
                  </div>
                  {leaderboard.senior?.institutes?.length > 0 ? (
                    <div className="max-h-[380px] overflow-y-auto -mx-1 px-1">
                      {leaderboard.senior.institutes.map((inst, idx) => (
                        <div key={`senior-${inst.rank}-${inst.institute}`} className={`leaderboard-row tt lb-soft-${idx % 5}`}>
                          <div className="leaderboard-row-inner">
                            <div className="flex-1 min-w-0">
                              <div className="leaderboard-detail-name">{inst.institute || "—"}</div>
                              <div className="leaderboard-detail-stats">
                                <span className="leaderboard-detail-stat s-0"><span className="label">Scholarship</span><span className="value">{inst.count}</span></span>
                                <span className="leaderboard-detail-stat s-1"><span className="label">Credit Point</span><span className="value">{inst.creditPoint}</span></span>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                              <Button
                                type="default"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => setInstituteDetailsModal({ institute: inst.institute, group: "Senior (Class 6–12)", rollDetails: inst.rollDetails || [] })}
                                style={{ fontSize: 11, color: "#1d4ed8", borderColor: "#93c5fd" }}
                              >
                                View details
                              </Button>
                              <div className={`leaderboard-rank-badge ${inst.rank <= 3 ? "top" : ""}`}>
                                {inst.rank === 1 ? <CrownOutlined style={{ fontSize: 16 }} /> : inst.rank}
                              </div>
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
            </>
            );
          })()}
        </Spin>
      </Card>
      )}

      <Modal
        title={
          instituteDetailsModal ? (
            <div className="tt">
              <div style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{instituteDetailsModal.institute}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>বৃত্তি প্রাপ্ত শিক্ষার্থীদের তালিকা</Text>
            </div>
          ) : ""
        }
        open={!!instituteDetailsModal}
        onCancel={() => setInstituteDetailsModal(null)}
        footer={null}
        width={480}
        styles={{ body: { paddingTop: 8 } }}
        className="tt"
      >
        {instituteDetailsModal && (
          <div className="tt">
            {instituteDetailsModal.rollDetails && instituteDetailsModal.rollDetails.length > 0 ? (
              <Table
                dataSource={instituteDetailsModal.rollDetails.map((item, i) => ({ ...item, key: `${item.roll}-${i}` }))}
                columns={[
                  {
                    title: "#",
                    key: "index",
                    width: 48,
                    align: "center",
                    render: (_, __, idx) => idx + 1,
                  },
                  {
                    title: "Scholarship Roll Number",
                    dataIndex: "roll",
                    key: "roll",
                    render: (v, row) => <Text strong>{v}{row.genderSuffix || ""}</Text>,
                  },
                  {
                    title: "Grade",
                    dataIndex: "grade",
                    key: "grade",
                    width: 110,
                    align: "center",
                    render: (grade) => (
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          background: grade === "Talentpool" ? "rgba(34, 197, 94, 0.15)" : "rgba(59, 130, 246, 0.15)",
                          color: grade === "Talentpool" ? "#15803d" : "#1d4ed8",
                        }}
                      >
                        {grade}
                      </span>
                    ),
                  },
                ]}
                pagination={false}
                size="small"
                scroll={{ y: 340 }}
                style={{ marginTop: 8 }}
              />
            ) : (
              <div className="tt text-center py-8 text-gray-500">কোন রোল নম্বর নেই</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResultPage;
