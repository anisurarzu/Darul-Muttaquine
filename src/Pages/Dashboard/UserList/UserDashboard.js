import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Alert,
  Button,
  Modal,
  Pagination,
  Popconfirm,
  Spin,
  Image,
  Select,
} from "antd";
import { formatDate } from "../../../utilities/dateFormate";
import UpdateUser from "./UpdateUser";
import { coreAxios } from "../../../utilities/axios";

const UserDashboard = () => {
  const navigate = useHistory();
  const [rowData, setRowData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rollData, setRollData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'submitted', 'verified'

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
    try {
      setLoading(true);
      const response = await coreAxios.delete(`/user/${RollID}`);
      if (response.data) {
        toast.success("Successfully Deleted!");
        setLoading(false);
        fetchScholarshipInfo();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleVerification = async (userEmail, isVerified) => {
    try {
      setLoading(true);
      const response = await coreAxios.post(`/update-user`, {
        email: userEmail,
        isVerification: isVerified,
      });

      if (response?.status === 200) {
        toast.success(isVerified ? "User Verified!" : "User Rejected!");
        fetchScholarshipInfo();
        setIsDocsModalOpen(false);
      } else {
        toast.error("Failed to update verification status");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error during verification!");
    }
  };

  const filteredRolls = rollData.filter((roll) => {
    // Apply search filter
    const searchMatch = searchQuery
      ? Object.values(roll)
          .join("")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    // Apply status filter
    let statusMatch = true;
    if (filterStatus === "submitted") {
      statusMatch = roll.nidInfo && roll.photoInfo;
    } else if (filterStatus === "verified") {
      statusMatch = roll.isVerification === true;
    }

    return searchMatch && statusMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRolls.slice(indexOfFirstItem, indexOfLastItem);

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
                onClick={() => navigate(-1)}
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
              <h3 className="text-[17px]">
                User Details ({filteredRolls?.length})
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <Select
                defaultValue="all"
                style={{ width: 180 }}
                onChange={(value) => setFilterStatus(value)}
                options={[
                  { value: "all", label: "All Users" },
                  { value: "submitted", label: "Documents Submitted" },
                  { value: "verified", label: "Verified Users" },
                ]}
              />
              <div className="relative">
                <input
                  type="text"
                  id="table-search-users"
                  className="block py-2 ps-10 text-md text-gray-900 border border-gray-300 rounded-full w-56 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
          </div>

          {/* Rest of your component remains the same */}
          <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400">
              {/* Table headers and body remain the same */}
              <thead className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="border border-tableBorder text-center p-2">
                    Image
                  </th>
                  <th className="border border-tableBorder text-center p-2">
                    Docs
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
                  <tr
                    key={roll._id}
                    className={
                      roll.isVerification
                        ? "bg-green-200 text-green-600"
                        : roll.nidInfo && roll.photoInfo
                        ? "bg-yellow-200 text-yellow-600"
                        : ""
                    }>
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
                      <button
                        className="font-semibold text-blue-600"
                        onClick={() => {
                          setRowData(roll);
                          setIsDocsModalOpen(true);
                        }}>
                        View Docs
                      </button>
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll.uniqueId}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {roll.firstName} {roll.lastName}
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
                      {roll.email}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(roll.createdAt)}
                    </td>

                    <td className="border border-tableBorder pl-1">
                      <div className="flex justify-center items-center py-2 gap-1">
                        <button
                          className="font-semibold gap-2.5 rounded-lg bg-editbuttonColor text-white py-2 px-4 text-xl"
                          onClick={() => {
                            setRowData(roll);
                            setIsProfileModalOpen(true);
                          }}>
                          <span>
                            <i className="pi pi-pencil font-semibold"></i>
                          </span>
                        </button>
                        <Popconfirm
                          title="Delete the user"
                          description="Are you sure to delete this user?"
                          onConfirm={() => handleDelete(roll._id)}
                          onCancel={() => toast.error("Delete action canceled")}
                          okText="Yes"
                          cancelText="No">
                          <button className="font-semibold gap-2.5 rounded-lg bg-editbuttonColor text-white py-2 px-4 text-xl">
                            <span>
                              <i className="pi pi-trash font-semibold"></i>
                            </span>
                          </button>
                        </Popconfirm>
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

      {/* Profile Modal */}
      <Modal
        title="User Profile"
        open={isProfileModalOpen}
        onCancel={() => setIsProfileModalOpen(false)}
        footer={null}>
        <UpdateUser rowData={rowData} />
      </Modal>

      {/* Docs Modal */}
      <Modal
        title="User Documents"
        open={isDocsModalOpen}
        onCancel={() => setIsDocsModalOpen(false)}
        width={600}>
        <div className="flex justify-center gap-4 flex-wrap">
          {rowData?.nidInfo?.url && (
            <div className="flex flex-col items-center">
              <Image
                src={rowData?.nidInfo?.url}
                alt="NID"
                className="object-cover mb-2 cursor-pointer"
                width={250}
                height={180}
                preview={true}
              />
              <p>NID</p>
            </div>
          )}
          {rowData?.photoInfo?.url && (
            <div className="flex flex-col items-center">
              <Image
                src={rowData?.photoInfo?.url}
                alt="Photo"
                className="object-cover mb-2 cursor-pointer"
                width={250}
                height={180}
                preview={true}
              />
              <p>Photo</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center mt-4">
          <Button
            className="bg-green-500 hover:bg-green-700 text-white"
            type="primary"
            onClick={() => handleVerification(rowData.email, true)}>
            Verify
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-700 text-white"
            type="danger"
            onClick={() => handleVerification(rowData.email, false)}>
            Reject
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default UserDashboard;
