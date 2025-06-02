import {
  Card,
  Table,
  Tag,
  Upload,
  Button,
  Modal,
  Descriptions,
  Image,
  Spin,
  message,
  Space,
  Input,
  Select,
  Avatar,
  Divider,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  UploadOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState, useMemo } from "react";

import axios from "axios";
import { coreAxios } from "../../../../utilities/axios";

const { Dragger } = Upload;
const { Text } = Typography;

const verificationStatuses = {
  verified: { icon: <CheckCircleOutlined />, color: "green", text: "Verified" },
  pending: { icon: <SyncOutlined spin />, color: "orange", text: "Pending" },
  unverified: {
    icon: <CloseCircleOutlined />,
    color: "red",
    text: "Unverified",
  },
};

export default function UpdateProfileFromAdmin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchText, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await coreAxios.get("users");
      if (res?.status === 200) {
        setUsers(res.data);
      }
    } catch (err) {
      message.error("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          user.phone?.includes(searchText)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => {
        if (statusFilter === "verified") return user.isVerification;
        if (statusFilter === "pending")
          return (
            user.nidInfo?.url && user.photoInfo?.url && !user.isVerification
          );
        if (statusFilter === "unverified")
          return !user.nidInfo?.url || !user.photoInfo?.url;
        return true;
      });
    }

    setFilteredUsers(filtered);
  };

  const getVerificationStatus = (user) => {
    if (user.isVerification) return verificationStatuses.verified;
    if (user.nidInfo?.url && user.photoInfo?.url)
      return verificationStatuses.pending;
    return verificationStatuses.unverified;
  };

  const columns = [
    {
      title: "User",
      dataIndex: "firstName",
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar src={record.image} icon={<UserOutlined />} className="mr-2" />
          <div>
            <div>
              {record.firstName} {record.lastName}
            </div>
            <Text type="secondary">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone) => (phone ? `0${phone}` : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "isVerification",
      render: (_, record) => {
        const status = getVerificationStatus(record);
        return (
          <Tag icon={status.icon} color={status.color}>
            {status.text}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button type="link" onClick={() => setSelectedUser(record)}>
          Manage Verification
        </Button>
      ),
    },
  ];

  const uploadProps = (docType) => {
    const customRequest = async ({ file, onSuccess, onError }) => {
      try {
        setUploading(true);
        message.loading(`Uploading ${file.name}...`);

        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          "https://api.imgbb.com/1/upload?key=5bdcb96655462459d117ee1361223929",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response?.status === 200) {
          const imageUrl = response?.data?.data?.display_url;
          if (imageUrl) {
            onSuccess(response.data, file);
            await updateVerificationDoc(docType, imageUrl);
            message.success(`${file.name} uploaded successfully`);
          } else {
            throw new Error("No image URL returned from API");
          }
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        message.error(`${file.name} upload failed: ${error.message}`);
        onError(error);
      } finally {
        setUploading(false);
      }
    };

    return {
      name: "image",
      multiple: false,
      customRequest,
      accept: "image/*",
      showUploadList: false,
      beforeUpload(file) {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
          message.error("You can only upload image files!");
          return Upload.LIST_IGNORE;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          message.error("Image must be smaller than 5MB!");
          return Upload.LIST_IGNORE;
        }

        return true;
      },
      disabled: uploading,
    };
  };

  const updateVerificationDoc = async (docType, url) => {
    try {
      const docData =
        docType === "nid"
          ? { nidInfo: { type: "nid/bc", url } }
          : { photoInfo: { type: "photo", url } };

      const res = await coreAxios.patch(`users/${selectedUser._id}`, docData);
      if (res.status === 200) {
        // Update local state
        setSelectedUser((prev) => ({
          ...prev,
          ...docData,
        }));
        fetchUsers(); // Refresh user list
      }
    } catch (err) {
      message.error("Failed to update document");
      console.error(err);
    }
  };

  const verifyUser = async () => {
    try {
      const res = await coreAxios.patch(`users/${selectedUser._id}`, {
        isVerification: true,
      });
      if (res.status === 200) {
        message.success("User verified successfully!");
        setSelectedUser((prev) => ({
          ...prev,
          isVerification: true,
        }));
        fetchUsers(); // Refresh user list
      }
    } catch (err) {
      message.error("Failed to verify user");
      console.error(err);
    }
  };

  const removeDocument = async (docType) => {
    try {
      const docData =
        docType === "nid" ? { nidInfo: null } : { photoInfo: null };

      const res = await coreAxios.patch(`users/${selectedUser._id}`, docData);
      if (res.status === 200) {
        message.success("Document removed successfully!");
        setSelectedUser((prev) => ({
          ...prev,
          ...docData,
        }));
        fetchUsers(); // Refresh user list
      }
    } catch (err) {
      message.error("Failed to remove document");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <Card
        title="User Verification Management"
        bordered={false}
        className="shadow-sm"
        extra={
          <Space>
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Select.Option value="all">All Statuses</Select.Option>
              <Select.Option value="verified">Verified</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="unverified">Unverified</Select.Option>
            </Select>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={`Verification Documents - ${selectedUser?.firstName} ${selectedUser?.lastName}`}
        visible={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        width={800}
        footer={null}
        destroyOnClose
      >
        {selectedUser && (
          <Spin spinning={loading}>
            <div className="space-y-6">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Name">
                  {selectedUser.firstName} {selectedUser.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedUser.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selectedUser.phone ? `0${selectedUser.phone}` : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag
                    icon={getVerificationStatus(selectedUser).icon}
                    color={getVerificationStatus(selectedUser).color}
                  >
                    {getVerificationStatus(selectedUser).text}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              <Divider orientation="left">
                National ID / Birth Certificate
              </Divider>
              {selectedUser.nidInfo?.url ? (
                <div className="flex flex-col items-start">
                  <Image
                    width={200}
                    src={selectedUser.nidInfo.url}
                    alt="NID/BC"
                    className="cursor-pointer"
                    onClick={() => setPreviewImage(selectedUser.nidInfo.url)}
                  />
                  <Space className="mt-2">
                    <Button
                      type="primary"
                      danger
                      onClick={() => removeDocument("nid")}
                      disabled={uploading}
                    >
                      Remove Document
                    </Button>
                  </Space>
                </div>
              ) : (
                <Dragger
                  {...uploadProps("nid")}
                  className="border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-blue-500"
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined className="text-blue-500" />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to upload NID/BC
                  </p>
                  <p className="ant-upload-hint text-gray-500">
                    Supported formats: JPG, PNG (Max 5MB)
                  </p>
                </Dragger>
              )}

              <Divider orientation="left">Passport Photo</Divider>
              {selectedUser.photoInfo?.url ? (
                <div className="flex flex-col items-start">
                  <Image
                    width={150}
                    src={selectedUser.photoInfo.url}
                    alt="Passport Photo"
                    className="cursor-pointer"
                    onClick={() => setPreviewImage(selectedUser.photoInfo.url)}
                  />
                  <Space className="mt-2">
                    <Button
                      type="primary"
                      danger
                      onClick={() => removeDocument("photo")}
                      disabled={uploading}
                    >
                      Remove Document
                    </Button>
                  </Space>
                </div>
              ) : (
                <Dragger
                  {...uploadProps("photo")}
                  className="border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-blue-500"
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined className="text-blue-500" />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to upload Passport Photo
                  </p>
                  <p className="ant-upload-hint text-gray-500">
                    Supported formats: JPG, PNG (Max 5MB)
                  </p>
                </Dragger>
              )}

              <div className="flex justify-end">
                <Button
                  type="primary"
                  onClick={verifyUser}
                  disabled={
                    !selectedUser.nidInfo?.url ||
                    !selectedUser.photoInfo?.url ||
                    selectedUser.isVerification ||
                    uploading
                  }
                  loading={uploading}
                >
                  Verify User
                </Button>
              </div>
            </div>
          </Spin>
        )}
      </Modal>

      <Modal
        visible={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}
