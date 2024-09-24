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

  const downloadPDF = () => {
    const element = document.getElementById("admit-card");
    const options = {
      margin: 0.5,
      filename: `Admit-card-${data?.scholarship?.name}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <Watermark content="DMF SCHOLARSHIP 2024">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="layout-invoice-page mx-28">
            <div className="flex gap-8 w-full mt-8 mx-0">
              {/*  <Button
              type="primary"
              onClick={print}
              className="p-mb-3"
              icon={<PrinterOutlined />}>
              Print
            </Button> */}

              <Button
                onClick={() => {
                  history.goBack();
                }}
                className="p-mr-2"
                title="Back"
                type="primary"
                icon={<ArrowLeftOutlined />}>
                Back
              </Button>

              <Button
                type="primary"
                onClick={downloadPDF}
                className="p-mr-2"
                icon={<DownloadOutlined />}>
                Download PDF
              </Button>
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
                  value={data?.scholarship?.scholarshipRollNumber}
                  size={100} // Adjust the size as needed
                />
              </div>
              {/* END 
              {/* END TOP */}

              {/* Header */}
              <div className="text-center">
                <p className="text-3xl font-bold uppercase underline">
                  DMF Scholarship 2024
                </p>
                <p className="text-xl font-bold pt-4">
                  ( 04 October 2024 Examination )
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
                          {data?.scholarship?.scholarshipRollNumber}
                        </td>
                        <td className="border border-black py-2 px-3"></td>
                        <td className="border border-black py-2 px-3"></td>
                      </tr>
                      <tr>
                        <td className="border border-black py-2 px-3 uppercase">
                          Name
                        </td>
                        <td className="border border-black py-2 px-3 uppercase">
                          {data?.scholarship?.name}
                        </td>
                        <td className="border border-black py-2 px-3 uppercase">
                          Class
                        </td>
                        <td className="border border-black py-2 px-3">
                          {data?.scholarship?.instituteClass}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black py-2 px-3 uppercase">
                          DOB
                        </td>
                        <td className="border border-black py-2 px-3 uppercase">
                          {formatDate(data?.scholarship?.dateOfBirth)}
                        </td>
                        <td className="border border-black py-2 px-3">
                          GENDER
                        </td>
                        <td className="border border-black py-2 px-3 uppercase">
                          {data?.scholarship?.gender}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black py-2 px-3 uppercase">
                          Parent Name
                        </td>
                        <td className="border border-black py-2 px-3 uppercase">
                          {data?.scholarship?.parentName}
                        </td>
                        <td className="border border-black py-2 px-3 uppercase">
                          Blood Group
                        </td>
                        <td className="border border-black py-2 px-3 uppercase">
                          {data?.scholarship?.bloodGroup}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black py-2 px-3 uppercase">
                          PHONE NUMBER
                        </td>
                        {/* <td
                          className="border border-black py-3 px-3 uppercase"
                          colSpan={3}>
                          {data?.scholarship?.phone}
                        </td> */}
                        <td
                          className="border border-black py-3 px-3 uppercase"
                          colSpan={3}>
                          {typeof data?.scholarship?.phone === "string" &&
                          data?.scholarship?.phone?.startsWith("0")
                            ? data?.scholarship?.phone
                            : `0${data?.scholarship?.phone}`}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black py-2 px-3 uppercase">
                          ADDRESS
                        </td>
                        <td
                          className="border border-black py-2 px-3 uppercase"
                          colSpan={3}>
                          {data?.scholarship?.presentAddress}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black py-2 px-3 uppercase">
                          Institute
                        </td>
                        <td
                          className="border border-black py-2 px-3 uppercase"
                          colSpan={3}>
                          {data?.scholarship?.institute}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black py-2 px-3 uppercase">
                          Institute Roll No.
                        </td>
                        <td
                          className="border border-black py-2 px-3 uppercase"
                          colSpan={3}>
                          {data?.scholarship?.instituteRollNumber}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black py-2 px-3 uppercase">
                          EXAM CENTER
                        </td>
                        <td
                          className="border border-black py-2 px-3 uppercase"
                          colSpan={3}>
                          Takter Chala Sabuj Bangla High School,Takter chala,
                          Sakhipur, Tangail
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-span-3 flex flex-col items-center justify-center">
                  <img
                    src={data?.scholarship?.image || DMFLogo}
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
      )}
    </Watermark>
  );
};

export default AdmitCard;
