import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

import {
  Alert,
  Button,
  Modal,
  Pagination,
  Popconfirm,
  Spin,
  Tag,
  Descriptions,
  Image,
} from "antd";

import CreateCourse from "./CreateCourse";
import { coreAxios } from "../../utilities/axios";
import { formatDate } from "../../utilities/dateFormate";

const CourseDashboard = () => {
  const history = useHistory();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [showDialog, setShowDialog] = useState(false);
  const [showDialog1, setShowDialog1] = useState(false);
  const [selectedRoll, setSelectedRoll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rowData, setRowData] = useState({});
  const [instructors, setInstructors] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    setIsViewModalOpen(false);
    fetchQuizeInfo();
  };

  const showViewModal = (course) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [rollData, setRollData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(18);

  const fetchQuizeInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("/courses");
      if (response?.status === 200) {
        setLoading(false);
        const sortedData = response?.data?.courses?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        setRollData(sortedData);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await coreAxios.get("/users");
      setInstructors(response?.data);
    } catch (error) {
      toast.error("ইন্সট্রাক্টরদের তালিকা লোড করতে সমস্যা হয়েছে");
    }
  };

  useEffect(() => {
    fetchQuizeInfo();
    fetchInstructors();
  }, []);

  const onHideDialog = () => {
    setShowDialog(false);
    setShowDialog1(false);
  };

  const handleDelete = async (RollID) => {
    console.log(RollID);
    try {
      setLoading(true);
      const response = await coreAxios.delete(`/courses/${RollID}`);
      if (response.data) {
        toast.success("Successfully Deleted!");
        setLoading(false);
        fetchQuizeInfo();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
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

  const handleBackClick = () => {
    history.goBack();
  };
  const confirm = (e) => {
    console.log(e);
    toast.success("Click on Yes");
  };
  const cancel = (e) => {
    console.log(e);
    toast.error("Click on No");
  };

  const onChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalDepositAmount = rollData?.reduce(
    (total, deposit) => total + deposit?.amount,
    0
  );

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
          <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-2 border border-tableBorder bg-white px-4 py-5">
            <div className="ml-1">
              <button
                className="font-semibold inline-flex items-center justify-center gap-2.5 rounded-lg text-lg bg-newbuttonColor py-2 px-10 text-center text-white hover:bg-opacity-90 lg:px-8 xl:px-4 "
                onClick={() => showModal()}
                style={{
                  outline: "none",
                  borderColor: "transparent !important",
                }}
              >
                <span>
                  <i className="pi pi-plus font-semibold"></i>
                </span>
                NEW
              </button>

              <button
                className="font-semibold inline-flex items-center text-lg justify-center gap-2.5 rounded-lg bg-editbuttonColor py-2 px-10 text-center text-white hover:bg-opacity-90 lg:px-8 xl:px-4 ml-4"
                onClick={handleBackClick}
                style={{
                  outline: "none",
                  borderColor: "transparent !important",
                }}
              >
                <span>
                  <i className="pi pi-arrow-left font-semibold"></i>
                </span>
                BACK
              </button>
            </div>
            <div>
              <h3 className="text-[17px]">Course Management</h3>
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
                  viewBox="0 0 20 20"
                >
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

          <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="border border-tableBorder text-center p-2">
                    Course Name
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Enrollments
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Created Date
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Start Date
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    End Date
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Status
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((roll) => (
                  <tr key={roll?._id}>
                    <td className="border border-tableBorder pl-2 text-left">
                      {roll?.title}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center font-bold text-green-900">
                      {roll?.enrollments?.length || 0}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(roll?.createdAt)}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(roll?.startDate)}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(roll?.endDate)}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      <Tag color={roll?.status === "Active" ? "green" : "red"}>
                        {roll?.status || "Inactive"}
                      </Tag>
                    </td>

                    <td className="border border-tableBorder pl-1">
                      <div className="flex justify-center items-center py-2 gap-1">
                        <button
                          className="font-semibold gap-2.5 rounded-lg bg-blue-500 text-white py-2 px-4 text-xl"
                          onClick={() => showViewModal(roll)}
                        >
                          <span>
                            <i className="pi pi-eye font-semibold">View</i>
                          </span>
                        </button>

                        {roll?.status !== "Approved" && (
                          <>
                            {userInfo?.userRole === "Super-Admin" && (
                              <button
                                className="font-semibold gap-2.5 rounded-lg bg-editbuttonColor text-white py-2 px-4 text-xl"
                                onClick={() => {
                                  setRowData(roll);
                                  setIsModalOpen2(true);
                                }}
                              >
                                <span>
                                  <i className="pi pi-pencil font-semibold">
                                    Edit
                                  </i>
                                </span>
                              </button>
                            )}

                            <Popconfirm
                              title="Delete the course"
                              description="Are you sure to delete this course?"
                              onConfirm={() => {
                                if (
                                  userInfo?.userRole === "Super-Admin" ||
                                  "Admin"
                                ) {
                                  handleDelete(roll?._id);
                                } else {
                                  toast.error("Please contact with Admin!");
                                }
                              }}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <button className="font-semibold gap-2.5 rounded-lg bg-red-500 text-white py-2 px-4 text-xl">
                                <span>
                                  <i className="pi pi-trash font-semibold">
                                    Delete
                                  </i>
                                </span>
                              </button>
                            </Popconfirm>
                          </>
                        )}
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

      <Modal
        title="Create New Course"
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <CreateCourse handleCancel={handleCancel} instructors={instructors} />
      </Modal>

      {/* View Course Details Modal */}
      <Modal
        title="Course Details"
        open={isViewModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        {selectedCourse && (
          <div className="course-details-container">
            <div className="mb-6 text-center">
              <Image
                src={selectedCourse.image}
                alt={selectedCourse.title}
                width={300}
                height={200}
                className="rounded-lg mx-auto"
                fallback="https://via.placeholder.com/300x200?text=No+Image"
              />
              <h2 className="text-2xl font-bold mt-4">
                {selectedCourse.title}
              </h2>
              <p className="text-gray-600">{selectedCourse.category}</p>
            </div>

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Description">
                {selectedCourse.description}
              </Descriptions.Item>
              <Descriptions.Item label="Instructor">
                {selectedCourse.instructorName}
              </Descriptions.Item>
              <Descriptions.Item label="Batch Number">
                {selectedCourse.batchNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                {selectedCourse.duration}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {formatDate(selectedCourse.startDate)}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {formatDate(selectedCourse.endDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Available Seats">
                {selectedCourse.availableSeats}
              </Descriptions.Item>
              <Descriptions.Item label="Qualifications">
                {selectedCourse.qualifications}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {selectedCourse.price} BDT
              </Descriptions.Item>
              <Descriptions.Item label="Certifications">
                {selectedCourse.certifications || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={selectedCourse.status === "Active" ? "green" : "red"}
                >
                  {selectedCourse.status || "Inactive"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {formatDate(selectedCourse.createdAt)}
              </Descriptions.Item>
            </Descriptions>

            {selectedCourse.enrollments?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Enrollments ({selectedCourse.enrollments.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Class</th>
                        <th className="py-2 px-4 border">Institute</th>
                        <th className="py-2 px-4 border">Phone</th>
                        <th className="py-2 px-4 border">Payment Method</th>
                        <th className="py-2 px-4 border">Enrolled At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCourse.enrollments.map((enrollment, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4 border">
                            {enrollment.name}
                          </td>
                          <td className="py-2 px-4 border">
                            {enrollment.class || enrollment.studentClass}
                          </td>
                          <td className="py-2 px-4 border">
                            {enrollment.lastInstitute}
                          </td>
                          <td className="py-2 px-4 border">
                            {enrollment.phone}
                          </td>
                          <td className="py-2 px-4 border">
                            {enrollment.paymentMethod}
                          </td>
                          <td className="py-2 px-4 border">
                            {formatDate(enrollment.enrolledAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default CourseDashboard;
