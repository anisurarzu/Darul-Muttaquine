import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Rate,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Upload,
  message,
} from "antd";
import {
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { coreAxios } from "../../../utilities/axios";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    tasks: true,
    users: true,
  });
  const [modalState, setModalState] = useState({
    visible: false,
    mode: "create",
    isSubmission: false,
    taskId: null,
  });
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isSuperAdmin = userInfo?.userRole === "Super-Admin";
  const currentUserId = userInfo?._id;

  const fetchTasks = async () => {
    try {
      setLoading((prev) => ({ ...prev, tasks: true }));
      const endpoint = isSuperAdmin ? "/tasks" : `/tasks/user/${currentUserId}`;
      const response = await coreAxios.get(endpoint);
      setTasks(response.data);
    } catch (error) {
      message.error("Failed to fetch tasks");
    } finally {
      setLoading((prev) => ({ ...prev, tasks: false }));
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading((prev) => ({ ...prev, users: true }));
      const response = await coreAxios.get("/users");
      setUsers(
        response.data.map((user) => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName}`,
        }))
      );
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchUsers(), fetchTasks()]);
    };
    loadData();
  }, [isSuperAdmin, currentUserId]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success) {
        return result.data.url; // Return the direct URL
      }
      throw new Error(result.error?.message || "Upload failed");
    } catch (error) {
      message.error(`Upload failed: ${error.message}`);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const url = await handleUpload(file);
      onSuccess({ url }, file); // Pass the URL in the response
    } catch (error) {
      onError(error);
    }
  };

  const taskFormik = useFormik({
    initialValues: {
      title: "",
      assignedTo: null,
      notes: "",
      dueDate: null,
      files: [],
      mark: 0,
      status: "pending",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      assignedTo: Yup.string().required("Please select a user"),
      dueDate: Yup.date().required("Due date is required"),
      mark: Yup.number()
        .min(0, "Mark must be at least 0")
        .max(5, "Mark must be at most 5"),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const selectedUser = users.find((u) => u._id === values.assignedTo);

        // Process files to get URLs - both new uploads and existing files
        const fileUrls = fileList
          .map((file) => {
            // For newly uploaded files (they'll have response.url)
            if (file.response?.url) return file.response.url;
            // For existing files (they'll have url property)
            if (file.url) return file.url;
            return null;
          })
          .filter((url) => url); // Remove any null values

        const taskData = {
          title: values.title,
          status: values.status,
          assignedTo: values.assignedTo,
          assignedToName: selectedUser?.fullName,
          assignedToImage: selectedUser?.image,
          notes: values.notes,
          dueDate: values.dueDate.format("YYYY-MM-DD"),
          files: fileUrls, // Array of image URLs
          mark: values.mark,
        };

        if (modalState.mode === "edit") {
          await coreAxios.put(`/tasks/${modalState.taskId}`, taskData);
          message.success("Task updated successfully");
        } else {
          await coreAxios.post("/tasks", taskData);
          message.success("Task created successfully");
        }

        await fetchTasks();
        handleCloseModal();
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            (modalState.mode === "edit"
              ? "Failed to update task"
              : "Failed to create task")
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const completeTask = async (taskId) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: "completed" } : task
        )
      );

      await coreAxios.put(`/tasks/${taskId}/complete`);
      message.success("Task completed successfully");
      await fetchTasks();
    } catch (error) {
      await fetchTasks();
      message.error("Failed to complete task");
    }
  };

  const deleteTask = async (taskId) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this task?",
      async onOk() {
        try {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
          await coreAxios.delete(`/tasks/${taskId}`);
          message.success("Task deleted successfully");
          await fetchTasks();
        } catch (error) {
          await fetchTasks();
          message.error("Failed to delete task");
        }
      },
    });
  };

  const updateMark = async (taskId, newMark) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, mark: newMark } : task
        )
      );
      await coreAxios.patch(`/tasks/${taskId}/mark`, { mark: newMark });
      message.success("Mark updated successfully");
      await fetchTasks();
    } catch (error) {
      await fetchTasks();
      message.error("Failed to update mark");
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: "orange", icon: <ClockCircleOutlined /> },
      "in-progress": { color: "blue", icon: <ClockCircleOutlined /> },
      completed: { color: "green", icon: <CheckOutlined /> },
    };

    const config = statusConfig[status] || { color: "default", icon: null };

    return (
      <Tag color={config.color} icon={config.icon}>
        {status.toUpperCase()}
      </Tag>
    );
  };

  const showModal = (taskId = null, isSubmission = false) => {
    if (isSubmission) {
      setModalState({
        visible: true,
        isSubmission: true,
        taskId,
      });
      return;
    }

    if (taskId) {
      const taskToEdit = tasks.find((task) => task._id === taskId);
      if (taskToEdit) {
        taskFormik.setValues({
          title: taskToEdit.title,
          assignedTo: taskToEdit.assignedTo,
          notes: taskToEdit.notes,
          dueDate: dayjs(taskToEdit.dueDate),
          mark: taskToEdit.mark,
          status: taskToEdit.status,
        });

        // Safely handle files
        setFileList(
          (taskToEdit.files || [])
            .filter((file) => file)
            .map((file) => ({
              uid: file,
              name: file?.split("/").pop() || "file",
              status: "done",
              url: file,
            }))
        );
      }
      setModalState({
        visible: true,
        mode: "edit",
        isSubmission: false,
        taskId,
      });
    } else {
      taskFormik.resetForm();
      setFileList([]);
      setModalState({
        visible: true,
        mode: "create",
        isSubmission: false,
        taskId: null,
      });
    }
  };

  const handleCloseModal = () => {
    setModalState({
      visible: false,
      mode: "create",
      isSubmission: false,
      taskId: null,
    });
    taskFormik.resetForm();
    setFileList([]);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      key: "assignedTo",
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar
            src={record.assignedToImage}
            icon={<UserOutlined />}
            className="mr-2"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text) => dayjs(text).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Task Mark",
      dataIndex: "mark",
      key: "mark",
      render: (mark) => <span>{mark}/5</span>,
    },
    {
      title: "Rating",
      dataIndex: "mark",
      key: "rating",
      render: (mark, record) => (
        <Rate
          value={mark}
          onChange={(value) => updateMark(record._id, value)}
          disabled={!isSuperAdmin || record.status !== "completed"}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {!isSuperAdmin && (
            <Button
              type="primary"
              onClick={() => completeTask(record._id)}
              disabled={
                record.status === "completed" ||
                record.assignedTo !== currentUserId
              }
            >
              Complete Task
            </Button>
          )}

          {isSuperAdmin && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => showModal(record._id)}
                className="text-gray-600"
              >
                Edit
              </Button>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => deleteTask(record._id)}
                className="text-red-500"
              >
                Delete
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        {isSuperAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Create Task
          </Button>
        )}
      </div>

      {loading.tasks || loading.users ? (
        <>
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
        </>
      ) : (
        <Card>
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="_id"
            loading={loading.tasks}
            expandable={{
              expandedRowRender: (record) => (
                <div className="p-4 bg-gray-50">
                  <div className="mb-2">
                    <span className="font-semibold">Notes:</span>
                    <p className="mt-1">
                      {record.notes || "No notes provided"}
                    </p>
                  </div>
                  {record.files?.length > 0 && (
                    <div className="mb-2">
                      <span className="font-semibold">Attachments:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {record.files.map(
                          (file, index) =>
                            file && (
                              <a
                                key={`${record._id}-file-${index}`}
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Tag
                                  icon={<FileOutlined />}
                                  className="cursor-pointer hover:bg-blue-50"
                                >
                                  {file?.split("/").pop()}
                                </Tag>
                              </a>
                            )
                        )}
                      </div>
                    </div>
                  )}
                  {record.submission && (
                    <div className="mt-4 p-3 bg-white rounded border">
                      <div className="font-semibold">Submission Details:</div>
                      <div className="mt-1">
                        {record.submission.comments || "No comments"}
                      </div>
                      {record.submission.files?.length > 0 && (
                        <div className="mt-2">
                          <div className="font-medium">Submitted Files:</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {record.submission.files.map(
                              (file, index) =>
                                file && (
                                  <a
                                    key={`submission-${index}`}
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Tag
                                      icon={<FileOutlined />}
                                      className="cursor-pointer hover:bg-blue-50"
                                    >
                                      {file?.split("/").pop()}
                                    </Tag>
                                  </a>
                                )
                            )}
                          </div>
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-2">
                        Submitted:{" "}
                        {record.submission.submittedAt
                          ? dayjs(record.submission.submittedAt).format(
                              "DD MMM YYYY HH:mm"
                            )
                          : "No submission date"}
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mt-2">
                    Created: {dayjs(record.createdAt).format("DD MMM YYYY")}
                  </div>
                </div>
              ),
            }}
          />
        </Card>
      )}

      <Modal
        title={modalState.mode === "edit" ? "Edit Task" : "Create New Task"}
        open={modalState.visible && !modalState.isSubmission}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={taskFormik.handleSubmit}>
          <Form.Item
            label="Task Title"
            required
            validateStatus={taskFormik.errors.title ? "error" : ""}
            help={taskFormik.errors.title}
          >
            <Input
              name="title"
              value={taskFormik.values.title}
              onChange={taskFormik.handleChange}
              placeholder="Enter task title"
            />
          </Form.Item>

          <Form.Item
            label="Assign To"
            required
            validateStatus={taskFormik.errors.assignedTo ? "error" : ""}
            help={taskFormik.errors.assignedTo}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                const userData = option.user || {};
                const searchText = input.toLowerCase();
                return (
                  userData.fullName?.toLowerCase().includes(searchText) ||
                  userData.uniqueId?.toLowerCase().includes(searchText) ||
                  userData.email?.toLowerCase().includes(searchText)
                );
              }}
              onChange={(value) => {
                taskFormik.setFieldValue("assignedTo", value);
              }}
              value={taskFormik.values.assignedTo}
              loading={loading.users}
              placeholder="Select user"
              className="w-full"
            >
              {users.map((user) => (
                <Option
                  key={user._id}
                  value={user._id}
                  user={user}
                  label={user.fullName}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={user.image}
                      icon={<UserOutlined />}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {user.uniqueId} • {user.email}
                      </div>
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Status" required>
            <Select
              name="status"
              value={taskFormik.values.status}
              onChange={(value) => taskFormik.setFieldValue("status", value)}
            >
              <Option value="pending">Pending</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Due Date"
            required
            validateStatus={taskFormik.errors.dueDate ? "error" : ""}
            help={taskFormik.errors.dueDate}
          >
            <DatePicker
              name="dueDate"
              value={taskFormik.values.dueDate}
              onChange={(date) => taskFormik.setFieldValue("dueDate", date)}
              style={{ width: "100%" }}
            />
          </Form.Item>

          {isSuperAdmin && (
            <Form.Item
              label="Mark (0-5)"
              validateStatus={taskFormik.errors.mark ? "error" : ""}
              help={taskFormik.errors.mark}
            >
              <Rate
                name="mark"
                value={taskFormik.values.mark}
                onChange={(value) => taskFormik.setFieldValue("mark", value)}
              />
            </Form.Item>
          )}

          <Form.Item label="Notes">
            <TextArea
              name="notes"
              value={taskFormik.values.notes}
              onChange={taskFormik.handleChange}
              rows={4}
              placeholder="Additional instructions..."
            />
          </Form.Item>

          <Form.Item label="Attachments">
            <Upload
              customRequest={customRequest}
              fileList={fileList}
              onChange={({ fileList: updatedFileList }) => {
                // Ensure all files have proper structure
                const safeFileList = updatedFileList.map((file) => ({
                  ...file,
                  name:
                    file.name || (file.url || "").split("/").pop() || "file",
                  url: file.url || file.response?.url,
                }));
                setFileList(safeFileList);
              }}
              multiple
              listType="picture"
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Upload Files
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className="text-right">
            <Button onClick={handleCloseModal} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {modalState.mode === "edit" ? "Update Task" : "Create Task"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
