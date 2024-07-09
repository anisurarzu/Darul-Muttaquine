import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

import { Alert, Button, Modal, Pagination, Popconfirm, Spin } from "antd";

import { formatDate } from "../../../utilities/dateFormate";
import UpdateUser from "./UpdateUser";
import { coreAxios } from "../../../utilities/axios";

const UserDashboard = () => {
  const navigate = useHistory(); // Get the navigate function
  const [rowData, setRowData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    fetchScholarshipInfo();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [rollData, setRollData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Change the number of items per page as needed

  const fetchScholarshipInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
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

  const handleDelete = async (RollID) => {
    console.log(RollID);
    try {
      setLoading(true);
      const response = await coreAxios.delete(`/user-info/${RollID}`);
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
    // navigate(-1);
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
              <h3 className="text-[17px]">User Details ({rollData?.length})</h3>
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
                    Image
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    DMF ID
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Name
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    User Name
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Role
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Phone
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Blood Group
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Email
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Join Date
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((roll) => (
                  <tr key={roll?.scholarshipRollNumber}>
                    <td className="border border-tableBorder pl-1 text-center flex justify-center ">
                      <img
                        className="w-[40px] lg:w-[60px] xl:w-[60px] h-[40px] lg:h-[60px] xl:h-[60px] rounded-[100px] mt-2 lg:mt-0 xl:mt-0   lg:rounded-[100px] xl:rounded-[100px] object-cover "
                        src={
                          roll?.image ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_JmAXuH2Myq0ah2g_5ioG6Ku7aR02-mcvimzwFXuD25p2bjx7zhaL34oJ7H9khuFx50&usqp=CAU"
                        }
                        alt=""
                      />
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.uniqueId}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll.firstName} {roll?.lastName}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll.username}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll.userRole}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll.phone}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll.bloodGroup}
                    </td>

                    <td className="border border-tableBorder pl-1 text-center">
                      {roll?.email}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(roll?.createdAt)}
                    </td>

                    <td className="border border-tableBorder pl-1">
                      <div className="flex justify-center items-center py-2 gap-1">
                        <button
                          className="font-semibold gap-2.5 rounded-lg bg-editbuttonColor text-white py-2 px-4 text-xl"
                          onClick={() => {
                            setRowData(roll);
                            setIsModalOpen(true);
                          }} // Ensure this is correct
                        >
                          <span>
                            <i className="pi pi-pencil font-semibold"></i>
                          </span>
                        </button>
                        <Popconfirm
                          title="Delete the task"
                          description="Are you sure to delete this task?"
                          onConfirm={() => {
                            handleDelete(roll._id);
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
                      |
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
        <UpdateUser handleCancel={handleCancel} rowData={rowData} />
      </Modal>
    </>
  );
};

export default UserDashboard;
