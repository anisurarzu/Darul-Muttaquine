import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Input,
  Avatar,
  DatePicker,
  Select,
  Skeleton,
  Grid,
  Drawer,
} from "antd";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import { coreAxios } from "../../utilities/axios";
import InvestmentRegistration from "./InvestmentRegistration ";

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;
const { useBreakpoint } = Grid;

const InvestmentUsersDashboard = () => {
  const screens = useBreakpoint();
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [detailsModal, setDetailsModal] = useState({
    visible: false,
    data: null,
  });
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState({
    visible: false,
    data: null,
  });
  const [depositModal, setDepositModal] = useState({
    visible: false,
    data: null,
  });
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [actionRecord, setActionRecord] = useState(null);

  const [depositForm, setDepositForm] = useState({
    date: null,
    amount: "",
    paymentMethod: "",
    transactionID: "",
  });
  const [depositLoading, setDepositLoading] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    numberOfShares: "",
    pinCode: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, investmentsRes] = await Promise.all([
        coreAxios.get("/users"),
        coreAxios.get("/investment-users"),
      ]);

      const usersList = usersRes.data || [];
      const investmentsList = investmentsRes.data || [];

      const merged = investmentsList.map((inv) => {
        const user = usersList.find((u) => u.uniqueId === inv.userDMFID) || {};
        return {
          key: inv._id,
          ...inv,
          username:
            user.username || `${user.firstName || ""} ${user.lastName || ""}`,
          photo: user.image || "https://via.placeholder.com/40",
        };
      });

      setUsers(usersList);
      setInvestments(merged);
      setFilteredData(merged);
    } catch (err) {
      console.error("Error fetching data", err);
      message.error("ডাটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const deleteInvestment = (id) => {
    confirm({
      title: "আপনি কি নিশ্চিত?",
      icon: <ExclamationCircleOutlined />,
      content: "এই ইনভেস্টমেন্ট ব্যবহারকারীকে মুছে ফেলতে চান?",
      okText: "হ্যাঁ",
      cancelText: "না",
      onOk: async () => {
        try {
          const res = await coreAxios.delete(`/investment/${id}`);
          if (res.status === 200) {
            message.success("সফলভাবে মুছে ফেলা হয়েছে");
            fetchData();
          }
        } catch (error) {
          message.error("মুছে ফেলতে ব্যর্থ হয়েছে");
        }
      },
    });
  };

  const onSearch = (value) => {
    const searchValue = value.toLowerCase().trim();
    if (!searchValue) {
      setFilteredData(investments);
      return;
    }

    const filtered = investments.filter((inv) => {
      const usernameMatch = inv.username?.toLowerCase().includes(searchValue);
      const investmentIDMatch = inv.investmentID
        ?.toLowerCase()
        .includes(searchValue);
      const pinCodeMatch = inv.pinCode?.toLowerCase().includes(searchValue);
      const sharesMatch = inv.numberOfShares?.toString().includes(searchValue);

      return usernameMatch || investmentIDMatch || pinCodeMatch || sharesMatch;
    });

    setFilteredData(filtered);
  };

  const openUpdateModal = (record) => {
    setUpdateForm({
      numberOfShares: record.numberOfShares || "",
      pinCode: record.pinCode || "",
    });
    setUpdateModal({ visible: true, data: record });
  };

  const handleUpdateChange = (field, value) => {
    setUpdateForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitUpdate = async () => {
    if (
      updateForm.pinCode.length < 5 ||
      updateForm.numberOfShares === "" ||
      isNaN(updateForm.numberOfShares)
    ) {
      message.error("সঠিক পিন কোড এবং শেয়ার সংখ্যা দিন");
      return;
    }

    setUpdateLoading(true);
    try {
      const res = await coreAxios.put(`/investment/${updateModal.data._id}`, {
        pinCode: updateForm.pinCode,
        numberOfShares: Number(updateForm.numberOfShares),
      });
      if (res.status === 200) {
        message.success("ইনভেস্টমেন্ট আপডেট সফল হয়েছে");
        setUpdateModal({ visible: false, data: null });
        fetchData();
      } else {
        message.error("আপডেট ব্যর্থ হয়েছে");
      }
    } catch (err) {
      message.error("সার্ভার ত্রুটি হয়েছে");
    } finally {
      setUpdateLoading(false);
    }
  };

  const openDepositModal = (record) => {
    setDepositForm({
      date: null,
      amount: "",
      paymentMethod: "",
      transactionID: "",
    });
    setDepositModal({ visible: true, data: record });
  };

  const handleDepositChange = (field, value) => {
    setDepositForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitDeposit = async () => {
    if (
      !depositForm.date ||
      !depositForm.amount ||
      !depositForm.paymentMethod
    ) {
      message.error("দয়া করে সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }

    setDepositLoading(true);
    try {
      const res = await coreAxios.post(
        `/investment/${depositModal.data._id}/deposit`,
        {
          date: depositForm.date.format("YYYY-MM-DD"),
          amount: Number(depositForm.amount),
          paymentMethod: depositForm.paymentMethod,
          transactionID: depositForm.transactionID || null,
        }
      );
      if (res.status === 201) {
        message.success("ডিপোজিট সফল হয়েছে");
        setDepositModal({ visible: false, data: null });
        fetchData();
      } else {
        message.error("ডিপোজিট ব্যর্থ হয়েছে");
      }
    } catch (err) {
      message.error("সার্ভার ত্রুটি হয়েছে");
    } finally {
      setDepositLoading(false);
    }
  };

  const showMobileActions = (record) => {
    setActionRecord(record);
    setMobileMenuVisible(true);
  };

  const getColumns = () => {
    const baseColumns = [
      {
        title: "ছবি",
        dataIndex: "photo",
        key: "photo",
        render: (photo) => <Avatar src={photo} size={screens.xs ? 32 : 40} />,
      },
      {
        title: screens.xs ? "নাম" : "ব্যবহারকারী",
        dataIndex: "username",
        key: "username",
        render: (text) =>
          screens.xs ? (
            <span style={{ fontSize: "12px" }}>
              {text.length > 10 ? `${text.substring(0, 8)}...` : text}
            </span>
          ) : (
            text
          ),
      },
      {
        title: "আইডি",
        dataIndex: "investmentID",
        key: "investmentID",
        render: (text) => (screens.xs ? `${text.substring(0, 4)}...` : text),
      },
      {
        title: "পিন",
        dataIndex: "pinCode",
        key: "pinCode",
        responsive: ["md"],
        render: (pin) => pin?.replace(/./g, "*") || "",
      },
      {
        title: "শেয়ার",
        dataIndex: "numberOfShares",
        key: "numberOfShares",
        render: (num) => num || 0,
      },
    ];

    if (screens.xs) {
      return [
        ...baseColumns,
        {
          title: "",
          key: "action",
          render: (_, record) => (
            <Button
              icon={<MenuOutlined />}
              onClick={() => showMobileActions(record)}
              size="small"
            />
          ),
        },
      ];
    }

    return [
      ...baseColumns,
      {
        title: "অ্যাকশন",
        key: "action",
        render: (_, record) => (
          <Space size="small">
            <Button
              size="small"
              type="link"
              onClick={() => setDetailsModal({ visible: true, data: record })}
            >
              বিস্তারিত
            </Button>
            <Button
              size="small"
              type="link"
              onClick={() => openUpdateModal(record)}
            >
              আপডেট
            </Button>
            <Button
              size="small"
              type="link"
              onClick={() => openDepositModal(record)}
            >
              জমা
            </Button>
            <Button
              size="small"
              type="link"
              danger
              onClick={() => deleteInvestment(record._id)}
            >
              মুছুন
            </Button>
          </Space>
        ),
      },
    ];
  };

  if (loading) {
    return (
      <div style={{ padding: screens.xs ? 12 : 24 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div style={{ padding: screens.xs ? 12 : 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            marginBottom: 0,
            fontSize: screens.xs ? "18px" : "24px",
          }}
        >
          ইনভেস্টমেন্ট ইউজারস
        </h2>

        {screens.xs && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModal(true)}
            size="small"
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: screens.xs ? "column" : "row",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: screens.xs ? 12 : 0,
        }}
      >
        <Search
          placeholder="খুঁজুন..."
          onSearch={onSearch}
          allowClear
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: screens.xs ? "100%" : 400 }}
          size={screens.xs ? "small" : "middle"}
        />

        {!screens.xs && (
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchData}
              size={screens.sm ? "small" : "middle"}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModal(true)}
              size={screens.sm ? "small" : "middle"}
            >
              নতুন ব্যবহারকারী
            </Button>
          </Space>
        )}
      </div>

      <Table
        columns={getColumns()}
        dataSource={filteredData}
        pagination={{
          pageSize: 8,
          simple: screens.xs,
          showSizeChanger: !screens.xs,
        }}
        scroll={{ x: true }}
        size={screens.xs ? "small" : "middle"}
        style={{ overflowX: "auto" }}
      />

      {/* Mobile Actions Drawer */}
      <Drawer
        title={`${actionRecord?.username || "অ্যাকশন"}`}
        placement="bottom"
        closable={true}
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        height="auto"
        style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
      >
        {actionRecord && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              block
              onClick={() => {
                setDetailsModal({ visible: true, data: actionRecord });
                setMobileMenuVisible(false);
              }}
            >
              বিস্তারিত দেখুন
            </Button>
            <Button
              block
              onClick={() => {
                openUpdateModal(actionRecord);
                setMobileMenuVisible(false);
              }}
            >
              তথ্য আপডেট
            </Button>
            <Button
              block
              onClick={() => {
                openDepositModal(actionRecord);
                setMobileMenuVisible(false);
              }}
            >
              টাকা জমা দিন
            </Button>
            <Button
              block
              danger
              onClick={() => {
                deleteInvestment(actionRecord._id);
                setMobileMenuVisible(false);
              }}
            >
              মুছে ফেলুন
            </Button>
          </Space>
        )}
      </Drawer>

      {/* Details Modal */}
      <Modal
        open={detailsModal.visible}
        title="ব্যবহারকারীর বিস্তারিত"
        onCancel={() => setDetailsModal({ visible: false, data: null })}
        footer={null}
        width={screens.xs ? "90%" : 600}
      >
        {detailsModal.data && (
          <div>
            <p>
              <b>নাম:</b> {detailsModal.data.username}
            </p>
            <p>
              <b>ইনভেস্টমেন্ট আইডি:</b> {detailsModal.data.investmentID}
            </p>
            <p>
              <b>পিন:</b> {detailsModal.data.pinCode?.replace(/./g, "*") || ""}
            </p>
            <p>
              <b>শেয়ারের সংখ্যা:</b> {detailsModal.data.numberOfShares || 0}
            </p>

            {detailsModal.data.depositInfo &&
              detailsModal.data.depositInfo.length > 0 && (
                <>
                  <h4>টাকা জমার তথ্যঃ</h4>
                  <ul style={{ paddingLeft: "20px" }}>
                    {detailsModal.data.depositInfo.map((d, i) => (
                      <li key={i} style={{ marginBottom: "8px" }}>
                        {d.date} — {d.amount} টাকা — {d.paymentMethod} —
                        {d.transactionID && ` ট্রানজেকশন: ${d.transactionID}`}
                      </li>
                    ))}
                  </ul>
                </>
              )}
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        open={createModal}
        title="নতুন ইনভেস্টমেন্ট ব্যবহারকারী"
        onCancel={() => setCreateModal(false)}
        footer={null}
        width={screens.xs ? "90%" : 500}
        destroyOnClose
      >
        <InvestmentRegistration
          onSuccess={() => {
            setCreateModal(false);
            fetchData();
          }}
        />
      </Modal>

      {/* Update Modal */}
      <Modal
        open={updateModal.visible}
        title="ইনভেস্টমেন্ট আপডেট"
        onCancel={() => setUpdateModal({ visible: false, data: null })}
        onOk={submitUpdate}
        confirmLoading={updateLoading}
        width={screens.xs ? "90%" : 500}
      >
        <div style={{ marginBottom: 16 }}>
          <label>শেয়ারের সংখ্যা</label>
          <Input
            type="number"
            value={updateForm.numberOfShares}
            onChange={(e) =>
              handleUpdateChange("numberOfShares", e.target.value)
            }
            placeholder="শেয়ারের সংখ্যা দিন"
            size={screens.xs ? "small" : "middle"}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>পিন কোড</label>
          <Input.Password
            value={updateForm.pinCode}
            onChange={(e) => handleUpdateChange("pinCode", e.target.value)}
            placeholder="পিন কোড দিন"
            maxLength={6}
            size={screens.xs ? "small" : "middle"}
          />
        </div>
      </Modal>

      {/* Deposit Modal */}
      <Modal
        open={depositModal.visible}
        title={`টাকা জমা দিন - ${depositModal.data?.username || ""}`}
        onCancel={() => setDepositModal({ visible: false, data: null })}
        onOk={submitDeposit}
        confirmLoading={depositLoading}
        width={screens.xs ? "90%" : 600}
      >
        <div style={{ marginBottom: 16 }}>
          <label>তারিখ</label>
          <DatePicker
            style={{ width: "100%" }}
            value={depositForm.date}
            onChange={(date) => handleDepositChange("date", date)}
            format="YYYY-MM-DD"
            size={screens.xs ? "small" : "middle"}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>পরিমাণ (টাকা)</label>
          <Input
            type="number"
            value={depositForm.amount}
            onChange={(e) => handleDepositChange("amount", e.target.value)}
            placeholder="পরিমাণ দিন"
            size={screens.xs ? "small" : "middle"}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>পেমেন্ট পদ্ধতি</label>
          <Select
            value={depositForm.paymentMethod}
            onChange={(value) => handleDepositChange("paymentMethod", value)}
            placeholder="পেমেন্ট পদ্ধতি নির্বাচন করুন"
            style={{ width: "100%" }}
            size={screens.xs ? "small" : "middle"}
          >
            <Option value="Cash">ক্যাশ</Option>
            <Option value="Bkash">বিকাশ</Option>
            <Option value="Nagad">নগদ</Option>
            <Option value="Bank Transfer">ব্যাংক ট্রান্সফার</Option>
            <Option value="Other">অন্যান্য</Option>
          </Select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>ট্রানজেকশন আইডি (ঐচ্ছিক)</label>
          <Input
            value={depositForm.transactionID}
            onChange={(e) =>
              handleDepositChange("transactionID", e.target.value)
            }
            placeholder="ট্রানজেকশন আইডি দিন (যদি থাকে)"
            size={screens.xs ? "small" : "middle"}
          />
        </div>
      </Modal>
    </div>
  );
};

export default InvestmentUsersDashboard;
