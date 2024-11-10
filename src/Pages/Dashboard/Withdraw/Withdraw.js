import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

import { Alert, Button, Modal, Pagination, Popconfirm, Spin } from "antd";

import InsertWithdraw from "./InsertWithdraw";
import UpdateWithdraw from "./UpdateWithdraw";
import { coreAxios } from "../../../utilities/axios";
import { formatDate } from "../../../utilities/dateFormate";
import UpdateSingleWithdraw from "./UpdateSingleWithdraw";

const Withdraw = () => {
  const history = useHistory();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Get the navigate function
  const [showDialog, setShowDialog] = useState(false); //insert customer
  const [showDialog1, setShowDialog1] = useState(false); //update customer
  const [selectedRoll, setSelectedRoll] = useState(null); // Initially set to null
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [rowData, setRowData] = useState({});

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    setIsModalOpen3(false);
    fetchDepositInfo();
    setRowData(null);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [rollData, setRollData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Change the number of items per page as needed

  // const fetchDepositInfo = async () => {
  //   try {
  //     setLoading(true);
  //     const uri =
  //       userInfo?.userRole === "Super-Admin"
  //         ? "cost-info"
  //         : `cost-info/${userInfo?._id}`;
  //     const response = await coreAxios.get(uri);
  //     if (response?.status === 200) {
  //       if (userInfo?.userRole === "Super-Admin") {
  //         const sortedData = response?.data?.sort((a, b) => {
  //           return new Date(b?.requestDate) - new Date(a?.requestDate);
  //         });
  //         setRollData(sortedData);
  //         setLoading(false);
  //       } else {
  //         const sortedData = response?.data?.deposits?.sort((a, b) => {
  //           return new Date(b?.requestDate) - new Date(a?.requestDate);
  //         });
  //         setRollData(sortedData);
  //         setLoading(false);
  //       }
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Error fetching rolls:", error);
  //   }
  // };

  const fetchDepositInfo = async () => {
    try {
      setLoading(true);
      const uri =
        userInfo?.userRole === "Super-Admin"
          ? "cost-info"
          : userInfo?.userRole === "Accountant"
          ? "cost-info"
          : userInfo?.userRole === "Second-Accountant"
          ? "cost-info"
          : `cost-info/${userInfo?._id}`;
      const response = await coreAxios.get(uri);
      if (response?.status === 200) {
        let filteredData = [];

        if (
          userInfo?.userRole === "Super-Admin" ||
          userInfo?.userRole === "Accountant" ||
          userInfo?.userRole === "Second-Accountant"
        ) {
          // Sort the filtered data by depositDate
          const sortedData = response?.data?.sort((a, b) => {
            return new Date(b?.requestDate) - new Date(a?.requestDate);
          });

          setRollData(sortedData);
        } else {
          const sortedData = response?.data?.deposits?.sort((a, b) => {
            return new Date(b?.requestDate) - new Date(a?.requestDate);
          });
          setRollData(sortedData);
        }

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };

  useEffect(() => {
    fetchDepositInfo();
  }, []);

  const onHideDialog = () => {
    setShowDialog(false);
    setShowDialog1(false);
  };

  const handleEditClick = async (RollID) => {
    console.log("RollID", RollID);
    try {
      const response = await axios.get(`scholarship-info/${RollID}`);
      if (response.data) {
        setSelectedRoll(response.data);
        setShowDialog1(true);
      } else {
        console.error("Customer data not found");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };
  const handleDelete = async (RollID) => {
    console.log(RollID);
    try {
      setLoading(true);
      const response = await coreAxios.delete(`/cost-info/${RollID}`);
      if (response.data) {
        toast.success("Successfully Deleted");
        setLoading(false);
        fetchDepositInfo();
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
              <h3 className="text-[17px]">Withdrawal/Cost History</h3>
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
                    User Name
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Amount
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Reason
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Request Date
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Project
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Withdrawal Method
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Phone
                  </th>

                  <th className="border border-tableBorder text-center p-2">
                    Accepted Date
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Documents Submit Date
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Documents
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Status
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((roll) => (
                  <tr key={roll?.scholarshipRollNumber}>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.userName}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center font-bold text-green-900">
                      ৳{roll?.amount}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center font-bold text-purple-900">
                      {roll?.reason}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(roll?.requestDate)}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.project}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.paymentMethod}
                    </td>
                    <td className="border border-tableBorder px-1 text-center">
                      0{roll?.phone}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.acceptedDate
                        ? formatDate(roll?.acceptedDate)
                        : "Not Accepted Yet"}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(roll?.fileAttachedDate)}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.file ? (
                        <a
                          href={roll.file}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Button type="primary" size="small">
                            View File
                          </Button>
                        </a>
                      ) : (
                        <span>No File</span>
                      )}
                    </td>

                    <td
                      className={`border border-tableBorder pl-1 text-center text-[14px] font-semi-bold ${
                        roll?.status === "Approved"
                          ? "text-green-500 "
                          : roll?.status === "Rejected"
                          ? "text-red-500"
                          : roll?.status === "Hold"
                          ? "text-yellow-500"
                          : ""
                      }`}>
                      {roll?.status}
                    </td>

                    <td className="border border-tableBorder pl-1">
                      <div className="flex justify-center items-center py-2 gap-1">
                        {roll?.status !== "Approved" && (
                          <div className="flex justify-center items-center py-2 gap-1">
                            <button
                              className="font-semibold gap-2.5 rounded-lg bg-editbuttonColor text-white py-2 px-4 text-xl"
                              onClick={() => {
                                setRowData(roll);
                                setIsModalOpen3(true);
                              }}>
                              <span>
                                <i className="pi pi-file font-semibold pl-1">
                                  Update
                                </i>
                              </span>
                            </button>
                            {(userInfo?.userRole === "Super-Admin" ||
                              userInfo?.userRole === "Accountant" ||
                              userInfo?.userRole === "Second-Accountant") && (
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

                            {/* <Popconfirm
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
                            </Popconfirm> */}
                          </div>
                        )}
                        {roll?.status === "Approved" && (
                          <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => {
                              if (
                                userInfo?.userRole === "Super-Admin" ||
                                userInfo?.userRole === "Accountant" ||
                                userInfo?.userRole === "Second-Accountant"
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
        title="Please Provided Valid Information"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
        <InsertWithdraw handleCancel={handleCancel} />
      </Modal>
      <Modal
        title="Please Provided Valid Information"
        open={isModalOpen2}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
        <UpdateWithdraw handleCancel={handleCancel} rowData={rowData} />
      </Modal>
      <Modal
        title="Please Provided Valid Information"
        open={isModalOpen3}
        // onOk={handleOk}
        onCancel={handleCancel}
        width={800}>
        <UpdateSingleWithdraw handleCancel={handleCancel} rowData={rowData} />
      </Modal>
    </>
  );
};

export default Withdraw;
