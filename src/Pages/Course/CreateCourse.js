import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  notification,
  Select,
  InputNumber,
  Upload,
  DatePicker,
  message,
} from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { coreAxios } from "../../utilities/axios";

const { Option } = Select;

// ImgBB API Key
const IMGBB_API_KEY = "5bdcb96655462459d117ee1361223929";

const CreateCourse = ({ handleCancel, instructors }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [instructorImageUrl, setInstructorImageUrl] = useState("");

  // Image upload handler for ImgBB
  const handleImageUpload = async (file, setFieldValue) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      );
      const uploadedImageUrl = response.data.data.url;
      setImageUrl(uploadedImageUrl);
      setFieldValue("image", uploadedImageUrl);
    } catch (error) {
      message.error("ছবি আপলোড করতে সমস্যা হয়েছে");
    }
  };

  const handleInstructorImageUpload = async (file, setFieldValue) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      );
      const uploadedInstructorImageUrl = response.data.data.url;
      setInstructorImageUrl(uploadedInstructorImageUrl);
      setFieldValue("instructorImage", uploadedInstructorImageUrl);
    } catch (error) {
      message.error("ইন্সট্রাক্টরের ছবি আপলোড করতে সমস্যা হয়েছে");
    }
  };

  const saveCourseToAPI = async (values) => {
    try {
      const response = await coreAxios.post("/courses", values);
      if (response.status === 200) {
        notification.success({
          message: "কোর্স তৈরি সফল হয়েছে!",
          description: `আপনি সফলভাবে "${values.title}" কোর্স তৈরি করেছেন।`,
        });
        handleCancel();
      }
    } catch (error) {
      notification.error({
        message: "কোর্স তৈরি করতে সমস্যা হয়েছে",
        description: "দয়া করে আবার চেষ্টা করুন।",
      });
      handleCancel();
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#2D6A3F]">
        কোর্স তৈরি করুন
      </h1>

      <Formik
        initialValues={{
          title: "",
          category: "",
          description: "",
          instructorName: "",
          instructorImage: "",
          startDate: "",
          endDate: "",
          duration: "",
          availableSeats: 0,
          batchNumber: "",
          qualifications: "",
          certifications: "",
          image: "",
          price: 0,
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("কোর্সের নাম আবশ্যক"),
          category: Yup.string().required("ক্যাটেগরি নির্বাচন করুন"),
          description: Yup.string().required("বিবরণ প্রদান করুন"),
          instructorName: Yup.string().required("ইন্সট্রাক্টরের নাম আবশ্যক"),
          startDate: Yup.date().required("কোর্সের শুরু তারিখ আবশ্যক"),
          endDate: Yup.date().required("কোর্সের শেষ তারিখ আবশ্যক"),
          duration: Yup.string().required("কোর্সের সময়কাল আবশ্যক"),
          availableSeats: Yup.number().required("আসনের সংখ্যা আবশ্যক"),
          batchNumber: Yup.string().required("ব্যাচ নম্বর প্রদান করুন"),
          qualifications: Yup.string().required("যোগ্যতা প্রদান করুন"),
          certifications: Yup.string().required(
            "সার্টিফিকেটের বিবরণ প্রদান করুন"
          ),
          price: Yup.number().required("কোর্সের মূল্য প্রদান করুন"),
        })}
        onSubmit={saveCourseToAPI}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          handleSubmit,
          errors,
          touched,
        }) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            className="bg-white p-6 shadow-lg rounded-lg"
          >
            {/* Title */}
            <Form.Item
              label="কোর্সের নাম"
              name="title"
              required
              validateStatus={errors.title && touched.title ? "error" : ""}
              help={errors.title && touched.title ? errors.title : null}
            >
              <Input
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="কোর্সের নাম লিখুন"
              />
            </Form.Item>

            {/* Category */}
            <Form.Item
              label="ক্যাটেগরি"
              name="category"
              required
              validateStatus={
                errors.category && touched.category ? "error" : ""
              }
              help={
                errors.category && touched.category ? errors.category : null
              }
            >
              <Select
                name="category"
                value={values.category}
                onChange={(value) => setFieldValue("category", value)}
                placeholder="ক্যাটেগরি নির্বাচন করুন"
              >
                <Option value="আইসিটি">আইসিটি</Option>
                <Option value="ব্যবসা">ব্যবসা</Option>
                <Option value="স্বাস্থ্য">স্বাস্থ্য</Option>
                <Option value="শিল্প">শিল্প</Option>
              </Select>
            </Form.Item>

            {/* Description */}
            <Form.Item
              label="কোর্সের বিবরণ"
              name="description"
              required
              validateStatus={
                errors.description && touched.description ? "error" : ""
              }
              help={
                errors.description && touched.description
                  ? errors.description
                  : null
              }
            >
              <Input.TextArea
                name="description"
                value={values.description}
                onChange={handleChange}
                rows={4}
                placeholder="কোর্সের বিস্তারিত বিবরণ লিখুন"
              />
            </Form.Item>

            {/* Instructor Name */}
            <Form.Item
              label="ইন্সট্রাক্টরের নাম"
              name="instructorName"
              required
              validateStatus={
                errors.instructorName && touched.instructorName ? "error" : ""
              }
              help={
                errors.instructorName && touched.instructorName
                  ? errors.instructorName
                  : null
              }
            >
              <Select
                name="instructorName"
                value={values.instructorName}
                onChange={(value) => setFieldValue("instructorName", value)}
                placeholder="ইন্সট্রাক্টরের নাম নির্বাচন করুন"
              >
                {instructors?.map((instructor) => (
                  <Option key={instructor.uniqueId} value={instructor.uniqueId}>
                    {instructor.firstName} {instructor?.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Instructor Image Upload (Optional) */}
            <Form.Item
              label="ইন্সট্রাক্টরের ছবি (অপশনাল)"
              name="instructorImage"
            >
              <Upload
                name="instructorImage"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleInstructorImageUpload(file, setFieldValue);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>
                  ইন্সট্রাক্টরের ছবি আপলোড করুন
                </Button>
              </Upload>
            </Form.Item>

            {/* Course Image Upload (Optional) */}
            <Form.Item label="কোর্সের ছবি (অপশনাল)" name="image">
              <Upload
                name="image"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleImageUpload(file, setFieldValue);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>
                  কোর্সের ছবি আপলোড করুন
                </Button>
              </Upload>
            </Form.Item>

            {/* Start Date */}
            <Form.Item
              label="কোর্সের শুরু তারিখ"
              name="startDate"
              required
              validateStatus={
                errors.startDate && touched.startDate ? "error" : ""
              }
              help={
                errors.startDate && touched.startDate ? errors.startDate : null
              }
            >
              <DatePicker
                name="startDate"
                value={values.startDate}
                onChange={(date) => setFieldValue("startDate", date)}
                placeholder="কোর্সের শুরু তারিখ নির্বাচন করুন"
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* End Date */}
            <Form.Item
              label="কোর্সের শেষ তারিখ"
              name="endDate"
              required
              validateStatus={errors.endDate && touched.endDate ? "error" : ""}
              help={errors.endDate && touched.endDate ? errors.endDate : null}
            >
              <DatePicker
                name="endDate"
                value={values.endDate}
                onChange={(date) => setFieldValue("endDate", date)}
                placeholder="কোর্সের শেষ তারিখ নির্বাচন করুন"
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* Duration */}
            <Form.Item
              label="কোর্সের সময়কাল"
              name="duration"
              required
              validateStatus={
                errors.duration && touched.duration ? "error" : ""
              }
              help={
                errors.duration && touched.duration ? errors.duration : null
              }
            >
              <Input
                name="duration"
                value={values.duration}
                onChange={handleChange}
                placeholder="কোর্সের সময়কাল লিখুন"
              />
            </Form.Item>

            {/* Available Seats */}
            <Form.Item
              label="আসনের সংখ্যা"
              name="availableSeats"
              required
              validateStatus={
                errors.availableSeats && touched.availableSeats ? "error" : ""
              }
              help={
                errors.availableSeats && touched.availableSeats
                  ? errors.availableSeats
                  : null
              }
            >
              <InputNumber
                name="availableSeats"
                value={values.availableSeats}
                onChange={(value) => setFieldValue("availableSeats", value)}
                min={0}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {/* Batch Number */}
            <Form.Item
              label="ব্যাচ নম্বর"
              name="batchNumber"
              required
              validateStatus={
                errors.batchNumber && touched.batchNumber ? "error" : ""
              }
              help={
                errors.batchNumber && touched.batchNumber
                  ? errors.batchNumber
                  : null
              }
            >
              <Input
                name="batchNumber"
                value={values.batchNumber}
                onChange={handleChange}
                placeholder="ব্যাচ নম্বর লিখুন"
              />
            </Form.Item>

            {/* Qualifications */}
            <Form.Item
              label="যোগ্যতা"
              name="qualifications"
              required
              validateStatus={
                errors.qualifications && touched.qualifications ? "error" : ""
              }
              help={
                errors.qualifications && touched.qualifications
                  ? errors.qualifications
                  : null
              }
            >
              <Input.TextArea
                name="qualifications"
                value={values.qualifications}
                onChange={handleChange}
                rows={3}
                placeholder="যোগ্যতার বিবরণ লিখুন"
              />
            </Form.Item>

            {/* Certifications */}
            <Form.Item
              label="সার্টিফিকেট"
              name="certifications"
              required
              validateStatus={
                errors.certifications && touched.certifications ? "error" : ""
              }
              help={
                errors.certifications && touched.certifications
                  ? errors.certifications
                  : null
              }
            >
              <Input.TextArea
                name="certifications"
                value={values.certifications}
                onChange={handleChange}
                rows={3}
                placeholder="সার্টিফিকেটের বিবরণ লিখুন"
              />
            </Form.Item>

            {/* Price */}
            <Form.Item
              label="কোর্সের মূল্য"
              name="price"
              required
              validateStatus={errors.price && touched.price ? "error" : ""}
              help={errors.price && touched.price ? errors.price : null}
            >
              <InputNumber
                name="price"
                value={values.price}
                onChange={(value) => setFieldValue("price", value)}
                min={0}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                কোর্স তৈরি করুন
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCourse;
