import React, { useEffect, useState } from "react";
import { Button, Spin, Alert } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { coreAxios } from "../../utilities/axios";
import CreateCourse from "./CreateCourse";

export default function UpdateCoursePage() {
  const history = useHistory();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [instructors, setInstructors] = useState([]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const [courseRes, usersRes] = await Promise.all([
        coreAxios.get(`/courses/${courseId}`),
        coreAxios.get("/users"),
      ]);
      setCourseData(courseRes?.data?.course || null);
      setInstructors(usersRes?.data || []);
    } catch (error) {
      toast.error("Course data load করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handleClose = () => {
    history.push("/dashboard/courseDashboard");
  };

  if (loading) {
    return (
      <Spin tip="Loading course...">
        <Alert
          message="Course edit data loading"
          description="Please wait a moment."
          type="info"
        />
      </Spin>
    );
  }

  if (!courseData) {
    return (
      <div className="p-4">
        <p className="mb-4">Course পাওয়া যায়নি।</p>
        <Button type="primary" onClick={handleClose}>
          Back to Course Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <div className="mb-4">
        <Button onClick={handleClose}>Back</Button>
      </div>
      <CreateCourse
        handleCancel={handleClose}
        instructors={instructors}
        initialData={courseData}
        mode="edit"
      />
    </div>
  );
}
