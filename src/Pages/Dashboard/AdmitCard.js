import { useHistory, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { Button, QRCode } from "antd";
import { formatDate } from "../../utilities/dateFormate";
import html2pdf from "html2pdf.js";
import Loader from "../../components/Loader/Loader";
import PreviousDMFLogo from "../../images/New-Main-2.png";

const DMFLogo = "https://i.ibb.co/F4XV8dKL/1.png";

const AdmitCard = ({ scholarshipData = null, showActions = true }) => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchScholarshipInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`scholarship-info/${id}`);
      if (response?.status === 200) {
        setData(response?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };

  useEffect(() => {
    if (scholarshipData) {
      // If data is passed as prop, use it directly
      setData({ scholarship: scholarshipData });
    } else if (id) {
      // Otherwise fetch using id from params
      fetchScholarshipInfo();
    }
  }, [id, scholarshipData]);

  const print = () => {
    window.print();
  };

  const instructions = [
    "লিখিত ও মৌখিক পরীক্ষায় অংশগ্রহণের জন্য এই প্রবেশপত্র অবশ্যই সঙ্গে আনতে হবে।",
    "সকাল ৯:৩০ টায় প্রার্থীর নির্ধারিত আসন গ্রহণ করতে হবে এবং পরীক্ষা সময় শেষ না হওয়া পর্যন্ত কক্ষ ত্যাগ করতে পারবেন না।",
    "পরীক্ষার কক্ষে কোন প্রকার মোবাইল ফোন, স্মার্ট ওয়াচ, বই, খাতা, নোট, কাগজপত্র, ক্যালকুলেটর, ব্যাগ, মানিব্যাগ, পার্স ইত্যাদি আনা নিষিদ্ধ।",
    "পরীক্ষার্থীকে উত্তরপত্রে অবশ্যই কালো বলপয়েন্ট কলম ব্যবহার করতে হবে।",
    "রোল এর পূরণে কোনো ভুল হলে উত্তরপত্রটি বাতিল বলে গণ্য হবে।",
    "ওএমআর ফরমের উপরের অংশের নির্ধারিত সকল তথ্য যথাযথভাবে পূরণ করতে হবে। অন্যথায় উত্তরপত্রটি বাতিল বলে গণ্য হবে।",
    "পরীক্ষার কেন্দ্রের ভিতরে প্রার্থী আসন কোন কক্ষে তার তালিকা টানিয়ে দেওয়া হবে।",
    "লিখিত পরীক্ষায় বা মৌখিক পরীক্ষায় অংশগ্রহণ বৃত্তির নিশ্চয়তা প্রদান করে না।",
    "পরীক্ষা সংক্রান্ত সকল তথ্যাদি ফাউন্ডেশনের ওয়েবসাইটে (ourdmf.com) পাওয়া যাবে।",
  ];

  const getExamTime = () => {
    const instituteClass = data?.scholarship?.instituteClass?.toString().toLowerCase().trim();
    
    // Classes: Six, Seven, Eight, Nine, Ten, Eleven, Twelve
    const higherClasses = ['six', '7', 'seven', '8', 'eight', '9', 'nine', '10', 'ten', '11', 'eleven', '12', 'twelve'];
    
    // Classes: Two, Three, Four, Five
    const lowerClasses = ['two', '2', 'three', '3', 'four', '4', 'five', '5'];
    
    if (higherClasses.includes(instituteClass)) {
      return "10:45 AM - 11:45 AM";
    } else if (lowerClasses.includes(instituteClass)) {
      return "10:00 AM - 10:30 AM";
    }
    
    // Default time if class doesn't match
    return "10:00 AM - 11:30 AM";
  };

  const getGenderPrefix = () => {
    const gender = data?.scholarship?.gender?.toLowerCase();
    if (gender === 'male') {
      return 'M';
    } else if (gender === 'female') {
      return 'F';
    }
    return ''; // Return empty if gender is not specified or is 'other'
  };

  const downloadPDF = () => {
    const element = document.getElementById("admit-card");
    const options = {
      margin: 0.3,
      filename: `Admit-card-${data?.scholarship?.name}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-gray-50 min-h-screen">
          {/* Action Buttons - Hidden on Print */}
          {showActions && (
            <div className="max-w-5xl mx-auto px-4 py-6 print:hidden">
              <div className="flex gap-3">
                <Button
                  onClick={() => history.goBack()}
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  size="large">
                  Back
                </Button>
                <Button
                  type="primary"
                  onClick={downloadPDF}
                  icon={<DownloadOutlined />}
                  size="large">
                  Download PDF
                </Button>
              </div>
            </div>
          )}

          {/* Main Admit Card */}
          <div
            id="admit-card"
            className="max-w-7xl mx-auto bg-white shadow-lg print:shadow-none print:max-w-full">
            <div className="p-8 print:p-6">
              {/* Header Section */}
              <div className="border-b-2 border-green-600 pb-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  {/* Logo - Left */}
                  <div className="flex-1">
                    <img 
                      src={DMFLogo} 
                      alt="DMF Logo" 
                      className="h-[100px] object-contain" 
                    />
                  </div>
                  
                  {/* Title - Center */}
                  <div className="flex-1 text-center">
                    <p className="text-2xl md:text-3xl font-bold text-green-800 mb-2 bangla-text">
                      দারুল মুত্তাক্বীন ফাউন্ডেশন
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2 bangla-text whitespace-nowrap">
                      প্রবেশপত্র  
                    </h1>
                      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2 bangla-text whitespace-nowrap">
                        শিক্ষাবৃত্তি পরীক্ষা-২০২৬
                      </h1>
                  </div>

                  {/* QR Code - Right */}
                  <div className="flex-1 flex justify-end">
                    <QRCode
                      type="svg"
                      value={data?.scholarship?.scholarshipRollNumber || "DMF2026"}
                      size={100}
                      className="border-2 border-green-600 p-1"
                    />
                  </div>
                </div>
              </div>

              {/* Roll Number - Large Display */}
              <div className="text-center mb-8">
                <div className="flex justify-center items-baseline gap-3 mb-4">
                  <p className="text-base font-semibold bangla-text text-green-700" style={{ lineHeight: '1', paddingTop: '12px' }}>রোলনং-</p>
                  {String(data?.scholarship?.scholarshipRollNumber || "").split("").map((digit, idx) => (
                    <span key={idx} className="text-4xl font-bold text-green-800 border-2 border-green-600 px-4 py-3 bg-green-50 inline-flex items-center justify-center" style={{ lineHeight: '1', verticalAlign: 'middle' }}>
                      {digit}
                    </span>
                  ))}
                  {getGenderPrefix() && (
                    <span className="text-4xl font-bold text-green-800 border-2 border-green-600 px-4 py-3 bg-green-50 inline-flex items-center justify-center" style={{ lineHeight: '1', verticalAlign: 'middle' }}>
                      {getGenderPrefix()}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-12 gap-5 mb-8">
                {/* Left Side - Student Information */}
                <div className="col-span-8">
                  <table className="w-full text-lg border-2 border-green-600">
                    <tbody>
                      <tr className="border-b border-green-600">
                        <td className="py-3 px-4 font-semibold bg-green-100 w-1/3 border-r border-green-600 bangla-text text-green-800">
                          নাম:
                        </td>
                        <td className="py-3 px-4 font-semibold uppercase">
                          {data?.scholarship?.name}
                        </td>
                      </tr>
                      <tr className="border-b border-green-600">
                        <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 bangla-text text-green-800">
                          পিতার নাম:
                        </td>
                        <td className="py-3 px-4 uppercase">
                          {data?.scholarship?.parentName}
                        </td>
                      </tr>
                      <tr className="border-b border-green-600">
                        <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 bangla-text text-green-800">
                          মাতার নাম:
                        </td>
                        <td className="py-3 px-4 uppercase">
                          {data?.scholarship?.parentName || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b border-green-600">
                        <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 bangla-text text-green-800">
                          শ্রেণী:
                        </td>
                        <td className="py-3 px-4 uppercase">
                          {data?.scholarship?.instituteClass || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b border-green-600">
                        <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 bangla-text text-green-800">
                          শিক্ষা প্রতিষ্ঠানের নাম:
                        </td>
                        <td className="py-3 px-4 uppercase">
                          {data?.scholarship?.institute || "N/A"}
                        </td>
                      </tr>
                      <tr className="border-b border-green-600">
                        <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 bangla-text text-green-800">
                          পরীক্ষার তারিখ ও সময়:
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-green-700">23 January 2026, {getExamTime()}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold bg-green-100 border-r border-green-600 bangla-text text-green-800">
                          পরীক্ষার কেন্দ্র:
                        </td>
                        <td className="py-3 px-4 font-semibold text-green-700">
                          Takter Chala Sabuj Bangla High School, Takter chala, Sakhipur, Tangail
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Side - Photo & Signature - Smaller */}
                <div className="col-span-4">
                  <div className="border-2 border-green-600 p-3 h-full flex flex-col">
                    <div className="w-36 h-44 mx-auto border-2 border-green-600 overflow-hidden mb-4 flex items-center justify-center bg-green-50">
                      <img
                        src={data?.scholarship?.image || DMFLogo}
                        alt="Candidate"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-auto text-center">
                      <p className="text-sm font-semibold mb-2 bangla-text text-green-700">পরীক্ষার্থীর স্বাক্ষরঃ</p>
                      <div className="border-t-2 border-green-600 mt-4 h-12"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions Section */}
              <div className="border-2 border-green-600 mb-6">
                <div className="bg-green-700 text-white px-5 py-4 font-bold text-center bangla-text text-xl">
                  পরীক্ষার্থীর জন্য সাধারণ নির্দেশনাবলী:
                </div>
                <div className="p-5 bg-green-50">
                  <ol className="space-y-3 text-lg bangla-text">
                    {instructions?.map((instruction, index) => {
                      const bengaliNumbers = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
                      return (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-8 h-8 bg-green-700 text-white rounded-full text-center font-semibold mr-4 flex-shrink-0 text-base leading-8">
                            {bengaliNumbers[index]}
                          </span>
                          <span className="pt-0.5 leading-relaxed">{instruction}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>

              {/* Footer with QR Code and Signature */}
              <div className="grid grid-cols-12 gap-4 mt-6 pt-4 border-t-2 border-green-600">
                {/* Logo - Bottom Left */}
                <div className="col-span-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={PreviousDMFLogo} 
                      alt="DMF Logo" 
                      className="h-[80px] object-contain border-2 border-green-600 p-1" 
                    />
                    <div>
                      <p className="text-sm font-semibold mb-1">User Id:</p>
                      <p className="text-sm">{data?.scholarship?.scholarshipRollNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Director Signature - Bottom Right */}
                <div className="col-span-6 text-right">
                  <div className="inline-block text-center mt-8 mr-8 pl-6">
                    <div className="border-t-2 border-green-600 w-48 mb-4"></div>
                    <p className="text-sm font-semibold bangla-text text-green-700 mb-3">পরিচালক</p>
                    <p className="text-sm bangla-text text-green-700">দারুল মুত্তাক্বীন ফাউন্ডেশন</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdmitCard;