import React, { useEffect, useState } from "react";
import { Table, Button, Card, Spin } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { coreAxios } from "../../../utilities/axios";

// ScholarshipTable Component
const ScholarshipTable = ({ title, dataSource }) => (
  <Card title={title} className="mb-5 shadow-lg">
    <Table
      dataSource={dataSource}
      columns={[
        { title: "Sequence", dataIndex: "sequence", key: "sequence" },
        { title: "Class", dataIndex: "class", key: "class" },
        { title: "Roll Number", dataIndex: "rollNumber", key: "rollNumber" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Institute", dataIndex: "institute", key: "institute" },
        { title: "Total Marks", dataIndex: "totalMarks", key: "totalMarks" },
        { title: "Grade", dataIndex: "grade", key: "grade" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
      ]}
      rowKey="sequence"
      pagination={false}
      bordered
    />
  </Card>
);

// ResultDetails Component
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
        const sortedData = response?.data?.sort(
          (a, b) => new Date(b?.submittedAt) - new Date(a?.submittedAt)
        );
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
    const doc = new jsPDF("p", "pt", "a4");
    doc.setFontSize(16);
    doc.text("Scholarship Results", 14, 22);
    doc.setFontSize(12);

    let sequenceNumber = 1;
    const allData = [];

    Object.keys(results.scholarshipListByClass).forEach((classKey) => {
      Object.keys(results.scholarshipListByClass[classKey]).forEach(
        (gradeKey) => {
          const dataSource = results.scholarshipListByClass[classKey][gradeKey];
          dataSource.forEach((data) => {
            allData.push({
              sequence: sequenceNumber++,
              class: classKey.replace("class", ""),
              ...data,
            });
          });
        }
      );
    });

    // Sort by grade priority and then by total marks descending
    const gradePriority = { Talentpool: 1, General: 2, "Special Category": 3 };
    allData.sort((a, b) => {
      const gradeCompare = gradePriority[a.grade] - gradePriority[b.grade];
      return gradeCompare !== 0 ? gradeCompare : b.totalMarks - a.totalMarks;
    });

    // Generate the PDF table with sorted data
    doc.autoTable({
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [128, 128, 128] },
      margin: { left: 14, right: 14 },
      head: [
        [
          "Seq",
          "Class",
          "Roll Number",
          "Name",
          "Institute",
          "Total Marks",
          "Grade",
          "Phone",
        ],
      ],
      body: allData.map((data, index) => [
        index + 1, // Sequence based on priority and marks
        data.class,
        data.rollNumber,
        data.name,
        data.institute,
        data.totalMarks,
        data.grade,
        data.phone,
      ]),
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
      <div className="text-right mb-5">
        <Button onClick={generatePDF} type="primary">
          Download PDF
        </Button>
      </div>
      {Object.keys(scholarshipListByClass).map((classKey) =>
        Object.keys(scholarshipListByClass[classKey]).map((gradeKey) =>
          scholarshipListByClass[classKey][gradeKey].length > 0 ? (
            <ScholarshipTable
              key={`${classKey}-${gradeKey}`}
              title={`${classKey.replace("class", "")} - ${gradeKey}`}
              dataSource={scholarshipListByClass[classKey][gradeKey]
                .sort((a, b) => {
                  const gradePriority = {
                    Talentpool: 1,
                    General: 2,
                    "Special Category": 3,
                  };
                  const gradeCompare =
                    gradePriority[a.grade] - gradePriority[b.grade];
                  return gradeCompare !== 0
                    ? gradeCompare
                    : b.totalMarks - a.totalMarks;
                })
                .map((data, idx) => ({
                  ...data,
                  sequence: idx + 1, // Sequence within sorted list for display
                  class: classKey.replace("class", ""),
                }))}
            />
          ) : null
        )
      )}
    </div>
  );
};

// Helper function to process roll data
function processRollData(rollData) {
  const scholarshipListByClass = {
    class5: { generalGrade: [], talentpoolGrade: [], specialCategory: [] },
    class6: { generalGrade: [], talentpoolGrade: [], specialCategory: [] },
    class7: { gradeA: [], talentpoolGrade: [], specialCategory: [] },
    class8: { gradeA: [], talentpoolGrade: [], specialCategory: [] },
    class9: { gradeA: [], talentpoolGrade: [], specialCategory: [] },
    class10: { gradeA: [], talentpoolGrade: [], specialCategory: [] },
  };

  rollData?.forEach((item) => {
    if (Array.isArray(item.resultDetails)) {
      item.resultDetails.forEach((result) => {
        const {
          instituteClass,
          scholarshipRollNumber,
          name,
          institute,
          phone,
        } = item;
        const { totalMarks } = result;
        let grade = "";

        const data = {
          rollNumber: scholarshipRollNumber,
          name,
          institute,
          totalMarks,
          phone,
          grade,
        };

        if (instituteClass === "5" || instituteClass === "6") {
          if (totalMarks >= 68) {
            data.grade = "Talentpool";
            scholarshipListByClass[
              `class${instituteClass}`
            ].talentpoolGrade.push(data);
          } else if (totalMarks >= 65 && totalMarks < 70) {
            data.grade = "General";
            scholarshipListByClass[`class${instituteClass}`].generalGrade.push(
              data
            );
          } else if (totalMarks >= 50 && totalMarks < 65) {
            data.grade = "Special Category";
            scholarshipListByClass[
              `class${instituteClass}`
            ].specialCategory.push(data);
          }
        } else if (instituteClass === "7" || instituteClass === "8") {
          if (totalMarks >= 80) {
            data.grade = "Talentpool";
            scholarshipListByClass[
              `class${instituteClass}`
            ].talentpoolGrade.push(data);
          } else if (totalMarks >= 70 && totalMarks < 80) {
            data.grade = "General";
            scholarshipListByClass[`class${instituteClass}`].gradeA.push(data);
          } else if (totalMarks >= 60 && totalMarks < 70) {
            data.grade = "Special Category";
            scholarshipListByClass[
              `class${instituteClass}`
            ].specialCategory.push(data);
          }
        } else if (instituteClass === "9" || instituteClass === "10") {
          if (totalMarks >= 90) {
            data.grade = "Talentpool";
            scholarshipListByClass[
              `class${instituteClass}`
            ].talentpoolGrade.push(data);
          } else if (totalMarks >= 80 && totalMarks < 90) {
            data.grade = "General";
            scholarshipListByClass[`class${instituteClass}`].gradeA.push(data);
          } else if (totalMarks >= 70 && totalMarks < 80) {
            data.grade = "Special Category";
            scholarshipListByClass[
              `class${instituteClass}`
            ].specialCategory.push(data);
          }
        }
      });
    }
  });

  return { scholarshipListByClass };
}

export default ResultDetails;
