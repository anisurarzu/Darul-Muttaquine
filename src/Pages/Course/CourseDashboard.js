import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

import { Alert, Button, Modal, Pagination, Popconfirm, Spin, Tag } from "antd";

import CreateCourse from "./CreateCourse";
import { coreAxios } from "../../utilities/axios";
import { formatDate } from "../../utilities/dateFormate";

const CourseDashboard = () => {
  const history = useHistory();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Get the navigate function
  const [showDialog, setShowDialog] = useState(false); //insert customer
  const [showDialog1, setShowDialog1] = useState(false); //update customer
  const [selectedRoll, setSelectedRoll] = useState(null); // Initially set to null
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [rowData, setRowData] = useState({});
  const [instructors, setInstructors] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    fetchQuizeInfo();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [rollData, setRollData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(18); // Change the number of items per page as needed

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
  // Fetch list of instructors from API
  const fetchInstructors = async () => {
    try {
      const response = await coreAxios.get("/users"); // Change URL based on your backend
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
                }}>
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
                }}>
                <span>
                  <i className="pi pi-arrow-left font-semibold"></i>
                </span>
                BACK
              </button>
            </div>
            <div>
              <h3 className="text-[17px]">Quize History</h3>
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

          <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="border border-tableBorder text-center p-2">
                    Quize Name
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Attendance
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
                  <tr key={roll?.scholarshipRollNumber}>
                    <td className="border border-tableBorder pl-2 text-left">
                      {/* <TableData status={roll?.status} data={roll?.userName} /> */}
                      {roll?.title}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center font-bold text-green-900">
                      {/* <TableData status={roll?.status} data={roll?.amount} /> */}
                      {roll?.userAnswers?.length}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {/* <TableData
                        status={roll?.status}
                        data={formatDate(roll?.depositDate)}
                      /> */}
                      {formatDate(roll?.createdAt)}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(roll?.startDate)}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(roll?.endDate)}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {/* <TableData status={roll?.status} data={roll?.phone} /> */}
                      {roll?.status}
                    </td>

                    <td className="border border-tableBorder pl-1">
                      {roll?.status !== "Approved" && (
                        <div className="flex justify-center items-center py-2 gap-1">
                          {userInfo?.userRole === "Super-Admin" && (
                            <button
                              className="font-semibold gap-2.5 rounded-lg bg-editbuttonColor text-white py-2 px-4 text-xl"
                              onClick={() => {
                                setRowData(roll);
                                setIsModalOpen2(true);
                              }}>
                              <span>
                                <i className="pi pi-pencil font-semibold"></i>
                              </span>
                            </button>
                          )}

                          <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => {
                              if (
                                userInfo?.userRole === "Super-Admin" ||
                                "Admin"
                              ) {
                                handleDelete(roll?._id);
                              } else {
                                toast.error("Please contact with DMF Admin!");
                              }
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
                        </div>
                      )}
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
        title="Please Provided Valid Information"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
        <CreateCourse handleCancel={handleCancel} instructors={instructors} />
      </Modal>
      {/* <Modal
        title="Please Provided Valid Information"
        open={isModalOpen2}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
        <UpdateQuizeStatus handleCancel={handleCancel} rowData={rowData} />
      </Modal> */}
    </>
  );
};

export default CourseDashboard;
