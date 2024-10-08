import React, { useEffect, useState } from "react";
import { Card, Table, Spin } from "antd";
import { coreAxios } from "../../../utilities/axios";

// Reusable Table Component for displaying scholarship data
const ScholarshipTable = ({ title, dataSource }) => (
  <Card title={title} className="mb-5 shadow-lg">
    <Table
      dataSource={dataSource}
      columns={[
        {
          title: "Roll Number",
          dataIndex: "rollNumber",
          key: "rollNumber",
        },
        {
          title: "Name", // Added Name Column
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Institute", // Added Institute Column
          dataIndex: "institute",
          key: "institute",
        },
        {
          title: "Total Marks",
          dataIndex: "totalMarks",
          key: "totalMarks",
        },
      ]}
      rowKey="rollNumber"
      pagination={false}
      bordered
    />
  </Card>
);

// Process API Data for displaying scholarship results
function processRollData(rollData) {
  let totalResultDetailsCount = 0;
  let isScholarshipedCount = 0;
  let talentpoolGradeCount = 0;
  let generalGradeCount = 0;
  let gradeAcount = 0;

  // To store scholarshiped students by class
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

      // Loop through resultDetails for each result
      item.resultDetails.forEach((result) => {
        const className = item.instituteClass; // Assuming the class is called `instituteClass`
        const rollNumber = item.scholarshipRollNumber; // Assuming roll number is stored as `scholarshipRollNumber`
        const totalMarks = result.totalMarks; // Assuming total marks are directly available in `result.totalMarks`
        const name = item.name; // Added Name field
        const institute = item.institute; // Added Institute field

        // Class-based scholarship and grade logic
        if (className === "5" || className === "6") {
          // Class 5 & 6: General Grade (60-89), Talentpool Grade (90-100)
          if (totalMarks >= 90) {
            talentpoolGradeCount++;
            scholarshipListByClass[`class${className}`].talentpoolGrade.push({
              rollNumber,
              name, // Added Name
              institute, // Added Institute
              totalMarks,
            });
          } else if (totalMarks >= 60 && totalMarks < 90) {
            generalGradeCount++;
            scholarshipListByClass[`class${className}`].generalGrade.push({
              rollNumber,
              name, // Added Name
              institute, // Added Institute
              totalMarks,
            });
          }
        } else if (className === "7" || className === "8") {
          // Class 7 & 8: Grade A (70-89), Talentpool Grade (90-100)
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
        } else if (className === "9" || className === "10") {
          // Class 9 & 10: Grade A (80-89), Talentpool Grade (90-100)
          if (totalMarks >= 90) {
            talentpoolGradeCount++;
            scholarshipListByClass[`class${className}`].talentpoolGrade.push({
              rollNumber,
              name,
              institute,
              totalMarks,
            });
          } else if (totalMarks >= 80 && totalMarks < 90) {
            gradeAcount++;
            scholarshipListByClass[`class${className}`].gradeA.push({
              rollNumber,
              name,
              institute,
              totalMarks,
            });
          }
        }

        // Count total students considered for scholarship (marks >= 80)
        if (totalMarks >= 80) {
          isScholarshipedCount++;
        }
      });
    }
  });

  // Return detailed output
  return {
    totalResultDetailsCount,
    isScholarshipedCount,
    talentpoolGradeCount,
    generalGradeCount,
    gradeAcount,
    scholarshipListByClass,
  };
}

export default function ResultDetails() {
  const [results, setResults] = useState(null); // Change to null initially
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
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
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

  console.log("-----", results);

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-10">
        Scholarship Results
      </h1>

      {/* Class 5 */}
      {scholarshipListByClass.class5.generalGrade.length > 0 && (
        <ScholarshipTable
          title="Class 5 - General Grade"
          dataSource={scholarshipListByClass.class5.generalGrade.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}
      {scholarshipListByClass.class5.talentpoolGrade.length > 0 && (
        <ScholarshipTable
          title="Class 5 - Talentpool Grade"
          dataSource={scholarshipListByClass.class5.talentpoolGrade.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}

      {/* Class 6 */}
      {scholarshipListByClass.class6.generalGrade.length > 0 && (
        <ScholarshipTable
          title="Class 6 - General Grade"
          dataSource={scholarshipListByClass.class6.generalGrade.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}
      {scholarshipListByClass.class6.talentpoolGrade.length > 0 && (
        <ScholarshipTable
          title="Class 6 - Talentpool Grade"
          dataSource={scholarshipListByClass.class6.talentpoolGrade.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}

      {/* Class 7 */}
      {scholarshipListByClass.class7.gradeA.length > 0 && (
        <ScholarshipTable
          title="Class 7 - Grade A"
          dataSource={scholarshipListByClass.class7.gradeA.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}
      {scholarshipListByClass.class7.talentpoolGrade.length > 0 && (
        <ScholarshipTable
          title="Class 7 - Talentpool Grade"
          dataSource={scholarshipListByClass.class7.talentpoolGrade.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}

      {/* Class 8 */}
      {scholarshipListByClass.class8.gradeA.length > 0 && (
        <ScholarshipTable
          title="Class 8 - Grade A"
          dataSource={scholarshipListByClass.class8.gradeA.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}
      {scholarshipListByClass.class8.talentpoolGrade.length > 0 && (
        <ScholarshipTable
          title="Class 8 - Talentpool Grade"
          dataSource={scholarshipListByClass.class8.talentpoolGrade.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}

      {/* Class 9 */}
      {scholarshipListByClass.class9.gradeA.length > 0 && (
        <ScholarshipTable
          title="Class 9 - Grade A"
          dataSource={scholarshipListByClass.class9.gradeA.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}
      {scholarshipListByClass.class9.talentpoolGrade.length > 0 && (
        <ScholarshipTable
          title="Class 9 - Talentpool Grade"
          dataSource={scholarshipListByClass.class9.talentpoolGrade.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}

      {/* Class 10 */}
      {scholarshipListByClass.class10.gradeA.length > 0 && (
        <ScholarshipTable
          title="Class 10 - Grade A"
          dataSource={scholarshipListByClass.class10.gradeA.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}
      {scholarshipListByClass.class10.talentpoolGrade.length > 0 && (
        <ScholarshipTable
          title="Class 10 - Talentpool Grade"
          dataSource={scholarshipListByClass.class10.talentpoolGrade.sort(
            (a, b) => b.totalMarks - a.totalMarks
          )} // Sort by totalMarks
        />
      )}
    </div>
  );
}
