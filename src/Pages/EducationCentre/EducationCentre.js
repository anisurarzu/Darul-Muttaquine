import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, Radio, Popconfirm } from "antd";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { coreAxios } from "../../utilities/axios";
import { toast } from "react-toastify";

const { Option } = Select;

export default function AdmissionTable() {
  const [admissions, setAdmissions] = useState([]); // Store admission data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState(null); // Edit mode
  const [loading, setLoading] = useState(false);

  // Fetch admissions data from the server on component mount
  useEffect(() => {
    fetchAdmissions();
  }, []);

  // Fetch all admissions
  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("/admissions"); // Replace with your API endpoint

      if (response?.status === 200) {
        setLoading(false);
        setAdmissions(response.data);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching admission data:", error);
    }
  };

  // Open modal for create/update
  const openModal = (record = null) => {
    setEditingAdmission(record); // Set record for editing
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmission(null);
  };

  // Handle form submission (Create/Update)
  const handleFormSubmit = async (values) => {
    try {
      if (editingAdmission) {
        setLoading(true);
        // Update existing admission
        const response = await coreAxios.put(
          `/admissions/${editingAdmission.admissionNo}`,
          values
        ); // API endpoint
        if (response?.status === 200) {
          setLoading(false);
          toast.success("Successfully Updated");
          fetchAdmissions();
        }
      } else {
        setLoading(true);
        // Add new admission
        const response = await coreAxios.post("/admissions", values); // API endpoint
        if (response?.status === 200) {
          toast.success("Successfully Added");
          fetchAdmissions();
          setLoading(false);
        }
      }
      closeModal();
    } catch (error) {
      setLoading(false);
      console.error("Error submitting admission data:", error);
    }
  };

  // Validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    parentName: Yup.string().required("Parent's name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{11}$/, "Phone number must be exactly 11 digits")
      .required("Phone number is required"),
    gender: Yup.string().required("Gender is required"),
    course: Yup.array()
      .min(1, "Please select at least one course")
      .required("Course is required"),
    instituteName: Yup.string().required("Institute name is required"),
    class: Yup.string().required("Class is required"),
    dmfID: Yup.string().required("DMF ID is required"),
  });

  // Course options
  const courses = [
    { value: "math-physics", label: "Fundamentals of Math and Physics" },
    { value: "spoken-english", label: "Spoken English Essentials" },
    { value: "ict-ai", label: "ICT and Artificial Intelligence Basics" },
    { value: "ethics", label: "Adab and Akhlaq Essentials" },
  ];

  // Table columns
  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Parent's Name", dataIndex: "parentName", key: "parentName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (courses) => courses.join(", "),
    },
    {
      title: "Institute Name",
      dataIndex: "instituteName",
      key: "instituteName",
    },
    { title: "Class", dataIndex: "class", key: "class" },
    { title: "DMF ID", dataIndex: "dmfID", key: "dmfID" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this admission?"
            onConfirm={() => handleDelete(record.admissionNo)}
            okText="Yes"
            cancelText="No">
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // Handle admission deletion
  const handleDelete = async (admissionNo) => {
    try {
      setLoading(true);
      const res = await coreAxios.delete(`/admissions/${admissionNo}`); // API endpoint
      if (res?.status === 200) {
        toast.success("Successfully Deleted!");
        fetchAdmissions();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting admission:", error);
    }
  };

  return (
    <div className="admission-table-container p-6 lg:p-12 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-800">
          Admission Data
        </h1>
        <Button
          type="primary"
          onClick={() => openModal()}
          className="bg-blue-500 text-white">
          Add Admission
        </Button>
      </div>

      <Table
        dataSource={admissions}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="bg-white shadow-lg rounded-lg"
      />

      <Modal
        title={editingAdmission ? "Update Admission" : "Add Admission"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}>
        <Formik
          initialValues={{
            fullName: editingAdmission?.fullName || "",
            parentName: editingAdmission?.parentName || "",
            email: editingAdmission?.email || "",
            phone: editingAdmission?.phone || "",
            gender: editingAdmission?.gender || "",
            course: editingAdmission?.course || [],
            instituteName: editingAdmission?.instituteName || "",
            class: editingAdmission?.class || "",
            dmfID: editingAdmission?.dmfID || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}>
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Full Name
                </label>
                <Field
                  name="fullName"
                  as={Input}
                  placeholder="Enter full name"
                />
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Parent's Name
                </label>
                <Field
                  name="parentName"
                  as={Input}
                  placeholder="Enter parent's name"
                />
                <ErrorMessage
                  name="parentName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Email
                </label>
                <Field name="email" as={Input} placeholder="Enter email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Phone
                </label>
                <Field
                  name="phone"
                  as={Input}
                  placeholder="Enter phone number"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Gender
                </label>
                <Field name="gender">
                  {({ field }) => (
                    <Radio.Group
                      {...field}
                      onChange={(e) => setFieldValue("gender", e.target.value)}>
                      <Radio value="Male">Male</Radio>
                      <Radio value="Female">Female</Radio>
                    </Radio.Group>
                  )}
                </Field>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Course
                </label>
                <Field name="course">
                  {({ field }) => (
                    <Select
                      {...field}
                      mode="multiple"
                      className="w-full"
                      placeholder="Select courses"
                      onChange={(value) => setFieldValue("course", value)}>
                      {courses.map((course) => (
                        <Option key={course.value} value={course.value}>
                          {course.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="course"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Institute Name
                </label>
                <Field
                  name="instituteName"
                  as={Input}
                  placeholder="Enter institute name"
                />
                <ErrorMessage
                  name="instituteName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Class
                </label>
                <Field name="class" as={Input} placeholder="Enter class" />
                <ErrorMessage
                  name="class"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  DMF ID
                </label>
                <Field name="dmfID" as={Input} placeholder="Enter DMF ID" />
                <ErrorMessage
                  name="dmfID"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="text-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md">
                  {editingAdmission ? "Update" : "Add"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}
