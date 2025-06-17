import React, { useEffect, useState } from "react";
import { Button, Input, message, Popconfirm } from "antd";
import { coreAxios } from "../../utilities/axios";

const ScholarshipFund = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [scholarshipID, setScholarshipID] = useState("");

  // Load all data initially
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await coreAxios.get("/scholarship-cost-info");
      setData(response.data || []);
      setFiltered(response.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  // Load specific scholarship data
  const fetchByScholarshipID = async () => {
    if (!scholarshipID.trim()) {
      message.warning("অনুগ্রহ করে একটি Scholarship ID লিখুন");
      return;
    }

    setLoading(true);
    try {
      const response = await coreAxios.get(
        `/scholarship-cost-info/${scholarshipID}`
      );
      const responseData = response.data;
      const arrayData = Array.isArray(responseData)
        ? responseData
        : [responseData];
      setData(arrayData);
      setFiltered(arrayData);
    } catch (error) {
      console.error("Scholarship ID fetch error:", error);
      message.error("Scholarship ID দিয়ে তথ্য খুঁজে পাওয়া যায়নি");
    } finally {
      setLoading(false);
    }
  };

  // Global text search
  const handleGlobalSearch = (text) => {
    setSearchText(text);
    const lowerText = text.toLowerCase();
    const result = data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(lowerText)
      )
    );
    setFiltered(result);
  };

  // Delete a row using _id
  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await coreAxios.delete(`/scholarship-cost-info/${id}`);
      message.success("ডেটা সফলভাবে মুছে ফেলা হয়েছে");
      fetchAllData(); // Refresh data after delete
    } catch (error) {
      console.error("Delete error:", error);
      message.error("ডেটা মুছতে ব্যর্থ হয়েছে");
    }
  };

  // Approve status
  const handleApprove = async (id) => {
    try {
      await coreAxios.patch(`/scholarship-cost-info/${id}`, {
        status: "approved",
      });
      message.success("স্ট্যাটাস 'approved' সেট হয়েছে");
      fetchAllData();
    } catch (error) {
      console.error("Approve error:", error);
      message.error("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-md">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Scholarship ID অনুসন্ধান"
            value={scholarshipID}
            onChange={(e) => setScholarshipID(e.target.value)}
            className="w-64"
          />
          <Button type="primary" onClick={fetchByScholarshipID}>
            ID দিয়ে খুঁজুন
          </Button>
          <Button type="default" onClick={fetchAllData}>
            সব তথ্য দেখুন
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="গ্লোবাল সার্চ"
            value={searchText}
            onChange={(e) => handleGlobalSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <table className="min-w-full border border-gray-300 text-base text-left">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Scholarship ID",
                  "Amount",
                  "Payment Method",
                  "Fund Name",
                  "Current Balance",
                  "Request Date",
                  "Action",
                ].map((col, i) => (
                  <th key={i} className="border px-3 py-2">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {[...Array(7)].map((_, colIdx) => (
                    <td key={colIdx} className="border px-3 py-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full border border-gray-300 text-base text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Scholarship ID</th>
                <th className="border px-3 py-2">Amount</th>
                <th className="border px-3 py-2">Payment Method</th>
                <th className="border px-3 py-2">Fund Name</th>
                <th className="border px-3 py-2">Current Balance</th>
                <th className="border px-3 py-2">Request Date</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    কোনো তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item._id}
                    className={item.status === "approved" ? "bg-green-100" : ""}
                  >
                    <td className="border px-3 py-2">{item.scholarshipID}</td>
                    <td className="border px-3 py-2">{item.amount}</td>
                    <td className="border px-3 py-2">{item.paymentMethod}</td>
                    <td className="border px-3 py-2">{item.fundName}</td>
                    <td className="border px-3 py-2">{item.currentBalance}</td>
                    <td className="border px-3 py-2">
                      {new Date(item.requestDate).toLocaleString("bn-BD")}
                    </td>
                    <td className="border px-3 py-2">
                      <div className="flex gap-2">
                        {item.status !== "approved" && (
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => handleApprove(item._id)}
                          >
                            Approve
                          </Button>
                        )}
                        <Popconfirm
                          title="আপনি কি নিশ্চিত?"
                          onConfirm={() => handleDelete(item._id)}
                          okText="হ্যাঁ"
                          cancelText="না"
                        >
                          <Button type="link" danger size="small">
                            মুছুন
                          </Button>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ScholarshipFund;
