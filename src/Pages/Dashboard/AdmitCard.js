import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { coreAxios } from "../../utilities/axios";

const AdmitCard = () => {
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

  return (
    <div className="">
      {/* Your admit card HTML content */}
      <h1>Admit Card</h1>
      <p>Name: {data?.scholarship?.name}</p>
      <p>Exam Date: 01/01/2025</p>
      {/* Add more fields as needed */}
      <button onClick={print}>Download Admit Card</button>
    </div>
  );
};

export default AdmitCard;
