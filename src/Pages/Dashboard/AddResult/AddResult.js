import React, { useState, useEffect, useCallback } from "react";
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
  Spin,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { coreAxios } from "../../../utilities/axios";

const { Title, Text } = Typography;

// ভাইভা মার্কস ফিল্ড ১২ তারিখের পর থেকে দেখাবে (১২ মার্চ ২০২৬)
const VIBA_MARKS_OPEN_FROM = new Date(2026, 2, 12, 0, 0, 0); // 12 March 2026
const isVibaMarksVisible = () => new Date() >= VIBA_MARKS_OPEN_FROM;

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
  const [searchResult, setSearchResult] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [stats, setStats] = useState({ overall: null, byClass: [] });
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchResultStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await coreAxios.get("/result-stats");
      if (res?.status === 200 && res?.data?.success && res?.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Result stats fetch error:", err);
      setStats({ overall: null, byClass: [] });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResultStats();
  }, [fetchResultStats]);

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
          vibaMarks:
            data.vibaMarks !== undefined && data.vibaMarks !== null
              ? data.vibaMarks
              : undefined,
        });
        setSearchResult(data);
        setIsEditMode(true);
        toast.success("রেকর্ড পাওয়া গেছে। এডিট করে আপডেট করুন অথবা ডিলিট করুন।");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "রোল নম্বর পাওয়া যায়নি");
      setSearchResult(null);
      form.setFieldsValue({ correctAnswer: undefined, vibaMarks: undefined });
      setIsEditMode(false);
    } finally {
      setSearching(false);
    }
  };

  // Insert or Update
  const onFinish = async (values) => {
    const { scholarshipRollNumber, correctAnswer, vibaMarks } = values;
    if (
      correctAnswer === undefined ||
      correctAnswer === null ||
      String(correctAnswer).trim() === ""
    ) {
      toast.warning("সঠিক উত্তর দিন");
      return;
    }
    const normalizedRoll = normalizeRollNumber(scholarshipRollNumber);
    const payload = {
      scholarshipRollNumber: normalizedRoll,
      correctAnswer: Number(correctAnswer),
    };
    if (vibaMarks !== undefined && vibaMarks !== null && String(vibaMarks).trim() !== "") {
      payload.vibaMarks = Number(vibaMarks);
    }
    try {
      setLoading(true);
      const res = await coreAxios.post("/add-result", payload);
      if (res?.status === 200) {
        toast.success(res?.data?.message || "সফলভাবে সংরক্ষণ হয়েছে");
        setSearchResult((prev) =>
          prev && prev.scholarshipRollNumber === normalizedRoll
            ? { ...prev, correctAnswer: Number(correctAnswer), vibaMarks: payload.vibaMarks }
            : prev
        );
        setIsEditMode(true);
        if (!searchResult) form.resetFields();
        fetchResultStats();
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
      fetchResultStats();
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
    ...(isVibaMarksVisible()
      ? [
          {
            title: "ভাইভা মার্কস",
            dataIndex: "vibaMarks",
            key: "vibaMarks",
            render: (val) => (val !== undefined && val !== null ? val : "-"),
          },
        ]
      : []),
  ];

  const overall = stats?.overall ?? null;
  const byClass = stats?.byClass ?? [];
  const barChartData = {
    labels: byClass.map((r) => String(r.class)),
    datasets: [
      {
        label: "মোট উপস্থিত",
        data: byClass.map((r) => r.totalPresent),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
      {
        label: "রেজাল্ট যোগ হয়েছে",
        data: byClass.map((r) => r.resultAddedCount),
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
      {
        label: "পাস (৪০%+)",
        data: byClass.map((r) => r.passCount),
        backgroundColor: "rgba(168, 85, 247, 0.7)",
        borderColor: "rgb(168, 85, 247)",
        borderWidth: 1,
      },
      {
        label: "৭০%+ প্রাপ্ত",
        data: byClass.map((r) => r.got70Count),
        backgroundColor: "rgba(245, 158, 11, 0.7)",
        borderColor: "rgb(245, 158, 11)",
        borderWidth: 1,
      },
    ],
  };
  const doughnutData = overall
    ? {
        labels: ["রেজাল্ট যোগ হয়েছে", "পাস (৪০%+)", "৭০%+ (ভাইভা)"],
        datasets: [
          {
            data: [
              overall.resultAddedCount,
              overall.passCount,
              overall.got70Count,
            ],
            backgroundColor: [
              "rgba(34, 197, 94, 0.8)",
              "rgba(168, 85, 247, 0.8)",
              "rgba(245, 158, 11, 0.8)",
            ],
            borderColor: ["rgb(34, 197, 94)", "rgb(168, 85, 247)", "rgb(245, 158, 11)"],
            borderWidth: 2,
          },
        ],
      }
    : null;

  return (
    <div className=" bg-gray-50 p-4 md:p-6">
      <div className="">
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
            initialValues={{ scholarshipRollNumber: "", correctAnswer: undefined, vibaMarks: undefined }}
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

            {isVibaMarksVisible() && (
              <Form.Item
                name="vibaMarks"
                label="ভাইভা মার্কস (Optional)"
              >
                <InputNumber
                  placeholder="ভাইভা মার্কস (ঐচ্ছিক)"
                  min={0}
                  max={100}
                  size="large"
                  className="w-full"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}

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
                  vibaMarks: searchResult.vibaMarks,
                },
              ]}
              pagination={false}
              size="small"
              bordered
            />
          </Card>
        )}

         {/* Result Stats — overall cards + graphs */}
        <Spin spinning={statsLoading} tip="স্ট্যাটস লোড হচ্ছে...">
          {!statsLoading && (overall || byClass.length > 0) && (
            <Card
              className="shadow-sm border border-gray-200 mb-6"
              title={
                <span>
                  <BarChartOutlined className="mr-2" />
                  রেজাল্ট স্ট্যাটিস্টিক্স
                </span>
              }
              extra={
                <Button
                  type="text"
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={fetchResultStats}>
                  রিফ্রেশ
                </Button>
              }>
              {overall && (
                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={12} sm={12} md={6}>
                    <Card size="small" className="bg-blue-50 border-blue-200">
                      <Statistic
                        title={<Text type="secondary">মোট উপস্থিত</Text>}
                        value={overall.totalPresent}
                      />
                      {overall.totalPresentPercentOfApplications != null && (
                        <Text type="secondary" style={{ fontSize: 12 }} className="block mt-1">
                          আবেদনের {Number(overall.totalPresentPercentOfApplications).toFixed(2)}% উপস্থিত,  মোট আবেদন: {overall.totalApplications}
                        </Text>
                      )}
                      {/* {overall.totalApplications != null && (
                        <Text type="secondary" style={{ fontSize: 12 }} className="block">
                          মোট আবেদন: {overall.totalApplications}
                        </Text>
                      )} */}
                    </Card>
                  </Col>
                  <Col xs={12} sm={12} md={6}>
                    <Card size="small" className="bg-green-50 border-green-200">
                      <Statistic
                        title={<Text type="secondary">রেজাল্ট যোগ (%)</Text>}
                        value={overall.resultAddedRatioPercent}
                        suffix="%"
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {overall.resultAddedCount} / {overall.totalPresent}
                      </Text>
                    </Card>
                  </Col>
                  <Col xs={12} sm={12} md={6}>
                    <Card size="small" className="bg-purple-50 border-purple-200">
                      <Statistic
                        title={<Text type="secondary">পাস ৪০%+ (%)</Text>}
                        value={overall.passRatioPercent}
                        suffix="%"
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {overall.passCount} পাস
                      </Text>
                    </Card>
                  </Col>
                  <Col xs={12} sm={12} md={6}>
                    <Card size="small" className="bg-amber-50 border-amber-200">
                      <Statistic
                        title={<Text type="secondary">৭০%+ (ভাইভা) (%)</Text>}
                        value={overall.got70RatioPercent}
                        suffix="%"
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {overall.got70Count} জন
                      </Text>
                    </Card>
                  </Col>
                </Row>
              )}
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                  <Card size="small" title="শ্রেণী অনুযায়ী (বার চার্ট)" className="mb-0">
                    <div style={{ height: 320 }}>
                      {byClass.length > 0 ? (
                        <Bar
                          data={barChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: "top" },
                              tooltip: { mode: "index", intersect: false },
                            },
                            scales: {
                              x: {
                                stacked: false,
                                ticks: { maxRotation: 45 },
                              },
                              y: { beginAtZero: true, stacked: false },
                            },
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          কোন ক্লাস ডেটা নেই
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={10}>
                  <Card size="small" title="সারাংশ (ডোনাট চার্ট)" className="mb-0">
                    <div style={{ height: 320 }}>
                      {doughnutData ? (
                        <Doughnut
                          data={doughnutData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: "bottom" },
                              tooltip: {
                                callbacks: {
                                  label: (ctx) =>
                                    `${ctx.label}: ${ctx.raw} (${overall ? ((ctx.raw / overall.totalPresent) * 100).toFixed(1) : 0}%)`,
                                },
                              },
                            },
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          সারাংশ ডেটা নেই
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default AddResult;
