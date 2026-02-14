import React, { useEffect, useState } from "react";
import { coreAxios } from "../../utilities/axios";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import html2pdf from "html2pdf.js";
import Loader from "../../components/Loader/Loader";

const DMFLogo = "https://i.ibb.co/F4XV8dKL/1.png";

export default function SeatPlan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

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

  // Helper function to get gender prefix
  const getGenderPrefix = (gender) => {
    if (!gender) return "";
    const genderLower = gender.toLowerCase();
    if (genderLower === "male") return "M";
    if (genderLower === "female") return "F";
    return "";
  };

  // Helper function to format roll number with gender prefix
  const formatRollNumberWithGender = (rollNumber, gender) => {
    const prefix = getGenderPrefix(gender);
    return prefix ? `${rollNumber}${prefix}` : rollNumber;
  };

  const downloadPDF = async () => {
    setPdfLoading(true);
    
    try {
      const element = document.getElementById("seat-plan-cards");
      
      if (!element) {
        alert("Element not found");
        setPdfLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        alert("No data to export");
        setPdfLoading(false);
        return;
      }

      // Ensure element is visible and has proper styling
      element.style.display = "grid";
      element.style.visibility = "visible";
      element.style.opacity = "1";
      
      // Wait for any animations or transitions
      await new Promise((resolve) => setTimeout(resolve, 300));

      const options = {
        margin: 0.2,
        filename: `DMF-Seat-Plan-2026.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          removeContainer: false,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById("seat-plan-cards");
            if (clonedElement) {
              clonedElement.style.display = "grid";
              clonedElement.style.visibility = "visible";
              clonedElement.style.opacity = "1";
              clonedElement.style.backgroundColor = "#ffffff";
              clonedElement.style.gridTemplateColumns = "repeat(3, 1fr)";
              clonedElement.style.gap = "12px";
            }
            
            // Ensure all roll numbers are properly styled
            const rollNumberSpans = clonedDoc.querySelectorAll('span[style*="fontWeight"]');
            rollNumberSpans.forEach((span) => {
              if (span.textContent && span.textContent.length > 1) {
                span.style.color = '#000000';
                span.style.fontWeight = 'bold';
                span.style.fontSize = '20px';
              }
            });
            
            // Add page break styles to cloned document
            const style = clonedDoc.createElement("style");
            style.textContent = `
              .seat-plan-card {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                display: block !important;
              }
              /* Break after every 21 cards (7 rows × 3 cards = 21 cards) */
              .seat-plan-card:nth-child(21n) {
                page-break-after: always !important;
                break-after: page !important;
                margin-bottom: 0 !important;
              }
              /* Ensure proper rendering of roll numbers */
              .seat-plan-card span[style*="fontWeight"] {
                display: inline-block !important;
                color: #000000 !important;
                font-weight: bold !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        },
        jsPDF: { 
          unit: "in", 
          format: "a4", 
          orientation: "portrait"
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] }
      };
      
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF: " + error.message);
    } finally {
      setPdfLoading(false);
    }
  };

  const renderSeatPlanCard = (student) => {
    const fullRollNumber = formatRollNumberWithGender(
      student?.scholarshipRollNumber || "",
      student?.gender
    );
    
    // Determine if female for color styling
    const isFemale = getGenderPrefix(student?.gender) === "F";
    
    // Color scheme: Vibrant Green for male, Beautiful Purple/Indigo for female
    const borderColor = isFemale ? "border-purple-600" : "border-green-600";
    const textColor = isFemale ? "text-purple-800" : "text-green-800";
    const textColorLight = isFemale ? "text-purple-700" : "text-green-700";
    const bgColor = isFemale ? "bg-purple-50" : "bg-green-50";
    // More vibrant and eye-catching colors - Purple/Indigo for female, Emerald Green for male
    const borderColorStyle = isFemale ? "#9333ea" : "#10b981"; // Vibrant purple for female, emerald green for male
    const textColorStyle = isFemale ? "#7e22ce" : "#047857"; // Deep purple for female, deep emerald for male
    const bgColorStyle = isFemale ? "#faf5ff" : "#ecfdf5"; // Light purple for female, light emerald for male
    
    return (
      <div
        className={`bg-white border-2 ${borderColor} shadow-sm print:shadow-none seat-plan-card`}
        style={{ 
          pageBreakInside: "avoid", 
          breakInside: "avoid",
          width: "100%", 
          minHeight: "100px",
          display: "block",
          visibility: "visible",
          opacity: "1",
          backgroundColor: "#ffffff"
        }}>
        <div className="p-3">
          {/* Header Section - Logo and Title */}
          <div className="flex items-center justify-between mb-2">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <img 
                src={DMFLogo} 
                alt="DMF Logo" 
                className="h-[45px] w-auto object-contain"
                crossOrigin="anonymous"
                loading="eager"
              />
            </div>
            
            {/* Title - Center */}
            <div className="flex-1 text-center px-2">
              <p className={`text-xs font-bold ${textColor} mb-0.5 bangla-text leading-tight`}>
                দারুল মুত্তাক্বীন ফাউন্ডেশন
              </p>
              <h2 className={`text-sm font-bold ${textColor} bangla-text leading-tight`}>
                আসন বিন্যাস
              </h2>
              <h3 className={`text-[10px] font-semibold ${textColorLight} leading-tight`}>
                DMF Scholarship 2026
              </h3>
            </div>

            {/* Empty space for balance */}
            <div className="flex-shrink-0 w-[45px]"></div>
          </div>

          {/* Roll Number Display - Full number with M/F */}
          <div 
            className={`text-center border-t-2 ${borderColor} pt-2`} 
            style={{ 
              borderTopColor: borderColorStyle,
              borderTopWidth: '2px',
              borderTopStyle: 'solid',
              paddingTop: '8px'
            }}>
            <div 
              style={{ 
                display: 'block',
                textAlign: 'center'
              }}>
              <span 
                style={{ 
                  display: 'inline-block',
                  color: '#000000',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  letterSpacing: '1px'
                }}>
                {fullRollNumber}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Action Button */}
      <div className="max-w-7xl mx-auto mb-4 print:hidden">
        <Button
          type="primary"
          onClick={downloadPDF}
          icon={<DownloadOutlined />}
          size="large"
          loading={pdfLoading}
          disabled={pdfLoading || !data || data.length === 0}>
          {pdfLoading ? "Generating PDF..." : "Download PDF"}
      </Button>
      </div>

      {/* Seat Plan Cards Grid - 3 cards per row, 7 rows per page (21 cards per page) */}
      <style>{`
        @media print {
          .seat-plan-card {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          /* Break after every 21 cards (7 rows × 3 cards = 21 cards) */
          .seat-plan-card:nth-child(21n) {
            page-break-after: always;
            break-after: page;
            margin-bottom: 0;
          }
          /* Ensure no break before the first card of a new page */
          .seat-plan-card:nth-child(21n + 1) {
            page-break-before: auto;
            break-before: auto;
          }
        }
        .seat-plan-card {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      `}</style>
      <div 
        id="seat-plan-cards"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 print:grid-cols-3 bg-white p-4"
        style={{ 
          display: "grid",
          visibility: "visible",
          opacity: "1",
          gridTemplateColumns: "repeat(3, 1fr)"
        }}>
        {data?.length > 0 ? (
          data.map((student, index) => (
            <div key={student._id} className="seat-plan-card">
              {renderSeatPlanCard(student)}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
