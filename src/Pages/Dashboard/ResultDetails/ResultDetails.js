import React, { useEffect, useState } from "react";
import { Card, Table, Spin, Button } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { coreAxios } from "../../../utilities/axios";

// Reusable Table Component for displaying scholarship data
const ScholarshipTable = ({ title, dataSource }) => (
  <Card title={title} className="mb-5 shadow-lg">
    <Table
      dataSource={dataSource}
      columns={[
        { title: "Roll Number", dataIndex: "rollNumber", key: "rollNumber" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Institute", dataIndex: "institute", key: "institute" },
        { title: "Total Marks", dataIndex: "totalMarks", key: "totalMarks" },
      ]}
      rowKey="rollNumber"
      pagination={false}
      bordered
    />
  </Card>
);

const ResultDetails = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchScholarshipInfo();
  }, []);

  const fetchScholarshipInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/scholarship-info`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.submittedAt) - new Date(a?.submittedAt);
        });
        const processedData = processRollData(sortedData);
        setResults(processedData);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Scholarship Results", 14, 22);

    Object.keys(results.scholarshipListByClass).forEach((classKey, index) => {
      const gradeCategories = results.scholarshipListByClass[classKey];
      Object.keys(gradeCategories).forEach((gradeKey) => {
        const dataSource = gradeCategories[gradeKey];
        if (dataSource.length > 0) {
          doc.text(
            `${classKey.toUpperCase()} - ${gradeKey}`,
            14,
            doc.lastAutoTable.finalY + 20 || 40
          );
          doc.autoTable({
            startY: doc.lastAutoTable?.finalY + 10 || 30,
            head: [["Roll Number", "Name", "Institute", "Total Marks"]],
            body: dataSource.map((data) => [
              data.rollNumber,
              data.name,
              data.institute,
              data.totalMarks,
            ]),
          });
        }
      });
    });

    doc.save("Scholarship_Results.pdf");
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

  const { scholarshipListByClass } = results;

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-10">
        Scholarship Results
      </h1>

      {/* PDF Generation Button */}
      <div className="text-right mb-5">
        <Button onClick={generatePDF} type="primary">
          Download PDF
        </Button>
      </div>

      {/* Render each class and grade section */}
      {Object.keys(scholarshipListByClass).map((classKey) =>
        Object.keys(scholarshipListByClass[classKey]).map((gradeKey) =>
          scholarshipListByClass[classKey][gradeKey].length > 0 ? (
            <ScholarshipTable
              key={`${classKey}-${gradeKey}`}
              title={`${classKey.toUpperCase()} - ${gradeKey}`}
              dataSource={scholarshipListByClass[classKey][gradeKey]}
            />
          ) : null
        )
      )}
    </div>
  );
};

// Process API Data for displaying scholarship results
function processRollData(rollData) {
  let totalResultDetailsCount = 0;
  let isScholarshipedCount = 0;
  let talentpoolGradeCount = 0;
  let generalGradeCount = 0;
  let gradeAcount = 0;

  const scholarshipListByClass = {
    class5: { generalGrade: [], talentpoolGrade: [] },
    class6: { generalGrade: [], talentpoolGrade: [] },
    class7: { gradeA: [], talentpoolGrade: [] },
    class8: { gradeA: [], talentpoolGrade: [] },
    class9: { gradeA: [], talentpoolGrade: [] },
    class10: { gradeA: [], talentpoolGrade: [] },
  };

  rollData?.forEach((item) => {
    if (Array.isArray(item.resultDetails)) {
      totalResultDetailsCount += item.resultDetails.length;
      item.resultDetails.forEach((result) => {
        const className = item.instituteClass;
        const rollNumber = item.scholarshipRollNumber;
        const totalMarks = result.totalMarks;
        const name = item.name;
        const institute = item.institute;

        if (className === "5" || className === "6") {
          if (totalMarks >= 70) {
            talentpoolGradeCount++;
            scholarshipListByClass[`class${className}`].talentpoolGrade.push({
              rollNumber,
              name,
              institute,
              totalMarks,
            });
          } else if (totalMarks >= 50 && totalMarks < 70) {
            generalGradeCount++;
            scholarshipListByClass[`class${className}`].generalGrade.push({
              rollNumber,
              name,
              institute,
              totalMarks,
            });
          }
        } else if (className === "7" || className === "8") {
          if (totalMarks >= 80) {
            talentpoolGradeCount++;
            scholarshipListByClass[`class${className}`].talentpoolGrade.push({
              rollNumber,
              name,
              institute,
              totalMarks,
            });
          } else if (totalMarks >= 60 && totalMarks < 80) {
            gradeAcount++;
            scholarshipListByClass[`class${className}`].gradeA.push({
              rollNumber,
              name,
              institute,
              totalMarks,
            });
          }
        } else if (className === "9" || className === "10") {
          if (totalMarks >= 90) {
            talentpoolGradeCount++;
            scholarshipListByClass[`class${className}`].talentpoolGrade.push({
              rollNumber,
              name,
              institute,
              totalMarks,
            });
          } else if (totalMarks >= 70 && totalMarks < 90) {
            gradeAcount++;
            scholarshipListByClass[`class${className}`].gradeA.push({
              rollNumber,
              name,
              institute,
              totalMarks,
            });
          }
        }

        if (totalMarks >= 80) {
          isScholarshipedCount++;
        }
      });
    }
  });

  return {
    totalResultDetailsCount,
    isScholarshipedCount,
    talentpoolGradeCount,
    generalGradeCount,
    gradeAcount,
    scholarshipListByClass,
  };
}

export default ResultDetails;
