import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { coreAxios } from "../../utilities/axios";
import {
  Alert,
  Button,
  DatePicker,
  Input,
  InputNumber,
  QRCode,
  Radio,
  Select,
  Spin,
  Upload,
} from "antd";
import "antd/dist/reset.css";
import html2pdf from "html2pdf.js"; // Ensure Ant Design styles are included
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import DMFLogo from "../../images/New-Main-2.png";
import { formatDate } from "../../utilities/dateFormate";

const { Option } = Select;

const PublicScholarship = ({ onHide, fetchRolls, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isApplicationShow, setIsApplicationShow] = useState(true);

  const formik = useFormik({
    initialValues: {
      name: "",
      parentName: "",
      institute: "",
      instituteClass: "",
      instituteRollNumber: "",
      gender: "",
      phone: 0,
      bloodGroup: "",
      presentAddress: "",
      dateOfBirth: "2025-04-18",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (!fileList.length) {
          const allData = {
            ...values,
            image:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_JmAXuH2Myq0ah2g_5ioG6Ku7aR02-mcvimzwFXuD25p2bjx7zhaL34oJ7H9khuFx50&usqp=CAU",
          };
          console.log("allData", allData);

          const res = await coreAxios.post(`/scholarship-info`, allData);
          if (res?.status === 201) {
            setLoading(false);
            toast.success("Successfully Saved!");
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
              dateOfBirth: "2025-04-18",
            };
            console.log("allData", allData);

            const res = await coreAxios.post(`/scholarship-info`, allData);
            if (res?.status === 201) {
              setLoading(false);

              toast.success(
                `SuccessFully Saved!! & Your Scholarship Roll No is ${res.data?.scholarshipRollNumber}. Please note this for future use`,
                {
                  autoClose: 30000,
                  draggable: false,
                  closeOnClick: false,
                }
              );
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
      label: "Student Name",
      component: Input,
      required: true,
    },
    {
      id: "parentName",
      name: "parentName",
      type: "text",
      label: "Parent Name",
      component: Input,
      required: true,
    },
    {
      id: "institute",
      name: "institute",
      type: "text",
      label: "Institute Name",
      component: Input,
      required: true,
    },
    {
      id: "instituteClass",
      name: "instituteClass",
      type: "text",
      label: "Institute Class",
      component: Input,
      required: true,
    },
    {
      id: "instituteRollNumber",
      name: "instituteRollNumber",
      type: "text",
      label: "Institute Roll",
      component: Input,
      required: true,
    },
    {
      id: "phone",
      name: "phone",
      type: "number",
      label: "Phone Number",
      component: InputNumber,
      required: false,
    },
    {
      id: "bloodGroup",
      name: "bloodGroup",
      type: "text",
      label: "Blood Group",
      component: Input,
      required: false,
    },
    {
      id: "presentAddress",
      name: "presentAddress",
      type: "text",
      label: "Present Address",
      component: Input,
      required: true,
    },
  ];
  const instructions = [
    "পরীক্ষার সময় ৮০ মিনিট।",
    "পরীক্ষা সকাল ১০:০০ টায় শুরু হবে।",
    "পরীক্ষার কেন্দ্রে ৩০ মিনিট আগে উপস্থিত হতে হবে।",
    "প্রশ্নপত্রের প্রতিটি প্রশ্ন পড়ুন এবং উত্তর দেওয়ার আগে ভালোভাবে বুঝে নিন।",
    "অনতিবিলম্বে আপনার উত্তরপত্র জমা দিন পরীক্ষার শেষে।",
    "পরীক্ষার সময় মোবাইল ফোন এবং অন্যান্য বৈদ্যুতিন ডিভাইস ব্যবহার করা নিষেধ।",
    "পরীক্ষার নিয়ম এবং নির্দেশাবলী অনুসরণ করুন।",
    "প্রশ্নপত্রে যে কোন অস্পষ্টতা থাকলে পরীক্ষককে জানান।",
    "আপনার পরীক্ষা সনদ এবং প্রয়োজনীয় ডকুমেন্ট সঙ্গে রাখুন।",
  ];

  // scholarship roll wise scholarship get
  const [scholarshipRollNumber, setScholarshipRollNumber] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleFetchData = async () => {
    setLoading(true);
    setError("");
    try {
      setLoading(true);
      const response = await coreAxios.get(
        `/scholarship-roll-info/${scholarshipRollNumber}`
      );
      if (response?.status === 200) {
        setLoading(false);
        setData(response.data);
        setScholarshipRollNumber("");
      }

      //   toast.success("Data fetched successfully!");
    } catch (err) {
      setLoading(false);
      setError("Failed to fetch data. Please try again.");
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };
  const downloadPDF = () => {
    const element = document.getElementById("admit-card");
    const options = {
      margin: 0.5,
      filename: `Admit-card-${data?.name}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };
  return (
    <div>
      <div style={{ background: "#BDDE98" }}>
        <h2
          className="text-white font-semibold text-2xl md:text-[33px] py-4 lg:py-12 xl:py-12 text-center bangla-text"
          style={{ color: "#2F5811" }}>
          শিক্ষা বৃত্তি
        </h2>
      </div>

      <div>
        <Alert
          message={`গুরুত্বপূর্ণ ঘোষণা: শিহ্মাবৃত্তি ২০২৪ এর সকল আবেদন নেয়ার সময় শেষ হয়ে গিয়েছে,আপনি কোন কারণে আবেদন করতে না পেরে থাকলে দ্রুত আমাদের সাথে যোগাযোগ করুন `}
          description=""
          type="info"
          showIcon
          className="mb-2 mx-8"
        />
        <div className="flex justify-center gap-2 mt-4">
          <Button
            onClick={() => {
              setIsApplicationShow(false);
            }}
            type="primary"
            htmlType="submit"
            className="bg-green-600 text-white text-lg hover:bg-green-700">
            Application Create
          </Button>
          <Button
            onClick={() => {
              setIsApplicationShow(true);
            }}
            type="primary"
            htmlType="submit"
            className="bg-green-600 text-white text-lg hover:bg-green-700">
            Application View
          </Button>
        </div>
      </div>

      {isApplicationShow ? (
        <div className="mt-8">
          <div className="p-4  bg-white shadow-md rounded-lg">
            <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-24">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
                এডমিট কার্ড ডাউনলোড করতে চাইলে নিচে আপনার স্কলারশিপ রোল নম্বরটি
                প্রদান করুন
              </h2>
              <div className="mb-4 max-w-md mx-auto">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  স্কলারশিপ রোল নাম্বার
                </label>
                <input
                  type="text"
                  value={scholarshipRollNumber}
                  onChange={(e) => setScholarshipRollNumber(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* <button
                onClick={handleFetchData}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                disabled={loading}>
                {loading ? "লোড হচ্ছে..." : "তথ্য সংগ্রহ করুন"}
              </button> */}

              <div className="flex justify-center">
                <Button
                  loading={loading}
                  onClick={handleFetchData}
                  type="primary"
                  htmlType="submit"
                  className="bg-green-600 text-white text-lg hover:bg-green-700">
                  Submit
                </Button>
              </div>
            </div>

            <div>
              <div className="layout-invoice-page mx-28">
                <div className="flex gap-8 w-full mt-8 mx-0">
                  {data && (
                    <Button
                      type="primary"
                      onClick={downloadPDF}
                      className="p-mr-2"
                      icon={<DownloadOutlined />}>
                      Download Admit Card
                    </Button>
                  )}
                </div>
              </div>

              <div
                id="admit-card"
                className="layout-invoice-content w-full mt-4  print:!bg-white">
                <div className="p-8">
                  {/* Top */}
                  <div className="flex items-center justify-between ">
                    <img src={DMFLogo} alt="logo" className="w-[230px]  " />

                    <QRCode
                      type="svg"
                      value={data?.scholarshipRollNumber}
                      size={100}
                    />
                  </div>
                  {/* END TOP */}

                  {/* <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "20%", width: "20%" }}
                    value={"test"}
                    viewBox={`0 0 256 256`}
                  /> */}

                  {/* Header */}
                  <div className="text-center">
                    <p className="text-3xl font-bold uppercase underline">
                      DMF Scholarship 2025
                    </p>
                    <p className="text-xl font-bold pt-4">
                      ( 18 April 2025 Examination )
                    </p>
                  </div>
                  {/* END Header */}

                  <div className="grid grid-cols-12 mt-10 gap-4">
                    <div className="col-span-9">
                      <table className="w-full text-[12px] border-collapse">
                        <colgroup>
                          <col style={{ width: "23%" }} />
                          <col style={{ width: "33%" }} />
                          <col style={{ width: "22%" }} />
                          <col style={{ width: "22%" }} />
                        </colgroup>
                        <tbody>
                          <tr>
                            <td className="border border-black py-2 px-3 uppercase">
                              Roll Number
                            </td>
                            <td className="border border-black py-2 px-3 font-semibold">
                              {data?.scholarshipRollNumber}
                            </td>
                            <td className="border border-black py-2 px-3"></td>
                            <td className="border border-black py-2 px-3"></td>
                          </tr>
                          <tr>
                            <td className="border border-black py-2 px-3 uppercase">
                              Name
                            </td>
                            <td className="border border-black py-2 px-3 uppercase">
                              {data?.name}
                            </td>
                            <td className="border border-black py-2 px-3 uppercase">
                              Class
                            </td>
                            <td className="border border-black py-2 px-3">
                              {data?.instituteClass}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black py-2 px-3 uppercase">
                              DOB
                            </td>
                            <td className="border border-black py-2 px-3 uppercase">
                              {formatDate(data?.dateOfBirth)}
                            </td>
                            <td className="border border-black py-2 px-3">
                              GENDER
                            </td>
                            <td className="border border-black py-2 px-3 uppercase">
                              {data?.gender}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black py-2 px-3 uppercase">
                              Parent Name
                            </td>
                            <td className="border border-black py-2 px-3 uppercase">
                              {data?.parentName}
                            </td>
                            <td className="border border-black py-2 px-3 uppercase">
                              Blood Group
                            </td>
                            <td className="border border-black py-2 px-3 uppercase">
                              {data?.bloodGroup}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black py-2 px-3 uppercase">
                              PHONE NUMBER
                            </td>
                            <td
                              className="border border-black py-2 px-3 uppercase"
                              colSpan={3}>
                              {typeof data?.phone === "string" &&
                              data?.phone?.startsWith("0")
                                ? data?.phone
                                : `0${data?.phone}`}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black py-2 px-3 uppercase">
                              ADDRESS
                            </td>
                            <td
                              className="border border-black py-2 px-3 uppercase"
                              colSpan={3}>
                              {data?.presentAddress}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black py-2 px-3 uppercase">
                              Institute
                            </td>
                            <td
                              className="border border-black py-2 px-3 uppercase"
                              colSpan={3}>
                              {data?.institute}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black py-2 px-3 uppercase">
                              Institute Roll No.
                            </td>
                            <td
                              className="border border-black py-2 px-3 uppercase"
                              colSpan={3}>
                              {data?.instituteRollNumber}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-black py-2 px-3 uppercase">
                              EXAM CENTER
                            </td>
                            <td
                              className="border border-black py-2 px-3 uppercase"
                              colSpan={3}>
                              Takter Chala Sabuj Bangla High School,Takter
                              chala, Sakhipur, Tangail
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-span-3 flex flex-col items-center justify-center">
                      <img
                        src={data?.image || DMFLogo}
                        alt="User"
                        className="w-56 h-56 border py-2"
                      />
                      <p className="font-semibold text-2xl text-center pt-6">
                        ADMIT CARD
                      </p>
                    </div>
                  </div>

                  {/* Start Instruction */}

                  <div className="mt-8">
                    <p className="font-bold text-xl">Exam Instructions:</p>
                    <table className="w-full text-[12px] mt-3 border-collapse">
                      <colgroup>
                        <col style={{ width: "3%" }} />
                        <col style={{ width: "97%" }} />
                      </colgroup>
                      <tbody>
                        {instructions?.map((value, index) => {
                          const serialNumber = index + 1;
                          return (
                            <tr key={index}>
                              <td className="py-2 px-3 text-center">
                                {serialNumber}
                              </td>
                              <td className=" py-2 px-3 uppercase">{value}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* End Instruction */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md mx-8 lg:mx-24 xl:mx-24 mt-12">
          <div className="text-lg font-semibold mb-4 text-center text-blue-600">
            আবেদন করার নির্দেশিকা
          </div>
          <div className="text-lg mb-6 text-gray-700">
            <p>১. সকল তথ্য সঠিকভাবে পূরণ করুন।</p>
            <p>২. প্রয়োজনীয় কাগজপত্র আপলোড করুন।</p>
            <p>
              ৩. ফর্ম সাবমিট করার পর নিশ্চিত করুন যে সকল তথ্য সঠিকভাবে জমা
              হয়েছে।
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
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
                    {/* <div className="w-full mb-4">
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
                    </div> */}
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

                <div className="flex justify-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-green-600 text-white text-lg hover:bg-green-700">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicScholarship;
