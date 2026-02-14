import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ScholarshipInsert from "./ScholarshipInsert";
import {
  Alert,
  Button,
  Modal,
  Pagination,
  Popconfirm,
  Spin,
  Collapse,
} from "antd";
import { coreAxios } from "../../utilities/axios";
import jsPDF from "jspdf";
import AdmitCard from "../Dashboard/AdmitCard";
import { formatDate } from "../../utilities/dateFormate";
import ScholarshipUpdate from "./ScholarshipUpdate";
import QrReader from "react-qr-scanner";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const { Panel } = Collapse;

const Scholarship = () => {
  const navigate = useHistory();
  const [showDialog, setShowDialog] = useState(false);
  const [showDialog1, setShowDialog1] = useState(false);
  const [selectedRoll, setSelectedRoll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [rowData, setRowData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrScanResult, setQrScanResult] = useState("");
  const [facingMode, setFacingMode] = useState("environment");
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [rollData, setRollData] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    fetchScholarshipInfo();
  };

  const fetchScholarshipInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/scholarship-info`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.submittedAt) - new Date(a?.submittedAt);
        });
        setRollData(sortedData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };

  const uniqueInstitutes = [
    ...new Set(rollData.map((item) => item.institute.trim())),
  ];

  const instituteCount = uniqueInstitutes.length;

  const class6to10 = rollData.filter((item) => {
    const classNumber = parseInt(item.instituteClass);
    return classNumber >= 6 && classNumber <= 10;
  });

  const otherClasses = rollData.filter((item) => {
    const classNumber = parseInt(item.instituteClass);
    return classNumber < 6 || classNumber > 10;
  });

  const countClass6to10 = class6to10.length;
  const countOtherClasses = otherClasses.length;

  useEffect(() => {
    fetchScholarshipInfo();
  }, []);

  const onHideDialog = () => {
    setShowDialog(false);
    setShowDialog1(false);
  };

  const handleEditClick = async (RollID) => {
    setIsModalOpen2(true);
  };

  const handleDelete = async (RollID) => {
    console.log(RollID);
    try {
      setLoading(true);
      const response = await coreAxios.delete(`/scholarship-info/${RollID}`);
      if (response.data) {
        setLoading(false);
        fetchScholarshipInfo();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const previewStyle = {
    height: "auto",
    width: "100%",
    maxHeight: "400px",
  };

  const handleBackClick = () => {
    history.goBack();
  };

  const confirm = (e) => {
    console.log(e);
    toast.success("Click on Yes");
  };

  const onChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const cancel = (e) => {
    console.log(e);
    toast.error("Click on No");
  };

  const filteredRolls = rollData.filter((roll) =>
    searchQuery
      ? Object.values(roll)
          .join("")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRolls.slice(indexOfFirstItem, indexOfLastItem);

  const handleScan = (data) => {
    if (data) {
      setShowQrScanner(false);
      setQrScanResult(data.text);
      const filteredRoll = rollData?.find(
        (roll) => roll.scholarshipRollNumber === data.text
      );
      if (filteredRoll) {
        updateAttendanceStatus(filteredRoll);
      } else {
        toast.error(`User Didn't Matched`);
      }
    }
  };

  const updateAttendanceStatus = async (data) => {
    try {
      const allData = {
        ...data,
        isAttendanceComplete: true,
      };
      const res = await coreAxios.put(`/scholarship-info/${data._id}`, allData);
      if (res?.status === 200) {
        toast.success("Attendance Completed!");
        fetchScholarshipInfo();
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const constraints = {
    video: {
      facingMode: "environment", // Use back camera (remove exact to allow fallback)
    },
  };

  // Function to determine scholarship grade based on class and marks
  const getScholarshipGrade = (student) => {
    if (!student.resultDetails || student.resultDetails.length === 0)
      return null;

    const classNumber = parseInt(student.instituteClass);
    const totalMarks = student.resultDetails[0].totalMarks;

    // For classes 3 to 5
    if (classNumber >= 3 && classNumber <= 5) {
      if (totalMarks >= 45 && totalMarks <= 48) {
        return "General Grade";
      } else if (totalMarks >= 49 && totalMarks <= 50) {
        return "Talentpool Grade";
      }
    }
    // For classes 6, 7, and 8
    else if (classNumber >= 6 && classNumber <= 8) {
      if (totalMarks >= 75 && totalMarks < 90) {
        return "General Grade";
      } else if (totalMarks >= 90 && totalMarks <= 100) {
        return "Talentpool Grade";
      }
    }
    // For classes 9 and 10
    else if (classNumber >= 9 && classNumber <= 10) {
      if (totalMarks >= 80 && totalMarks < 90) {
        return "General Grade";
      } else if (totalMarks >= 90 && totalMarks <= 100) {
        return "Talentpool Grade";
      }
    }

    return null;
  };

  // Count scholarship grades
  const countScholarshipGrades = () => {
    let generalGradeCount = 0;
    let talentpoolGradeCount = 0;
    let totalResultDetailsCount = 0;
    let isScholarshipedCount = 0;

    rollData.forEach((student) => {
      if (student.resultDetails && student.resultDetails.length > 0) {
        totalResultDetailsCount += student.resultDetails.length;
        const grade = getScholarshipGrade(student);

        if (grade === "General Grade") {
          generalGradeCount++;
          isScholarshipedCount++;
        } else if (grade === "Talentpool Grade") {
          talentpoolGradeCount++;
          isScholarshipedCount++;
        }
      }
    });

    return {
      generalGradeCount,
      talentpoolGradeCount,
      totalResultDetailsCount,
      isScholarshipedCount,
    };
  };

  const {
    generalGradeCount,
    talentpoolGradeCount,
    totalResultDetailsCount,
    isScholarshipedCount,
  } = countScholarshipGrades();

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Name",
      "Gender",
      "Roll Number",
      "Institute",
      "Class",
      "Phone",
      "Date",
      "SMS Sent",
      "Attendance",
      "Total Marks",
      "Scholarship Grade",
    ];

    const tableRows = filteredRolls.map((roll) => [
      roll.name,
      roll.gender,
      roll.scholarshipRollNumber,
      roll.institute,
      roll.instituteClass,
      roll.phone,
      new Date(roll.submittedAt).toLocaleDateString(),
      roll.isSmsSend ? "Yes" : "No",
      roll.isAttendanceComplete ? "Present" : "Not Present",
      roll.resultDetails?.[0]?.totalMarks || "N/A",
      getScholarshipGrade(roll) || "Not Qualified",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("ScholarshipData.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRolls.map((roll) => ({
        Name: roll.name,
        RollNumber: roll.scholarshipRollNumber,
        Institute: roll.institute,
        Class: roll.instituteClass,
        Phone: roll.phone,
        Date: new Date(roll.submittedAt).toLocaleDateString(),
        "SMS Sent": roll.isSmsSend ? "Yes" : "No",
        Attendance: roll.isAttendanceComplete ? "Present" : "Not Present",
        "Total Marks": roll.resultDetails?.[0]?.totalMarks || "N/A",
        "Scholarship Grade": getScholarshipGrade(roll) || "Not Qualified",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ScholarshipData");
    XLSX.writeFile(workbook, "ScholarshipData.xlsx");
  };

  // Helper function to get gender prefix
  const getGenderPrefix = (gender) => {
    if (!gender) return "";
    const genderLower = gender.toLowerCase();
    if (genderLower === "male") return "M";
    if (genderLower === "female") return "F";
    return "";
  };

  // Helper function to format roll number with gender prefix
  const formatRollNumberWithGender = (rollNumber, gender) => {
    const prefix = getGenderPrefix(gender);
    return prefix ? `${rollNumber}${prefix}` : rollNumber;
  };

  const exportClassWisePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    // Design Constants
    const PRIMARY_COLOR = [46, 125, 50]; // Dark green
    const TEXT_COLOR = [0, 0, 0]; // Black
    const HEADER_FONT_SIZE = 16; // Header size
    const BODY_FONT_SIZE = 10; // Body font size
    const LINE_HEIGHT = 7; // Line spacing
    const CELL_PADDING = 3; // Cell padding

    // Helper function to normalize class name to number
    const normalizeClassToNumber = (className) => {
      if (!className) return null;
      const classStr = className.toString().toLowerCase().trim();
      
      // Handle numeric classes
      const numMatch = classStr.match(/^(\d+)/);
      if (numMatch) {
        return parseInt(numMatch[1]);
      }
      
      // Handle text class names
      const classMap = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
      };
      
      return classMap[classStr] || null;
    };

    // Filter and group students by class (only classes 1-10)
    const classGroups = rollData.reduce((groups, student) => {
      const className = student.instituteClass;
      const classNum = normalizeClassToNumber(className);
      
      // Only include classes 1-10
      if (classNum !== null && classNum >= 1 && classNum <= 10) {
        // Use normalized class number as key for consistent grouping
        const classKey = classNum.toString();
        if (!groups[classKey]) groups[classKey] = [];
        groups[classKey].push(student);
      }
      return groups;
    }, {});

    // Sort classes numerically (1 to 10)
    const sortedClasses = Object.keys(classGroups)
      .filter(className => {
        const classNum = parseInt(className);
        return !isNaN(classNum) && classNum >= 1 && classNum <= 10;
      })
      .sort((a, b) => parseInt(a) - parseInt(b));

    // Check if there are any classes to process
    if (sortedClasses.length === 0) {
      toast.error("No students found in classes 1-10");
      return;
    }

    // Get page dimensions for landscape
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10; // Margin on each side
    const availableWidth = pageWidth - (margin * 2);
    
    // Column Widths (as percentages of available width)
    const COLUMN_WIDTHS = {
      serial: availableWidth * 0.05, // 5% - Serial No
      roll: availableWidth * 0.12, // 12% - Roll Number (with M/F suffix)
      name: availableWidth * 0.20, // 20% - Name
      institute: availableWidth * 0.30, // 30% - Institute
      phone: availableWidth * 0.12, // 12% - Phone
      marks: availableWidth * 0.08, // 8% - Total Marks
      grade: availableWidth * 0.13, // 13% - Scholarship Grade
    };

    // Process each class (1-10)
    sortedClasses.forEach((className, classIndex) => {
      // Add new page for classes after the first one
      if (classIndex > 0) {
        doc.addPage("landscape");
      }

      // Header (landscape: 792 x 612 points)
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      doc.setFillColor(...PRIMARY_COLOR);
      doc.rect(0, 0, pageWidth, 14, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(HEADER_FONT_SIZE);
      doc.setFont("helvetica", "bold");
      doc.text(`DMF Scholarship 2026 - Class ${className}`, pageWidth / 2, 9, {
        align: "center",
        baseline: "middle",
      });

      // Sort students: first by gender (M first, then F), then by roll number
      const sortedStudents = classGroups[className].sort((a, b) => {
        // Get gender prefix for sorting
        const genderA = getGenderPrefix(a.gender);
        const genderB = getGenderPrefix(b.gender);
        
        // Sort by gender first: M comes before F, F comes before empty
        if (genderA !== genderB) {
          if (genderA === "M") return -1; // M comes first
          if (genderB === "M") return 1; // M comes first
          if (genderA === "F") return -1; // F comes before empty
          if (genderB === "F") return 1; // F comes before empty
        }
        
        // If same gender, sort by roll number
        const rollA = a.scholarshipRollNumber || "";
        const rollB = b.scholarshipRollNumber || "";
        return rollA.localeCompare(rollB, undefined, { numeric: true });
      });

      // Check if there are students in this class
      if (sortedStudents.length === 0) {
        // Still show header even if no students
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(BODY_FONT_SIZE);
        doc.setFont("helvetica", "normal");
        doc.text("No students found in this class.", pageWidth / 2, 30, {
          align: "center",
        });
        return;
      }

      // Prepare table data with formatted roll number (with M/F) and store gender info
      const tableData = sortedStudents.map((student, index) => [
        index + 1,
        formatRollNumberWithGender(
          student.scholarshipRollNumber || "N/A",
          student.gender
        ),
        student.name || "N/A",
        student.institute || "N/A",
        student.phone
          ? student.phone.toString().replace(/^(\d)/, "0$1")
          : "N/A",
        student.resultDetails?.[0]?.totalMarks || "N/A",
        getScholarshipGrade(student) || "N/A",
      ]);

      // Store gender information for row styling
      const studentGenders = sortedStudents.map(student => getGenderPrefix(student.gender));

      // Color definitions
      const MALE_BG_COLOR = [230, 242, 255]; // Light blue for males
      const FEMALE_BG_COLOR = [255, 230, 242]; // Light pink for females
      const DEFAULT_BG_COLOR = [245, 245, 245]; // Light gray for others

      // Create table
      doc.autoTable({
        head: [
          [
            "#",
            "Roll No",
            "Name",
            "Institute",
            "Phone",
            "Marks",
            "Grade",
          ],
        ],
        body: tableData,
        startY: 18, // Below header
        margin: { left: margin, right: margin, top: 18 },
        styles: {
          fontSize: BODY_FONT_SIZE,
          cellPadding: CELL_PADDING,
          lineHeight: LINE_HEIGHT,
          textColor: TEXT_COLOR,
          lineWidth: 0.25,
          lineColor: [200, 200, 200],
          font: "helvetica",
        },
        columnStyles: {
          0: { cellWidth: COLUMN_WIDTHS.serial, halign: "center" },
          1: { cellWidth: COLUMN_WIDTHS.roll, halign: "center", fontStyle: "bold" },
          2: { cellWidth: COLUMN_WIDTHS.name },
          3: { cellWidth: COLUMN_WIDTHS.institute },
          4: { cellWidth: COLUMN_WIDTHS.phone },
          5: { cellWidth: COLUMN_WIDTHS.marks, halign: "center" },
          6: { cellWidth: COLUMN_WIDTHS.grade, halign: "center" },
        },
        headStyles: {
          fillColor: PRIMARY_COLOR,
          textColor: 255,
          fontSize: BODY_FONT_SIZE + 1,
          cellPadding: CELL_PADDING + 0.5,
          fontStyle: "bold",
        },
        bodyStyles: {
          valign: "middle",
        },
        didParseCell: function (data) {
          // Apply background color based on gender for body rows
          if (data.section === 'body' && data.row.index < studentGenders.length) {
            const gender = studentGenders[data.row.index];
            if (gender === "M") {
              data.cell.styles.fillColor = MALE_BG_COLOR;
            } else if (gender === "F") {
              data.cell.styles.fillColor = FEMALE_BG_COLOR;
            } else {
              data.cell.styles.fillColor = DEFAULT_BG_COLOR;
            }
          }
        },
        theme: "grid",
      });
    });

    // Save with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    doc.save(`DMF-Scholarship-Class-Wise-${timestamp}.pdf`);
  };

  const countAttendanceComplete = rollData?.filter(
    (item) => item?.isAttendanceComplete === true
  )?.length;

  // Group students by class
  const groupStudentsByClass = () => {
    const classGroups = {};

    rollData.forEach((student) => {
      const className = student.instituteClass;
      if (!classGroups[className]) {
        classGroups[className] = [];
      }
      classGroups[className].push(student);
    });

    return classGroups;
  };

  const classGroups = groupStudentsByClass();

  if (loading) {
    return (
      <Spin tip="Loading...">
        <Alert
          message="Loading Data"
          description="Further details about the context of this alert."
          type="info"
        />
      </Spin>
    );
  }

  return (
    <>
      <div className="px-0 py-0 bg-gradient-to-br from-gray-50 to-white min-h-screen">
          {/* Action Bar */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-green-100  md:p-4 mb-4 md:mb-6 mx-0">
            {/* All Buttons - 2 rows on mobile, 1 row on desktop */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
              <button
                className="font-semibold inline-flex items-center justify-center gap-1 md:gap-2 rounded-lg text-xs md:text-sm lg:text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-1.5 md:py-2 px-2 md:px-3 lg:px-4 text-white shadow-md hover:shadow-lg transition-all whitespace-nowrap w-full"
                onClick={() => showModal()}>
                <i className="pi pi-plus font-semibold text-xs md:text-sm"></i>
                <span className="text-xs md:text-sm lg:text-base">NEW</span>
              </button>

              <button
                className="font-semibold inline-flex items-center justify-center gap-1 md:gap-2 rounded-lg text-xs md:text-sm lg:text-base bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 py-1.5 md:py-2 px-2 md:px-3 lg:px-4 text-white shadow-md hover:shadow-lg transition-all whitespace-nowrap w-full"
                onClick={handleBackClick}>
                <i className="pi pi-arrow-left font-semibold text-xs md:text-sm"></i>
                <span className="text-xs md:text-sm lg:text-base">BACK</span>
              </button>

              <button
                className="font-semibold inline-flex items-center justify-center gap-1 md:gap-2 rounded-lg text-xs md:text-sm lg:text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-1.5 md:py-2 px-2 md:px-3 lg:px-4 text-white shadow-md hover:shadow-lg transition-all whitespace-nowrap w-full"
                onClick={() => setShowQrScanner(!showQrScanner)}>
                <i className="pi pi-qrcode font-semibold text-xs md:text-sm"></i>
                <span className="text-xs md:text-sm lg:text-base">Scan QR</span>
              </button>

              <button
                className="font-semibold inline-flex items-center justify-center gap-1 md:gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-1.5 md:py-2 px-2 md:px-3 lg:px-4 text-xs md:text-sm lg:text-base shadow-md hover:shadow-lg transition-all whitespace-nowrap w-full"
                onClick={exportToPDF}>
                <i className="pi pi-file-pdf text-xs md:text-sm"></i>
                <span className="text-xs md:text-sm lg:text-base">PDF</span>
              </button>

              <button
                className="font-semibold inline-flex items-center justify-center gap-1 md:gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-1.5 md:py-2 px-2 md:px-3 lg:px-4 text-xs md:text-sm lg:text-base shadow-md hover:shadow-lg transition-all whitespace-nowrap w-full"
                onClick={exportToExcel}>
                <i className="pi pi-file-excel text-xs md:text-sm"></i>
                <span className="text-xs md:text-sm lg:text-base">Excel</span>
              </button>

              <button
                className="font-semibold inline-flex items-center justify-center gap-1 md:gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-1.5 md:py-2 px-2 md:px-3 lg:px-4 text-xs md:text-sm lg:text-base shadow-md hover:shadow-lg transition-all whitespace-nowrap w-full"
                onClick={exportClassWisePDF}>
                <i className="pi pi-file-pdf text-xs md:text-sm"></i>
                <span className="text-xs md:text-sm lg:text-base">Class PDF</span>
              </button>
            </div>

            {/* Stats Bar */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 md:p-4 mb-4 md:mb-6 border-2 border-green-100 mt-2 md:mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  {/* Header Title and Categories */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-extrabold text-gray-800">
                      DMF Scholarship 2026
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                      <span className="bg-green-100 text-green-700 px-2 md:px-3 py-1 rounded-full font-semibold">
                        Senior Category: {countClass6to10}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-2 md:px-3 py-1 rounded-full font-semibold">
                        Junior Category: {countOtherClasses}
                      </span>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm lg:text-base">
                    <span className="font-semibold text-gray-700">
                      Applications: <span className="text-green-600">{rollData?.length}</span>
                    </span>
                    <span className="font-semibold text-gray-700">
                      Present: <span className="text-green-600">{countAttendanceComplete}</span>
                    </span>
                    <span className="font-semibold text-gray-700">
                      Results: <span className="text-blue-600">{totalResultDetailsCount}</span>
                    </span>
                    <span className="font-semibold text-gray-700">
                      Scholarship: <span className="text-purple-600">{isScholarshipedCount}</span>
                    </span>
                    <span className="font-semibold text-gray-700">
                      T-Grade: <span className="text-green-600">{talentpoolGradeCount}</span>
                    </span>
                    <span className="font-semibold text-gray-700">
                      G-Grade: <span className="text-blue-600">{generalGradeCount}</span>
                    </span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    id="table-search-users"
                    className="block py-2 ps-10 pe-4 text-sm md:text-base text-gray-900 border-2 border-green-200 rounded-lg w-full md:w-64 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          {showQrScanner && (
            <div className="mb-4 md:mb-6 bg-white rounded-xl shadow-lg border-2 border-green-100 p-2 md:p-4 lg:p-6 mx-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">
                  QR Code Scanner
                </h3>
                <button
                  onClick={() => setShowQrScanner(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl">
                  <i className="pi pi-times"></i>
                </button>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-md rounded-lg overflow-hidden border-2 border-green-200">
                  <QrReader
                    delay={300}
                    style={{ width: "100%", height: "auto" }}
                    onError={handleError}
                    onScan={handleScan}
                    facingMode="environment"
                    constraints={constraints}
                  />
                </div>
                <button
                  onClick={() =>
                    setFacingMode(
                      facingMode === "environment" ? "user" : "environment"
                    )
                  }
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <i className="pi pi-refresh mr-2"></i>
                  Switch Camera
                </button>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-green-100 overflow-hidden mb-4 md:mb-6 mx-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base text-left text-gray-700">
                <thead className="text-xs md:text-sm text-gray-700 uppercase bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <tr>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold">
                    Image
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold">
                    Roll
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold hidden md:table-cell">
                    Seat Plan
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold">
                    Name
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold hidden lg:table-cell">
                    Gender
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold hidden lg:table-cell">
                    Institute
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold">
                    Class
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold hidden md:table-cell">
                    Date
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold hidden lg:table-cell">
                    Phone
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold hidden md:table-cell">
                    SMS
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold">
                    Attend
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold">
                    Marks
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold">
                    Grade
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold hidden lg:table-cell">
                    Created By
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold">
                    Admit
                  </th>
                  <th className="border border-green-200 text-center p-2 md:p-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentItems?.map((roll, index) => {
                  const scholarshipGrade = getScholarshipGrade(roll);
                  return (
                    <tr
                      key={roll?.scholarshipRollNumber}
                      className={`hover:bg-green-50 transition-colors ${
                        roll?.isAttendanceComplete &&
                        "bg-green-50"
                      } ${
                        scholarshipGrade === "Talentpool Grade"
                          ? "bg-green-50"
                          : scholarshipGrade === "General Grade"
                          ? "bg-blue-50"
                          : "bg-white"
                      }`}>
                      <td className="border border-green-200 p-2 text-center">
                        <div className="flex justify-center">
                          <img
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-green-200 cursor-pointer hover:scale-110 transition-transform duration-200"
                            src={roll?.image}
                            alt={roll?.name}
                            onClick={() => {
                              setSelectedImage(roll?.image);
                              setSelectedImageName(roll?.name);
                              setImageModalVisible(true);
                            }}
                          />
                        </div>
                      </td>
                      <td className="border border-green-200 p-2 text-center font-medium">
                        {roll?.scholarshipRollNumber}
                      </td>
                      <td className="border border-green-200 p-2 text-center hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          roll?.isSeatPlaned 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {roll?.isSeatPlaned ? "Send" : "Not Send"}
                        </span>
                      </td>
                      <td className="border border-green-200 p-2 text-center font-medium">
                        {roll.name}
                      </td>
                      <td className="border border-green-200 p-2 text-center hidden lg:table-cell">
                        {roll.gender}
                      </td>
                      <td className="border border-green-200 p-2 text-center hidden lg:table-cell truncate max-w-xs">
                        {roll.institute}
                      </td>
                      <td className="border border-green-200 p-2 text-center font-semibold">
                        {roll.instituteClass}
                      </td>
                      <td className="border border-green-200 p-2 text-center hidden md:table-cell text-xs">
                        {formatDate(roll.submittedAt)}
                      </td>
                      <td className="border border-green-200 p-2 text-center hidden lg:table-cell text-xs">
                        {typeof roll?.phone === "string" &&
                        roll?.phone?.startsWith("0")
                          ? roll?.phone
                          : `0${roll?.phone}`}
                      </td>
                      <td className="border border-green-200 p-2 text-center hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          roll?.isSmsSend 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {roll?.isSmsSend ? "Send" : "Not Send"}
                        </span>
                      </td>
                      <td className="border border-green-200 p-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          roll?.isAttendanceComplete 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {roll?.isAttendanceComplete ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="border border-green-200 p-2 text-center font-semibold">
                        {roll?.resultDetails?.[0]?.totalMarks || "N/A"}
                      </td>
                      <td className="border border-green-200 p-2 text-center font-semibold">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          scholarshipGrade === "Talentpool Grade"
                            ? "bg-green-200 text-green-800"
                            : scholarshipGrade === "General Grade"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {scholarshipGrade || "N/A"}
                        </span>
                      </td>
                      <td className="border border-green-200 p-2 text-center hidden lg:table-cell text-xs">
                        {roll?.createdByName}
                      </td>
                      <td className="border border-green-200 p-2 text-center">
                        <button
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-1 px-2 md:px-3 rounded-lg text-xs md:text-sm shadow-sm hover:shadow-md transition-all"
                          onClick={() => {
                            history.push(`/admitCard/${roll?._id}`);
                          }}>
                          Download
                        </button>
                      </td>
                      <td className="border border-green-200 p-2">
                        <div className="flex justify-center items-center gap-1 md:gap-2">
                          <button
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-1 px-2 md:px-3 rounded-lg text-xs md:text-sm shadow-sm hover:shadow-md transition-all"
                            onClick={() => {
                              setRowData(roll);
                              handleEditClick(roll._id);
                            }}>
                          Edit
                          </button>
                          {!roll?.isSmsSend && (
                            <Popconfirm
                              title="Delete Application"
                              description="Are you sure to delete this application?"
                              onConfirm={() => {
                                handleDelete(roll?._id);
                              }}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No">
                              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-1 px-2 md:px-3 rounded-lg text-xs md:text-sm shadow-sm hover:shadow-md transition-all">
                               Delete
                              </button>
                            </Popconfirm>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
            <div className="flex justify-center p-4 bg-gray-50 border-t border-green-200">
              <Pagination
                showQuickJumper
                current={currentPage}
                total={filteredRolls.length}
                pageSize={itemsPerPage}
                onChange={onChange}
                showSizeChanger={false}
                showTotal={(total) => `Total ${total} applications`}
                className="text-sm md:text-base"
              />
            </div>
          </div>

          {/* Class-wise Student List Section */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-green-100 mx-0">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
              Class-wise Student List
            </h3>
            <Collapse accordion className="bg-transparent">
              {Object.keys(classGroups)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((className) => (
                  <Panel
                    header={
                      <span className="font-bold text-base md:text-lg">
                        Class {className} ({classGroups[className].length} students)
                      </span>
                    }
                    key={className}
                    className="mb-2 border-2 border-green-200 rounded-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                          <tr>
                            <th className="px-3 py-2 md:px-4 md:py-3 font-semibold">#</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 font-semibold">Roll No.</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 font-semibold">Name</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 font-semibold hidden md:table-cell">Institute</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 font-semibold hidden lg:table-cell">Gender</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 font-semibold hidden lg:table-cell">Phone</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 font-semibold">Marks</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 font-semibold">Grade</th>
                            <th className="px-3 py-2 md:px-4 md:py-3 font-semibold">Attendance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classGroups[className].map((student, index) => {
                            const scholarshipGrade =
                              getScholarshipGrade(student);
                            return (
                              <tr
                                key={student._id}
                                className={`border-b hover:bg-green-50 transition-colors ${
                                  student.isAttendanceComplete
                                    ? "bg-green-50"
                                    : "bg-white"
                                } ${
                                  scholarshipGrade === "Talentpool Grade"
                                    ? "bg-green-50"
                                    : scholarshipGrade === "General Grade"
                                    ? "bg-blue-50"
                                    : ""
                                }`}>
                                <td className="px-3 py-2 md:px-4 md:py-3 font-medium">{index + 1}</td>
                                <td className="px-3 py-2 md:px-4 md:py-3 font-medium">
                                  {student.scholarshipRollNumber}
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 font-medium">{student.name}</td>
                                <td className="px-3 py-2 md:px-4 md:py-3 hidden md:table-cell">
                                  {student.institute}
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 hidden lg:table-cell">{student.gender}</td>
                                <td className="px-3 py-2 md:px-4 md:py-3 hidden lg:table-cell text-xs">
                                  {typeof student?.phone === "string" &&
                                  student?.phone?.startsWith("0")
                                    ? student?.phone
                                    : `0${student?.phone}`}
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3 font-semibold">
                                  {student.resultDetails?.[0]?.totalMarks ||
                                    "N/A"}
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    scholarshipGrade === "Talentpool Grade"
                                      ? "bg-green-200 text-green-800"
                                      : scholarshipGrade === "General Grade"
                                      ? "bg-blue-200 text-blue-800"
                                      : "bg-gray-200 text-gray-600"
                                  }`}>
                                    {scholarshipGrade || "N/A"}
                                  </span>
                                </td>
                                <td className="px-3 py-2 md:px-4 md:py-3">
                                  {student.isAttendanceComplete ? (
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                      Present
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                      Absent
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Panel>
                ))}
            </Collapse>
          </div>
        </div>
      </div>

      <Modal
        title={
          <span className="text-xl md:text-2xl font-bold text-gray-800">
            Please Provide Valid Information
          </span>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        width="95%"
        style={{ maxWidth: 800 }}>
        <ScholarshipInsert handleCancel={handleCancel} isUpdate={false} />
      </Modal>
      <Modal
        title={
          <span className="text-xl md:text-2xl font-bold text-gray-800">
            Update Scholarship Information
          </span>
        }
        open={isModalOpen2}
        onCancel={handleCancel}
        width="95%"
        style={{ maxWidth: 800 }}>
        <ScholarshipUpdate
          handleCancel={handleCancel}
          scholarshipData={rowData}
          isUpdate={true}
        />
      </Modal>
      
      {/* Image Preview Modal */}
      <Modal
        title={
          <span className="text-lg md:text-xl font-bold text-gray-800">
            {selectedImageName}
          </span>
        }
        open={imageModalVisible}
        onCancel={() => setImageModalVisible(false)}
        footer={null}
        centered
        width="auto"
        style={{ maxWidth: "90vw" }}
        styles={{
          body: {
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <div className="flex justify-center items-center">
          <img
            src={selectedImage}
            alt={selectedImageName}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg animate-in fade-in zoom-in duration-300"
            style={{
              animation: "zoomIn 0.3s ease-out",
            }}
          />
        </div>
        <style>{`
          @keyframes zoomIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </Modal>
    </>
  );
};

export default Scholarship;
