import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { coreAxios } from "../../utilities/axios";
import { Alert, Button, DatePicker, Radio, Spin, Upload, Switch } from "antd";
import moment from "moment";

const ScholarshipUpdate = ({
  onHide,
  fetchRolls,
  handleCancel,
  scholarshipData,
  isUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: scholarshipData?.name || "",
      parentName: scholarshipData?.parentName || "",
      institute: scholarshipData?.institute || "",
      instituteClass: scholarshipData?.instituteClass || "",
      instituteRollNumber: scholarshipData?.instituteRollNumber || "",
      gender: scholarshipData?.gender || "",
      phone: scholarshipData?.phone || 0,
      bloodGroup: scholarshipData?.bloodGroup || "",
      presentAddress: scholarshipData?.presentAddress || "",
      dateOfBirth: scholarshipData?.dateOfBirth
        ? moment(scholarshipData.dateOfBirth)
        : null,
      isSmsSend: scholarshipData?.isSmsSend || false, // New field
      isSeatPlaned: scholarshipData?.isSeatPlaned || false, // New field
      isAttendanceComplete: scholarshipData?.isAttendanceComplete || false, // New field
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);

        if (!fileList.length) {
          const allData = {
            ...values,
            image:
              scholarshipData?.image ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_JmAXuH2Myq0ah2g_5ioG6Ku7aR02-mcvimzwFXuD25p2bjx7zhaL34oJ7H9khuFx50&usqp=CAU",
          };
          console.log("allData", allData);

          const res = await coreAxios.put(
            `/scholarship-info/${scholarshipData._id}`,
            allData
          );
          if (res?.status === 200) {
            setLoading(false);
            toast.success("Successfully Update!");
            formik.resetForm();
            setFileList([]);
            handleCancel();
          }
        } else {
          const formData = new FormData();
          fileList.forEach((file) => {
            formData.append("image", file.originFileObj);
          });

          const response = await axios.post(
            "https://api.imgbb.com/1/upload?key=5bdcb96655462459d117ee1361223929",
            formData
          );
          if (response?.status === 200) {
            console.log("response", response?.data?.data?.display_url);
            const allData = {
              ...values,
              image: response?.data?.data?.display_url,
            };
            const res = await coreAxios.put(
              `/scholarship-info/${scholarshipData._id}`,
              allData
            );

            if (res?.status === 200) {
              setLoading(false);
              toast.success("Successfully Updated!");
              formik.resetForm();
              setFileList([]);
              handleCancel();
            }
          }
        }
      } catch (err) {
        setLoading(false);
        toast.error(err?.response?.data?.message);
      }
    },
    enableReinitialize: true,
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
      id: "name",
      name: "name",
      type: "text",
      label: "Student Name ",
      required: true,
    },
    {
      id: "parentName",
      name: "parentName",
      type: "text",
      label: "Parent Name",
      required: true,
    },
    {
      id: "institute",
      name: "institute",
      type: "text",
      label: "Institute Name",
      required: true,
    },
    {
      id: "instituteClass",
      name: "instituteClass",
      type: "text",
      label: "Institute Class",
      required: true,
    },
    {
      id: "instituteRollNumber",
      name: "instituteRollNumber",
      type: "text",
      label: "Institute Roll",
      required: true,
    },
    {
      id: "phone",
      name: "phone",
      type: "text",
      label: "Phone Number",
      required: false,
    },
    {
      id: "bloodGroup",
      name: "bloodGroup",
      type: "text",
      label: "Blood Group",
      required: false,
    },
    {
      id: "presentAddress",
      name: "presentAddress",
      type: "text",
      label: "Present Address",
      required: true,
    },
  ];

  return (
    <div className="">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form className="p-6.5 pt-1 px-1 " onSubmit={formik.handleSubmit}>
          <div>
            {loading ? (
              <Spin tip="Loading...">
                <Alert
                  message="Alert message title"
                  description="Further details about the context of this alert."
                  type="info"
                />
              </Spin>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
                {inputData?.map(({ id, name, type, label, required }) => (
                  <div className="w-full mb-4" key={id}>
                    <label className="block text-black dark:text-black">
                      {label}{" "}
                      {required && <span className="text-meta-1">*</span>}
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
                  <label className="block text-black dark:text-black">
                    Gender <span className="text-meta-1">*</span>
                  </label>
                  <Radio.Group
                    name="gender"
                    onChange={formik.handleChange}
                    value={formik.values.gender}>
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                    <Radio value="other">Other</Radio>
                  </Radio.Group>
                </div>

                <div className="w-full mb-4">
                  <label className="block text-black dark:text-black">
                    Birth Date <span className="text-meta-1">*</span>
                  </label>
                  <DatePicker
                    value={formik.values.dateOfBirth}
                    onChange={(date) =>
                      formik.setFieldValue("dateOfBirth", date)
                    }
                    className="w-full"
                  />
                </div>

                {/* New Switch Field */}
                <div className="w-full mb-4">
                  <label className="block text-black dark:text-black">
                    SMS Send <span className="text-meta-1">*</span>
                  </label>
                  <Switch
                    checked={formik.values.isSmsSend}
                    onChange={(checked) =>
                      formik.setFieldValue("isSmsSend", checked)
                    }
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="block text-black dark:text-black">
                    Seat Planed? <span className="text-meta-1">*</span>
                  </label>
                  <Switch
                    checked={formik.values.isSeatPlaned}
                    onChange={(checked) =>
                      formik.setFieldValue("isSeatPlaned", checked)
                    }
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="block text-black dark:text-black">
                    IS Attendance Complete{" "}
                    <span className="text-meta-1">*</span>
                  </label>
                  <Switch
                    checked={formik.values.isAttendanceComplete}
                    onChange={(checked) =>
                      formik.setFieldValue("isAttendanceComplete", checked)
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <Upload
            action=""
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            beforeUpload={() => false}>
            {fileList.length < 5 && "+ Upload"}
          </Upload>

          {/* Submit Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-1 ">
            <div></div>

            <button
              type="submit"
              className="justify-center rounded bg-primary p-3 font-medium text-gray border border-green-600 m-4 hover:bg-green-600 hover:text-white hover:shadow-md">
              {isUpdate ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScholarshipUpdate;
