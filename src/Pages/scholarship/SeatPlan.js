import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { Button } from "antd";
import { QRCode } from "antd";
import DMFLogo from "../../images/New-Main-2.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactDOM from "react-dom"; // Import ReactDOM for rendering JSX to DOM

export default function SeatPlan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchScholarshipInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/scholarship-info`);
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.submittedAt) - new Date(a?.submittedAt);
        });
        setData(sortedData);
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

  // Define renderAdmitCard function outside downloadPDF
  const renderAdmitCard = (data) => (
    <div
      key={data._id}
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <img src={DMFLogo} alt="logo" className="w-[80px]" />
        <div className="text-right">
          <h1 className="text-2xl font-bold">DMF Scholarship 2025</h1>
          <h3 className="font-bold text-green-700 text-[16px]">
            {data?.scholarshipRollNumber}
          </h3>
        </div>
      </div>

      {/* Student Details Section */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[15px] font-semibold">Name: {data?.name}</p>
          <p className="text-[15px]">Class: {data?.instituteClass}</p>
          <p className="text-[15px]">[{data?.institute}]</p>
          <p className="text-[12px]">Contact: {data?.phone}</p>
        </div>
        <div className="flex items-center">
          <QRCode value={data?.scholarshipRollNumber} size={100} />
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-4 text-center text-[12px] text-gray-500">
        <p>Bring this admit card to the exam center.</p>
        <p>Do not share or lose this card.</p>
      </div>
    </div>
  );

  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF instance
    const cardsPerPage = 2; // Number of admit cards per page
    const totalPages = Math.ceil(data.length / cardsPerPage);

    // Function to add a page to the PDF
    const addPageToPDF = (canvas, pdf, pageNumber) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Add a new page if there are more admit cards
      if (pageNumber < totalPages - 1) {
        pdf.addPage();
      }
    };

    // Loop through each page
    for (let page = 0; page < totalPages; page++) {
      const startIndex = page * cardsPerPage;
      const endIndex = startIndex + cardsPerPage;

      // Create a temporary container for the current page
      const tempContainer = document.createElement("div");
      tempContainer.style.visibility = "hidden";
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      document.body.appendChild(tempContainer);

      // Render the admit cards for the current page into the temporary container
      data.slice(startIndex, endIndex).forEach((data) => {
        ReactDOM.render(renderAdmitCard(data), tempContainer);
      });

      // Wait for the rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust delay if needed

      // Convert the temporary container to a canvas
      const canvas = await html2canvas(tempContainer);
      addPageToPDF(canvas, pdf, page);

      // Remove the temporary container
      document.body.removeChild(tempContainer);
    }

    // Save the PDF after all pages are processed
    pdf.save("admit-cards.pdf");
  };

  return (
    <div className="p-4 bg-gray-100">
      <Button type="primary" onClick={downloadPDF} className="mb-4">
        Download PDF
      </Button>
      <div id="admit-cards" className="grid grid-cols-2 gap-4">
        {data?.map((data) => renderAdmitCard(data))}
      </div>
    </div>
  );
}
