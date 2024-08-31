import React, { useEffect, useState } from "react";
import { Button, Table, Pagination, Empty, Input, Alert } from "antd";
import { Link } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa"; // Import icons
import { coreAxios } from "../../utilities/axios";
import { AiOutlineSearch } from "react-icons/ai"; // Import search icon

export default function QuizeMainPage() {
  const [loading, setLoading] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  const getAllResults = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("/quizzes-results");
      if (response?.status === 200) {
        // Sort results
        const sortedResults = [...response.data].sort((a, b) => {
          if (b.totalMarks === a.totalMarks) {
            // If totalMarks are the same, sort by answerTime
            return (a.totalAnswerTime || 0) - (b.totalAnswerTime || 0);
          }
          return b.totalMarks - a.totalMarks;
        });

        // Add positionNumber to each result
        const resultsWithPosition = sortedResults.map((result, index) => ({
          ...result,
          positionNumber: index + 1,
        }));

        setAllResults(resultsWithPosition);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getAllResults();
  }, []);

  const handleTableChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredResults = allResults.filter((result) =>
    result.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Function to format answerTime to MM:SS
  const formatAnswerTime = (seconds) => {
    if (seconds == null) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")} sec`;
  };

  const columns = [
    {
      title: "Rank",
      dataIndex: "positionNumber",
      key: "positionNumber",
      // render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
      align: "center",
      render: (text, record, index) => (
        <div
          className={`text-center space-x-2 md:space-x-2 border   rounded-lg p-1 ${
            record?.positionNumber < 6
              ? "bg-[#73A63B] text-white"
              : "border-gray-500"
          }`}>
          {(currentPage - 1) * pageSize + index + 1}
        </div>
      ),
    },
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => (
        <div
          className={`flex items-center space-x-2 md:space-x-2   rounded-lg p-1 ${
            record?.positionNumber < 6 ? "border-[#73A63B] text-[#73A63B]" : ""
          }`}>
          <img
            src={
              record.image ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_JmAXuH2Myq0ah2g_5ioG6Ku7aR02-mcvimzwFXuD25p2bjx7zhaL34oJ7H9khuFx50&usqp=CAU"
            } // Replace with your blank profile image path
            alt={record.name}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full object-cover  `}
          />
          <span className="text-sm md:text-xl uppercase">
            {text || "Unknown User"}
          </span>
        </div>
      ),
      align: "center",
    },
    {
      title: "Points",
      dataIndex: "totalMarks",
      key: "totalMarks",
      align: "center",
      render: (text, record, index) => (
        <div
          className={`text-center space-x-2 md:space-x-2 border   rounded-lg p-1 ${
            record?.positionNumber < 6
              ? "bg-[#73A63B] text-white"
              : "border-gray-500 "
          }`}>
          {text != null ? text.toString() : "0"}
        </div>
      ),
    },
    {
      title: "Time",
      dataIndex: "totalAnswerTime",
      key: "totalAnswerTime",
      align: "center",
      render: (text, record, index) => (
        <div
          className={`text-center space-x-2 md:space-x-2   rounded-lg p-1 ${
            record?.positionNumber < 6 ? "border-[#73A63B] text-[#73A63B]" : ""
          }`}>
          {formatAnswerTime(text)}
        </div>
      ),
    },
    {
      title: "Quiz",
      dataIndex: "quizzesAttended",
      key: "quizzesAttended",
      align: "center",
      render: (text, record, index) => (
        <div
          className={`text-center space-x-2 md:space-x-2 border   rounded-lg p-1 ${
            record?.positionNumber < 6
              ? "bg-[#73A63B] text-white"
              : "border-gray-500"
          }`}>
          {text != null ? text.toString() : "0"}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div style={{ background: "#BDDE98" }}>
        <h2
          className="text-white font-semibold text-2xl md:text-[33px] py-4 lg:py-12 xl:py-12 text-center bangla-text"
          style={{ color: "#2F5811" }}>
          ইসলামিক কুইজ
        </h2>
      </div>

      <div className="flex flex-col items-center py-8 px-4 sm:px-8 lg:px-12">
        <div className="text-center mb-6">
          <FaQuestionCircle className="text-[70px] text-green-600 mb-4 mx-auto py-4" />
          <p className="text-xl md:text-2xl mb-4">
            কুইজ শুরু করার আগে আপনাকে একটি অ্যাকাউন্ট তৈরি করতে হবে। যদি আপনার
            কোনো অ্যাকাউন্ট না থাকে, তাহলে এই লিঙ্কে
            <Link
              to="/login"
              className="underline ml-2 bangla-text"
              style={{ color: "#4A7C1D" }}>
              অ্যাকাউন্ট তৈরি করুন
            </Link>
            ।
          </p>
        </div>

        <div className="flex flex-col items-center mb-12">
          <Link to="/quize">
            <Button
              type="primary"
              style={{ backgroundColor: "#73A63B", borderColor: "#73A63B" }}
              className="text-white text-xl flex items-center">
              <FaQuestionCircle className="mr-2" />
              কুইজে প্রবেশ করুন
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 lg:p-8">
          <div className="flex justify-center mb-4">
            <Input
              placeholder="Search users..."
              prefix={<AiOutlineSearch />}
              value={searchText}
              onChange={handleSearch}
              className="w-full max-w-xs"
            />
          </div>
          <h3 className="text-2xl text-[#73A63B] font-semibold mb-4 text-center bangla-text">
            অলটাইম লিডারবোর্ড
          </h3>
          {filteredResults?.length ? (
            <>
              <Table
                columns={columns}
                dataSource={filteredResults.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                )}
                pagination={false}
                loading={loading}
                rowKey="userId"
                className="text-center "
                size="small" // Make rows smaller
              />
              <div className="pt-4">
                {" "}
                {/* Add padding to the pagination */}
                <Pagination
                  className="mx-auto"
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredResults.length}
                  onChange={handleTableChange}
                  showSizeChanger
                  // pageSizeOptions={["10", "20", "50"]}
                  // showQuickJumper
                />
              </div>
            </>
          ) : (
            <Empty description="No results available" />
          )}
        </div>
      </div>
    </div>
  );
}
