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
  // State management
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    tasks: true,
    users: true,
  });
  const [modalState, setModalState] = useState({
    visible: false,
    mode: "create", // 'create' or 'edit'
    isSubmission: false,
    taskId: null,
  });
  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const currentUserRole = "admin"; // This would normally come from auth context

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await coreAxios.get("/users");
        setUsers(
          usersResponse.data.map((user) => ({
            ...user,
            fullName: `${user.firstName} ${user.lastName}`,
          }))
        );

        // Fetch tasks
        const tasksResponse = await coreAxios.get("/tasks");
        setTasks(tasksResponse.data);

        setLoading({ tasks: false, users: false });
      } catch (error) {
        message.error("Failed to fetch data");
        setLoading({ tasks: false, users: false });
      }
    };

    fetchData();
  }, []);

  // Formik for task management
  const taskFormik = useFormik({
    initialValues: {
      title: "",
      assignedTo: null,
      notes: "",
      dueDate: null,
      files: [],
      mark: 0,
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
        const taskData = {
          title: values.title,
          assignedTo: values.assignedTo,
          assignedToName: selectedUser?.fullName,
          assignedToImage: selectedUser?.image,
          notes: values.notes,
          dueDate: values.dueDate.format("YYYY-MM-DD"),
          files: fileList.map((file) => file.name),
          mark: values.mark,
        };

        if (modalState.mode === "edit") {
          await coreAxios.put(`/tasks/${modalState.taskId}`, taskData);
          message.success("Task updated successfully");
        } else {
          await coreAxios.post("/tasks", taskData);
          message.success("Task created successfully");
        }

        // Refresh tasks
        const res = await coreAxios.get("/tasks");
        setTasks(res.data);
        handleCloseModal();
      } catch (error) {
        message.error(
          modalState.mode === "edit"
            ? "Failed to update task"
            : "Failed to create task"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Formik for task submission
  const submissionFormik = useFormik({
    initialValues: {
      comments: "",
      submissionFiles: [],
    },
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        await coreAxios.post(`/tasks/${modalState.taskId}/submit`, {
          comments: values.comments,
          files: values.submissionFiles.map((file) => file.name),
        });
        message.success("Task submitted successfully");

        // Refresh tasks
        const res = await coreAxios.get("/tasks");
        setTasks(res.data);
        handleCloseModal();
      } catch (error) {
        message.error("Failed to submit task");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Modal handlers
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
      // Edit mode
      const taskToEdit = tasks.find((task) => task.id === taskId);
      if (taskToEdit) {
        taskFormik.setValues({
          title: taskToEdit.title,
          assignedTo: taskToEdit.assignedTo,
          notes: taskToEdit.notes,
          dueDate: dayjs(taskToEdit.dueDate),
          files: taskToEdit.files,
          mark: taskToEdit.mark,
        });
        setFileList(
          taskToEdit.files.map((file) => ({
            uid: file,
            name: file,
            status: "done",
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
      // Create mode
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
    submissionFormik.resetForm();
    setFileList([]);
  };

  // Task actions
  const deleteTask = async (taskId) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this task?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await coreAxios.delete(`/tasks/${taskId}`);
          setTasks(tasks.filter((task) => task.id !== taskId));
          message.success("Task deleted successfully");
        } catch (error) {
          message.error("Failed to delete task");
        }
      },
    });
  };

  const updateMark = async (taskId, newMark) => {
    try {
      await coreAxios.patch(`/tasks/${taskId}`, { mark: newMark });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, mark: newMark } : task
        )
      );
      message.success("Mark updated successfully");
    } catch (error) {
      message.error("Failed to update mark");
    }
  };

  // UI helpers
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

  // Table columns
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
      title: "Mark",
      dataIndex: "mark",
      key: "mark",
      render: (mark, record) => (
        <Rate
          value={mark}
          onChange={(value) => updateMark(record.id, value)}
          disabled={
            currentUserRole !== "admin" || record.status !== "completed"
          }
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {record.status !== "completed" && currentUserRole !== "admin" && (
            <Button
              type="link"
              onClick={() => showModal(record.id, true)}
              className="text-blue-500"
            >
              Submit
            </Button>
          )}

          {currentUserRole === "admin" && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => showModal(record.id)}
                className="text-gray-600"
              >
                Edit
              </Button>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => deleteTask(record.id)}
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
        {currentUserRole === "admin" && (
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
            rowKey="id"
            expandable={{
              expandedRowRender: (record) => (
                <div className="p-4 bg-gray-50">
                  <div className="mb-2">
                    <span className="font-semibold">Notes:</span>
                    <p className="mt-1">{record.notes}</p>
                  </div>
                  {record.files?.length > 0 && (
                    <div className="mb-2">
                      <span className="font-semibold">Attachments:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {record.files.map((file, index) => (
                          <Tag
                            key={`${record.id}-file-${index}`}
                            icon={<FileOutlined />}
                            className="cursor-pointer hover:bg-blue-50"
                          >
                            {file}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Created: {dayjs(record.createdAt).format("DD MMM YYYY")}
                  </div>
                </div>
              ),
            }}
          />
        </Card>
      )}

      {/* Task Create/Edit Modal */}
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
              style={{ height: 40 }} // Added fixed height
              dropdownStyle={{
                borderRadius: 8,
                padding: 8,
              }}
              optionLabelProp="label" // This ensures the selected value shows properly
            >
              {users.map((user) => (
                <Option
                  key={user._id}
                  value={user._id}
                  user={user}
                  label={user.fullName} // This will be shown in the select field
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={user.image}
                      icon={<UserOutlined />}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      {" "}
                      {/* Added min-w-0 to prevent overflow */}
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

          {currentUserRole === "admin" && (
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
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              multiple
            >
              <Button icon={<UploadOutlined />}>Select Files</Button>
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

      {/* Task Submission Modal */}
      <Modal
        title="Submit Task"
        open={modalState.visible && modalState.isSubmission}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={submissionFormik.handleSubmit}>
          <Form.Item label="Comments">
            <TextArea
              name="comments"
              value={submissionFormik.values.comments}
              onChange={submissionFormik.handleChange}
              rows={4}
              placeholder="Add your comments..."
            />
          </Form.Item>

          <Form.Item label="Submission Files">
            <Upload
              fileList={submissionFormik.values.submissionFiles}
              onChange={({ fileList }) =>
                submissionFormik.setFieldValue("submissionFiles", fileList)
              }
              beforeUpload={() => false}
              multiple
            >
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
          </Form.Item>

          <Form.Item className="text-right">
            <Button onClick={handleCloseModal} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Submit Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
