import { useHistory, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import DMFLogo from "../../images/New-Main-2.png";
import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { Button, QRCode, Watermark } from "antd";
import { formatDate } from "../../utilities/dateFormate";
import html2pdf from "html2pdf.js";
import Loader from "../../components/Loader/Loader";

const AdmitCard = () => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

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
    fetchScholarshipInfo();
  }, []);

  const print = () => {
    window.print();
  };

  const instructions = [
    "পরীক্ষার কেন্দ্রে ৩০ মিনিট আগে উপস্থিত হতে হবে।",
    "প্রশ্নপত্রের প্রতিটি প্রশ্ন পড়ুন এবং উত্তর দেওয়ার আগে ভালোভাবে বুঝে নিন।",
    "পরীক্ষার সময় মোবাইল ফোন এবং অন্যান্য বৈদ্যুতিন ডিভাইস ব্যবহার করা নিষেধ।",
    "পরীক্ষার নিয়ম এবং নির্দেশাবলী অনুসরণ করুন।",
    "আপনার পরীক্ষা সনদ এবং প্রয়োজনীয় ডকুমেন্ট সঙ্গে রাখুন।",
  ];

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
    <Watermark content="DMF SCHOLARSHIP 2026">
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-gray-50 min-h-screen">
          {/* Action Buttons - Hidden on Print */}
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

          {/* Main Admit Card */}
          <div
            id="admit-card"
            className="max-w-5xl mx-auto bg-white shadow-lg print:shadow-none print:max-w-full">
            <div className="p-8">
              {/* Header Section */}
              <div className="border-b-4 border-blue-600 pb-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <img 
                    src={DMFLogo} 
                    alt="DMF Logo" 
                    className="h-20 object-contain" 
                  />
                  
                  <div className="text-center flex-1 px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">
                      DMF SCHOLARSHIP 2026
                    </h1>
                    <div className="inline-block bg-blue-100 px-6 py-2 rounded-lg">
                      <p className="text-lg font-semibold text-blue-800">
                        WRITTEN EXAM ADMIT CARD
                      </p>
                    </div>
                  </div>
                  
                  <QRCode
                    type="svg"
                    value={data?.scholarship?.scholarshipRollNumber || "DMF2026"}
                    size={80}
                    className="border-2 border-gray-300 p-1"
                  />
                </div>

                {/* Exam Details Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mt-4">
                  <p className="text-center text-lg font-semibold text-gray-800 mb-2">
                    📅 Exam Date: 23 January 2026 (Friday)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                    <p className="text-center">
                      <span className="font-semibold">Class (3rd-5th):</span> ⏰ Duration: 40 minutes | 🕘 Start: 9:00 AM
                    </p>
                    <p className="text-center">
                      <span className="font-semibold">Class (6th-10th):</span> ⏰ Duration: 70 minutes | 🕙 Start: 10:20 AM
                    </p>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-red-600">
                      📝 Written Examination
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-12 gap-6 mb-6">
                {/* Left Side - Student Information */}
                <div className="col-span-8">
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
                      Candidate Information
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold bg-gray-50 w-1/3">
                            Roll Number
                          </td>
                          <td className="py-3 px-4 font-bold text-blue-700 text-lg">
                            {data?.scholarship?.scholarshipRollNumber}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold bg-gray-50">
                            Candidate Name
                          </td>
                          <td className="py-3 px-4 font-semibold uppercase">
                            {data?.scholarship?.name}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold bg-gray-50">
                            Parent Name
                          </td>
                          <td className="py-3 px-4 uppercase">
                            {data?.scholarship?.parentName}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold bg-gray-50">
                            Class
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded font-semibold">
                              {data?.scholarship?.instituteClass}
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold bg-gray-50">
                            Gender
                          </td>
                          <td className="py-3 px-4 uppercase">
                            {data?.scholarship?.gender}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold bg-gray-50">
                            Blood Group
                          </td>
                          <td className="py-3 px-4 uppercase font-semibold text-red-600">
                            {data?.scholarship?.bloodGroup}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold bg-gray-50">
                            Phone Number
                          </td>
                          <td className="py-3 px-4">
                            {typeof data?.scholarship?.phone === "string" &&
                            data?.scholarship?.phone?.startsWith("0")
                              ? data?.scholarship?.phone
                              : `0${data?.scholarship?.phone}`}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold bg-gray-50">
                            Address
                          </td>
                          <td className="py-3 px-4 uppercase">
                            {data?.scholarship?.presentAddress}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 px-4 font-semibold bg-gray-50">
                            Institute
                          </td>
                          <td className="py-3 px-4 uppercase">
                            {data?.scholarship?.institute}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold bg-gray-50">
                            Institute Roll No.
                          </td>
                          <td className="py-3 px-4 uppercase">
                            {data?.scholarship?.instituteRollNumber}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Side - Photo & Signature */}
                <div className="col-span-4">
                  <div className="border-2 border-gray-300 rounded-lg p-4 h-full flex flex-col items-center">
                    <div className="w-full aspect-[3/4] border-2 border-dashed border-gray-400 rounded-lg overflow-hidden mb-3 flex items-center justify-center bg-gray-50">
                      <img
                        src={data?.scholarship?.image || DMFLogo}
                        alt="Candidate"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-2 text-center w-full">
                      <p className="text-xs text-gray-600 font-semibold mb-1">
                        Candidate Signature
                      </p>
                      <div className="border-t-2 border-gray-400 mt-8 pt-1 w-32 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exam Center Highlight */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
                <p className="font-bold text-gray-800 mb-1">📍 Exam Center:</p>
                <p className="text-gray-700 font-semibold">
                  Takter Chala Sabuj Bangla High School, Takter chala, Sakhipur, Tangail
                </p>
              </div>

              {/* Instructions Section */}
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 font-bold">
                  ⚠️ Important Instructions (গুরুত্বপূর্ণ নির্দেশাবলী)
                </div>
                <div className="p-4">
                  <ol className="space-y-2 text-sm">
                    {instructions?.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full text-center font-semibold mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t-2 border-gray-300 flex justify-between items-center text-xs text-gray-600">
                <p>📧 Contact: ourdmf@gmail.com</p>
                <p>🌐 www.dmfscholarship.org</p>
                <p className="font-semibold">Best of Luck! ✨</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Watermark>
  );
};

export default AdmitCard;