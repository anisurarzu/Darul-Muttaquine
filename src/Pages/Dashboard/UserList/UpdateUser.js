import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Divider,
  message,
  Modal,
  Select,
  Tag,
  Upload,
  Image,
  Row,
  Col,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { coreAxios } from "../../../utilities/axios";
import { useFormik } from "formik";
import ProfileCard from "../Profile/ProfileCard";

const { Option } = Select;
const { Dragger } = Upload;

const UpdateUser = ({ handleCancel, rowData }) => {
  const [verificationDocs, setVerificationDocs] = useState({
    nidInfo: rowData?.nidInfo || null,
    photoInfo: rowData?.photoInfo || null,
  });
  const [nidUploading, setNidUploading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      userRole: rowData?.userRole || "",
    },
    onSubmit: async (values) => {
      try {
        const res = await coreAxios.post(`/update-user-role`, {
          userRole: values?.userRole,
          email: rowData?.email,
        });
        if (res?.status === 200) {
          toast.success("Successfully Updated!");
          formik.resetForm();
          handleCancel();
        }
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
    },
    enableReinitialize: true,
  });

  const userRoleList = [
    "Super-Admin",
    "Admin",
    "Co-Admin",
    "Accountant",
    "Second-Accountant",
    "Senior-Member",
    "Member",
    "Junior-Member",
    "Advisor",
    "Visitor",
    "System-Admin",
    "Student",
  ];

  const uploadToImgBB = async (file, type) => {
    try {
      type === "nidOrBc" ? setNidUploading(true) : setPhotoUploading(true);
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
          await updateVerificationDoc(type, imageUrl);
          message.success(`${file.name} uploaded successfully`);
          return imageUrl;
        }
        throw new Error("No image URL returned from API");
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      message.error(`${file.name} upload failed: ${error.message}`);
      throw error;
    } finally {
      type === "nidOrBc" ? setNidUploading(false) : setPhotoUploading(false);
    }
  };

  const updateVerificationDoc = async (docType, url = "") => {
    try {
      let docData;
      if (docType === "nidOrBc") {
        docData = {
          nidInfo: url ? { type: "nid/bc", url } : null,
          email: rowData?.email,
        };
      } else {
        docData = {
          photoInfo: url ? { type: "photo", url } : null,
          email: rowData?.email,
        };
      }

      const res = await coreAxios.post("update-user", docData);
      if (res.status === 200) {
        setVerificationDocs((prev) => ({
          ...prev,
          ...docData,
        }));
        return true;
      }
      throw new Error("Failed to update document");
    } catch (err) {
      message.error("Failed to update document");
      console.error(err);
      throw err;
    }
  };

  const handleFileChange = async (file, type) => {
    try {
      const imageUrl = await uploadToImgBB(file, type);
      if (imageUrl) {
        await updateVerificationDoc(type, imageUrl);
      }
    } catch (error) {
      console.error("Document update failed:", error);
    }
  };

  const removeDocument = async (type) => {
    try {
      await updateVerificationDoc(type, "");
      message.success("Document removed successfully");
    } catch (error) {
      message.error("Failed to remove document");
      console.error(error);
    }
  };

  const verifyUser = async () => {
    try {
      const res = await coreAxios.post("/update-user", {
        email: rowData?.email,
        isVerification: true,
      });
      if (res.status === 200) {
        message.success("User verified successfully!");
        setIsVerificationModalOpen(false);
      }
    } catch (err) {
      message.error("Failed to verify user");
      console.error(err);
    }
  };

  const renderVerificationStatus = () => {
    if (
      verificationDocs.nidInfo?.url &&
      verificationDocs.photoInfo?.url &&
      !rowData?.isVerification
    ) {
      return (
        <Tag icon={<SyncOutlined spin />} color="orange">
          Pending Verification
        </Tag>
      );
    }

    if (rowData?.isVerification) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="green">
          Verified
        </Tag>
      );
    }

    return (
      <Tag icon={<CloseCircleOutlined />} color="red">
        Not Verified
      </Tag>
    );
  };

  return (
    <div className="">
      <div className="bg-white p-4 rounded">
        <ProfileCard rowData={rowData} />

        <div className="flex justify-between items-center pt-2">
          <div>
            <p className="text-[14px] font-semibold pb-4 text-orange-600">
              Update User Role
            </p>
          </div>
          <Button
            type="primary"
            onClick={() => setIsVerificationModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Manage Verification
          </Button>
        </div>

        <form
          className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full mb-4">
            <label
              htmlFor="userRole"
              className="block text-black dark:text-black"
            >
              Select User Role <span className="text-meta-1">*</span>
            </label>
            <Select
              id="userRole"
              name="userRole"
              onChange={(value) => formik.setFieldValue("userRole", value)}
              value={formik.values.userRole}
              className="w-full rounded border-stroke bg-transparent py-0 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              {userRoleList?.map((method) => (
                <Option key={method} value={method}>
                  {method}
                </Option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1">
            <div></div>
            <button
              type="submit"
              className="justify-center rounded bg-primary p-4 font-medium text-gray border border-yellow-400 m-8 rounded hover:bg-yellow-400 hover:text-white hover:shadow-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* Verification Modal */}
      <Modal
        title="User Verification Documents"
        open={isVerificationModalOpen}
        onCancel={() => setIsVerificationModalOpen(false)}
        footer={null}
        width={800}
        centered
      >
        <Card
          bordered={false}
          className="shadow-sm border border-gray-200"
          extra={renderVerificationStatus()}
        >
          <Row gutter={[16, 16]}>
            {/* NID/BC Document Section */}
            <Col xs={24} md={12}>
              <div className="h-full">
                <h4 className="font-medium mb-3 text-gray-700">
                  National ID / Birth Certificate
                </h4>
                {verificationDocs.nidInfo ? (
                  <div className="flex flex-col h-full">
                    <div className="flex-grow border rounded-md p-2 mb-2 flex items-center justify-center bg-gray-50">
                      <Image
                        src={verificationDocs.nidInfo.url}
                        alt="NID/BC"
                        className="max-w-full max-h-64 object-contain"
                        preview={{
                          mask: <EyeOutlined />,
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Upload
                        beforeUpload={(file) => {
                          handleFileChange(file, "nidOrBc");
                          return false;
                        }}
                        showUploadList={false}
                        accept="image/*"
                        disabled={nidUploading}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          loading={nidUploading}
                          type="primary"
                          className="flex-grow"
                        >
                          Update
                        </Button>
                      </Upload>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => removeDocument("nidOrBc")}
                        className="flex-grow"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Dragger
                    beforeUpload={(file) => {
                      handleFileChange(file, "nidOrBc");
                      return false;
                    }}
                    accept="image/*"
                    className="border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-green-500 h-full flex flex-col"
                    disabled={nidUploading}
                  >
                    <div className="flex-grow flex flex-col items-center justify-center">
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined className="text-green-500" />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to upload
                      </p>
                      <p className="ant-upload-hint text-gray-500">
                        Upload clear photo of NID or Birth Certificate
                      </p>
                      {nidUploading && <div className="mt-2">Uploading...</div>}
                    </div>
                  </Dragger>
                )}
              </div>
            </Col>

            {/* Passport Photo Section */}
            <Col xs={24} md={12}>
              <div className="h-full">
                <h4 className="font-medium mb-3 text-gray-700">
                  Passport Size Photo
                </h4>
                {verificationDocs.photoInfo ? (
                  <div className="flex flex-col h-full">
                    <div className="flex-grow border rounded-md p-2 mb-2 flex items-center justify-center bg-gray-50">
                      <Image
                        src={verificationDocs.photoInfo.url}
                        alt="Passport Photo"
                        className="max-w-full max-h-64 object-contain"
                        preview={{
                          mask: <EyeOutlined />,
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Upload
                        beforeUpload={(file) => {
                          handleFileChange(file, "passportPhoto");
                          return false;
                        }}
                        showUploadList={false}
                        accept="image/*"
                        disabled={photoUploading}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          loading={photoUploading}
                          type="primary"
                          className="flex-grow"
                        >
                          Update
                        </Button>
                      </Upload>
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => removeDocument("passportPhoto")}
                        className="flex-grow"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Dragger
                    beforeUpload={(file) => {
                      handleFileChange(file, "passportPhoto");
                      return false;
                    }}
                    accept="image/*"
                    className="border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-green-500 h-full flex flex-col"
                    disabled={photoUploading}
                  >
                    <div className="flex-grow flex flex-col items-center justify-center">
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined className="text-green-500" />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to upload
                      </p>
                      <p className="ant-upload-hint text-gray-500">
                        Upload passport size photo
                      </p>
                      {photoUploading && (
                        <div className="mt-2">Uploading...</div>
                      )}
                    </div>
                  </Dragger>
                )}
              </div>
            </Col>
          </Row>

          {verificationDocs.nidInfo?.url &&
            verificationDocs.photoInfo?.url &&
            !rowData?.isVerification && (
              <div className="text-center mt-16">
                <Button
                  type="primary"
                  onClick={verifyUser}
                  size="large"
                  className="bg-green-500 hover:bg-green-600"
                >
                  Verify This User
                </Button>
              </div>
            )}
        </Card>
      </Modal>
    </div>
  );
};

export default UpdateUser;
