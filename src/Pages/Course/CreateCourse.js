import React, { useMemo, useState } from "react";
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
  Divider,
  Collapse,
} from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { coreAxios } from "../../utilities/axios";
import dayjs from "dayjs";

const { Option } = Select;
const { Panel } = Collapse;
const IMGBB_API_KEY = "5bdcb96655462459d117ee1361223929";
const FINAL_EXAM_LIMIT = 50;

const emptyLesson = () => ({ title: "", content: "", lessonQuiz: [] });
const emptyModule = () => ({
  title: "",
  description: "",
  lessons: [emptyLesson()],
  moduleQuiz: [],
});
const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
});

const mapInitialValues = (initialData) => ({
  title: initialData?.title || "",
  category: initialData?.category || "",
  description: initialData?.description || "",
  instructorName: initialData?.instructor?.name || "",
  instructorQualification: initialData?.instructor?.qualification || "",
  instructorImage: initialData?.instructor?.image || "",
  startDate: initialData?.startDate || "",
  endDate: initialData?.endDate || "",
  duration: initialData?.duration || "",
  availableSeats: Number(initialData?.availableSeats || 0),
  batchNumber: initialData?.batchNumber || "",
  qualifications: initialData?.qualifications || "",
  certifications: initialData?.certifications || "",
  image: initialData?.image || "",
  modules:
    initialData?.modules?.length > 0
      ? initialData.modules.map((m) => ({
          title: m?.title || "",
          description: m?.description || "",
          lessons:
            m?.lessons?.length > 0
              ? m.lessons.map((l) => ({
                  title: l?.title || "",
                  content: l?.content || "",
                  lessonQuiz:
                    Array.isArray(l?.quiz) && l.quiz.length > 0
                      ? l.quiz.map((q) => ({
                          question: q?.question || "",
                          options:
                            Array.isArray(q?.options) && q.options.length === 4
                              ? q.options
                              : ["", "", "", ""],
                          correctAnswer: q?.correctAnswer || "",
                          explanation: q?.explanation || "",
                        }))
                      : [],
                }))
              : [emptyLesson()],
          moduleQuiz:
            Array.isArray(m?.moduleQuiz) && m.moduleQuiz.length > 0
              ? m.moduleQuiz.map((q) => ({
                  question: q?.question || "",
                  options:
                    Array.isArray(q?.options) && q.options.length === 4
                      ? q.options
                      : ["", "", "", ""],
                  correctAnswer: q?.correctAnswer || "",
                  explanation: q?.explanation || "",
                }))
              : [],
        }))
      : [emptyModule()],
  finalExam:
    initialData?.finalExam?.length > 0
      ? initialData.finalExam.map((q) => ({
          question: q?.question || "",
          options: Array.isArray(q?.options) && q.options.length === 4 ? q.options : ["", "", "", ""],
          correctAnswer: q?.correctAnswer || "",
          explanation: q?.explanation || "",
        }))
      : [],
});

export default function CreateCourse({
  handleCancel,
  instructors = [],
  initialData = null,
  mode = "create",
}) {
  const [submitting, setSubmitting] = useState(false);
  const isEdit = mode === "edit" && initialData?._id;

  const initialValues = useMemo(() => mapInitialValues(initialData), [initialData]);

  const uploadImage = async (file, setFieldValue, fieldName, errorText) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      );
      setFieldValue(fieldName, response?.data?.data?.url || "");
      message.success("ছবি আপলোড হয়েছে");
    } catch (error) {
      message.error(errorText);
    }
  };

  const saveCourseToAPI = async (values) => {
    if (!isEdit && values.finalExam.length !== FINAL_EXAM_LIMIT) {
      return notification.error({
        message: "Final exam অসম্পূর্ণ",
        description: `Final exam এ ঠিক ${FINAL_EXAM_LIMIT}টি প্রশ্ন থাকতে হবে।`,
      });
    }

    for (let i = 0; i < values.finalExam.length; i += 1) {
      const q = values.finalExam[i];
      if (!q.question || q.options.some((o) => !o) || !q.correctAnswer) {
        return notification.error({
          message: `Final exam question #${i + 1} অসম্পূর্ণ`,
          description: "প্রশ্ন, ৪টি option এবং correct answer দিন।",
        });
      }
    }

    for (let moduleIndex = 0; moduleIndex < values.modules.length; moduleIndex += 1) {
      const module = values.modules[moduleIndex];
      const moduleQuiz = module.moduleQuiz || [];
      if (moduleQuiz.length > 0 && moduleQuiz.length !== 20) {
        return notification.error({
          message: `Module #${moduleIndex + 1} quiz count ভুল`,
          description: "Module quiz দিলে ঠিক 20টি question দিতে হবে।",
        });
      }
      for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex += 1) {
        const lesson = module.lessons[lessonIndex];
        const lessonQuiz = lesson.lessonQuiz || [];
        if (lessonQuiz.length > 0 && lessonQuiz.length !== 5) {
          return notification.error({
            message: `Lesson #${lessonIndex + 1} quiz count ভুল`,
            description: "Lesson quiz দিলে ঠিক 5টি question দিতে হবে।",
          });
        }
      }
    }

    const payload = {
      title: values.title,
      category: values.category,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      duration: values.duration,
      availableSeats: Number(values.availableSeats),
      batchNumber: values.batchNumber,
      qualifications: values.qualifications,
      certifications: values.certifications,
      image: values.image,
      instructor: {
        name: values.instructorName,
        image: values.instructorImage || "",
        qualification: values.instructorQualification || "",
      },
      modules: values.modules.map((module, moduleIdx) => {
        const modulePayload = {
          title: module.title,
          description: module.description,
          lessons: module.lessons.map((lesson, lessonIdx) => {
            const lessonPayload = {
              title: lesson.title,
              content: lesson.content,
              lessonId: lesson.lessonId || `${moduleIdx + 1}-${lessonIdx + 1}`,
            };
            const lessonQuiz = lesson.lessonQuiz || [];
            if (Array.isArray(lessonQuiz) && lessonQuiz.length === 5) {
              lessonPayload.quiz = lessonQuiz;
            }
            return lessonPayload;
          }),
          moduleId: module.moduleId || `${moduleIdx + 1}`,
        };
        const moduleQuiz = module.moduleQuiz || [];
        if (Array.isArray(moduleQuiz) && moduleQuiz.length === 20) {
          modulePayload.moduleQuiz = moduleQuiz;
        }
        return modulePayload;
      }),
    };

    if (!isEdit || values.finalExam.length === FINAL_EXAM_LIMIT) {
      payload.finalExam = values.finalExam;
    }

    try {
      setSubmitting(true);
      const response = isEdit
        ? await coreAxios.put(`/courses/${initialData._id}`, payload)
        : await coreAxios.post("/courses", payload);

      if (response?.status === 200 || response?.status === 201) {
        notification.success({
          message: isEdit ? "কোর্স আপডেট সফল হয়েছে!" : "কোর্স তৈরি সফল হয়েছে!",
          description: `"${values.title}" সফলভাবে ${isEdit ? "আপডেট" : "তৈরি"} হয়েছে।`,
        });
        handleCancel();
      }
    } catch (error) {
      notification.error({
        message: isEdit ? "কোর্স আপডেট করতে সমস্যা হয়েছে" : "কোর্স তৈরি করতে সমস্যা হয়েছে",
        description: error?.response?.data?.message || "দয়া করে আবার চেষ্টা করুন।",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#2D6A3F]">
        {isEdit ? "কোর্স আপডেট করুন" : "কোর্স তৈরি করুন"}
      </h1>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={Yup.object({
          title: Yup.string().required("কোর্সের নাম আবশ্যক"),
          category: Yup.string().required("ক্যাটেগরি নির্বাচন করুন"),
          description: Yup.string().required("বিবরণ প্রদান করুন"),
          instructorName: Yup.string().required("ইন্সট্রাক্টরের নাম আবশ্যক"),
          startDate: Yup.string().required("শুরুর তারিখ আবশ্যক"),
          endDate: Yup.string().required("শেষ তারিখ আবশ্যক"),
          duration: Yup.string().required("কোর্সের সময়কাল আবশ্যক"),
          availableSeats: Yup.number().required("আসনের সংখ্যা আবশ্যক"),
          batchNumber: Yup.string().required("ব্যাচ নম্বর প্রদান করুন"),
          qualifications: Yup.string().required("যোগ্যতা প্রদান করুন"),
          certifications: Yup.string().required("সার্টিফিকেটের বিবরণ প্রদান করুন"),
        })}
        onSubmit={saveCourseToAPI}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          handleSubmit,
          submitForm,
          errors,
          touched,
        }) => (
          <Form
            layout="vertical"
            onSubmitCapture={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="bg-white p-6 shadow-lg rounded-lg"
          >
            <Form.Item label="কোর্সের নাম" required validateStatus={errors.title && touched.title ? "error" : ""} help={errors.title && touched.title ? errors.title : null}>
              <Input name="title" value={values.title} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="ক্যাটেগরি" required validateStatus={errors.category && touched.category ? "error" : ""} help={errors.category && touched.category ? errors.category : null}>
              <Select value={values.category} onChange={(value) => setFieldValue("category", value)}>
                <Option value="আইসিটি">আইসিটি</Option>
                <Option value="ব্যবসা">ব্যবসা</Option>
                <Option value="স্বাস্থ্য">স্বাস্থ্য</Option>
                <Option value="শিল্প">শিল্প</Option>
              </Select>
            </Form.Item>

            <Form.Item label="কোর্সের বিবরণ" required validateStatus={errors.description && touched.description ? "error" : ""} help={errors.description && touched.description ? errors.description : null}>
              <Input.TextArea name="description" value={values.description} onChange={handleChange} rows={3} />
            </Form.Item>

            <Form.Item label="ইন্সট্রাক্টরের নাম" required>
              <Select value={values.instructorName} onChange={(value) => setFieldValue("instructorName", value)}>
                {instructors?.map((instructor) => (
                  <Option key={instructor.uniqueId} value={`${instructor.firstName || ""} ${instructor.lastName || ""}`.trim()}>
                    {instructor.firstName} {instructor.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="ইন্সট্রাক্টরের যোগ্যতা">
              <Input name="instructorQualification" value={values.instructorQualification} onChange={handleChange} />
            </Form.Item>

            <Form.Item label="ইন্সট্রাক্টরের ছবি (অপশনাল)">
              <Upload showUploadList={false} beforeUpload={(file) => { uploadImage(file, setFieldValue, "instructorImage", "ইন্সট্রাক্টরের ছবি আপলোড করতে সমস্যা হয়েছে"); return false; }}>
                <Button icon={<UploadOutlined />}>ইন্সট্রাক্টরের ছবি আপলোড করুন</Button>
              </Upload>
            </Form.Item>

            <Form.Item label="কোর্সের ছবি (অপশনাল)">
              <Upload showUploadList={false} beforeUpload={(file) => { uploadImage(file, setFieldValue, "image", "কোর্সের ছবি আপলোড করতে সমস্যা হয়েছে"); return false; }}>
                <Button icon={<UploadOutlined />}>কোর্সের ছবি আপলোড করুন</Button>
              </Upload>
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Form.Item label="শুরুর তারিখ" required>
                <DatePicker value={values.startDate ? dayjs(values.startDate) : null} onChange={(date) => setFieldValue("startDate", date ? dayjs(date).format("YYYY-MM-DD") : "")} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="শেষ তারিখ" required>
                <DatePicker value={values.endDate ? dayjs(values.endDate) : null} onChange={(date) => setFieldValue("endDate", date ? dayjs(date).format("YYYY-MM-DD") : "")} style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Form.Item label="সময়কাল" required><Input name="duration" value={values.duration} onChange={handleChange} /></Form.Item>
              <Form.Item label="আসনের সংখ্যা" required><InputNumber value={values.availableSeats} onChange={(value) => setFieldValue("availableSeats", value)} style={{ width: "100%" }} min={0} /></Form.Item>
              <Form.Item label="ব্যাচ নম্বর" required><Input name="batchNumber" value={values.batchNumber} onChange={handleChange} /></Form.Item>
            </div>

            <Form.Item label="যোগ্যতা" required><Input.TextArea name="qualifications" value={values.qualifications} onChange={handleChange} rows={2} /></Form.Item>
            <Form.Item label="সার্টিফিকেট" required><Input.TextArea name="certifications" value={values.certifications} onChange={handleChange} rows={2} /></Form.Item>

            <Divider orientation="left">মডিউল ও লেসন</Divider>
            {values.modules.map((module, moduleIndex) => (
              <div key={`module-${moduleIndex}`} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">মডিউল #{moduleIndex + 1}</h3>
                  {values.modules.length > 1 && (
                    <Button danger size="small" onClick={() => {
                      const next = [...values.modules];
                      next.splice(moduleIndex, 1);
                      setFieldValue("modules", next);
                    }}>Remove Module</Button>
                  )}
                </div>
                <Form.Item label="মডিউল টাইটেল" required>
                  <Input value={module.title} onChange={(e) => setFieldValue(`modules[${moduleIndex}].title`, e.target.value)} />
                </Form.Item>
                <Form.Item label="মডিউল বর্ণনা" required>
                  <Input.TextArea value={module.description} onChange={(e) => setFieldValue(`modules[${moduleIndex}].description`, e.target.value)} rows={2} />
                </Form.Item>
                <Divider orientation="left">Lessons</Divider>
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={`lesson-${moduleIndex}-${lessonIndex}`} className="border rounded p-3 mb-3 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">লেসন #{lessonIndex + 1}</p>
                      {module.lessons.length > 1 && (
                        <Button danger size="small" onClick={() => {
                          const next = [...values.modules];
                          next[moduleIndex].lessons.splice(lessonIndex, 1);
                          setFieldValue("modules", next);
                        }}>Remove Lesson</Button>
                      )}
                    </div>
                    <Form.Item label="লেসন টাইটেল" required>
                      <Input value={lesson.title} onChange={(e) => setFieldValue(`modules[${moduleIndex}].lessons[${lessonIndex}].title`, e.target.value)} />
                    </Form.Item>
                    <Form.Item label="লেসন কন্টেন্ট" required>
                      <Input.TextArea value={lesson.content} onChange={(e) => setFieldValue(`modules[${moduleIndex}].lessons[${lessonIndex}].content`, e.target.value)} rows={4} />
                    </Form.Item>
                    <Divider orientation="left">Lesson Quiz (optional, 5 questions)</Divider>
                    <Collapse accordion className="mb-3">
                      {(lesson.lessonQuiz || []).map((q, qIndex) => (
                        <Panel
                          key={`lq-${moduleIndex}-${lessonIndex}-${qIndex}`}
                          header={`Question #${qIndex + 1} ${
                            q.question ? `- ${q.question.slice(0, 35)}${q.question.length > 35 ? "..." : ""}` : ""
                          }`}
                        >
                          <div className="mb-2">
                            <Button
                              danger
                              size="small"
                              onClick={() => {
                                const next = [...values.modules];
                                next[moduleIndex].lessons[lessonIndex].lessonQuiz.splice(qIndex, 1);
                                setFieldValue("modules", next);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                          <Input
                            className="mb-2"
                            placeholder="Question"
                            value={q.question}
                            onChange={(e) =>
                              setFieldValue(
                                `modules[${moduleIndex}].lessons[${lessonIndex}].lessonQuiz[${qIndex}].question`,
                                e.target.value
                              )
                            }
                          />
                          {(q.options || []).map((opt, oIndex) => (
                            <Input
                              key={`lqo-${oIndex}`}
                              className="mb-2"
                              placeholder={`Option ${oIndex + 1}`}
                              value={opt}
                              onChange={(e) =>
                                setFieldValue(
                                  `modules[${moduleIndex}].lessons[${lessonIndex}].lessonQuiz[${qIndex}].options[${oIndex}]`,
                                  e.target.value
                                )
                              }
                            />
                          ))}
                          <Select
                            className="w-full mb-2"
                            placeholder="Correct Answer"
                            value={q.correctAnswer || undefined}
                            onChange={(value) =>
                              setFieldValue(
                                `modules[${moduleIndex}].lessons[${lessonIndex}].lessonQuiz[${qIndex}].correctAnswer`,
                                value
                              )
                            }
                          >
                            {(q.options || []).filter(Boolean).map((opt, idx) => (
                              <Option key={`lqca-${idx}`} value={opt}>
                                {opt}
                              </Option>
                            ))}
                          </Select>
                          <Input.TextArea
                            rows={2}
                            placeholder="Explanation (optional)"
                            value={q.explanation}
                            onChange={(e) =>
                              setFieldValue(
                                `modules[${moduleIndex}].lessons[${lessonIndex}].lessonQuiz[${qIndex}].explanation`,
                                e.target.value
                              )
                            }
                          />
                        </Panel>
                      ))}
                    </Collapse>
                    <Button
                      type="dashed"
                      disabled={(lesson.lessonQuiz || []).length >= 5}
                      onClick={() => {
                        const next = [...values.modules];
                        next[moduleIndex].lessons[lessonIndex].lessonQuiz = [
                          ...(next[moduleIndex].lessons[lessonIndex].lessonQuiz || []),
                          emptyQuestion(),
                        ];
                        setFieldValue("modules", next);
                      }}
                    >
                      + Add Lesson Quiz Question
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => {
                  const next = [...values.modules];
                  next[moduleIndex].lessons.push(emptyLesson());
                  setFieldValue("modules", next);
                }}>+ Add Lesson</Button>
                <Divider orientation="left">Module End Quiz (optional, 20 questions)</Divider>
                {(module.moduleQuiz || []).map((q, qIndex) => (
                  <div key={`mq-${moduleIndex}-${qIndex}`} className="border rounded p-3 mb-3 bg-white">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium text-sm">Question #{qIndex + 1}</p>
                      <Button
                        danger
                        size="small"
                        onClick={() => {
                          const next = [...values.modules];
                          next[moduleIndex].moduleQuiz.splice(qIndex, 1);
                          setFieldValue("modules", next);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <Input
                      className="mb-2"
                      placeholder="Question"
                      value={q.question}
                      onChange={(e) =>
                        setFieldValue(
                          `modules[${moduleIndex}].moduleQuiz[${qIndex}].question`,
                          e.target.value
                        )
                      }
                    />
                    {(q.options || []).map((opt, oIndex) => (
                      <Input
                        key={`mqo-${oIndex}`}
                        className="mb-2"
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) =>
                          setFieldValue(
                            `modules[${moduleIndex}].moduleQuiz[${qIndex}].options[${oIndex}]`,
                            e.target.value
                          )
                        }
                      />
                    ))}
                    <Select
                      className="w-full mb-2"
                      placeholder="Correct Answer"
                      value={q.correctAnswer || undefined}
                      onChange={(value) =>
                        setFieldValue(
                          `modules[${moduleIndex}].moduleQuiz[${qIndex}].correctAnswer`,
                          value
                        )
                      }
                    >
                      {(q.options || []).filter(Boolean).map((opt, idx) => (
                        <Option key={`mqca-${idx}`} value={opt}>
                          {opt}
                        </Option>
                      ))}
                    </Select>
                    <Input.TextArea
                      rows={2}
                      placeholder="Explanation (optional)"
                      value={q.explanation}
                      onChange={(e) =>
                        setFieldValue(
                          `modules[${moduleIndex}].moduleQuiz[${qIndex}].explanation`,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  disabled={(module.moduleQuiz || []).length >= 20}
                  onClick={() => {
                    const next = [...values.modules];
                    next[moduleIndex].moduleQuiz = [
                      ...(next[moduleIndex].moduleQuiz || []),
                      emptyQuestion(),
                    ];
                    setFieldValue("modules", next);
                  }}
                >
                  + Add Module Quiz Question
                </Button>
              </div>
            ))}
            <Button type="dashed" block onClick={() => setFieldValue("modules", [...values.modules, emptyModule()])}>+ Add New Module</Button>

            <Divider orientation="left">Final Exam ({values.finalExam.length}/{FINAL_EXAM_LIMIT})</Divider>
            <p className="text-sm text-gray-600 mb-3">Controller অনুযায়ী final exam এ exactly 50টি question লাগবে।</p>
            {values.finalExam.map((question, qIndex) => (
              <div key={`final-q-${qIndex}`} className="border rounded p-4 mb-3">
                <div className="flex justify-between mb-2">
                  <p className="font-semibold">Question #{qIndex + 1}</p>
                  <Button danger size="small" onClick={() => {
                    const next = [...values.finalExam];
                    next.splice(qIndex, 1);
                    setFieldValue("finalExam", next);
                  }}>Remove</Button>
                </div>
                <Input className="mb-2" placeholder="Question" value={question.question} onChange={(e) => setFieldValue(`finalExam[${qIndex}].question`, e.target.value)} />
                {question.options.map((opt, oIndex) => (
                  <Input key={`opt-${qIndex}-${oIndex}`} className="mb-2" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => setFieldValue(`finalExam[${qIndex}].options[${oIndex}]`, e.target.value)} />
                ))}
                <Select className="w-full mb-2" placeholder="Correct Answer" value={question.correctAnswer || undefined} onChange={(value) => setFieldValue(`finalExam[${qIndex}].correctAnswer`, value)}>
                  {question.options.filter(Boolean).map((opt, idx) => (
                    <Option key={`ca-${qIndex}-${idx}`} value={opt}>{opt}</Option>
                  ))}
                </Select>
                <Input.TextArea rows={2} placeholder="Explanation (optional)" value={question.explanation} onChange={(e) => setFieldValue(`finalExam[${qIndex}].explanation`, e.target.value)} />
              </div>
            ))}
            <Button type="dashed" disabled={values.finalExam.length >= FINAL_EXAM_LIMIT} onClick={() => setFieldValue("finalExam", [...values.finalExam, emptyQuestion()])}>
              + Add Final Exam Question
            </Button>

            <Form.Item className="mt-6 mb-0">
              <Button
                type="primary"
                htmlType="button"
                block
                loading={submitting}
                onClick={() => submitForm()}
              >
                {isEdit ? "কোর্স আপডেট করুন" : "কোর্স তৈরি করুন"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
}
