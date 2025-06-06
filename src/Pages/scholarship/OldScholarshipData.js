import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import RollInsert from "./RollInsert";
// import RollEdit from "./RollEdit";

import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ScholarshipInsert from "./ScholarshipInsert";
import { Alert, Button, Modal, Pagination, Popconfirm, Spin } from "antd";
import { coreAxios } from "../../utilities/axios";
import jsPDF from "jspdf";
import AdmitCard from "../Dashboard/AdmitCard";
import { formatDate } from "../../utilities/dateFormate";
import ScholarshipUpdate from "./ScholarshipUpdate";
import QrReader from "react-qr-scanner";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const OldScholarshipData = () => {
  const navigate = useHistory(); // Get the navigate function
  const [showDialog, setShowDialog] = useState(false); //insert customer
  const [showDialog1, setShowDialog1] = useState(false); //update customer
  const [selectedRoll, setSelectedRoll] = useState(null); // Initially set to null
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [rowData, setRowData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showQrScanner, setShowQrScanner] = useState(false); // QR scanner visibility
  const [qrScanResult, setQrScanResult] = useState(""); // QR scan result

  const [facingMode, setFacingMode] = useState("environment");

  const history = useHistory();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    fetchScholarshipInfo();
  };

  //state for search query
  const [searchQuery, setSearchQuery] = useState("");

  // delete
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);

  const [rollData, setRollData] = useState([]);

  // Fetch customers from the API
  // Construct the API endpoint URL using the environment variable

  const fetchScholarshipInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/scholarship-info-old`);
      if (response?.status === 200) {
        // Sort the data by the submittedAt field in descending order
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

  useEffect(() => {
    fetchScholarshipInfo();
  }, []);

  const onHideDialog = () => {
    setShowDialog(false);
    setShowDialog1(false);
  };

  // handle Update or Edit
  const handleEditClick = async (RollID) => {
    setIsModalOpen2(true); // Check if this logs the correct RollID
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
    height: 240,
    width: 320,
  };

  const handleBackClick = () => {
    history.goBack(); // Navigate back to the previous page
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
      // setRollData([filteredRoll]);
      if (filteredRoll) {
        updateAttendanceStatus(filteredRoll);
      } else {
        toast.error(`User Didn't Matched`);
      }

      // Set the filtered roll data
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
      facingMode: { exact: "environment" }, // Specifically request the back camera
    },
  };
  // Function to generate PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Name",
      "Roll Number",
      "Institute",
      "Class",
      "Phone",
      "Date",
      "SMS Sent",
      "Attendance",
    ];
    const tableRows = filteredRolls.map((roll) => [
      roll.name,
      roll.scholarshipRollNumber,
      roll.institute,
      roll.instituteClass,
      roll.phone,
      new Date(roll.submittedAt).toLocaleDateString(),
      roll.isSmsSend ? "Yes" : "No",

      roll.isAttendanceComplete ? "Present" : "Not Present",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("ScholarshipData.pdf");
  };

  // Function to generate Excel
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
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ScholarshipData");
    XLSX.writeFile(workbook, "ScholarshipData.xlsx");
  };

  const countAttendanceComplete = rollData?.filter(
    (item) => item?.isAttendanceComplete === true
  )?.length;

  // Function to count total resultDetails, isScholarshiped, TalentpoolGrade, and GeneralGrade
  let totalResultDetailsCount = 0;
  let isScholarshipedCount = 0;
  let talentpoolGradeCount = 0;
  let generalGradeCount = 0;

  rollData?.forEach((item) => {
    if (Array.isArray(item.resultDetails)) {
      totalResultDetailsCount += item.resultDetails.length;

      // Loop through resultDetails for each result
      item.resultDetails.forEach((result) => {
        if (result.totalMarks >= 80) {
          isScholarshipedCount++; // Marks >= 80 is considered for scholarship

          // Check for TalentpoolGrade and GeneralGrade
          if (result.totalMarks >= 90) {
            talentpoolGradeCount++; // Marks >= 90
          } else if (result.totalMarks >= 80 && result.totalMarks < 90) {
            generalGradeCount++; // Marks between 80 and 89
          }
        }
      });
    }
  });

  return (
    <>
      {loading ? (
        <Spin tip="Loading...">
          <Alert
            message="Alert message title"
            description="Further details about the context of this alert."
            type="info"
          />
        </Spin>
      ) : (
        <div className="text-sm mx-8 my-6">
          <h3 className="text-lg font-bold">DMF Scholarship 2024</h3>
          <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-2 border border-tableBorder bg-white px-4 py-5">
            <div className="ml-1">
              <button
                className="font-semibold inline-flex items-center justify-center gap-2.5 rounded-lg text-lg bg-newbuttonColor py-2 px-10 text-center text-white hover:bg-opacity-90 lg:px-8 xl:px-4 "
                onClick={() => showModal()}
                style={{
                  outline: "none",
                  borderColor: "transparent !important",
                }}>
                <span>
                  <i className="pi pi-plus font-semibold"></i>
                </span>
                NEW
              </button>

              <button
                className="font-semibold inline-flex items-center text-lg justify-center gap-2.5 rounded-lg bg-editbuttonColor py-2 px-10 text-center text-white hover:bg-opacity-90 lg:px-8 xl:px-4 ml-4"
                onClick={handleBackClick} // Use the handleBackClick function here
                style={{
                  outline: "none",
                  borderColor: "transparent !important",
                }}>
                <span>
                  <i className="pi pi-arrow-left font-semibold"></i>
                </span>
                BACK
              </button>
              <Button
                className="font-semibold inline-flex items-center text-lg justify-center gap-2.5 rounded-lg bg-newbuttonColor py-2 px-10 text-center text-white hover:bg-opacity-90 lg:px-8 xl:px-4 ml-12 mt-4 mb-2 lg:ml-4 lg:mt-0 xl:mb-0 xl:mt-0"
                onClick={() => setShowQrScanner(!showQrScanner)}>
                Scan Now
              </Button>
            </div>
            <div className="flex justify-end mb-4 gap-4">
              <button
                className="font-semibold gap-2.5 rounded-lg bg-blue-500 text-white py-2 px-4 text-xl"
                onClick={exportToPDF}>
                Generate PDF
              </button>
              <button
                className="font-semibold gap-2.5 rounded-lg bg-green-500 text-white py-2 px-4 text-xl"
                onClick={exportToExcel}>
                Generate Excel
              </button>
            </div>
            <div>
              <h3 className="text-[17px]">
                Applications ({rollData?.length}) Present (
                {countAttendanceComplete}) Results ({totalResultDetailsCount})
                ScholarShipped ({isScholarshipedCount}) T-Grade (
                {talentpoolGradeCount}) G-Grade ({generalGradeCount})
              </h3>
            </div>

            <div className="relative mx-8 mr-4">
              <input
                type="text"
                id="table-search-users"
                className="block py-2 ps-10 text-md text-gray-900 border border-gray-300 rounded-full w-56 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="absolute inset-y-0 flex items-center p-3">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
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

          {showQrScanner && (
            <div className="my-4">
              <QrReader
                delay={100}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
                // facingMode={"environment"}
                facingMode={facingMode}
              />
              <button
                onClick={() =>
                  setFacingMode(
                    facingMode === "environment" ? "user" : "environment"
                  )
                }>
                Switch Camera
              </button>
            </div>
          )}
          {/* <p className="mt-2 text-lg font-semibold">
            QR Scan Result: {qrScanResult}
          </p> */}

          <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="border border-tableBorder text-center p-2">
                    Image
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Scholarship Roll
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Seat Planed
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Name
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Institute
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Class
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Date
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Phone
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    SMS Send
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Attendance
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Results
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Created By
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Admit Card
                  </th>

                  <th className="border border-tableBorder text-center p-2">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentItems?.map((roll, index) => (
                  <tr
                    key={roll?.scholarshipRollNumber}
                    className={` ${
                      roll?.isAttendanceComplete &&
                      "bg-purple-100 text-purple-600"
                    } `}>
                    <td className="border border-tableBorder pl-1 text-center flex justify-center ">
                      <img
                        className="w-[40px] lg:w-[60px] xl:w-[60px] h-[40px] lg:h-[60px] xl:h-[60px] rounded-[100px] mt-2 lg:mt-0 xl:mt-0   lg:rounded-[100px] xl:rounded-[100px] object-cover "
                        src={roll?.image}
                        alt=""
                      />
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.scholarshipRollNumber}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.isSeatPlaned ? "Send" : "Not Send"}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll.name}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll.institute}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll.instituteClass}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(roll.submittedAt)}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {typeof roll?.phone === "string" &&
                      roll?.phone?.startsWith("0")
                        ? roll?.phone
                        : `0${roll?.phone}`}
                    </td>

                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.isSmsSend ? "Send" : "Not Send"}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.isAttendanceComplete ? "Present" : "Not Present"}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.resultDetails?.[0]?.totalMarks}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.createdByName}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      <button
                        className="font-semibold gap-2.5 rounded-lg bg-editbuttonColor text-white py-2 px-4 text-xl"
                        onClick={() => {
                          toast.warn("Please Contact Your Administrator!");
                          //   history.push(`/admitCard/${roll?._id}`);
                        }} // Ensure this is correct
                      >
                        <span>Download</span>
                      </button>
                    </td>

                    <td className="border border-tableBorder pl-1">
                      <div className="flex justify-center items-center py-2 gap-1">
                        <button
                          className="font-semibold gap-2.5 rounded-lg bg-editbuttonColor text-white py-2 px-4 text-xl"
                          onClick={() => {
                            toast.warn("Please Contact Your Administrator!");
                            // setRowData(roll);
                            // handleEditClick(roll._id);
                          }} // Ensure this is correct
                        >
                          <span>
                            <i className="pi pi-pencil font-semibold"></i>
                          </span>
                        </button>
                        {/* {!roll?.isSmsSend && (
                          <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => {
                              handleDelete(roll?._id);
                            }}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No">
                            <button className="font-semibold gap-2.5 rounded-lg bg-editbuttonColor text-white py-2 px-4 text-xl">
                              <span>
                                <i className="pi pi-trash font-semibold"></i>
                              </span>
                            </button>
                          </Popconfirm>
                        )} */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center p-2">
              <Pagination
                showQuickJumper
                current={currentPage}
                total={filteredRolls.length}
                pageSize={itemsPerPage}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* start insert dialog */}

      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal
        title="Please Provided Valid Information"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
        <ScholarshipInsert handleCancel={handleCancel} isUpdate={false} />
      </Modal>
      <Modal
        title="Please Provided Valid Information"
        open={isModalOpen2}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
        <ScholarshipUpdate
          handleCancel={handleCancel}
          scholarshipData={rowData}
          isUpdate={true}
        />
      </Modal>
      {/* <Modal
        title="Scholarship 2024"
        open={isModalOpen2}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
        <AdmitCard handleCancel={handleCancel} />
      </Modal> */}
    </>
  );
};

export default OldScholarshipData;
