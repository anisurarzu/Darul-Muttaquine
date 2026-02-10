import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { coreAxios } from "../../utilities/axios";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Input,
  InputNumber,
  QRCode,
  Radio,
  Row,
  Col,
  Spin,
  Upload,
  Typography,
  Steps,
  Divider,
  Statistic,
  Badge,
  Modal
} from "antd";
import "antd/dist/reset.css";
import html2pdf from "html2pdf.js";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  DownloadOutlined,
  FormOutlined,
  EyeOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CopyOutlined
} from "@ant-design/icons";
import DMFLogo from "../../images/New-Main-2.png";
import { formatDate } from "../../utilities/dateFormate";
import useUserInfo from "../../hooks/useUserInfo";
import AdmitCard from "../Dashboard/AdmitCard";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Countdown: AntCountdown } = Statistic;

// Custom Countdown Component
const CountdownTimer = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        if (onComplete) onComplete();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (timeLeft.isCompleted) {
    return <Text strong className="text-red-600 text-lg">Application Closed! / আবেদন বন্ধ!</Text>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      <div className="bg-gradient-to-br from-green-600 to-green-500 text-white rounded-xl p-4 min-w-[80px] text-center shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-3xl md:text-4xl font-bold">{timeLeft.days}</div>
        <div className="text-sm">Days / দিন</div>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-4 min-w-[80px] text-center shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-3xl md:text-4xl font-bold">{timeLeft.hours}</div>
        <div className="text-sm">Hours / ঘণ্টা</div>
      </div>
      <div className="bg-gradient-to-br from-emerald-500 to-green-400 text-white rounded-xl p-4 min-w-[80px] text-center shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-3xl md:text-4xl font-bold">{timeLeft.minutes}</div>
        <div className="text-sm">Minutes / মিনিট</div>
      </div>
      <div className="bg-gradient-to-br from-green-400 to-emerald-400 text-white rounded-xl p-4 min-w-[80px] text-center shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-3xl md:text-4xl font-bold">{timeLeft.seconds}</div>
        <div className="text-sm">Seconds / সেকেন্ড</div>
      </div>
    </div>
  );
};

const PublicScholarship = ({ onHide, fetchRolls, handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isApplicationShow, setIsApplicationShow] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [globalTimeLeft, setGlobalTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isApplicationOpen, setIsApplicationOpen] = useState(true);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [submittedRollNumber, setSubmittedRollNumber] = useState("");
  const userInfo = useUserInfo();

  // Application period: Dec 27, 2025 2:00 PM to Feb 25, 2026 12:00 PM
  const applicationStart = new Date('2025-12-27T14:00:00');
  const applicationEnd = new Date('2026-02-25T12:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = applicationEnd.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setGlobalTimeLeft({ days, hours, minutes, seconds });
        setIsApplicationOpen(true);
      } else {
        setGlobalTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsApplicationOpen(false);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      parentName: "",
      institute: "",
      instituteClass: "",
      instituteRollNumber: "",
      gender: "",
      phone: "",
      bloodGroup: "",
      presentAddress: "",
      dateOfBirth: "2025-04-18",
      createdBy: userInfo?.uniqueId || "",
      createdByName: userInfo?.firstName || "",
    },
    onSubmit: () => {
      // Empty function - we handle submission manually
    },
    enableReinitialize: true,
  });

  // Custom submit handler to prevent page reload
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isApplicationOpen) {
      toast.error("Application period has ended! / আবেদনের সময়সীমা শেষ হয়ে গেছে!");
      return;
    }

    // Validate required fields
    const values = formik.values;
    const requiredFields = ['name', 'parentName', 'institute', 'instituteClass', 'instituteRollNumber', 'gender', 'presentAddress'];
    const missingFields = requiredFields.filter(field => !values[field] || values[field].trim() === '');
    
    if (missingFields.length > 0) {
      toast.error("Please fill all required fields / অনুগ্রহ করে সব আবশ্যক ক্ষেত্র পূরণ করুন");
      return;
    }

    try {
      setLoading(true);
      
      let imageUrl = null;
      
      // Handle image upload if exists
      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        const formData = new FormData();
        formData.append("image", fileList[0].originFileObj);

        const response = await axios.post(
          "https://api.imgbb.com/1/upload?key=5bdcb96655462459d117ee1361223929",
          formData
        );
        
        if (response?.status === 200 && response?.data?.data?.display_url) {
          imageUrl = response.data.data.display_url;
        } else {
          throw new Error("Failed to upload image");
        }
      } else {
        // Use default image if no image uploaded
        imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_JmAXuH2Myq0ah2g_5ioG6Ku7aR02-mcvimzwFXuD25p2bjx7zhaL34oJ7H9khuFx50&usqp=CAU";
      }

      // Prepare data for submission
      const submissionData = {
        ...values,
        image: imageUrl,
        dateOfBirth: values.dateOfBirth || "2025-04-18",
      };

      const res = await coreAxios.post(`/scholarship-info`, submissionData);
      
      if (res?.status === 201 || res?.status === 200) {
        const rollNumber = res.data?.scholarshipRollNumber || "N/A";
        
        // Set roll number and show success modal
        setSubmittedRollNumber(rollNumber);
        setSuccessModalVisible(true);
        
        // Reset form
        formik.resetForm();
        setFileList([]);
      } else {
        throw new Error("Failed to save data");
      }
    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || "An error occurred. Please try again. / একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      label: "Student Name / শিক্ষার্থীর নাম",
      placeholder: "Enter student name / শিক্ষার্থীর নাম লিখুন",
      component: Input,
      required: true,
    },
    {
      id: "parentName",
      name: "parentName",
      type: "text",
      label: "Parent Name / অভিভাবকের নাম",
      placeholder: "Enter parent name / অভিভাবকের নাম লিখুন",
      component: Input,
      required: true,
    },
    {
      id: "institute",
      name: "institute",
      type: "text",
      label: "Institute Name / প্রতিষ্ঠানের নাম",
      placeholder: "Enter institute name / প্রতিষ্ঠানের নাম লিখুন",
      component: Input,
      required: true,
    },
    {
      id: "instituteClass",
      name: "instituteClass",
      type: "text",
      label: "Institute Class / শ্রেণী",
      placeholder: "Enter class / শ্রেণী লিখুন",
      component: Input,
      required: true,
    },
    {
      id: "instituteRollNumber",
      name: "instituteRollNumber",
      type: "text",
      label: "Institute Roll No. / প্রতিষ্ঠানের রোল নম্বর",
      placeholder: "Enter roll number / রোল নম্বর লিখুন",
      component: Input,
      required: true,
    },
    {
      id: "phone",
      name: "phone",
      type: "text",
      label: "Phone Number / ফোন নম্বর",
      placeholder: "Enter phone number / ফোন নম্বর লিখুন",
      component: Input,
      required: false,
    },
    {
      id: "bloodGroup",
      name: "bloodGroup",
      type: "text",
      label: "Blood Group / রক্তের গ্রুপ",
      placeholder: "Enter blood group / রক্তের গ্রুপ লিখুন",
      component: Input,
      required: false,
    },
    {
      id: "presentAddress",
      name: "presentAddress",
      type: "text",
      label: "Present Address / বর্তমান ঠিকানা",
      placeholder: "Enter present address / বর্তমান ঠিকানা লিখুন",
      component: Input,
      required: true,
    },
  ];

  const instructions = [
    "পরীক্ষার কেন্দ্রে ৩০ মিনিট আগে উপস্থিত হতে হবে। / Reach exam center 30 minutes before.",
    "প্রশ্নপত্রের প্রতিটি প্রশ্ন পড়ুন এবং উত্তর দেওয়ার আগে ভালোভাবে বুঝে নিন। / Read each question carefully before answering.",
    "অনতিবিলম্বে আপনার উত্তরপত্র জমা দিন পরীক্ষার শেষে। / Submit your answer script promptly after exam.",
    "পরীক্ষার সময় মোবাইল ফোন এবং অন্যান্য বৈদ্যুতিন ডিভাইস ব্যবহার করা নিষেধ। / Mobile phones and electronic devices are prohibited during exam.",
    "পরীক্ষার নিয়ম এবং নির্দেশাবলী অনুসরণ করুন। / Follow exam rules and regulations.",
    "প্রশ্নপত্রে যে কোন অস্পষ্টতা থাকলে পরীক্ষককে জানান। / Inform the examiner about any ambiguity in question paper.",
    "আপনার পরীক্ষা সনদ এবং প্রয়োজনীয় ডকুমেন্ট সঙ্গে রাখুন। / Keep your admit card and required documents with you.",
  ];

  const [scholarshipRollNumber, setScholarshipRollNumber] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleFetchData = async () => {
    if (!scholarshipRollNumber.trim()) {
      toast.error("Please enter scholarship roll number / অনুগ্রহ করে শিক্ষাবৃত্তি রোল নম্বর লিখুন");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await coreAxios.get(
        `/scholarship-info-roll/${scholarshipRollNumber}`
      );
      if (response?.status === 200) {
        setData(response.data?.scholarship);
        setScholarshipRollNumber("");
        toast.success("Data fetched successfully! / তথ্য সফলভাবে আহরণ করা হয়েছে!");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again. / তথ্য আহরণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      toast.error("Failed to fetch data. / তথ্য আহরণ ব্যর্থ হয়েছে।");
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

  const applicationSteps = [
    {
      title: "Instructions",
      description: "Read guidelines carefully",
    },
    {
      title: "Fill Form",
      description: "Enter all required information",
    },
    {
      title: "Upload Photo",
      description: "Upload recent photograph",
    },
    {
      title: "Submit",
      description: "Review and submit application",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Application Status Banner */}
      <div className={`${isApplicationOpen ? 'bg-gradient-to-r from-green-600 via-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-orange-600'} shadow-lg`}>
        <div className="container mx-auto px-4 py-3">
          <Row gutter={[16, 16]} align="middle" justify="center">
            <Col xs={24} md={8}>
              <div className="text-center md:text-left">
                <Badge 
                  status={isApplicationOpen ? "success" : "error"} 
                  text={
                    <Text strong className="text-white">
                      {isApplicationOpen ? "Applications Open / আবেদন চলছে" : "Applications Closed / আবেদন বন্ধ"}
                    </Text>
                  } 
                />
                <div className="text-green-100 text-xl">
                  {isApplicationOpen ? "Apply Now! / এখনই আবেদন করুন!" : "Application period ended / আবেদনের সময়সীমা শেষ"}
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <Text strong className="text-white block text-xl">
                  <CalendarOutlined className="mr-2" />
                  Application Period / আবেদনের সময়সীমা
                </Text>
                <Text className="text-green-100 text-xl">
                  ২৭ ডিসেম্বর (দুপুর ২টা) - ২৫ ফেব্রুয়ারি (দুপুর ১২টা)
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <CountdownTimer 
                  targetDate={applicationEnd}
                  onComplete={() => setIsApplicationOpen(false)}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 shadow-lg">
        <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
          <Title level={2} className="text-center !text-white mb-2 !text-2xl md:!text-3xl lg:!text-4xl font-extrabold">
            DMF শিক্ষাবৃত্তি ২০২৬ / DMF Scholarship 2026
          </Title>
          <Text className="block text-center text-green-50 text-lg font-medium">
            Empowering Future Leaders Through Education / শিক্ষার মাধ্যমে ভবিষ্যত নেতৃত্ব গড়ে তোলা
          </Text>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats Bar */}
        

        {/* Mode Selection */}
        <Card className="mb-8 shadow-lg border-2 border-green-100 rounded-xl bg-white">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              type={!isApplicationShow ? "primary" : "default"}
              icon={<FormOutlined />}
              size="large"
              onClick={() => setIsApplicationShow(false)}
              disabled={!isApplicationOpen}
              className={`flex-1 max-w-md ${!isApplicationShow ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0" : ""}`}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">Apply Now / এখনই আবেদন করুন</span>
                <span className="text-sm opacity-80">Create New Application</span>
              </div>
            </Button>
            <Button
              type={isApplicationShow ? "primary" : "default"}
              icon={<EyeOutlined />}
              size="large"
              onClick={() => setIsApplicationShow(true)}
              className={`flex-1 max-w-md ${isApplicationShow ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0" : ""}`}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">View Application / আবেদন দেখুন</span>
                <span className="text-sm opacity-80">Check Status & Download Admit Card</span>
              </div>
            </Button>
          </div>
          
          {!isApplicationOpen && !isApplicationShow && (
            <Alert
              message="Applications Closed / আবেদন বন্ধ"
              description="The application period for DMF Scholarship 2026 has ended. You can only view previously submitted applications. / ডিএমএফ শিক্ষাবৃত্তি ২০২৬-এর আবেদনের সময়সীমা শেষ হয়েছে। আপনি শুধুমাত্র পূর্বে জমা দেওয়া আবেদনগুলি দেখতে পারবেন।"
              type="warning"
              showIcon
              className="mt-4"
            />
          )}
        </Card>

        {/* Content Based on Selection */}
        {isApplicationShow ? (
          // View Application Section
          <Card className="shadow-xl border-2 border-green-100 rounded-xl bg-white">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg h-full border-2 border-green-100 shadow-md">
                  <Title level={3} className="text-green-700 mb-4">
                    <InfoCircleOutlined className="mr-2 text-green-600" />
                    Download Admit Card / এডমিট কার্ড ডাউনলোড করুন
                  </Title>
                  <Paragraph className="text-gray-700 mb-6">
                    Enter your scholarship roll number below to download your admit card for the upcoming examination.
                    <br />
                    <Text className="text-gray-600">
                      পরীক্ষার এডমিট কার্ড ডাউনলোড করতে নিচে আপনার শিক্ষাবৃত্তি রোল নম্বরটি প্রদান করুন।
                    </Text>
                  </Paragraph>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scholarship Roll Number / শিক্ষাবৃত্তি রোল নম্বর
                      </label>
                      <Input
                        size="large"
                        placeholder="Enter your roll number / রোল নম্বর লিখুন"
                        value={scholarshipRollNumber}
                        onChange={(e) => setScholarshipRollNumber(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      icon={<EyeOutlined />}
                      loading={loading}
                      onClick={handleFetchData}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-md"
                    >
                      {loading ? "Loading... / লোড হচ্ছে..." : "Fetch Details / বিস্তারিত দেখুন"}
                    </Button>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                {data && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg h-full">
                    <Title level={3} className="text-green-800 mb-4">
                      <DownloadOutlined className="mr-2" />
                      Admit Card Ready / এডমিট কার্ড প্রস্তুত
                    </Title>
                    <div className="space-y-4">
                      <Alert
                        message="Admit Card Available / এডমিট কার্ড পাওয়া যাচ্ছে"
                        description={
                          <div>
                            <Text className="block mb-2">
                              Your admit card is ready! You can download it in PDF format by clicking the button below.
                            </Text>
                            <Text className="block text-gray-600">
                              আপনার এডমিট কার্ড প্রস্তুত! নিচের বাটনে ক্লিক করে PDF ফরম্যাটে ডাউনলোড করতে পারেন।
                            </Text>
                          </div>
                        }
                        type="success"
                        showIcon
                        className="mb-4"
                      />
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <Text strong className="block mb-2">Roll Number / রোল নম্বর: {data?.scholarshipRollNumber}</Text>
                        <Text className="block mb-1">Name / নাম: {data?.name}</Text>
                        <Text className="block">Class / শ্রেণী: {data?.instituteClass}</Text>
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        icon={<DownloadOutlined />}
                        onClick={downloadPDF}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-md text-lg h-12"
                      >
                        Download Admit Card / এডমিট কার্ড ডাউনলোড করুন
                      </Button>
                      <Text type="secondary" className="block text-center text-sm mt-2">
                        Scroll down to preview your admit card / আপনার এডমিট কার্ড দেখতে নিচে স্ক্রল করুন
                      </Text>
                    </div>
                  </div>
                )}
              </Col>
            </Row>

            {/* Admit Card Preview */}
            {data && (
              <div className="mt-8">
                <Divider orientation="left">
                  <Title level={4} className="!mb-0">Admit Card Preview / এডমিট কার্ড প্রদর্শন</Title>
                </Divider>
                <Alert
                  message="Download Your Admit Card / আপনার এডমিট কার্ড ডাউনলোড করুন"
                  description={
                    <div>
                      <Text className="block mb-1">
                        Your admit card is displayed below. Use the "Download Admit Card" button above to download it as a PDF file.
                      </Text>
                      <Text className="block text-gray-600">
                        আপনার এডমিট কার্ড নিচে প্রদর্শিত হচ্ছে। PDF ফাইল হিসাবে ডাউনলোড করতে উপরের "এডমিট কার্ড ডাউনলোড করুন" বাটন ব্যবহার করুন।
                      </Text>
                    </div>
                  }
                  type="info"
                  showIcon
                  className="mb-4"
                />
                <div className="bg-gray-50 p-4 rounded-lg">
                  <AdmitCard scholarshipData={data} showActions={false} />
                </div>
              </div>
            )}
          </Card>
        ) : (
          // Application Form Section
          <Card className="shadow-xl border-2 border-green-100 rounded-xl bg-white">
            {!isApplicationOpen && (
              <Alert
                message="Application Period Ended / আবেদনের সময়সীমা শেষ"
                description="The application period for DMF Scholarship 2026 has ended on February 25, 2026 at 12:00 PM. You can no longer submit new applications. / ডিএমএফ শিক্ষাবৃত্তি ২০২৬-এর আবেদনের সময়সীমা ২৫ ফেব্রুয়ারি, ২০২৬ দুপুর ১২টায় শেষ হয়েছে। আপনি আর নতুন আবেদন জমা দিতে পারবেন না।"
                type="error"
                showIcon
                className="mb-6"
              />
            )}

            <div className="mb-8">
              <Steps current={currentStep} responsive className="hidden md:flex">
                {applicationSteps.map((step, index) => (
                  <Step key={index} title={step.title} description={step.description} />
                ))}
              </Steps>
              <div className="md:hidden flex justify-between items-center mb-6">
                <Text strong>Step {currentStep + 1} of {applicationSteps.length}</Text>
                <Text>{applicationSteps[currentStep].title}</Text>
              </div>
            </div>

            <div className="mb-8">
              <Alert
                message="Important Instructions / গুরুত্বপূর্ণ নির্দেশনা"
                description={
                  <div>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Application Period: Dec 27, 2025 (2:00 PM) - Feb 25, 2026 (12:00 PM) / আবেদনের সময়সীমা: ২৭ ডিসেম্বর, ২০২৫ (দুপুর ২টা) - ২৫ ফেব্রুয়ারি, ২০২৬ (দুপুর ১২টা)</li>
                      <li>Fill all information accurately / সব তথ্য সঠিকভাবে পূরণ করুন</li>
                      <li>Upload recent passport size photo / সাম্প্রতিক পাসপোর্ট সাইজের ছবি আপলোড করুন</li>
                      <li>Keep your scholarship roll number safe for future reference / ভবিষ্যত রেফারেন্সের জন্য আপনার শিক্ষাবৃত্তি রোল নম্বর সংরক্ষণ করুন</li>
                    </ul>
                  </div>
                }
                type="info"
                showIcon
                className="mb-6"
              />
            </div>

            <form onSubmit={handleFormSubmit} noValidate>
              <Row gutter={[24, 16]}>
                {inputData.map(({ id, name, type, label, placeholder, required }) => (
                  <Col xs={24} md={12} lg={8} key={id}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label} {required && <span className="text-red-500">*</span>}
                      </label>
                      {id === "phone" ? (
                        <Input
                          id={id}
                          name={name}
                          type="text"
                          size="large"
                          placeholder={placeholder}
                          required={required}
                          onChange={formik.handleChange}
                          value={formik.values[id] || ""}
                          disabled={!isApplicationOpen}
                          className="w-full"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      ) : (
                        <Input
                          id={id}
                          name={name}
                          type={type}
                          size="large"
                          placeholder={placeholder}
                          required={required}
                          onChange={formik.handleChange}
                          value={formik.values[id] || ""}
                          disabled={!isApplicationOpen}
                          className="w-full"
                        />
                      )}
                    </div>
                  </Col>
                ))}

                <Col xs={24} md={12} lg={8}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender / লিঙ্গ <span className="text-red-500">*</span>
                    </label>
                    <Radio.Group
                      name="gender"
                      size="large"
                      onChange={formik.handleChange}
                      value={formik.values.gender}
                      className="w-full"
                      disabled={!isApplicationOpen}
                    >
                      <Radio value="male">Male / পুরুষ</Radio>
                      <Radio value="female">Female / মহিলা</Radio>
                    </Radio.Group>
                  </div>
                </Col>
              </Row>

              <Divider orientation="left">Upload Photo / ছবি আপলোড করুন</Divider>
              <div className="mb-8">
                <Card className="bg-gray-50">
                  <Upload
                    action=""
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    beforeUpload={() => false}
                    maxCount={1}
                    className="w-full"
                    disabled={!isApplicationOpen}
                  >
                    {fileList.length >= 1 ? null : (
                      <div className="text-center">
                        <UploadOutlined className="text-2xl mb-2" />
                        <div>Upload Photo / ছবি আপলোড করুন</div>
                        <div className="text-xs text-gray-500">Max 5MB, JPG/PNG</div>
                      </div>
                    )}
                  </Upload>
                  <Text type="secondary" className="block mt-2">
                    Upload recent passport size photo (Max 5MB) / সাম্প্রতিক পাসপোর্ট সাইজের ছবি আপলোড করুন (সর্বোচ্চ ৫এমবি)
                  </Text>
                </Card>
              </div>

              <Divider />

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  type="default"
                  size="large"
                  htmlType="button"
                  icon={<ArrowLeftOutlined />}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsApplicationShow(true);
                  }}
                  className="flex-1 max-w-md"
                >
                  Back / ফিরে যান
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  icon={<FormOutlined />}
                  disabled={!isApplicationOpen || loading}
                  className={`flex-1 max-w-lg ${!isApplicationOpen ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'} border-0 shadow-md`}
                >
                  {loading ? "Submitting... / জমা হচ্ছে..." : "Submit Application / আবেদন জমা দিন"}
                </Button>
              </div>

              {!isApplicationOpen && (
                <div className="mt-4 text-center">
                  <Text type="danger">
                    <ClockCircleOutlined className="mr-2" />
                    Application period has ended. Please wait for the next scholarship program. / আবেদনের সময়সীমা শেষ হয়েছে। অনুগ্রহ করে পরবর্তী শিক্ষাবৃত্তি কর্মসূচির জন্য অপেক্ষা করুন।
                  </Text>
                </div>
              )}
            </form>
          </Card>
        )}
      </div>

      {/* Application Timeline */}
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-lg border-2 border-green-100 rounded-xl bg-white">
          <Title level={3} className="text-center mb-6 text-green-700">
            <CalendarOutlined className="mr-2" />
            Scholarship Timeline / শিক্ষাবৃত্তি সময়সূচী
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                <div className="text-2xl font-bold text-blue-600 mb-2">Dec 27</div>
                <Text strong className="block">Application Starts / আবেদন শুরু</Text>
                <Text className="text-sm">2:00 PM / দুপুর ২টা</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-0">
                <div className="text-2xl font-bold text-green-600 mb-2">Feb 25</div>
                <Text strong className="block">Application Ends / আবেদন শেষ</Text>
                <Text className="text-sm">12:00 PM / দুপুর ১২টা</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-0">
                <div className="text-2xl font-bold text-orange-600 mb-2">Available</div>
                <Text strong className="block">Admit Card / এডমিট কার্ড</Text>
                <Text className="text-sm">Download Now / এখনই ডাউনলোড করুন</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                <div className="text-2xl font-bold text-purple-600 mb-2">TBA</div>
                <Text strong className="block">Exam Date / পরীক্ষার তারিখ</Text>
                <Text className="text-sm">To be announced / পরে ঘোষণা</Text>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 pb-6 bg-gradient-to-r from-green-700 via-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <Text className="text-gray-400">
            © 2025-2026 DMF Scholarship Program. All rights reserved.
          </Text>
          <Text className="block text-gray-400 text-sm mt-2">
            For queries, contact: support@dmfscholarship.com
          </Text>
          <div className="mt-4">
            <Text className="text-gray-500 text-xs">
              Application Period: December 27, 2025 (2:00 PM) to February 25, 2026 (12:00 PM) / 
              আবেদনের সময়সীমা: ২৭ ডিসেম্বর, ২০২৫ (দুপুর ২টা) থেকে ২৫ ফেব্রুয়ারি, ২০২৬ (দুপুর ১২টা)
            </Text>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={successModalVisible}
        onCancel={() => {
          setSuccessModalVisible(false);
          setIsApplicationShow(true);
        }}
        footer={null}
        centered
        closable={true}
        maskClosable={false}
        width={600}
        className="success-modal"
      >
        <div className="text-center py-6">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <CheckCircleOutlined className="text-6xl text-white" />
            </div>
          </div>

          {/* Title */}
          <Title level={2} className="!text-3xl !mb-4 text-green-700 font-extrabold">
            Application Submitted Successfully! / আবেদন সফলভাবে জমা দেওয়া হয়েছে!
          </Title>

          {/* Roll Number Card */}
          <Card className="mt-6 mb-6 border-2 border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="py-4">
              <Text className="text-lg text-gray-600 block mb-3">
                Your Scholarship Roll Number / আপনার শিক্ষাবৃত্তি রোল নম্বর:
              </Text>
              <div className="flex items-center justify-center gap-3">
                <div className="bg-white px-6 py-4 rounded-lg border-2 border-green-300 shadow-md">
                  <Text className="text-4xl font-bold text-green-700 tracking-wider">
                    {submittedRollNumber}
                  </Text>
                </div>
                <Button
                  type="default"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    navigator.clipboard.writeText(submittedRollNumber);
                    toast.success("Roll number copied! / রোল নম্বর কপি করা হয়েছে!");
                  }}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Copy
                </Button>
              </div>
            </div>
          </Card>

          {/* Important Message */}
          <Alert
            message="Important Notice / গুরুত্বপূর্ণ বিজ্ঞপ্তি"
            description={
              <div className="text-left mt-2">
                <Text className="block mb-2">
                  Please save your roll number for future reference. You will need it to download your admit card and check your application status.
                </Text>
                <Text className="block text-gray-600">
                  অনুগ্রহ করে ভবিষ্যত রেফারেন্সের জন্য আপনার রোল নম্বর সংরক্ষণ করুন। আপনার এডমিট কার্ড ডাউনলোড করতে এবং আবেদনের অবস্থা পরীক্ষা করতে আপনার এটি প্রয়োজন হবে।
                </Text>
              </div>
            }
            type="info"
            showIcon
            className="mb-6 text-left"
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button
              type="primary"
              size="large"
              icon={<EyeOutlined />}
              onClick={() => {
                setSuccessModalVisible(false);
                setIsApplicationShow(true);
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-md px-8"
            >
              View Application / আবেদন দেখুন
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => {
                setSuccessModalVisible(false);
                setIsApplicationShow(true);
              }}
              className="border-green-300 text-green-700 hover:bg-green-50 px-8"
            >
              Close / বন্ধ করুন
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PublicScholarship;