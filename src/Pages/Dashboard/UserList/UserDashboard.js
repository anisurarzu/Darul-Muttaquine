import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
  Table,
  Tag,
} from "antd";
import { formatDate } from "../../../utilities/dateFormate";
import UpdateUser from "./UpdateUser";
import { coreAxios } from "../../../utilities/axios";
import * as XLSX from "xlsx";

const UserDashboard = () => {
  const navigate = useHistory();
  const [rowData, setRowData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [allDepositsData, setAllDepositsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch all users data
  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        setUsersData(sortedData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all deposits data
  const fetchAllDepositsData = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/deposit-info`);
      if (response?.status === 200) {
        setAllDepositsData(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
    fetchAllDepositsData();
  }, []);

  // Get deposits for a specific user
  const getUserDeposits = (userId) => {
    if (!Array.isArray(allDepositsData)) return [];
    return allDepositsData.filter((deposit) => deposit?.userID === userId);
  };

  // Check current month deposit status for a user
  const getCurrentMonthDepositStatus = (userId) => {
    const userDeposits = getUserDeposits(userId);
    if (userDeposits.length === 0) return "due";

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const hasCurrentMonthDeposit = userDeposits.some((deposit) => {
      if (!deposit?.depositDate) return false;
      const depositDate = new Date(deposit.depositDate);
      return (
        depositDate.getMonth() === currentMonth &&
        depositDate.getFullYear() === currentYear &&
        deposit.status === "Approved"
      );
    });

    return hasCurrentMonthDeposit ? "paid" : "due";
  };

  const handleDelete = async (userId) => {
    try {
      setLoading(true);
      const response = await coreAxios.delete(`/user/${userId}`);
      if (response.data) {
        toast.success("Successfully Deleted!");
        fetchUsersData();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
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
        fetchUsersData();
        setIsDocsModalOpen(false);
      }
    } catch (error) {
      toast.error("Error during verification!");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredUsers.map((user) => ({
      "DMF ID": user.uniqueId,
      Name: `${user.firstName} ${user.lastName}`,
      "User Name": user.username,
      Role: user.userRole,
      Phone: user.phone,
      "Blood Group": user.bloodGroup,
      Email: user.email,
      "Join Date": formatDate(user.createdAt),
      "Current Month Status": getCurrentMonthDepositStatus(user._id),
      Status: user.isVerification
        ? "Verified"
        : user.nidInfo && user.photoInfo
        ? "Documents Submitted"
        : "Not Submitted",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  const filteredUsers = usersData.filter((user) => {
    // Apply search filter
    const searchMatch = searchQuery
      ? Object.values(user)
          .join("")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    // Apply status filter
    let statusMatch = true;
    if (filterStatus === "submitted") {
      statusMatch = user.nidInfo && user.photoInfo;
    } else if (filterStatus === "verified") {
      statusMatch = user.isVerification === true;
    }

    return searchMatch && statusMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const onChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Columns for deposit history table
  const depositColumns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `৳${amount}`,
    },
    {
      title: "Date",
      dataIndex: "depositDate",
      key: "depositDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Transaction ID",
      dataIndex: "tnxID",
      key: "tnxID",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => method.toUpperCase(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Approved" ? "green" : "orange"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Spin tip="Loading...">
          <Alert
            message="Loading Data"
            description="Please wait while we load the data."
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
              >
                <i className="pi pi-arrow-left font-semibold"></i>
                BACK
              </button>
            </div>

            <div>
              <h3 className="text-[17px]">
                User Details ({filteredUsers?.length})
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <Select
                defaultValue="all"
                style={{ width: 180 }}
                onChange={setFilterStatus}
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
                  className="block py-2 ps-10 text-md text-gray-900 border border-gray-300 rounded-full w-56 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
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
          </div>

          <div className="flex justify-end mb-4">
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export to Excel
            </button>
          </div>

          <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-xl text-left rtl:text-right text-gray-500">
              <thead className="text-xl text-gray-700 uppercase bg-gray-50">
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
                    C.M.D.S
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
                {currentItems.map((user) => (
                  <tr
                    key={user._id}
                    className={
                      user.isVerification
                        ? "bg-green-200 text-green-600"
                        : user.nidInfo && user.photoInfo
                        ? "bg-yellow-200 text-yellow-600"
                        : ""
                    }
                  >
                    <td className="border border-tableBorder pl-1 text-center flex justify-center">
                      <img
                        className="w-[40px] lg:w-[60px] xl:w-[60px] h-[40px] lg:h-[60px] xl:h-[60px] rounded-[100px] object-cover"
                        src={
                          user?.image ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_JmAXuH2Myq0ah2g_5ioG6Ku7aR02-mcvimzwFXuD25p2bjx7zhaL34oJ7H9khuFx50&usqp=CAU"
                        }
                        alt=""
                      />
                    </td>

                    <td className="border border-tableBorder pl-1 text-center">
                      <button
                        className="font-semibold text-blue-600"
                        onClick={() => {
                          setRowData(user);
                          setIsDocsModalOpen(true);
                        }}
                      >
                        View Docs
                      </button>
                    </td>

                    <td className="border border-tableBorder pl-1 text-center">
                      {user.uniqueId}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {user.username}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {user.userRole}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {user.phone}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {user.bloodGroup}
                    </td>
                    <td className="border border-tableBorder pl-1 text-center">
                      {user.email}
                    </td>

                    <td className="border border-tableBorder pl-1 text-center">
                      <Tag
                        color={
                          getCurrentMonthDepositStatus(user._id) === "paid"
                            ? "green"
                            : "red"
                        }
                        style={{ fontWeight: "bold" }}
                      >
                        {getCurrentMonthDepositStatus(user._id).toUpperCase()}
                      </Tag>
                    </td>

                    <td className="border border-tableBorder pl-1 text-center">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="border border-tableBorder pl-1">
                      <div className="flex justify-center items-center py-2 gap-1">
                        <button
                          className="font-semibold gap-2.5 rounded-lg bg-editbuttonColor text-white py-2 px-4 text-xl"
                          onClick={() => {
                            setRowData(user);
                            setIsProfileModalOpen(true);
                          }}
                        >
                          <i className="pi pi-pencil font-semibold">Edit</i>
                        </button>

                        <button
                          className="font-semibold gap-2.5 rounded-lg bg-blue-500 text-white py-2 px-4 text-xl"
                          onClick={() => {
                            setRowData(user);
                            setIsDepositModalOpen(true);
                          }}
                        >
                          <i className="pi pi-history font-semibold">History</i>
                        </button>

                        <Popconfirm
                          title="Delete the user"
                          description="Are you sure to delete this user?"
                          onConfirm={() => handleDelete(user._id)}
                          onCancel={() => toast.error("Delete action canceled")}
                          okText="Yes"
                          cancelText="No"
                        >
                          <button className="font-semibold gap-2.5 rounded-lg bg-red-500 text-white py-2 px-4 text-xl">
                            <i className="pi pi-trash font-semibold">Delete</i>
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
                total={filteredUsers.length}
                pageSize={itemsPerPage}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      )}

      <Modal
        title="User Profile"
        open={isProfileModalOpen}
        onCancel={() => setIsProfileModalOpen(false)}
        footer={null}
      >
        <UpdateUser rowData={rowData} />
      </Modal>

      <Modal
        title="User Documents"
        open={isDocsModalOpen}
        onCancel={() => setIsDocsModalOpen(false)}
        width={600}
      >
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
            onClick={() => handleVerification(rowData.email, true)}
          >
            Verify
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-700 text-white"
            type="danger"
            onClick={() => handleVerification(rowData.email, false)}
          >
            Reject
          </Button>
        </div>
      </Modal>

      <Modal
        title={`Deposit History for ${rowData.firstName || ""} ${
          rowData.lastName || ""
        }`}
        open={isDepositModalOpen}
        onCancel={() => setIsDepositModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={depositColumns}
          dataSource={getUserDeposits(rowData._id)}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          locale={{
            emptyText: "No deposit history found for this user",
          }}
        />
      </Modal>
    </>
  );
};

export default UserDashboard;
