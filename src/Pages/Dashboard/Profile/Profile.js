import {
  Alert,
  Modal,
  Spin,
  Upload,
  message,
  Card,
  Divider,
  Tag,
  Skeleton,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import ChangePassword from "./ChangePassword/ChangePassword";
import UpdateProfile from "./UpdateProfile/UpdateProfile";
import { coreAxios } from "../../../utilities/axios";
import { formatDate } from "../../../utilities/dateFormate";
import axios from "axios";

const { Dragger } = Upload;

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [userData, setUserData] = useState([]);
  const [verificationDocs, setVerificationDocs] = useState({
    nidInfo: null, // { type: string, url: string }
    photoInfo: null, // { type: string, url: string }
  });
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const res = await coreAxios.get(`userinfo`);
      if (res?.status === 200) {
        setUserData(res?.data);
        setVerificationDocs({
          nidInfo: res?.data?.nidInfo || null,
          photoInfo: res?.data?.photoInfo || null,
        });
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = (type) => {
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
            updateVerificationDoc(type, imageUrl);
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
        setFileList([]);
      }
    };

    return {
      name: "image",
      multiple: false,
      fileList,
      customRequest,
      onChange({ file, fileList }) {
        // Update file list for display
        setFileList(fileList.slice(-1)); // Keep only the last file
      },
      accept: "image/*",
      showUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: false,
      },
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
      onRemove() {
        setFileList([]);
        return true;
      },
      disabled: uploading,
    };
  };

  const updateVerificationDoc = async (docType, url) => {
    try {
      let docData;
      if (docType === "nidOrBc") {
        docData = { nidInfo: { type: "nid/bc", url }, email: userData?.email };
      } else {
        docData = { photoInfo: { type: "photo", url }, email: userData?.email };
      }

      const res = await coreAxios.post("update-user", docData);
      if (res.status === 200) {
        setVerificationDocs((prev) => ({
          ...prev,
          ...docData,
        }));
        message.success("Document updated successfully!");
      }
    } catch (err) {
      message.error("Failed to update document");
      console.error(err);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    getUserInfo();
  };

  const renderVerificationStatus = () => {
    if (loading) {
      return <Skeleton.Avatar active size="small" shape="circle" />;
    }

    // Check if verification documents are uploaded but not verified
    if (
      verificationDocs.nidInfo?.url &&
      verificationDocs.photoInfo?.url &&
      !userData?.isVerification
    ) {
      return (
        <Tag icon={<SyncOutlined spin />} color="orange">
          Pending Verification
        </Tag>
      );
    }

    // Check if the user is verified
    if (userData?.isVerification) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="green">
          Verified
        </Tag>
      );
    }

    // Default state: Not Verified
    return (
      <Tag icon={<CloseCircleOutlined />} color="red">
        Not Verified
      </Tag>
    );
  };

  const ProfileHeaderSkeleton = () => (
    <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <Skeleton.Avatar active size={128} shape="circle" />
          </div>
          <div className="text-center md:text-left w-full md:w-auto">
            <Skeleton.Input active size="large" style={{ width: 200 }} />
            <Skeleton paragraph={{ rows: 1 }} active className="mt-2" />
            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
              <Skeleton.Button active size="default" shape="round" />
              <Skeleton.Button active size="default" shape="round" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileCardSkeleton = ({ title }) => (
    <Card
      title={title}
      bordered={false}
      className="shadow-sm border border-gray-200"
      headStyle={{
        backgroundColor: "#f0fdf4",
        borderBottom: "1px solid #e5e7eb",
      }}>
      <Skeleton active paragraph={{ rows: 4 }} />
    </Card>
  );

  const VerificationCardSkeleton = () => (
    <Card
      title="Profile Verification"
      bordered={false}
      className="shadow-sm border border-gray-200"
      headStyle={{
        backgroundColor: "#f0fdf4",
        borderBottom: "1px solid #e5e7eb",
      }}>
      <div className="space-y-6">
        <div>
          <Skeleton.Input
            active
            size="small"
            style={{ width: 200 }}
            className="mb-3"
          />
          <Skeleton.Image active style={{ width: "100%", height: 200 }} />
        </div>
        <Divider className="my-4" />
        <div>
          <Skeleton.Input
            active
            size="small"
            style={{ width: 200 }}
            className="mb-3"
          />
          <Skeleton.Image
            active
            style={{ width: 128, height: 160, margin: "0 auto" }}
          />
        </div>
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <>
          <ProfileHeaderSkeleton />
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="space-y-6">
              <ProfileCardSkeleton title="Personal Information" />
              <ProfileCardSkeleton title="Address Information" />
            </div>
            <div className="space-y-6">
              <VerificationCardSkeleton />
            </div>
            <div className="space-y-6">
              <ProfileCardSkeleton title="Additional Information" />
              <ProfileCardSkeleton title="Account Status" />
              <ProfileCardSkeleton title="Quick Actions" />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-center">
                <div className="relative mb-4 md:mb-0 md:mr-6">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={userData?.image || "https://via.placeholder.com/150"}
                      alt="Profile"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    {renderVerificationStatus()}
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold">
                    {userData?.firstName} {userData?.lastName}
                    <span className="ml-2 text-sm font-normal bg-green-500 px-2 py-1 rounded">
                      {userData?.uniqueId}
                    </span>
                  </h1>
                  <p className="text-green-100">
                    {userData?.profession || "Member"}
                  </p>
                  <p className="text-green-100">
                    Member since {formatDate(userData?.createdAt)}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                    <button
                      onClick={showModal2}
                      className="px-4 py-2 bg-white text-green-600 rounded-md shadow hover:bg-green-50 transition-colors">
                      Update Profile
                    </button>
                    <button
                      onClick={showModal}
                      className="px-4 py-2 bg-white text-green-600 rounded-md shadow hover:bg-green-50 transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Info Card */}
              <Card
                title="Personal Information"
                bordered={false}
                className="shadow-sm border border-gray-200"
                headStyle={{
                  backgroundColor: "#f0fdf4",
                  borderBottom: "1px solid #e5e7eb",
                }}>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">
                      {userData?.firstName} {userData?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${userData?.email}`}
                      className="font-medium text-green-600 hover:underline">
                      {userData?.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">0{userData?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Birthday</p>
                    <p className="font-medium">
                      {formatDate(userData?.birthDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-medium">
                      {userData?.bloodGroup || "N/A"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Address Card */}
              <Card
                title="Address Information"
                bordered={false}
                className="shadow-sm border border-gray-200"
                headStyle={{
                  backgroundColor: "#f0fdf4",
                  borderBottom: "1px solid #e5e7eb",
                }}>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Address</p>
                    <p className="font-medium">
                      {userData?.currentAddress || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Permanent Address</p>
                    <p className="font-medium">
                      {userData?.permanentAddress || "N/A"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Middle Column - Verification */}
            <div className="space-y-6">
              <Card
                title="Profile Verification"
                bordered={false}
                className="shadow-sm border border-gray-200"
                headStyle={{
                  backgroundColor: "#f0fdf4",
                  borderBottom: "1px solid #e5e7eb",
                }}
                extra={renderVerificationStatus()}>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3 text-gray-700">
                      National ID / Birth Certificate
                    </h4>
                    {verificationLoading ? (
                      <Skeleton.Image
                        active
                        style={{ width: "100%", height: 200 }}
                      />
                    ) : verificationDocs.nidInfo?.url ? (
                      <div className="relative group">
                        <img
                          src={verificationDocs.nidInfo.url}
                          alt="NID/BC"
                          className="w-full h-auto border rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() =>
                              setVerificationDocs((prev) => ({
                                ...prev,
                                nidInfo: null,
                              }))
                            }
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Dragger
                        {...uploadProps("nidOrBc")}
                        className="border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-green-500">
                        <p className="ant-upload-drag-icon">
                          <UploadOutlined className="text-green-500" />
                        </p>
                        <p className="ant-upload-text">
                          Click or drag file to upload
                        </p>
                        <p className="ant-upload-hint text-gray-500">
                          Upload clear photo of your NID or Birth Certificate
                        </p>
                      </Dragger>
                    )}
                  </div>

                  <Divider className="my-4" />

                  <div>
                    <h4 className="font-medium mb-3 text-gray-700">
                      Passport Size Photo
                    </h4>
                    {verificationLoading ? (
                      <Skeleton.Image
                        active
                        style={{ width: 128, height: 160, margin: "0 auto" }}
                      />
                    ) : verificationDocs.photoInfo?.url ? (
                      <div className="relative group">
                        <img
                          src={verificationDocs.photoInfo.url}
                          alt="Passport Photo"
                          className="w-32 h-40 object-cover border rounded-md mx-auto"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() =>
                              setVerificationDocs((prev) => ({
                                ...prev,
                                photoInfo: null,
                              }))
                            }
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Dragger
                        {...uploadProps("passportPhoto")}
                        className="border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-green-500">
                        <p className="ant-upload-drag-icon">
                          <UploadOutlined className="text-green-500" />
                        </p>
                        <p className="ant-upload-text">
                          Click or drag file to upload
                        </p>
                        <p className="ant-upload-hint text-gray-500">
                          Upload your recent passport size photo
                        </p>
                      </Dragger>
                    )}
                  </div>

                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <h4 className="font-medium text-green-800 mb-2">
                      Verification Instructions
                    </h4>
                    <ul className="text-sm text-green-700 list-disc pl-5 space-y-1">
                      <li>Upload clear photos of your documents</li>
                      <li>Make sure all information is readable</li>
                      <li>Passport photo must be recent and clear</li>
                      <li>Verification may take 1-2 business days</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Additional Info Card */}
              <Card
                title="Additional Information"
                bordered={false}
                className="shadow-sm border border-gray-200"
                headStyle={{
                  backgroundColor: "#f0fdf4",
                  borderBottom: "1px solid #e5e7eb",
                }}>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{userData?.gender || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profession</p>
                    <p className="font-medium">
                      {userData?.profession || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Created</p>
                    <p className="font-medium">
                      {formatDate(userData?.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Status Card */}
              <Card
                title="Account Status"
                bordered={false}
                className="shadow-sm border border-gray-200"
                headStyle={{
                  backgroundColor: "#f0fdf4",
                  borderBottom: "1px solid #e5e7eb",
                }}>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email Verification</span>
                    <Tag color="green">Verified</Tag>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profile Completion</span>
                    <Tag color="green">80%</Tag>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <Tag color="green">Active</Tag>
                  </div>
                </div>
              </Card>

              {/* Quick Actions Card */}
              <Card
                title="Quick Actions"
                bordered={false}
                className="shadow-sm border border-gray-200"
                headStyle={{
                  backgroundColor: "#f0fdf4",
                  borderBottom: "1px solid #e5e7eb",
                }}>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={showModal2}
                    className="w-full text-left px-4 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors border border-green-100">
                    Update Profile
                  </button>
                  <button
                    onClick={showModal}
                    className="w-full text-left px-4 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors border border-green-100">
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors border border-green-100">
                    Download Profile
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <Modal
        title="Change Password"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={600}>
        <ChangePassword onCancel={handleCancel} />
      </Modal>
      <Modal
        title="Update Profile"
        open={isModalOpen2}
        onCancel={handleCancel}
        footer={null}
        centered
        width={800}>
        <UpdateProfile onCancel={handleCancel} />
      </Modal>
    </div>
  );
}
