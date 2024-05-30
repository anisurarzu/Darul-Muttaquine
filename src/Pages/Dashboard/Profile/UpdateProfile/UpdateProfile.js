import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Alert, Button, DatePicker, Spin, Upload } from "antd";

import { coreAxios } from "../../../../utilities/axios";

import dayjs from "dayjs";

const UpdateProfile = ({ handleCancel }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const res = await coreAxios.get(`userinfo`);
      if (res?.status === 200) {
        setLoading(false);
        setUserData(res?.data);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      username: userData?.username || "",
      image: userData?.image || "",
      phone: userData?.phone || "",
      email: userData?.email || "",
      bloodGroup: userData?.bloodGroup || "",
      gender: userData?.gender || "",
      currentAddress: userData?.currentAddress || "",
      permanentAddress: userData?.permanentAddress || "",
      birthDate: userData?.birthDate ? dayjs(userData?.birthDate) : null,
      profession: userData?.profession || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        let allData = { ...values, birthDate: values.birthDate?.toISOString() };

        if (fileList.length > 0) {
          const formData = new FormData();
          fileList.forEach((file) => {
            formData.append("image", file.originFileObj);
          });

          const response = await axios.post(
            "https://api.imgbb.com/1/upload?key=5bdcb96655462459d117ee1361223929",
            formData
          );

          if (response?.status === 200) {
            allData.image = response?.data?.data?.display_url;
          }
        }

        const res = await coreAxios.post(`/update-user`, allData);
        if (res?.status === 200) {
          toast.success("Successfully Updated!");
          formik.resetForm();
          setFileList([]);
          handleCancel();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Server Error");
      } finally {
        setLoading(false);
      }
    },
  });

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const imgWindow = window.open(src);
    imgWindow?.document.write(`<img src="${src}" alt="Preview" />`);
  };

  const inputData = [
    {
      id: "firstName",
      name: "firstName",
      type: "text",
      label: "First Name",
      required: true,
    },
    {
      id: "lastName",
      name: "lastName",
      type: "text",
      label: "Last Name",
      required: true,
    },
    {
      id: "username",
      name: "username",
      type: "text",
      label: "User Name",
      required: true,
    },
    {
      id: "phone",
      name: "phone",
      type: "number",
      label: "Phone",
      required: true,
    },
    {
      id: "gender",
      name: "gender",
      type: "text",
      label: "Gender",
      required: true,
    },
    {
      id: "bloodGroup",
      name: "bloodGroup",
      type: "text",
      label: "Blood Group",
      required: false,
    },
    {
      id: "email",
      name: "email",
      type: "email",
      label: "Email",
      required: true,
    },
    {
      id: "currentAddress",
      name: "currentAddress",
      type: "text",
      label: "Current Address",
      required: true,
    },
    {
      id: "permanentAddress",
      name: "permanentAddress",
      type: "text",
      label: "Permanent Address",
      required: true,
    },
    {
      id: "profession",
      name: "profession",
      type: "text",
      label: "Profession",
      required: true,
    },
  ];

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={formik.handleSubmit}>
          {loading ? (
            <Spin tip="Loading...">
              <Alert
                message="Loading..."
                description="Fetching user data."
                type="info"
              />
            </Spin>
          ) : (
            <div className="p-6.5 pt-1 px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
              {inputData?.map(({ id, name, type, label, required }) => (
                <div key={id} className="w-full mb-4">
                  <label className="block text-black dark:text-white">
                    {label} {required && <span className="text-meta-1">*</span>}
                  </label>
                  <input
                    id={id}
                    name={name}
                    type={type}
                    required={required}
                    onChange={formik.handleChange}
                    value={formik.values[id]}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              ))}
              <div className="w-full mb-4">
                <label className="block text-black dark:text-white">
                  Birth Date <span className="text-meta-1">*</span>
                </label>
                <DatePicker
                  value={formik.values.birthDate}
                  onChange={(date) => formik.setFieldValue("birthDate", date)}
                  className="w-full"
                />
              </div>
            </div>
          )}
          <div className="p-1">
            <Upload
              action=""
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              beforeUpload={() => false}>
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1">
            <div></div>
            <button
              type="submit"
              className="justify-center rounded bg-primary p-3 font-medium text-gray border border-green-600 m-4 rounded hover:bg-green-600 hover:text-white hover:shadow-md">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
