import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Table,
  Typography,
  Popconfirm,
  Space,
  Tag,
  Spin,
  Statistic,
  Select,
} from "antd";
import {
  SearchOutlined,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  SettingOutlined,
  FilePdfOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { coreAxios } from "../../../utilities/axios";

const { Title, Text } = Typography;

// Class name to number for viva threshold and time slot
const CLASS_NAME_TO_NUMBER = {
  Two: 2, Three: 3, Four: 4, Five: 5, Six: 6, Seven: 7, Eight: 8,
  Nine: 9, Ten: 10, Eleven: 11, Twelve: 12,
};
const getClassNumber = (instituteClass) => {
  if (instituteClass == null) return NaN;
  const s = String(instituteClass).trim();
  const n = parseInt(s, 10);
  if (!Number.isNaN(n)) return n;
  return CLASS_NAME_TO_NUMBER[s] ?? NaN;
};

// Viva time slot by class (aligned with ResultPage)
const getVivaSlotByClass = (classNumber) => {
  const n = classNumber != null ? Number(classNumber) : 0;
  if (n >= 9 && n <= 12) return { room: "Room 1", timeSlot: "09:00 - 10:30" };
  if (n === 5) return { room: "Room 2", timeSlot: "09:00 - 10:00" };
  if (n >= 6 && n <= 8) return { room: "Room 3", timeSlot: "10:30 - 11:30" };
  if (n >= 3 && n <= 4) return { room: "Room 2", timeSlot: "10:30 - 11:30" }; // Three, Four
  if (n === 2) return { room: "Room 3", timeSlot: "09:00 - 10:30" };
  return { room: "Room 3", timeSlot: "09:00 - 10:30" };
};

// ভাইভা মার্কস ফিল্ড ১২ তারিখের পর থেকে দেখাবে (১২ মার্চ ২০২৬)
const VIBA_MARKS_OPEN_FROM = new Date(2026, 2, 12, 0, 0, 0); // 12 March 2026
const isVibaMarksVisible = () => new Date() >= VIBA_MARKS_OPEN_FROM;

// Normalize roll: DMS26580F / DMS26580M → DMS26580; DMS26580 stays as is
const normalizeRollNumber = (roll) => {
  if (!roll || typeof roll !== "string") return roll?.trim() ?? "";
  const trimmed = roll.trim();
  if (trimmed.length < 2) return trimmed;
  const last = trimmed.slice(-1).toUpperCase();
  if (last === "F" || last === "M") return trimmed.slice(0, -1).trim();
  return trimmed;
};

// Result calculation: two separate percents (60–90) — class 3–5 and class 6–12
const PERCENT_MIN = 60;
const PERCENT_MAX = 90;

const AddResult = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [stats, setStats] = useState({ overall: null, byClass: [] });
  const [statsLoading, setStatsLoading] = useState(true);
  const [percentOptions, setPercentOptions] = useState([]);
  const [selectedPercentClass3To5, setSelectedPercentClass3To5] = useState(null);
  const [selectedPercentClass6To12, setSelectedPercentClass6To12] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configSavingClass3To5, setConfigSavingClass3To5] = useState(false);
  const [configSavingClass6To12, setConfigSavingClass6To12] = useState(false);
  const [vivaList, setVivaList] = useState([]);
  const [vivaListLoading, setVivaListLoading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const fetchPercentOptions = useCallback(async () => {
    try {
      const res = await coreAxios.get("/result-calculation-config/percent-options");
      if (res?.status === 200 && res?.data?.success && res?.data?.data?.options) {
        setPercentOptions(res.data.data.options);
      } else {
        const opts = [];
        for (let p = PERCENT_MIN; p <= PERCENT_MAX; p++) opts.push({ value: p, label: `${p}%` });
        setPercentOptions(opts);
      }
    } catch (err) {
      const opts = [];
      for (let p = PERCENT_MIN; p <= PERCENT_MAX; p++) opts.push({ value: p, label: `${p}%` });
      setPercentOptions(opts);
    }
  }, []);

  const fetchResultCalculationConfig = useCallback(async () => {
    try {
      setConfigLoading(true);
      const res = await coreAxios.get("/result-calculation-config");
      if (res?.status === 200 && res?.data?.success && res?.data?.data) {
        const d = res.data.data;
        const p35 = d.selectedPercentClass3To5;
        const p612 = d.selectedPercentClass6To12;
        if (typeof p35 === "number" && p35 >= PERCENT_MIN && p35 <= PERCENT_MAX) setSelectedPercentClass3To5(p35);
        else setSelectedPercentClass3To5(null);
        if (typeof p612 === "number" && p612 >= PERCENT_MIN && p612 <= PERCENT_MAX) setSelectedPercentClass6To12(p612);
        else setSelectedPercentClass6To12(null);
      }
    } catch (err) {
      setSelectedPercentClass3To5(null);
      setSelectedPercentClass6To12(null);
    } finally {
      setConfigLoading(false);
    }
  }, []);

  const saveResultCalculationConfigClass3To5 = async () => {
    const value = selectedPercentClass3To5 ?? 70;
    if (value < PERCENT_MIN || value > PERCENT_MAX) {
      toast.warning(`৬০–৯০% এর মধ্যে নির্বাচন করুন`);
      return;
    }
    try {
      setConfigSavingClass3To5(true);
      const res = await coreAxios.post("/result-calculation-config/class3to5", { selectedPercent: value });
      if (res?.status === 200 && res?.data?.success) {
        toast.success(res?.data?.message || "৩য়–৫ম কনফিগ সেভ হয়েছে।");
        setSelectedPercentClass3To5(value);
        fetchResultStats();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "কনফিগ সেভ করা যায়নি");
    } finally {
      setConfigSavingClass3To5(false);
    }
  };

  const saveResultCalculationConfigClass6To12 = async () => {
    const value = selectedPercentClass6To12 ?? 60;
    if (value < PERCENT_MIN || value > PERCENT_MAX) {
      toast.warning(`৬০–৯০% এর মধ্যে নির্বাচন করুন`);
      return;
    }
    try {
      setConfigSavingClass6To12(true);
      const res = await coreAxios.post("/result-calculation-config/class6to12", { selectedPercent: value });
      if (res?.status === 200 && res?.data?.success) {
        toast.success(res?.data?.message || "৬ষ্ঠ–১২শ কনফিগ সেভ হয়েছে।");
        setSelectedPercentClass6To12(value);
        fetchResultStats();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "কনফিগ সেভ করা যায়নি");
    } finally {
      setConfigSavingClass6To12(false);
    }
  };

  const fetchResultStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await coreAxios.get("/result-stats");
      if (res?.status === 200 && res?.data?.success && res?.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Result stats fetch error:", err);
      setStats({ overall: null, byClass: [] });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch scholarship list and filter to viva-selected: class 3–5 → 75% of 45; others (6–12) → 65% of 100.
  const fetchVivaSelectedList = useCallback(async () => {
    try {
      setVivaListLoading(true);
      const res = await coreAxios.get("/scholarship-info");
      if (res?.status !== 200 || !Array.isArray(res.data)) {
        setVivaList([]);
        return [];
      }
      const list = res.data;
      const selected = list.filter((s) => {
        const written = s.resultDetails?.[0]?.totalMarks ?? s.correctAnswer;
        if (written == null) return false;
        const classNum = getClassNumber(s.instituteClass);
        // Class 3 to 5: total 45, threshold 75%. Others (6–12): total 100, threshold 65%.
        const isClass3To5 = !Number.isNaN(classNum) && classNum >= 3 && classNum <= 5;
        const totalMarks = isClass3To5 ? 45 : 100;
        const threshold = isClass3To5 ? 75 : 65;
        const percentage = (Number(written) / totalMarks) * 100;
        return percentage >= threshold;
      });
      selected.sort((a, b) => {
        const ca = getClassNumber(a.instituteClass);
        const cb = getClassNumber(b.instituteClass);
        if (ca !== cb) return ca - cb;
        const ma = a.resultDetails?.[0]?.totalMarks ?? a.correctAnswer ?? 0;
        const mb = b.resultDetails?.[0]?.totalMarks ?? b.correctAnswer ?? 0;
        return Number(mb) - Number(ma);
      });
      setVivaList(selected);
      return selected;
    } catch (err) {
      console.error("Viva list fetch error:", err);
      setVivaList([]);
      toast.error("Failed to load viva selected list");
      return [];
    } finally {
      setVivaListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResultStats();
  }, [fetchResultStats]);

  useEffect(() => {
    fetchPercentOptions();
  }, [fetchPercentOptions]);

  useEffect(() => {
    fetchResultCalculationConfig();
  }, [fetchResultCalculationConfig]);

  // Search by roll number
  const handleSearch = async () => {
    const roll = form.getFieldValue("scholarshipRollNumber");
    if (!roll || !roll.trim()) {
      toast.warning("রোল নম্বর দিন");
      return;
    }
    const normalizedRoll = normalizeRollNumber(roll);
    try {
      setSearching(true);
      setSearchResult(null);
      const res = await coreAxios.get(`/search-result/${normalizedRoll}`);
      if (res?.status === 200 && res?.data) {
        const data = res.data;
        const correctAnswer = data.correctAnswer;
        form.setFieldsValue({
          scholarshipRollNumber: data.scholarshipRollNumber || normalizedRoll,
          correctAnswer:
            correctAnswer !== undefined && correctAnswer !== null
              ? correctAnswer
              : undefined,
          vibaMarks:
            data.vibaMarks !== undefined && data.vibaMarks !== null
              ? data.vibaMarks
              : undefined,
        });
        setSearchResult(data);
        setIsEditMode(true);
        toast.success("রেকর্ড পাওয়া গেছে। এডিট করে আপডেট করুন অথবা ডিলিট করুন।");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "রোল নম্বর পাওয়া যায়নি");
      setSearchResult(null);
      form.setFieldsValue({ correctAnswer: undefined, vibaMarks: undefined });
      setIsEditMode(false);
    } finally {
      setSearching(false);
    }
  };

  // Insert or Update
  const onFinish = async (values) => {
    const { scholarshipRollNumber, correctAnswer, vibaMarks } = values;
    if (
      correctAnswer === undefined ||
      correctAnswer === null ||
      String(correctAnswer).trim() === ""
    ) {
      toast.warning("সঠিক উত্তর দিন");
      return;
    }
    const normalizedRoll = normalizeRollNumber(scholarshipRollNumber);
    const payload = {
      scholarshipRollNumber: normalizedRoll,
      correctAnswer: Number(correctAnswer),
    };
    if (vibaMarks !== undefined && vibaMarks !== null && String(vibaMarks).trim() !== "") {
      payload.vibaMarks = Number(vibaMarks);
    }
    try {
      setLoading(true);
      const res = await coreAxios.post("/add-result", payload);
      if (res?.status === 200) {
        toast.success(res?.data?.message || "সফলভাবে সংরক্ষণ হয়েছে");
        setSearchResult((prev) =>
          prev && prev.scholarshipRollNumber === normalizedRoll
            ? { ...prev, correctAnswer: Number(correctAnswer), vibaMarks: payload.vibaMarks }
            : prev
        );
        setIsEditMode(true);
        if (!searchResult) form.resetFields();
        fetchResultStats();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "সংরক্ষণ করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  // Delete result (calls backend – add DELETE route if not present)
  const handleDelete = async () => {
    const roll = form.getFieldValue("scholarshipRollNumber");
    if (!roll || !roll.trim()) {
      toast.warning("রোল নম্বর দিন");
      return;
    }
    const normalizedRoll = normalizeRollNumber(roll);
    try {
      setDeleting(true);
      await coreAxios.delete(`/result/${normalizedRoll}`);
      toast.success("রেজাল্ট ডিলিট হয়েছে");
      form.resetFields();
      setSearchResult(null);
      setIsEditMode(false);
      fetchResultStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || "ডিলিট করা যায়নি");
    } finally {
      setDeleting(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setSearchResult(null);
    setIsEditMode(false);
  };

  // Rows for "all list" PDF: no viva, no phone — #, Class, Roll, Name, Written, Total (%), Time Slot, Room
  const getVivaPdfRowsSimple = (list) => {
    const source = list ?? vivaList;
    return source.map((s, idx) => {
      const written = s.resultDetails?.[0]?.totalMarks ?? s.correctAnswer;
      const viva = s.vibaMarks ?? s.resultDetails?.[0]?.vibaMarks;
      const classNum = getClassNumber(s.instituteClass);
      const totalMarks = (Number.isNaN(classNum) || (classNum >= 6 && classNum <= 12)) ? 100 : 45;
      const totalRaw = Number(written) + Number(viva ?? 0);
      const maxTotal = totalMarks + (viva != null ? 15 : 0);
      const totalOrPercent = `${totalRaw} (${((totalRaw / maxTotal) * 100).toFixed(1)}%)`;
      const slot = getVivaSlotByClass(classNum);
      const classLabel = s.instituteClass != null ? String(s.instituteClass) : "—";
      return [
        idx + 1,
        classLabel,
        s.scholarshipRollNumber || "—",
        s.name || "—",
        written != null ? String(written) : "—",
        totalOrPercent,
        slot.timeSlot,
        slot.room,
      ];
    });
  };

  // Group by room, then by time slot within each room (for room-wise PDF)
  const groupByRoomThenSlot = (list) => {
    const source = list ?? vivaList;
    const roomMap = new Map();
    source.forEach((s) => {
      const classNum = getClassNumber(s.instituteClass);
      const slot = getVivaSlotByClass(classNum);
      const roomKey = slot.room;
      if (!roomMap.has(roomKey)) roomMap.set(roomKey, new Map());
      const slotMap = roomMap.get(roomKey);
      const slotKey = slot.timeSlot || "";
      if (!slotMap.has(slotKey)) slotMap.set(slotKey, []);
      slotMap.get(slotKey).push(s);
    });
    const roomOrder = ["Room 1", "Room 2", "Room 3"];
    return roomOrder.filter((r) => roomMap.has(r)).map((room) => {
      const slotMap = roomMap.get(room);
      const slots = Array.from(slotMap.entries()).map(([timeSlot, candidates]) => ({ timeSlot, candidates }));
      slots.sort((a, b) => (a.timeSlot || "").localeCompare(b.timeSlot || ""));
      return { room, slots };
    });
  };

  const drawPdfFooter = (doc, margin, pageH) => {
    let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 16 : 24;
    if (y > pageH - 80) {
      doc.addPage();
      y = 24;
    }
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Venue", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text("Darul Muttaquine Foundation", margin, y + 12);
    doc.text("Hateya Road (East of Takarcharala Dakhil Madrasa)", margin, y + 22);
    doc.setFont("helvetica", "italic");
    doc.text("This list is for official use. Contact admin for updates.", margin, y + 38);
  };

  // PDF Type 1: All selected list — no viva column, no phone
  const generatePdf1AllList = (list) => {
    const source = list ?? vivaList;
    if (!source.length) {
      toast.warning("No viva selected candidates to export. Load the list first.");
      return;
    }
    setPdfGenerating(true);
    try {
      const doc = new jsPDF("p", "pt", "a4");
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 28;
      const tableWidth = pageW - margin * 2;
      let y = 24;

      doc.setFillColor(22, 82, 54);
      doc.rect(0, 0, pageW, 52, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Viva Selected Candidates 2026 — All List", margin, 28);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Darul Muttaquine Foundation — Scholarship", margin, 42);
      doc.setTextColor(0, 0, 0);
      y = 62;
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Exam date: 6 March, Friday  •  Total: ${source.length} candidate(s)`, margin, y);
      y += 18;

      const headerRow = ["#", "Class", "Roll", "Name", "Written", "Total (%)", "Time Slot", "Room"];
      doc.autoTable({
        startY: y,
        head: [headerRow],
        body: getVivaPdfRowsSimple(source),
        theme: "grid",
        tableWidth,
        margin: { left: margin, right: margin },
        headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold", fontSize: 9, cellPadding: 4, lineWidth: 0.2, lineColor: [180, 180, 180] },
        bodyStyles: { fontSize: 8, cellPadding: 3, lineWidth: 0.2, lineColor: [200, 200, 200] },
      });
      drawPdfFooter(doc, margin, pageH);
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      doc.save(`DMF_Viva_All_List_2026_${dateStr.replace(/\s/g, "_")}.pdf`);
      toast.success("PDF (All list) downloaded.");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Failed to generate PDF");
    } finally {
      setPdfGenerating(false);
    }
  };

  // PDF Type 2: Room-wise, slot-wise — with viva and phone; each room on at least one page
  const generatePdf2RoomSlotWise = (list) => {
    const source = list ?? vivaList;
    if (!source.length) {
      toast.warning("No viva selected candidates to export. Load the list first.");
      return;
    }
    setPdfGenerating(true);
    try {
      const doc = new jsPDF("p", "pt", "a4");
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 28;
      const tableWidth = pageW - margin * 2;
      const headerRowFull = ["#", "Class", "Roll", "Name", "Phone", "Written", "Viva", "Total (%)", "Time Slot", "Room"];
      const tableOpts = {
        theme: "grid",
        tableWidth,
        margin: { left: margin, right: margin },
        headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold", fontSize: 9, cellPadding: 4, lineWidth: 0.2, lineColor: [180, 180, 180] },
        bodyStyles: { fontSize: 8, cellPadding: 3, lineWidth: 0.2, lineColor: [200, 200, 200] },
      };

      const groups = groupByRoomThenSlot(source);
      let y = 24;
      let isFirstPage = true;

      groups.forEach(({ room, slots }) => {
        if (!isFirstPage) doc.addPage();
        isFirstPage = false;
        y = 24;

        doc.setFillColor(22, 82, 54);
        doc.rect(0, 0, pageW, 52, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`Viva Selected 2026 — ${room}`, margin, 28);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Darul Muttaquine Foundation — Scholarship", margin, 42);
        doc.setTextColor(0, 0, 0);
        y = 62;
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text("Exam date: 6 March, Friday", margin, y);
        y += 16;

        slots.forEach(({ timeSlot, candidates }, slotIdx) => {
          if (y > pageH - 120) {
            doc.addPage();
            y = 24;
          }
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.text(`${room} — ${timeSlot} (${candidates.length} candidate(s))`, margin, y);
          y += 12;

          const bodyRows = candidates.map((s, i) => {
            const written = s.resultDetails?.[0]?.totalMarks ?? s.correctAnswer;
            const viva = s.vibaMarks ?? s.resultDetails?.[0]?.vibaMarks;
            const classNum = getClassNumber(s.instituteClass);
            const totalMarks = (Number.isNaN(classNum) || (classNum >= 6 && classNum <= 12)) ? 100 : 45;
            const totalRaw = Number(written) + Number(viva ?? 0);
            const maxTotal = totalMarks + (viva != null ? 15 : 0);
            const totalOrPercent = `${totalRaw} (${((totalRaw / maxTotal) * 100).toFixed(1)}%)`;
            const slot = getVivaSlotByClass(classNum);
            const phone = s.phone != null ? String(s.phone).replace(/^(\d)/, "0$1") : "—";
            const classLabel = s.instituteClass != null ? String(s.instituteClass) : "—";
            return [i + 1, classLabel, s.scholarshipRollNumber || "—", s.name || "—", phone, written != null ? String(written) : "—", viva != null ? String(viva) : "", totalOrPercent, slot.timeSlot, slot.room];
          });

          doc.autoTable({
            startY: y,
            head: [headerRowFull],
            body: bodyRows,
            ...tableOpts,
          });
          y = doc.lastAutoTable.finalY + 20;
        });

        drawPdfFooter(doc, margin, pageH);
      });

      const now = new Date();
      const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      doc.save(`DMF_Viva_Room_Slot_Wise_2026_${dateStr.replace(/\s/g, "_")}.pdf`);
      toast.success("PDF (Room & slot wise) downloaded.");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Failed to generate PDF");
    } finally {
      setPdfGenerating(false);
    }
  };

  const ensureVivaList = async () => {
    if (vivaList.length > 0) return vivaList;
    return await fetchVivaSelectedList();
  };

  const handleDownloadPdf1AllList = async () => {
    const list = await ensureVivaList();
    if (!list.length) {
      toast.warning("No viva selected candidates found.");
      return;
    }
    generatePdf1AllList(list);
  };

  const handleDownloadPdf2RoomSlot = async () => {
    const list = await ensureVivaList();
    if (!list.length) {
      toast.warning("No viva selected candidates found.");
      return;
    }
    generatePdf2RoomSlotWise(list);
  };

  const tableColumns = [
    {
      title: "রোল নম্বর",
      dataIndex: "scholarshipRollNumber",
      key: "scholarshipRollNumber",
      render: (val) => val || "-",
    },
    {
      title: "সঠিক উত্তর",
      dataIndex: "correctAnswer",
      key: "correctAnswer",
      render: (val) => (val !== undefined && val !== null ? val : "-"),
    },
    ...(isVibaMarksVisible()
      ? [
          {
            title: "ভাইভা মার্কস",
            dataIndex: "vibaMarks",
            key: "vibaMarks",
            render: (val) => (val !== undefined && val !== null ? val : "-"),
          },
        ]
      : []),
  ];

  const overall = stats?.overall ?? null;
  const byClass = stats?.byClass ?? [];
  const class3To5 = stats?.class3To5 ?? null;
  const class6To12 = stats?.class6To12 ?? null;
  const byClass3To5 = class3To5?.byClass ?? [];
  const byClass6To12 = class6To12?.byClass ?? [];
  const top5ByClass = stats?.top5ByClass ?? {};
  const top5ByClassEntries = Object.entries(top5ByClass).sort((a, b) =>
    String(a[0]).localeCompare(String(b[0]), undefined, { numeric: true })
  );

  const highPercentClass3To5 = selectedPercentClass3To5 ?? 70;
  const highPercentClass6To12 = selectedPercentClass6To12 ?? 60;
  // Total viva selected = sum of both groups (so 52+52=104, not a separate API total that might be 103)
  const totalVivaSelected = (class3To5?.got70Count ?? 0) + (class6To12?.got70Count ?? 0);

  const buildBarChartData = (list, highPercent) => ({
    labels: (list || []).map((r) => String(r.class)),
    datasets: [
      { label: "মোট উপস্থিত", data: (list || []).map((r) => r.totalPresent), backgroundColor: "rgba(59, 130, 246, 0.7)", borderColor: "rgb(59, 130, 246)", borderWidth: 1 },
      { label: "রেজাল্ট যোগ", data: (list || []).map((r) => r.resultAddedCount), backgroundColor: "rgba(34, 197, 94, 0.7)", borderColor: "rgb(34, 197, 94)", borderWidth: 1 },
      { label: "পাস (৪০%+)", data: (list || []).map((r) => r.passCount), backgroundColor: "rgba(168, 85, 247, 0.7)", borderColor: "rgb(168, 85, 247)", borderWidth: 1 },
      { label: `${highPercent}%+ প্রাপ্ত`, data: (list || []).map((r) => r.got70Count), backgroundColor: "rgba(245, 158, 11, 0.7)", borderColor: "rgb(245, 158, 11)", borderWidth: 1 },
    ],
  });
  const barChartDataClass3To5 = buildBarChartData(byClass3To5, highPercentClass3To5);
  const barChartDataClass6To12 = buildBarChartData(byClass6To12, highPercentClass6To12);

  return (
    <div className=" bg-gray-50 p-4 md:p-6">
      <div className="">
        <div className="text-center mb-6">
          <Title level={4} className="!mb-0 !text-gray-800">
            রেজাল্ট ম্যানেজমেন্ট
          </Title>
        </div>

       

        <Card className="shadow-sm border border-gray-200 mb-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ scholarshipRollNumber: "", correctAnswer: undefined, vibaMarks: undefined }}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={14}>
                <Form.Item
                  name="scholarshipRollNumber"
                  label="শিক্ষাবৃত্তি রোল নম্বর"
                  rules={[{ required: true, message: "রোল নম্বর দিন" }]}
                >
                  <Input
                    placeholder="রোল নম্বর লিখুন"
                    size="large"
                    allowClear
                    className="w-full"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} className="flex items-end gap-2 flex-wrap">
                <Button
                  type="default"
                  icon={<SearchOutlined />}
                  size="large"
                  loading={searching}
                  onClick={handleSearch}
                  className="flex-1 min-w-[120px]"
                >
                  খুঁজুন
                </Button>
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  size="large"
                  onClick={handleClear}
                  className="flex-1 min-w-[100px]"
                >
                  ক্লিয়ার
                </Button>
              </Col>
            </Row>

            <Form.Item
              name="correctAnswer"
              label="সঠিক উত্তর (Correct Answer)"
              rules={[{ required: true, message: "সঠিক উত্তর দিন" }]}
            >
              <InputNumber
                placeholder="সঠিক উত্তরের সংখ্যা"
                min={0}
                max={1000}
                size="large"
                className="w-full"
                style={{ width: "100%" }}
              />
            </Form.Item>

            {isVibaMarksVisible() && (
              <Form.Item
                name="vibaMarks"
                label="ভাইভা মার্কস (Optional)"
              >
                <InputNumber
                  placeholder="ভাইভা মার্কস (ঐচ্ছিক)"
                  min={0}
                  max={100}
                  size="large"
                  className="w-full"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}

            <Form.Item className="!mb-0">
              <Space wrap size="middle">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                  className="bg-green-600 hover:!bg-green-700"
                >
                  {isEditMode ? "আপডেট করুন" : "যোগ করুন"}
                </Button>
                {isEditMode && searchResult && (
                  <Popconfirm
                    title="রেজাল্ট ডিলিট করবেন?"
                    description="এই রোলের সঠিক উত্তর ডিলিট হবে।"
                    onConfirm={handleDelete}
                    okText="হ্যাঁ"
                    cancelText="না"
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      loading={deleting}
                      size="large"
                    >
                      ডিলিট
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* Viva Selected — PDF Download */}
        <Card
          className="shadow-sm border border-gray-200 mb-6"
          title={
            <span className="flex items-center gap-2">
              <FilePdfOutlined />
              Viva Selected Candidates 2026 — PDF Export
            </span>
          }
          extra={
            <Button type="default" size="small" icon={<ReloadOutlined />} loading={vivaListLoading} onClick={fetchVivaSelectedList}>
              Refresh List
            </Button>
          }
        >
          <Text type="secondary" className="block mb-3">
            Class 3–5: 75% of 45 marks; others: 65% of 100. Load list then choose PDF type.
          </Text>
          {vivaList.length > 0 && <Tag color="green" className="mb-3">{vivaList.length} candidate(s) loaded</Tag>}
          <Space wrap size="middle">
            <Button
              type="primary"
              size="middle"
              icon={<DownloadOutlined />}
              loading={pdfGenerating || vivaListLoading}
              onClick={handleDownloadPdf1AllList}
              className="bg-blue-600 hover:!bg-blue-700"
            >
              PDF 1: All list (no viva, no phone)
            </Button>
            <Button
              type="primary"
              size="middle"
              icon={<DownloadOutlined />}
              loading={pdfGenerating || vivaListLoading}
              onClick={handleDownloadPdf2RoomSlot}
              className="bg-green-600 hover:!bg-green-700"
            >
              PDF 2: Room & slot wise (viva + phone)
            </Button>
          </Space>
        </Card>

        {searchResult && (
          <Card
            title={
              <span>
                বর্তমান রেকর্ড{" "}
                <Tag color="blue">{searchResult.scholarshipRollNumber}</Tag>
              </span>
            }
            className="shadow-sm border border-gray-200"
          >
            <Table
              columns={tableColumns}
              dataSource={[
                {
                  key: "1",
                  scholarshipRollNumber: searchResult.scholarshipRollNumber,
                  correctAnswer: searchResult.correctAnswer,
                  vibaMarks: searchResult.vibaMarks,
                },
              ]}
              pagination={false}
              size="small"
              bordered
            />
          </Card>
        )}

        {/* Result calculation config: two parts — ৩য়–৫ম and ৬ষ্ঠ–১২শ (dropdown value drives stats below) */}
        <Card
          className="shadow-sm border border-gray-200 mb-6"
          title={
            <span>
              <SettingOutlined className="mr-2" />
              রেজাল্ট ক্যালকুলেশন কনফিগ
            </span>
          }>
          <Spin spinning={configLoading} tip="কনফিগ লোড হচ্ছে...">
            {!configLoading && (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card size="small" title="৩য়–৫ম শ্রেণী" className="bg-green-50/50 border-green-200">
                    <Text type="secondary" className="block mb-2" style={{ fontSize: 12 }}>
                      হাই মার্কস / ৭৫%+ থ্রেশহোল্ড (মোট ৪৫ নম্বরের ভিত্তিতে)
                    </Text>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={selectedPercentClass3To5}
                        placeholder="নির্বাচন করুন (৬০–৯০%)"
                        options={percentOptions}
                        onChange={setSelectedPercentClass3To5}
                        style={{ minWidth: 120 }}
                        allowClear
                      />
                      <Button
                        type="primary"
                        size="small"
                        icon={<SaveOutlined />}
                        loading={configSavingClass3To5}
                        onClick={saveResultCalculationConfigClass3To5}>
                        সেভ করুন
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title="৬ষ্ঠ–১২শ শ্রেণী" className="bg-blue-50/50 border-blue-200">
                    <Text type="secondary" className="block mb-2" style={{ fontSize: 12 }}>
                      হাই মার্কস / ৭৫%+ থ্রেশহোল্ড (মোট ১০০ নম্বরের ভিত্তিতে)
                    </Text>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={selectedPercentClass6To12}
                        placeholder="নির্বাচন করুন (৬০–৯০%)"
                        options={percentOptions}
                        onChange={setSelectedPercentClass6To12}
                        style={{ minWidth: 120 }}
                        allowClear
                      />
                      <Button
                        type="primary"
                        size="small"
                        icon={<SaveOutlined />}
                        loading={configSavingClass6To12}
                        onClick={saveResultCalculationConfigClass6To12}>
                        সেভ করুন
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col span={24}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    সেভ করার পর নিচের রেজাল্ট স্ট্যাটিস্টিক্স ও লিস্টগুলো এই মান অনুযায়ী আপডেট হবে।
                  </Text>
                </Col>
              </Row>
            )}
          </Spin>
        </Card>

         {/* Result Stats — two groups: ৩য়–৫ম and ৬ষ্ঠ–১২শ */}
        <Spin spinning={statsLoading} tip="স্ট্যাটস লোড হচ্ছে...">
          {!statsLoading && (class3To5 || class6To12 || overall) && (
            <Card
              className="shadow-sm border border-gray-200 mb-6"
              title={
                <span>
                  <BarChartOutlined className="mr-2" />
                  রেজাল্ট স্ট্যাটিস্টিক্স
                  <Text type="secondary" className="block mt-1" style={{ fontSize: 13, fontWeight: "normal" }}>
                    মোট ভাইভা নির্বাচিত: {totalVivaSelected} জন (৩য়–৫ম: {class3To5?.got70Count ?? 0} + ৬ষ্ঠ–১২শ: {class6To12?.got70Count ?? 0})
                  </Text>
                </span>
              }
              extra={
                <Button type="text" size="small" icon={<ReloadOutlined />} onClick={fetchResultStats}>
                  রিফ্রেশ
                </Button>
              }>
              <Row gutter={[24, 24]}>
                {/* গ্রুপ ১: ৩য়–৫ম শ্রেণী */}
                <Col xs={24} lg={12}>
                  <Card size="small" title="৩য়–৫ম শ্রেণী" className="bg-green-50/30 border-green-200 h-full">
                    {class3To5 && (
                      <>
                        <Row gutter={[12, 12]} className="mb-4">
                          <Col xs={12}>
                            <Card size="small" className="bg-blue-50 border-blue-200">
                              <Statistic title={<Text type="secondary">উপস্থিত</Text>} value={class3To5.totalPresent} />
                            </Card>
                          </Col>
                          <Col xs={12}>
                            <Card size="small" className="bg-green-50 border-green-200">
                              <Statistic title={<Text type="secondary">রেজাল্ট যোগ (%)</Text>} value={class3To5.resultAddedRatioPercent} suffix="%" />
                            </Card>
                          </Col>
                          <Col xs={12}>
                            <Card size="small" className="bg-purple-50 border-purple-200">
                              <Statistic title={<Text type="secondary">পাস (%)</Text>} value={class3To5.passRatioPercent} suffix="%" />
                            </Card>
                          </Col>
                          <Col xs={12}>
                            <Card size="small" className="bg-amber-50 border-amber-200">
                              <Statistic title={<Text type="secondary">{highPercentClass3To5}%+ (%)</Text>} value={class3To5.got70RatioPercent} suffix="%" />
                            </Card>
                          </Col>
                        </Row>
                        <Card size="small" title="শ্রেণী অনুযায়ী (বার চার্ট)" className="mb-4">
                          <div style={{ height: 260 }}>
                            {byClass3To5.length > 0 ? (
                              <Bar
                                data={barChartDataClass3To5}
                                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } }, scales: { x: { stacked: false, ticks: { maxRotation: 45 } }, y: { beginAtZero: true, stacked: false } } }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-500">কোন ডেটা নেই</div>
                            )}
                          </div>
                        </Card>
                        <Card
                          size="small"
                          title={
                            <span>
                              শ্রেণী অনুযায়ী {highPercentClass3To5}%+ প্রাপ্ত ছাত্রসংখ্যা
                              <Text type="secondary" className="block mt-1" style={{ fontSize: 12, fontWeight: "normal" }}>
                                মোট: {class3To5.got70Count ?? 0} জন
                              </Text>
                            </span>
                          }
                          className="mb-0">
                          <ul className="list-none p-0 m-0 flex flex-wrap gap-2">
                            {[...byClass3To5]
                              .sort((a, b) => String(a.class).localeCompare(String(b.class), undefined, { numeric: true }))
                              .map((r) => {
                                const count = r.got70Count ?? 0;
                                return (
                                  <li key={r.class} className={`flex items-center justify-between gap-3 py-1.5 px-3 rounded-lg border text-sm ${count > 0 ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
                                    <span className="font-medium text-gray-800">শ্রেণী {r.class}</span>
                                    <Tag color={count > 0 ? "orange" : "default"}>{count} জন</Tag>
                                  </li>
                                );
                              })}
                          </ul>
                        </Card>
                      </>
                    )}
                    {!class3To5 && <Text type="secondary">কোন ডেটা নেই</Text>}
                  </Card>
                </Col>

                {/* গ্রুপ ২: ৬ষ্ঠ–১২শ শ্রেণী */}
                <Col xs={24} lg={12}>
                  <Card size="small" title="৬ষ্ঠ–১২শ শ্রেণী" className="bg-blue-50/30 border-blue-200 h-full">
                    {class6To12 && (
                      <>
                        <Row gutter={[12, 12]} className="mb-4">
                          <Col xs={12}>
                            <Card size="small" className="bg-blue-50 border-blue-200">
                              <Statistic title={<Text type="secondary">উপস্থিত</Text>} value={class6To12.totalPresent} />
                            </Card>
                          </Col>
                          <Col xs={12}>
                            <Card size="small" className="bg-green-50 border-green-200">
                              <Statistic title={<Text type="secondary">রেজাল্ট যোগ (%)</Text>} value={class6To12.resultAddedRatioPercent} suffix="%" />
                            </Card>
                          </Col>
                          <Col xs={12}>
                            <Card size="small" className="bg-purple-50 border-purple-200">
                              <Statistic title={<Text type="secondary">পাস (%)</Text>} value={class6To12.passRatioPercent} suffix="%" />
                            </Card>
                          </Col>
                          <Col xs={12}>
                            <Card size="small" className="bg-amber-50 border-amber-200">
                              <Statistic title={<Text type="secondary">{highPercentClass6To12}%+ (%)</Text>} value={class6To12.got70RatioPercent} suffix="%" />
                            </Card>
                          </Col>
                        </Row>
                        <Card size="small" title="শ্রেণী অনুযায়ী (বার চার্ট)" className="mb-4">
                          <div style={{ height: 260 }}>
                            {byClass6To12.length > 0 ? (
                              <Bar
                                data={barChartDataClass6To12}
                                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } }, scales: { x: { stacked: false, ticks: { maxRotation: 45 } }, y: { beginAtZero: true, stacked: false } } }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-500">কোন ডেটা নেই</div>
                            )}
                          </div>
                        </Card>
                        <Card
                          size="small"
                          title={
                            <span>
                              শ্রেণী অনুযায়ী {highPercentClass6To12}%+ প্রাপ্ত ছাত্রসংখ্যা
                              <Text type="secondary" className="block mt-1" style={{ fontSize: 12, fontWeight: "normal" }}>
                                মোট: {class6To12.got70Count ?? 0} জন
                              </Text>
                            </span>
                          }
                          className="mb-0">
                          <ul className="list-none p-0 m-0 flex flex-wrap gap-2">
                            {[...byClass6To12]
                              .sort((a, b) => String(a.class).localeCompare(String(b.class), undefined, { numeric: true }))
                              .map((r) => {
                                const count = r.got70Count ?? 0;
                                return (
                                  <li key={r.class} className={`flex items-center justify-between gap-3 py-1.5 px-3 rounded-lg border text-sm ${count > 0 ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
                                    <span className="font-medium text-gray-800">শ্রেণী {r.class}</span>
                                    <Tag color={count > 0 ? "orange" : "default"}>{count} জন</Tag>
                                  </li>
                                );
                              })}
                          </ul>
                        </Card>
                      </>
                    )}
                    {!class6To12 && <Text type="secondary">কোন ডেটা নেই</Text>}
                  </Card>
                </Col>
              </Row>

              {/* শ্রেণী অনুযায়ী টপ ৫ লিডারবোর্ড */}
              {top5ByClassEntries.length > 0 && (
                <Card
                  size="small"
                  title={
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🏆</span>
                      শ্রেণী অনুযায়ী টপ ৫ (রোল ও নম্বর)
                    </span>
                  }
                  className="mt-4 mb-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {top5ByClassEntries.map(([cls, list]) => {
                      const items = Array.isArray(list) ? list : [];
                      if (items.length === 0) return null;
                      const rankColors = ["bg-amber-100 border-amber-300 text-amber-800", "bg-gray-100 border-gray-300 text-gray-700", "bg-orange-100 border-orange-300 text-orange-800", "bg-slate-50 border-slate-200 text-slate-600", "bg-slate-50 border-slate-200 text-slate-600"];
                      const rankBadge = (i) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1);
                      return (
                        <div
                          key={`top5-${cls}`}
                          className="rounded-xl border-2 border-green-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2.5 font-bold text-sm text-center">
                            শ্রেণী {cls}
                          </div>
                          <div className="p-2 space-y-1.5">
                            {items.map((row, i) => (
                              <div
                                key={`${cls}-${i}-${row.scholarshipRollNumber}`}
                                className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-sm ${rankColors[i] ?? "bg-slate-50 border-slate-200"}`}>
                                <span className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-base flex-shrink-0">{rankBadge(i)}</span>
                                  <span className="font-semibold text-gray-800 truncate">{row.scholarshipRollNumber}</span>
                                </span>
                                <Tag color="blue" className="!m-0 flex-shrink-0 font-bold">
                                  {row.marks}
                                </Tag>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </Card>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default AddResult;
