import React, { useEffect, useState } from "react";
import { Table, Button, Card, Spin, Collapse } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { coreAxios } from "../../../utilities/axios";
import * as XLSX from "xlsx";

const { Panel } = Collapse;

// ScholarshipTable Component
const ScholarshipTable = ({ title, dataSource }) => (
  <Table
    dataSource={dataSource}
    columns={[
      { title: "#", dataIndex: "serial", key: "serial" },
      { title: "Roll", dataIndex: "rollNumber", key: "rollNumber" },
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Institute", dataIndex: "institute", key: "institute" },
      { title: "Marks", dataIndex: "totalMarks", key: "totalMarks" },
      {
        title: "Grade",
        dataIndex: "grade",
        key: "grade",
        render: (grade) => (
          <span
            className={`font-semibold ${
              grade === "Talentpool Grade"
                ? "text-green-600"
                : grade === "General Grade"
                ? "text-blue-600"
                : grade === "Special Category"
                ? "text-purple-600"
                : "text-gray-600"
            }`}>
            {grade}
          </span>
        ),
      },
      { title: "Phone", dataIndex: "phone", key: "phone" },
      {
        title: "Position",
        dataIndex: "position",
        key: "position",
        render: (position) => <span className="font-bold">{position}</span>,
      },
    ]}
    rowKey="serial"
    pagination={false}
    bordered
    size="small"
    className="mb-4"
  />
);

// InstituteSummaryTable Component
const InstituteSummaryTable = ({ dataSource }) => (
  <Table
    dataSource={dataSource}
    columns={[
      { title: "#", dataIndex: "serial", key: "serial" },
      { title: "Institute Name", dataIndex: "name", key: "name" },
      {
        title: "Talentpool",
        dataIndex: "talentpool",
        key: "talentpool",
        render: (count) => (
          <span className="text-green-600 font-semibold">{count}</span>
        ),
      },
      {
        title: "General Grade",
        dataIndex: "general",
        key: "general",
        render: (count) => (
          <span className="text-blue-600 font-semibold">{count}</span>
        ),
      },
      {
        title: "Special Category",
        dataIndex: "special",
        key: "special",
        render: (count) => (
          <span className="text-purple-600 font-semibold">{count}</span>
        ),
      },
      {
        title: "Total Students",
        dataIndex: "total",
        key: "total",
        render: (count) => <span className="font-bold">{count}</span>,
      },
    ]}
    rowKey="serial"
    pagination={false}
    bordered
    size="small"
    className="mb-4"
  />
);

// Helper function to calculate positions within a class
const calculateClassPositions = (students) => {
  if (!students || students.length === 0) return [];

  // Sort by marks descending
  const sorted = [...students].sort((a, b) => b.totalMarks - a.totalMarks);

  // Assign positions (same for same marks)
  let currentPosition = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].totalMarks !== sorted[i - 1].totalMarks) {
      currentPosition = i + 1;
    }
    sorted[i].position = currentPosition;
    sorted[i].serial = i + 1;
  }

  return sorted;
};

// ResultDetails Component
const ResultDetails = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classGroups, setClassGroups] = useState({});
  const [instituteSummary, setInstituteSummary] = useState([]);

  useEffect(() => {
    fetchScholarshipInfo();
  }, []);

  const fetchScholarshipInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/scholarship-info`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort(
          (a, b) => new Date(b?.submittedAt) - new Date(a?.submittedAt)
        );
        const processedData = processRollData(sortedData);
        setResults(processedData);
        groupStudentsByClass(sortedData);
        prepareInstituteSummary(sortedData);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };

  // Function to determine scholarship grade based on class and marks
  const getScholarshipGrade = (student) => {
    if (!student.resultDetails || student.resultDetails.length === 0)
      return null;

    const classNumber = parseInt(student.instituteClass);
    const totalMarks = student.resultDetails[0].totalMarks;

    // For classes 3 to 5 (keeping existing criteria)
    if (classNumber >= 3 && classNumber <= 5) {
      if (totalMarks >= 45 && totalMarks <= 48) {
        return "General Grade";
      } else if (totalMarks >= 49 && totalMarks <= 50) {
        return "Talentpool Grade";
      } else if (totalMarks >= 40 && totalMarks <= 44) {
        return "Special Category";
      }
    }
    // For classes 6 to 8 (modified criteria)
    else if (classNumber >= 6 && classNumber <= 8) {
      if (totalMarks >= 75 && totalMarks < 85) {
        return "General Grade";
      } else if (totalMarks >= 85 && totalMarks <= 100) {
        return "Talentpool Grade";
      } else if (totalMarks >= 65 && totalMarks < 75) {
        return "Special Category";
      }
    }
    // For classes 9 to 10 (modified criteria)
    else if (classNumber >= 9 && classNumber <= 10) {
      if (totalMarks >= 75 && totalMarks < 85) {
        return "General Grade";
      } else if (totalMarks >= 85 && totalMarks <= 100) {
        return "Talentpool Grade";
      } else if (totalMarks >= 70 && totalMarks < 75) {
        return "Special Category";
      }
    }

    return null;
  };

  // Group students by class
  const groupStudentsByClass = (data) => {
    const groups = {};

    data.forEach((student) => {
      if (student.resultDetails && student.resultDetails.length > 0) {
        const className = student.instituteClass;
        if (!groups[className]) {
          groups[className] = [];
        }
        groups[className].push(student);
      }
    });

    setClassGroups(groups);
  };

  // Prepare institute summary data
  const prepareInstituteSummary = (data) => {
    const instituteMap = {};

    data.forEach((student) => {
      if (student.resultDetails && student.resultDetails.length > 0) {
        const grade = getScholarshipGrade(student);
        if (!grade) return;

        if (!instituteMap[student.institute]) {
          instituteMap[student.institute] = {
            name: student.institute,
            talentpool: 0,
            general: 0,
            special: 0,
            total: 0,
          };
        }

        if (grade === "Talentpool Grade") {
          instituteMap[student.institute].talentpool++;
        } else if (grade === "General Grade") {
          instituteMap[student.institute].general++;
        } else if (grade === "Special Category") {
          instituteMap[student.institute].special++;
        }

        instituteMap[student.institute].total++;
      }
    });

    const summaryArray = Object.values(instituteMap).map((item, index) => ({
      ...item,
      serial: index + 1,
    }));

    // Sort by total students descending
    summaryArray.sort((a, b) => b.total - a.total);

    setInstituteSummary(summaryArray);
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(16);
    doc.text("DMF Scholarship Results 2025", 40, 30);
    doc.setFontSize(10);
    doc.setTextColor(100);

    let sequenceNumber = 1;
    const allData = [];

    // Sort classes numerically
    const sortedClasses = Object.keys(classGroups).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    sortedClasses.forEach((className) => {
      const classStudents = classGroups[className]
        .map((student) => {
          const grade = getScholarshipGrade(student);
          if (grade) {
            return {
              class: className,
              rollNumber: student.scholarshipRollNumber,
              name: student.name,
              institute: student.institute,
              totalMarks: student.resultDetails[0].totalMarks,
              grade: grade,
              phone: student.phone?.toString().replace(/^(\d)/, "0$1"),
            };
          }
          return null;
        })
        .filter((student) => student !== null);

      // Calculate positions for this class (marks-based only)
      const studentsWithPositions = calculateClassPositions(classStudents).sort(
        (a, b) => b.totalMarks - a.totalMarks
      );

      studentsWithPositions.forEach((student) => {
        allData.push({
          serial: sequenceNumber++,
          class: student.class,
          rollNumber: student.rollNumber,
          name: student.name,
          institute: student.institute,
          totalMarks: student.totalMarks,
          grade: student.grade,
          phone: student.phone,
          position: student.position,
        });
      });
    });

    // Generate the PDF table with sorted data
    doc.autoTable({
      startY: 50,
      theme: "grid",
      headStyles: {
        fillColor: [46, 125, 50],
        textColor: 255,
        fontSize: 10,
      },
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
      },
      head: [
        [
          "#",
          "Class",
          "Roll",
          "Name",
          "Institute",
          "Marks",
          "Grade",
          "Phone",
          "Position",
        ],
      ],
      body: allData.map((data) => [
        data.serial,
        data.class,
        data.rollNumber,
        data.name,
        data.institute,
        data.totalMarks,
        data.grade,
        data.phone,
        data.position,
      ]),
    });

    // Add summary statistics
    const summaryY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Count scholarship grades
    let generalCount = 0;
    let talentpoolCount = 0;
    let specialCount = 0;

    allData.forEach((item) => {
      if (item.grade === "General Grade") generalCount++;
      if (item.grade === "Talentpool Grade") talentpoolCount++;
      if (item.grade === "Special Category") specialCount++;
    });

    doc.text(`Total Students: ${allData.length}`, 40, summaryY);
    doc.text(`Talentpool Grade: ${talentpoolCount}`, 40, summaryY + 20);
    doc.text(`General Grade: ${generalCount}`, 40, summaryY + 40);
    doc.text(`Special Category: ${specialCount}`, 40, summaryY + 60);

    doc.save("DMF_Scholarship_Results_2025.pdf");
  };

  const generateExcel = () => {
    const excelData = [];

    // Sort classes numerically
    const sortedClasses = Object.keys(classGroups).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    let sequenceNumber = 1;

    sortedClasses.forEach((className) => {
      const classStudents = classGroups[className]
        .map((student) => {
          const grade = getScholarshipGrade(student);
          if (grade) {
            return {
              class: className,
              rollNumber: student.scholarshipRollNumber,
              name: student.name,
              institute: student.institute,
              totalMarks: student.resultDetails[0].totalMarks,
              grade: grade,
              phone: student.phone?.toString().replace(/^(\d)/, "0$1"),
            };
          }
          return null;
        })
        .filter((student) => student !== null);

      // Calculate positions for this class (marks-based only)
      const studentsWithPositions = calculateClassPositions(classStudents).sort(
        (a, b) => b.totalMarks - a.totalMarks
      );

      studentsWithPositions.forEach((student) => {
        excelData.push({
          "SL No": sequenceNumber++,
          Class: student.class,
          "Roll No": student.rollNumber,
          Name: student.name,
          Institute: student.institute,
          Marks: student.totalMarks,
          Grade: student.grade,
          Phone: student.phone,
          Position: student.position,
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scholarship Results");
    XLSX.writeFile(wb, "DMF_Scholarship_Results_2025.xlsx");
  };

  const generateClassWisePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    // Sort classes numerically
    const sortedClasses = Object.keys(classGroups).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    // Add page for each class
    sortedClasses.forEach((className) => {
      doc.addPage("landscape");

      // Header with larger text
      doc.setFillColor(46, 125, 50); // Dark green
      doc.rect(0, 0, 280, 12, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(`DMF-Scholarship-2025 - Class ${className}`, 140, 8, {
        align: "center",
        baseline: "middle",
      });

      // Prepare table data
      const classStudents = classGroups[className]
        .map((student) => {
          const grade = getScholarshipGrade(student);
          if (grade) {
            return {
              rollNumber: student.scholarshipRollNumber,
              name: student.name,
              institute: student.institute,
              gender: student.gender,
              phone: student.phone?.toString().replace(/^(\d)/, "0$1"),
              totalMarks: student.resultDetails[0].totalMarks,
              grade: grade,
            };
          }
          return null;
        })
        .filter((student) => student !== null);

      // Calculate positions
      const tableData = calculateClassPositions(classStudents).sort(
        (a, b) => b.totalMarks - a.totalMarks
      );

      // Create table
      doc.autoTable({
        head: [
          [
            "#",
            "Roll No",
            "Name",
            "Institute",
            "Gender",
            "Phone",
            "Marks",
            "Grade",
            "Position",
          ],
        ],
        body: tableData.map((data, index) => [
          index + 1,
          data.rollNumber,
          data.name,
          data.institute,
          data.gender,
          data.phone,
          data.totalMarks,
          data.grade,
          data.position,
        ]),
        startY: 16, // Below header
        margin: { horizontal: 5 }, // Minimal side margins
        styles: {
          fontSize: 10,
          cellPadding: 2.5,
          lineHeight: 7,
          textColor: [0, 0, 0],
          lineWidth: 0.25,
          lineColor: [220, 220, 220],
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 28 },
          2: { cellWidth: 70 },
          3: { cellWidth: 110 },
          4: { cellWidth: 20, halign: "center" },
          5: { cellWidth: 28 },
          6: { cellWidth: 20, halign: "center" },
          7: { cellWidth: 30, halign: "center" },
          8: { cellWidth: 20, halign: "center" },
        },
        headStyles: {
          fillColor: [46, 125, 50],
          textColor: 255,
          fontSize: 11,
          cellPadding: 3,
        },
        bodyStyles: {
          valign: "middle",
        },
        didParseCell: (data) => {
          // Color cells based on grade
          if (data.column.dataKey === "grade") {
            if (data.cell.raw === "Talentpool Grade") {
              data.cell.styles.textColor = [0, 128, 0]; // Dark green
            } else if (data.cell.raw === "General Grade") {
              data.cell.styles.textColor = [0, 0, 128]; // Dark blue
            } else if (data.cell.raw === "Special Category") {
              data.cell.styles.textColor = [128, 0, 128]; // Purple
            }
          }
        },
        theme: "grid",
      });
    });

    // Remove initial blank page
    if (doc.getNumberOfPages() > 1) {
      doc.deletePage(1);
    }

    // Save with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    doc.save(`DMF-Scholarship-Class-Wise-Results-${timestamp}.pdf`);
  };

  const generateAllStudentsPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    // Sort classes numerically
    const sortedClasses = Object.keys(classGroups).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    // Add page for each class
    sortedClasses.forEach((className) => {
      doc.addPage("landscape");

      // Header with larger text
      doc.setFillColor(46, 125, 50); // Dark green
      doc.rect(0, 0, 280, 12, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(
        `DMF-Scholarship-2025 - Class ${className} (All Students)`,
        140,
        8,
        {
          align: "center",
          baseline: "middle",
        }
      );

      // Prepare table data for all students
      const tableData = classGroups[className]
        .map((student) => {
          const grade = getScholarshipGrade(student);
          return {
            rollNumber: student.scholarshipRollNumber,
            name: student.name,
            institute: student.institute,
            gender: student.gender,
            phone: student.phone?.toString().replace(/^(\d)/, "0$1"),
            totalMarks: student.resultDetails[0].totalMarks,
            grade: grade || "Not Qualified",
            status: grade ? "Qualified" : "Not Qualified",
          };
        })
        .sort((a, b) => b.totalMarks - a.totalMarks); // Sort by marks descending

      // Calculate positions
      let currentPosition = 1;
      for (let i = 0; i < tableData.length; i++) {
        if (i > 0 && tableData[i].totalMarks !== tableData[i - 1].totalMarks) {
          currentPosition = i + 1;
        }
        tableData[i].position = currentPosition;
        tableData[i].serial = i + 1;
      }

      // Create table
      doc.autoTable({
        head: [
          [
            "#",
            "Roll No",
            "Name",
            "Institute",
            "Gender",
            "Phone",
            "Marks",
            "Grade",
            "Status",
            "Position",
          ],
        ],
        body: tableData.map((data) => [
          data.serial,
          data.rollNumber,
          data.name,
          data.institute,
          data.gender,
          data.phone,
          data.totalMarks,
          data.grade,
          data.status,
          data.position,
        ]),
        startY: 16, // Below header
        margin: { horizontal: 5 }, // Minimal side margins
        styles: {
          fontSize: 8, // Smaller font to fit more data
          cellPadding: 2,
          lineHeight: 7,
          textColor: [0, 0, 0],
          lineWidth: 0.25,
          lineColor: [220, 220, 220],
        },
        columnStyles: {
          0: { cellWidth: 8, halign: "center" },
          1: { cellWidth: 22 },
          2: { cellWidth: 55 },
          3: { cellWidth: 85 },
          4: { cellWidth: 18, halign: "center" },
          5: { cellWidth: 22 },
          6: { cellWidth: 16, halign: "center" },
          7: { cellWidth: 22, halign: "center" },
          8: { cellWidth: 22, halign: "center" },
          9: { cellWidth: 16, halign: "center" },
        },
        headStyles: {
          fillColor: [46, 125, 50],
          textColor: 255,
          fontSize: 10,
          cellPadding: 2,
        },
        bodyStyles: {
          valign: "middle",
        },
        didParseCell: (data) => {
          // Highlight qualified students
          if (
            data.column.dataKey === "grade" &&
            data.cell.raw !== "Not Qualified"
          ) {
            if (data.cell.raw === "Talentpool Grade") {
              data.cell.styles.fillColor = [200, 230, 200]; // Light green
            } else if (data.cell.raw === "General Grade") {
              data.cell.styles.fillColor = [200, 200, 230]; // Light blue
            } else if (data.cell.raw === "Special Category") {
              data.cell.styles.fillColor = [230, 200, 230]; // Light purple
            }
          }
          if (
            data.column.dataKey === "status" &&
            data.cell.raw === "Qualified"
          ) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.textColor = [0, 100, 0]; // Dark green
          }
        },
        theme: "grid",
      });
    });

    // Remove initial blank page
    if (doc.getNumberOfPages() > 1) {
      doc.deletePage(1);
    }

    // Save with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    doc.save(`DMF-Scholarship-All-Students-Results-${timestamp}.pdf`);
  };

  const generateInstituteWisePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
    });

    // Header
    doc.setFillColor(46, 125, 50);
    doc.rect(0, 0, doc.internal.pageSize.width, 14, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("DMF Scholarship 2025 - Institute Wise Summary", 105, 10, {
      align: "center",
      baseline: "middle",
    });

    // Prepare table data
    const tableData = instituteSummary.map((institute) => ({
      name: institute.name,
      talentpool: institute.talentpool,
      general: institute.general,
      special: institute.special,
      total: institute.total,
    }));

    // Create table
    doc.autoTable({
      startY: 20,
      head: [
        [
          "#",
          "Institute Name",
          "Talentpool",
          "General Grade",
          "Special Category",
          "Total Students",
        ],
      ],
      body: instituteSummary.map((institute, index) => [
        index + 1,
        institute.name,
        institute.talentpool,
        institute.general,
        institute.special,
        institute.total,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 90 },
        2: { cellWidth: 30, halign: "center" },
        3: { cellWidth: 30, halign: "center" },
        4: { cellWidth: 30, halign: "center" },
        5: { cellWidth: 30, halign: "center" },
      },
      headStyles: {
        fillColor: [46, 125, 50],
        textColor: 255,
        fontSize: 10,
      },
      didParseCell: (data) => {
        // Color grade columns
        if (data.column.dataKey === "talentpool" && data.cell.raw > 0) {
          data.cell.styles.textColor = [0, 128, 0]; // Green
        } else if (data.column.dataKey === "general" && data.cell.raw > 0) {
          data.cell.styles.textColor = [0, 0, 128]; // Blue
        } else if (data.column.dataKey === "special" && data.cell.raw > 0) {
          data.cell.styles.textColor = [128, 0, 128]; // Purple
        }
        if (data.column.dataKey === "total") {
          data.cell.styles.fontStyle = "bold";
        }
      },
      theme: "grid",
    });

    // Add summary statistics
    const summaryY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const totalTalentpool = instituteSummary.reduce(
      (sum, inst) => sum + inst.talentpool,
      0
    );
    const totalGeneral = instituteSummary.reduce(
      (sum, inst) => sum + inst.general,
      0
    );
    const totalSpecial = instituteSummary.reduce(
      (sum, inst) => sum + inst.special,
      0
    );
    const grandTotal = instituteSummary.reduce(
      (sum, inst) => sum + inst.total,
      0
    );

    doc.text(`Total Institutes: ${instituteSummary.length}`, 14, summaryY);
    doc.text(`Total Talentpool: ${totalTalentpool}`, 14, summaryY + 15);
    doc.text(`Total General Grade: ${totalGeneral}`, 14, summaryY + 30);
    doc.text(`Total Special Category: ${totalSpecial}`, 14, summaryY + 45);
    doc.text(`Grand Total Students: ${grandTotal}`, 14, summaryY + 60);

    // Save with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    doc.save(`DMF-Scholarship-Institute-Summary-${timestamp}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!results) {
    return <div>No results found.</div>;
  }

  // Count scholarship grades
  const countGrades = () => {
    let generalGradeCount = 0;
    let talentpoolGradeCount = 0;
    let specialCategoryCount = 0;
    let totalStudents = 0;

    Object.values(classGroups).forEach((students) => {
      students.forEach((student) => {
        const grade = getScholarshipGrade(student);
        if (grade === "General Grade") generalGradeCount++;
        if (grade === "Talentpool Grade") talentpoolGradeCount++;
        if (grade === "Special Category") specialCategoryCount++;
        if (grade) totalStudents++;
      });
    });

    return {
      generalGradeCount,
      talentpoolGradeCount,
      specialCategoryCount,
      totalStudents,
    };
  };

  const {
    generalGradeCount,
    talentpoolGradeCount,
    specialCategoryCount,
    totalStudents,
  } = countGrades();

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-6">
        DMF Scholarship Results 2025
      </h1>

      <div className="text-center mb-8 p-4 bg-green-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Summary Statistics</h2>
        <div className="flex justify-center gap-8">
          <div className="bg-white p-3 rounded shadow">
            <p className="text-gray-600">Total Students</p>
            <p className="text-2xl font-bold">{totalStudents}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded shadow">
            <p className="text-purple-600">Special Category</p>
            <p className="text-2xl font-bold">{specialCategoryCount}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded shadow">
            <p className="text-blue-600">General Grade</p>
            <p className="text-2xl font-bold">{generalGradeCount}</p>
          </div>
          <div className="bg-green-50 p-3 rounded shadow">
            <p className="text-green-600">Talentpool Grade</p>
            <p className="text-2xl font-bold">{talentpoolGradeCount}</p>
          </div>
        </div>
      </div>

      <div className="text-right mb-5 space-x-2">
        <Button
          onClick={generatePDF}
          type="primary"
          className="bg-blue-600 hover:bg-blue-700">
          Download Combined PDF
        </Button>
        <Button
          onClick={generateExcel}
          type="primary"
          className="bg-green-600 hover:bg-green-700">
          Download Excel
        </Button>
        <Button
          onClick={generateClassWisePDF}
          type="primary"
          className="bg-purple-600 hover:bg-purple-700">
          Class-wise PDF
        </Button>
        <Button
          onClick={generateAllStudentsPDF}
          type="primary"
          className="bg-red-600 hover:bg-red-700"
          style={{ marginLeft: "8px" }}>
          All Students PDF
        </Button>
        <Button
          onClick={generateInstituteWisePDF}
          type="primary"
          className="bg-orange-600 hover:bg-orange-700"
          style={{ marginLeft: "8px" }}>
          Institute Summary PDF
        </Button>
      </div>

      {/* Institute Summary Section */}
      <Card
        title="Institute Wise Summary"
        className="mb-6"
        extra={
          <Button
            onClick={generateInstituteWisePDF}
            type="primary"
            size="small"
            className="bg-orange-600 hover:bg-orange-700">
            Download PDF
          </Button>
        }>
        <InstituteSummaryTable dataSource={instituteSummary} />
      </Card>

      {/* Class-wise Results Section */}
      <Collapse accordion className="mb-6">
        {Object.keys(classGroups)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((className) => {
            const qualifiedStudents = classGroups[className]
              .filter((student) => getScholarshipGrade(student) !== null)
              .map((student) => {
                const grade = getScholarshipGrade(student);
                return {
                  rollNumber: student.scholarshipRollNumber,
                  name: student.name,
                  institute: student.institute,
                  totalMarks: student.resultDetails[0].totalMarks,
                  grade: grade,
                  phone: student.phone?.toString().replace(/^(\d)/, "0$1"),
                };
              });

            if (qualifiedStudents.length === 0) return null;

            // Calculate positions for this class (marks-based only)
            const studentsWithPositions = calculateClassPositions(
              qualifiedStudents
            ).sort((a, b) => b.totalMarks - a.totalMarks);

            return (
              <Panel
                header={`Class ${className} (${qualifiedStudents.length} qualified students)`}
                key={className}>
                <ScholarshipTable
                  title={`Class ${className}`}
                  dataSource={studentsWithPositions}
                />
              </Panel>
            );
          })}
      </Collapse>
    </div>
  );
};

// Helper function to process roll data
function processRollData(rollData) {
  const scholarshipListByClass = {};

  rollData?.forEach((item) => {
    if (Array.isArray(item.resultDetails)) {
      const className = `class${item.instituteClass}`;
      if (!scholarshipListByClass[className]) {
        scholarshipListByClass[className] = {
          talentpoolGrade: [],
          generalGrade: [],
          specialCategory: [],
        };
      }

      item.resultDetails.forEach((result) => {
        const data = {
          rollNumber: item.scholarshipRollNumber,
          name: item.name,
          institute: item.institute,
          totalMarks: result.totalMarks,
          phone: item.phone,
          grade: "",
        };

        // Class 3-5
        if (item.instituteClass >= 3 && item.instituteClass <= 5) {
          if (result.totalMarks >= 49 && result.totalMarks <= 50) {
            data.grade = "Talentpool Grade";
            scholarshipListByClass[className].talentpoolGrade.push(data);
          } else if (result.totalMarks >= 45 && result.totalMarks <= 48) {
            data.grade = "General Grade";
            scholarshipListByClass[className].generalGrade.push(data);
          } else if (result.totalMarks >= 40 && result.totalMarks <= 44) {
            data.grade = "Special Category";
            scholarshipListByClass[className].specialCategory.push(data);
          }
        }
        // Class 6-8 (modified)
        else if (item.instituteClass >= 6 && item.instituteClass <= 8) {
          if (result.totalMarks >= 85 && result.totalMarks <= 100) {
            data.grade = "Talentpool Grade";
            scholarshipListByClass[className].talentpoolGrade.push(data);
          } else if (result.totalMarks >= 75 && result.totalMarks < 85) {
            data.grade = "General Grade";
            scholarshipListByClass[className].generalGrade.push(data);
          } else if (result.totalMarks >= 65 && result.totalMarks < 75) {
            data.grade = "Special Category";
            scholarshipListByClass[className].specialCategory.push(data);
          }
        }
        // Class 9-10 (modified)
        else if (item.instituteClass >= 9 && item.instituteClass <= 10) {
          if (result.totalMarks >= 85 && result.totalMarks <= 100) {
            data.grade = "Talentpool Grade";
            scholarshipListByClass[className].talentpoolGrade.push(data);
          } else if (result.totalMarks >= 75 && result.totalMarks < 85) {
            data.grade = "General Grade";
            scholarshipListByClass[className].generalGrade.push(data);
          } else if (result.totalMarks >= 70 && result.totalMarks < 75) {
            data.grade = "Special Category";
            scholarshipListByClass[className].specialCategory.push(data);
          }
        }
      });
    }
  });

  return { scholarshipListByClass };
}

export default ResultDetails;
