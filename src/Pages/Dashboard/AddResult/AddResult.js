import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Table,
  Typography,
  Popconfirm,
  Space,
  Tag,
} from "antd";
import {
  SearchOutlined,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { coreAxios } from "../../../utilities/axios";

const { Title } = Typography;

// Normalize roll: DMS26580F / DMS26580M → DMS26580; DMS26580 stays as is
const normalizeRollNumber = (roll) => {
  if (!roll || typeof roll !== "string") return roll?.trim() ?? "";
  const trimmed = roll.trim();
  if (trimmed.length < 2) return trimmed;
  const last = trimmed.slice(-1).toUpperCase();
  if (last === "F" || last === "M") return trimmed.slice(0, -1).trim();
  return trimmed;
};

const AddResult = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchResult, setSearchResult] = useState(null); // last searched/loaded record for display
  const [isEditMode, setIsEditMode] = useState(false);

  // Search by roll number
  const handleSearch = async () => {
    const roll = form.getFieldValue("scholarshipRollNumber");
    if (!roll || !roll.trim()) {
      toast.warning("রোল নম্বর দিন");
      return;
    }
    const normalizedRoll = normalizeRollNumber(roll);
    try {
      setSearching(true);
      setSearchResult(null);
      const res = await coreAxios.get(`/search-result/${normalizedRoll}`);
      if (res?.status === 200 && res?.data) {
        const data = res.data;
        const correctAnswer = data.correctAnswer;
        form.setFieldsValue({
          scholarshipRollNumber: data.scholarshipRollNumber || normalizedRoll,
          correctAnswer:
            correctAnswer !== undefined && correctAnswer !== null
              ? correctAnswer
              : undefined,
        });
        setSearchResult(data);
        setIsEditMode(true);
        toast.success("রেকর্ড পাওয়া গেছে। এডিট করে আপডেট করুন অথবা ডিলিট করুন।");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "রোল নম্বর পাওয়া যায়নি");
      setSearchResult(null);
      form.setFieldsValue({ correctAnswer: undefined });
      setIsEditMode(false);
    } finally {
      setSearching(false);
    }
  };

  // Insert or Update
  const onFinish = async (values) => {
    const { scholarshipRollNumber, correctAnswer } = values;
    if (
      correctAnswer === undefined ||
      correctAnswer === null ||
      String(correctAnswer).trim() === ""
    ) {
      toast.warning("সঠিক উত্তর দিন");
      return;
    }
    const normalizedRoll = normalizeRollNumber(scholarshipRollNumber);
    try {
      setLoading(true);
      const res = await coreAxios.post("/add-result", {
        scholarshipRollNumber: normalizedRoll,
        correctAnswer: Number(correctAnswer),
      });
      if (res?.status === 200) {
        toast.success(res?.data?.message || "সফলভাবে সংরক্ষণ হয়েছে");
        setSearchResult((prev) =>
          prev && prev.scholarshipRollNumber === normalizedRoll
            ? { ...prev, correctAnswer: Number(correctAnswer) }
            : prev
        );
        setIsEditMode(true);
        // Don't reset if we were editing – only reset for fresh insert
        if (!searchResult) form.resetFields();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "সংরক্ষণ করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  // Delete result (calls backend – add DELETE route if not present)
  const handleDelete = async () => {
    const roll = form.getFieldValue("scholarshipRollNumber");
    if (!roll || !roll.trim()) {
      toast.warning("রোল নম্বর দিন");
      return;
    }
    const normalizedRoll = normalizeRollNumber(roll);
    try {
      setDeleting(true);
      await coreAxios.delete(`/result/${normalizedRoll}`);
      toast.success("রেজাল্ট ডিলিট হয়েছে");
      form.resetFields();
      setSearchResult(null);
      setIsEditMode(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "ডিলিট করা যায়নি");
    } finally {
      setDeleting(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setSearchResult(null);
    setIsEditMode(false);
  };

  const tableColumns = [
    {
      title: "রোল নম্বর",
      dataIndex: "scholarshipRollNumber",
      key: "scholarshipRollNumber",
      render: (val) => val || "-",
    },
    {
      title: "সঠিক উত্তর",
      dataIndex: "correctAnswer",
      key: "correctAnswer",
      render: (val) => (val !== undefined && val !== null ? val : "-"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <Title level={4} className="!mb-0 !text-gray-800">
            রেজাল্ট ম্যানেজমেন্ট
          </Title>
        </div>

        <Card className="shadow-sm border border-gray-200 mb-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ scholarshipRollNumber: "", correctAnswer: undefined }}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={14}>
                <Form.Item
                  name="scholarshipRollNumber"
                  label="শিক্ষাবৃত্তি রোল নম্বর"
                  rules={[{ required: true, message: "রোল নম্বর দিন" }]}
                >
                  <Input
                    placeholder="রোল নম্বর লিখুন"
                    size="large"
                    allowClear
                    className="w-full"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} className="flex items-end gap-2 flex-wrap">
                <Button
                  type="default"
                  icon={<SearchOutlined />}
                  size="large"
                  loading={searching}
                  onClick={handleSearch}
                  className="flex-1 min-w-[120px]"
                >
                  খুঁজুন
                </Button>
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  size="large"
                  onClick={handleClear}
                  className="flex-1 min-w-[100px]"
                >
                  ক্লিয়ার
                </Button>
              </Col>
            </Row>

            <Form.Item
              name="correctAnswer"
              label="সঠিক উত্তর (Correct Answer)"
              rules={[{ required: true, message: "সঠিক উত্তর দিন" }]}
            >
              <InputNumber
                placeholder="সঠিক উত্তরের সংখ্যা"
                min={0}
                max={1000}
                size="large"
                className="w-full"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item className="!mb-0">
              <Space wrap size="middle">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                  className="bg-green-600 hover:!bg-green-700"
                >
                  {isEditMode ? "আপডেট করুন" : "যোগ করুন"}
                </Button>
                {isEditMode && searchResult && (
                  <Popconfirm
                    title="রেজাল্ট ডিলিট করবেন?"
                    description="এই রোলের সঠিক উত্তর ডিলিট হবে।"
                    onConfirm={handleDelete}
                    okText="হ্যাঁ"
                    cancelText="না"
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      loading={deleting}
                      size="large"
                    >
                      ডিলিট
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {searchResult && (
          <Card
            title={
              <span>
                বর্তমান রেকর্ড{" "}
                <Tag color="blue">{searchResult.scholarshipRollNumber}</Tag>
              </span>
            }
            className="shadow-sm border border-gray-200"
          >
            <Table
              columns={tableColumns}
              dataSource={[
                {
                  key: "1",
                  scholarshipRollNumber: searchResult.scholarshipRollNumber,
                  correctAnswer: searchResult.correctAnswer,
                },
              ]}
              pagination={false}
              size="small"
              bordered
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddResult;
