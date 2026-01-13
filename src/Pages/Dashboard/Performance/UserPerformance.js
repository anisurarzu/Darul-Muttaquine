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
  Grid,
  Tooltip,
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
  FilterOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { coreAxios } from "../../../utilities/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { TextArea } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
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
  const [filters, setFilters] = useState({
    status: null,
    dateRange: null,
  });
  const screens = useBreakpoint();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isSuperAdmin = userInfo?.userRole === "Super-Admin";
  const currentUserId = userInfo?._id;

  const fetchTasks = async () => {
    try {
      setLoading((prev) => ({ ...prev, tasks: true }));
      const endpoint = isSuperAdmin ? "/tasks" : `/tasks/user/${currentUserId}`;
      const response = await coreAxios.get(endpoint);

      // Reverse the array so last-added data comes first
      const reversedTasks = response.data.slice().reverse();

      setTasks(reversedTasks);
      setFilteredTasks(reversedTasks); // Initialize filtered tasks with reversed list
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

  // Apply filters when tasks or filters change
  useEffect(() => {
    let result = [...tasks];

    // Status filter
    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      result = result.filter((task) => {
        const taskDate = dayjs(task.createdAt);
        return taskDate.isAfter(start) && taskDate.isBefore(end);
      });
    }

    // For non-super-admin, filter by assigned tasks
    if (!isSuperAdmin) {
      result = result.filter((task) => {
        const assignedTo = task.assignedTo;
        // Handle both array (legacy) and string formats
        if (Array.isArray(assignedTo)) {
          return assignedTo.includes(currentUserId);
        }
        return assignedTo === currentUserId;
      });
    }

    setFilteredTasks(result);
  }, [tasks, filters, isSuperAdmin, currentUserId]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=5bdcb96655462459d117ee1361223929",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status === 200) {
        return result.data.url;
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
      onSuccess({ url }, file);
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

        // Upload new files first
        const uploadPromises = fileList
          .filter(
            (file) => file.originFileObj && !file.url && !file.response?.url
          )
          .map((file) => handleUpload(file.originFileObj));

        const uploadedUrls = await Promise.all(uploadPromises);

        // Create a mapping of originFileObj to uploaded URLs
        const urlMap = {};
        fileList.forEach((file, index) => {
          if (file.originFileObj && !file.url && !file.response?.url) {
            urlMap[file.uid] = uploadedUrls[index];
          }
        });

        // Process all files to get URLs
        const fileUrls = fileList
          .map((file) => {
            if (file.url) return file.url;
            if (file.response?.url) return file.response.url;
            if (urlMap[file.uid]) return urlMap[file.uid];
            return null;
          })
          .filter((url) => url);

        const selectedUser = users.find((u) => u._id === values.assignedTo);

        const taskData = {
          title: values.title,
          status: values.status,
          assignedTo: values.assignedTo,
          assignedToName: selectedUser?.fullName,
          assignedToImage: selectedUser?.image,
          notes: values.notes,
          dueDate: values.dueDate.format("YYYY-MM-DD"),
          files: fileUrls,
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
      const now = new Date().toISOString();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, status: "completed", completedAt: now }
            : task
        )
      );

      await coreAxios.put(`/tasks/${taskId}/complete`, { completedAt: now });
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
        // Handle both single user (string) and multiple users (array) - convert array to single
        const assignedToValue = Array.isArray(taskToEdit.assignedTo) 
          ? taskToEdit.assignedTo[0] 
          : taskToEdit.assignedTo;
        
        taskFormik.setValues({
          title: taskToEdit.title,
          assignedTo: assignedToValue,
          notes: taskToEdit.notes,
          dueDate: dayjs(taskToEdit.dueDate),
          mark: taskToEdit.mark,
          status: taskToEdit.status,
        });

        // Handle files safely
        setFileList(
          (taskToEdit.files || [])
            .filter((file) => typeof file === "string")
            .map((file) => ({
              uid: file,
              name: file.split("/").pop() || "file",
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

  const handleStatusFilter = (status) => {
    setFilters((prev) => ({ ...prev, status: status || null }));
  };

  const handleDateRangeFilter = (dates) => {
    setFilters((prev) => ({ ...prev, dateRange: dates || null }));
  };

  const resetFilters = () => {
    setFilters({
      status: null,
      dateRange: null,
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{text}</span>
          {!screens.md && (
            <span className="text-xs text-gray-500">
              {record.assignedToName.split(" ")[0]}
            </span>
          )}
        </div>
      ),
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
          {screens.md && <span>{text}</span>}
        </div>
      ),
      responsive: ["md"],
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text) =>
        dayjs(text).format(screens.md ? "DD MMM YYYY" : "DD/MM"),
    },
    {
      title: "Completed Date",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (text) =>
        text ? dayjs(text).format(screens.md ? "DD MMM YYYY" : "DD/MM") : "-",
      responsive: ["md"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Pending", value: "pending" },
        { text: "In Progress", value: "in-progress" },
        { text: "Completed", value: "completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Mark",
      dataIndex: "mark",
      key: "mark",
      render: (mark) => <span>{mark}/5</span>,
      responsive: ["md"],
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
          count={screens.md ? 5 : 3}
        />
      ),
      responsive: ["sm"],
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
                (Array.isArray(record.assignedTo) 
                  ? !record.assignedTo.includes(currentUserId)
                  : record.assignedTo !== currentUserId)
              }
              size={screens.md ? "default" : "small"}
              className="bg-green-600 hover:bg-green-700 border-green-600"
            >
              {screens.md ? "Complete Task" : "Complete"}
            </Button>
          )}

          {isSuperAdmin && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => showModal(record._id)}
                className="text-gray-600"
                size={screens.md ? "default" : "small"}
              >
                {screens.md && "Edit"}
              </Button>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => deleteTask(record._id)}
                className="text-red-500"
                size={screens.md ? "default" : "small"}
              >
                {screens.md && "Delete"}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    return (
      <div className="p-3 md:p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
        <div className="mb-2">
          <span className="font-semibold">Notes:</span>
          <p className="mt-1">{record.notes || "No notes provided"}</p>
        </div>
        {record.files?.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold">Attachments:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {record.files
                .filter((file) => typeof file === "string")
                .map((file, index) => (
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
                      {file.split("/").pop()}
                    </Tag>
                  </a>
                ))}
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
                  {record.submission.files
                    .filter((file) => typeof file === "string")
                    .map((file, index) => (
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
                          {file.split("/").pop()}
                        </Tag>
                      </a>
                    ))}
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
          Created: {dayjs(record.createdAt).format("DD MMM YYYY HH:mm")}
        </div>
        {record.completedAt && (
          <div className="text-sm text-gray-500 mt-1">
            Completed: {dayjs(record.completedAt).format("DD MMM YYYY HH:mm")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-3 md:py-4 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header Section */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">
          Task Management
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Manage and track tasks efficiently
        </p>
      </div>

      {/* Filter Section */}
      <Card 
        className="mb-4 shadow-lg border-0 rounded-2xl"
        bodyStyle={{ padding: "16px" }}
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-green-600">
            <FilterOutlined className="text-lg" />
            <span className="font-semibold text-base">Filters:</span>
          </div>

          <Select
            placeholder="Filter by Status"
            allowClear
            onChange={handleStatusFilter}
            value={filters.status}
            style={{ width: screens.md ? 200 : 150 }}
            size={screens.md ? "default" : "middle"}
            className="rounded-lg"
          >
            <Option value="pending">Pending</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>

          <RangePicker
            placeholder={["Start Date", "End Date"]}
            onChange={handleDateRangeFilter}
            value={filters.dateRange}
            style={{ width: screens.md ? 300 : 200 }}
            size={screens.md ? "default" : "middle"}
            className="rounded-lg"
          />

          <Button
            onClick={resetFilters}
            size={screens.md ? "default" : "middle"}
            className="rounded-lg"
          >
            Reset Filters
          </Button>
          {isSuperAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              size={screens.md ? "default" : "small"}
              className="bg-green-600 hover:bg-green-700 border-green-600 rounded-lg shadow-md"
            >
              {screens.md ? "Create Task" : "Create"}
            </Button>
          )}
        </div>
      </Card>

      {loading.tasks || loading.users ? (
        <>
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
        </>
      ) : (
        <Card 
          className="shadow-lg border-0 rounded-2xl"
          bodyStyle={{ padding: "16px" }}
        >
          <Table
            columns={columns}
            dataSource={filteredTasks}
            rowKey="_id"
            loading={loading.tasks}
            expandable={{
              expandedRowRender,
            }}
            scroll={{ x: 800 }}
            size="middle"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} tasks`,
              className: "mt-4",
            }}
            className="rounded-lg"
          />
        </Card>
      )}

      <Modal
        title={
          <div className="text-xl md:text-2xl font-bold text-gray-800">
            {modalState.mode === "edit" ? "Edit Task" : "Create New Task"}
          </div>
        }
        open={modalState.visible && !modalState.isSubmission}
        onCancel={handleCloseModal}
        footer={null}
        width={screens.md ? 800 : "95%"}
        destroyOnClose
        className="rounded-2xl"
        styles={{
          content: {
            borderRadius: '1rem',
          }
        }}
      >
        <Form layout="vertical" onFinish={taskFormik.handleSubmit} className="mt-2">
          <Form.Item
            label={<span className="font-semibold text-base">Task Title</span>}
            required
            validateStatus={taskFormik.errors.title ? "error" : ""}
            help={taskFormik.errors.title}
          >
            <Input
              name="title"
              value={taskFormik.values.title}
              onChange={taskFormik.handleChange}
              placeholder="Enter task title"
              size={screens.md ? "default" : "large"}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-base">Assign To</span>}
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
                  userData.name?.toLowerCase().includes(searchText) ||
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
              size={screens.md ? "default" : "large"}
              optionLabelProp="label"
            >
              {users.map((user) => (
                  <Option
                    key={user._id}
                    value={user._id}
                    user={user}
                    label={
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={user.image}
                          icon={<UserOutlined />}
                          size="small"
                          className="w-6 h-6"
                        />
                        <span>{user.fullName}</span>
                      </div>
                    }
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
                        {screens.md && (
                          <div className="text-xs text-gray-500 truncate">
                            {user.uniqueId} • {user.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item 
            label={<span className="font-semibold text-base">Status</span>} 
            required
          >
            <Select
              name="status"
              value={taskFormik.values.status}
              onChange={(value) => taskFormik.setFieldValue("status", value)}
              size={screens.md ? "default" : "large"}
              className="rounded-lg"
            >
              <Option value="pending">Pending</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-base">Due Date</span>}
            required
            validateStatus={taskFormik.errors.dueDate ? "error" : ""}
            help={taskFormik.errors.dueDate}
          >
            <DatePicker
              name="dueDate"
              value={taskFormik.values.dueDate}
              onChange={(date) => taskFormik.setFieldValue("dueDate", date)}
              style={{ width: "100%" }}
              size={screens.md ? "default" : "large"}
              className="rounded-lg w-full"
            />
          </Form.Item>

          {isSuperAdmin && (
            <Form.Item
              label={<span className="font-semibold text-base">Mark (0-5)</span>}
              validateStatus={taskFormik.errors.mark ? "error" : ""}
              help={taskFormik.errors.mark}
            >
              <Rate
                name="mark"
                value={taskFormik.values.mark}
                onChange={(value) => taskFormik.setFieldValue("mark", value)}
                count={5}
                className="text-green-600"
              />
            </Form.Item>
          )}

          <Form.Item label={<span className="font-semibold text-base">Notes</span>}>
            <TextArea
              name="notes"
              value={taskFormik.values.notes}
              onChange={taskFormik.handleChange}
              rows={4}
              placeholder="Additional instructions..."
              size={screens.md ? "default" : "large"}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item label={<span className="font-semibold text-base">Attachments</span>}>
            <Upload
              customRequest={customRequest}
              fileList={fileList}
              onChange={({ fileList: updatedFileList }) => {
                const safeFileList = updatedFileList.map((file) => ({
                  ...file,
                  name:
                    file.name || (file.url || "").split("/").pop() || "file",
                  url: file.url || file.response?.url,
                }));
                setFileList(safeFileList);
              }}
              multiple
              listType={screens.md ? "picture" : "text"}
              beforeUpload={() => false}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                size={screens.md ? "default" : "large"}
              >
                Upload Files
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item className="text-right mt-4">
            <Button
              onClick={handleCloseModal}
              className="mr-3 rounded-lg"
              size={screens.md ? "default" : "large"}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              size={screens.md ? "default" : "large"}
              className="bg-green-600 hover:bg-green-700 border-green-600 rounded-lg shadow-md"
            >
              {modalState.mode === "edit" ? "Update Task" : "Create Task"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
