import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import DMFLogo from "../../images/New-Main-2.png";
import { useHistory } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { Button } from "antd";

const NoticePrint = ({ dataSet }) => {
  const history = useHistory();
  const [data, setData] = useState(dataSet);

  const downloadPDF = () => {
    const element = document.getElementById("admit-card");

    // Temporarily modify the class to include `mt-0`
    const originalClass = element.className;
    element.className = `${originalClass} mt-0`;

    const options = {
      margin: 0.5,
      filename: `Notice-${data?.to || "Recipient"}.pdf`, // Filename dynamically includes the recipient's name
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Ensure the data is available before generating the PDF
    if (!data) {
      console.error("No data available to generate the PDF.");
      return;
    }

    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then(() => {
        console.log("PDF successfully downloaded.");
      })
      .catch((err) => {
        console.error("Error while downloading the PDF:", err);
      })
      .finally(() => {
        // Restore the original class after generating the PDF
        element.className = originalClass;
      });
  };

  // Function to check if the text contains Bengali characters
  const isBengali = (text) => {
    return /[\u0980-\u09FF]/.test(text);
  };

  return (
    <div>
      <div className="layout-invoice-page">
        <div className="flex items-center justify-between w-full mt-16">
          <Button
            onClick={() => {
              history.goBack();
            }}
            className="p-mr-2"
            title="Back"
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            Back
          </Button>

          <Button
            type="primary"
            onClick={downloadPDF}
            className="p-mr-2"
            icon={<DownloadOutlined />}
          >
            Download PDF
          </Button>
        </div>
      </div>

      <div
        id="admit-card"
        className="layout-invoice-content w-full mt-4 print:!bg-white bangla-text"
        style={{ wordWrap: "break-word", whiteSpace: "pre-wrap", overflow: "hidden" }}
      >
        <div className="mt-20 text-2xl">
          {/* START TOP */}
          <div className="flex justify-between">
            <div>
              <p>
                {data?.noticeDate
                  ? isBengali(data.noticeDate)
                    ? new Date(data.noticeDate).toLocaleDateString("bn-BD")
                    : new Date(data.noticeDate).toLocaleDateString("en-US")
                  : ""}
              </p>

              <p>{isBengali(data?.to) ? "প্রাপক" : "TO"}</p>
              <p>{data?.to}</p>
              <p className="mt-6">
                {isBengali(data?.subject) ? "বিষয়:" : "Subject:"} {data?.subject}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <img src={DMFLogo} alt="logo" className="w-56 h-44" />
              </div>
            </div>
          </div>

          {/* Render body and body2 with proper handling for long text */}
          <div className="pt-8">{data?.body}</div>
          <div className="pt-5">{data?.body2}</div>

          <p className="pt-10">{data?.from}</p>
          <table className="w-full mt-56 mb-20">
            <tbody>
              <tr>
                <td className="text-center">{data?.signature1}</td>
                <td className="text-center">{data?.signature2}</td>
                <td className="text-center">{data?.signature3}</td>
              </tr>
              <tr>
                <td className="text-center">{data?.designation1}</td>
                <td className="text-center">{data?.designation2}</td>
                <td className="text-center">{data?.designation3}</td>
              </tr>
            </tbody>
          </table>
          {/* END TOP */}
        </div>
      </div>
    </div>
  );
};

export default NoticePrint;
