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
      { title: "#", dataIndex: "sequence", key: "sequence" },
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
                : "text-gray-600"
            }`}>
            {grade}
          </span>
        ),
      },
      { title: "Phone", dataIndex: "phone", key: "phone" },
    ]}
    rowKey="sequence"
    pagination={false}
    bordered
    size="small"
    className="mb-4"
  />
);

// ResultDetails Component
const ResultDetails = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classGroups, setClassGroups] = useState({});

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

    // For classes 3 to 5
    if (classNumber >= 3 && classNumber <= 5) {
      if (totalMarks >= 45 && totalMarks <= 47) {
        return "General Grade";
      } else if (totalMarks >= 48 && totalMarks <= 50) {
        return "Talentpool Grade";
      }
    }
    // For classes 6, 7, and 8
    else if (classNumber >= 6 && classNumber <= 8) {
      if (totalMarks >= 70 && totalMarks < 80) {
        return "General Grade";
      } else if (totalMarks >= 80 && totalMarks <= 100) {
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
      classGroups[className].forEach((student) => {
        const grade = getScholarshipGrade(student);
        if (grade) {
          allData.push({
            sequence: sequenceNumber++,
            class: className,
            rollNumber: student.scholarshipRollNumber,
            name: student.name,
            institute: student.institute,
            totalMarks: student.resultDetails[0].totalMarks,
            grade: grade,
            phone: student.phone?.toString().replace(/^(\d)/, "0$1"),
          });
        }
      });
    });

    // Generate the PDF table with sorted data
    doc.autoTable({
      startY: 50,
      theme: "grid",
      headStyles: {
        fillColor: [46, 125, 50], // Dark green
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
        ["#", "Class", "Roll", "Name", "Institute", "Marks", "Grade", "Phone"],
      ],
      body: allData.map((data) => [
        data.sequence,
        data.class,
        data.rollNumber,
        data.name,
        data.institute,
        data.totalMarks,
        data.grade,
        data.phone,
      ]),
    });

    // Add summary statistics
    const summaryY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Count scholarship grades
    let generalCount = 0;
    let talentpoolCount = 0;

    allData.forEach((item) => {
      if (item.grade === "General Grade") generalCount++;
      if (item.grade === "Talentpool Grade") talentpoolCount++;
    });

    doc.text(`Total Students: ${allData.length}`, 40, summaryY);
    doc.text(`General Grade: ${generalCount}`, 40, summaryY + 20);
    doc.text(`Talentpool Grade: ${talentpoolCount}`, 40, summaryY + 40);

    doc.save("DMF_Scholarship_Results_2025.pdf");
  };

  const generateExcel = () => {
    const excelData = [];

    // Sort classes numerically
    const sortedClasses = Object.keys(classGroups).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    sortedClasses.forEach((className) => {
      classGroups[className].forEach((student, index) => {
        const grade = getScholarshipGrade(student);
        if (grade) {
          excelData.push({
            "SL No": index + 1,
            Class: className,
            "Roll No": student.scholarshipRollNumber,
            Name: student.name,
            Institute: student.institute,
            Marks: student.resultDetails[0].totalMarks,
            Grade: grade,
            Phone: student.phone?.toString().replace(/^(\d)/, "0$1"),
          });
        }
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
      const tableData = classGroups[className]
        .map((student, index) => {
          const grade = getScholarshipGrade(student);
          return grade
            ? {
                sequence: index + 1,
                rollNumber: student.scholarshipRollNumber,
                name: student.name,
                institute: student.institute,
                gender: student.gender,
                phone: student.phone?.toString().replace(/^(\d)/, "0$1"),
                totalMarks: student.resultDetails[0].totalMarks,
                grade: grade,
              }
            : null;
        })
        .filter((item) => item !== null);

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
          ],
        ],
        body: tableData.map((data) => [
          data.sequence,
          data.rollNumber,
          data.name,
          data.institute,
          data.gender,
          data.phone,
          data.totalMarks,
          data.grade,
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
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 28 },
          2: { cellWidth: 75 },
          3: { cellWidth: 115 },
          4: { cellWidth: 22, halign: "center" },
          5: { cellWidth: 28 },
          6: { cellWidth: 20, halign: "center" },
          7: { cellWidth: 30, halign: "center" },
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
        .map((student, index) => {
          const grade = getScholarshipGrade(student);
          return {
            sequence: index + 1,
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
          ],
        ],
        body: tableData.map((data) => [
          data.sequence,
          data.rollNumber,
          data.name,
          data.institute,
          data.gender,
          data.phone,
          data.totalMarks,
          data.grade,
          data.status,
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
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 25 },
          2: { cellWidth: 60 },
          3: { cellWidth: 90 },
          4: { cellWidth: 20, halign: "center" },
          5: { cellWidth: 25 },
          6: { cellWidth: 18, halign: "center" },
          7: { cellWidth: 25, halign: "center" },
          8: {
            cellWidth: 25,
            halign: "center",
            fontStyle: (data) =>
              data.grade !== "Not Qualified" ? "bold" : "normal",
            textColor: (data) =>
              data.grade === "Not Qualified" ? [100, 100, 100] : [0, 0, 0],
          },
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
            data.cell.styles.fillColor =
              data.cell.raw === "Talentpool Grade"
                ? [200, 230, 200] // Light green for Talentpool
                : [200, 200, 230]; // Light blue for General
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
    let totalStudents = 0;

    Object.values(classGroups).forEach((students) => {
      students.forEach((student) => {
        const grade = getScholarshipGrade(student);
        if (grade === "General Grade") generalGradeCount++;
        if (grade === "Talentpool Grade") talentpoolGradeCount++;
        if (grade) totalStudents++;
      });
    });

    return { generalGradeCount, talentpoolGradeCount, totalStudents };
  };

  const { generalGradeCount, talentpoolGradeCount, totalStudents } =
    countGrades();

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
      </div>

      <Collapse accordion className="mb-6">
        {Object.keys(classGroups)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((className) => {
            const qualifiedStudents = classGroups[className].filter(
              (student) => getScholarshipGrade(student) !== null
            );

            if (qualifiedStudents.length === 0) return null;

            return (
              <Panel
                header={`Class ${className} (${qualifiedStudents.length} qualified students)`}
                key={className}>
                <ScholarshipTable
                  title={`Class ${className}`}
                  dataSource={qualifiedStudents
                    .map((student, index) => {
                      const grade = getScholarshipGrade(student);
                      return {
                        sequence: index + 1,
                        rollNumber: student.scholarshipRollNumber,
                        name: student.name,
                        institute: student.institute,
                        totalMarks: student.resultDetails[0].totalMarks,
                        grade: grade,
                        phone: student.phone
                          ?.toString()
                          .replace(/^(\d)/, "0$1"),
                      };
                    })
                    .sort((a, b) => {
                      // Sort by grade (Talentpool first) then by marks (descending)
                      const gradeOrder = {
                        "Talentpool Grade": 1,
                        "General Grade": 2,
                      };
                      return (
                        gradeOrder[a.grade] - gradeOrder[b.grade] ||
                        b.totalMarks - a.totalMarks
                      );
                    })}
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
          if (result.totalMarks >= 48 && result.totalMarks <= 50) {
            data.grade = "Talentpool Grade";
            scholarshipListByClass[className].talentpoolGrade.push(data);
          } else if (result.totalMarks >= 45 && result.totalMarks <= 47) {
            data.grade = "General Grade";
            scholarshipListByClass[className].generalGrade.push(data);
          }
        }
        // Class 6-8
        else if (item.instituteClass >= 6 && item.instituteClass <= 8) {
          if (result.totalMarks >= 80 && result.totalMarks <= 100) {
            data.grade = "Talentpool Grade";
            scholarshipListByClass[className].talentpoolGrade.push(data);
          } else if (result.totalMarks >= 70 && result.totalMarks < 80) {
            data.grade = "General Grade";
            scholarshipListByClass[className].generalGrade.push(data);
          }
        }
        // Class 9-10
        else if (item.instituteClass >= 9 && item.instituteClass <= 10) {
          if (result.totalMarks >= 90 && result.totalMarks <= 100) {
            data.grade = "Talentpool Grade";
            scholarshipListByClass[className].talentpoolGrade.push(data);
          } else if (result.totalMarks >= 80 && result.totalMarks < 90) {
            data.grade = "General Grade";
            scholarshipListByClass[className].generalGrade.push(data);
          }
        }
      });
    }
  });

  return { scholarshipListByClass };
}

export default ResultDetails;
