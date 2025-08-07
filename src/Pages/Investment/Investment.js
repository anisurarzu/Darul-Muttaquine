import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, Button, Modal, Progress, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import investmentGif from "../../images/GIF/investment.gif";
import investmentLogo from "../../images/GIF/i-logo.gif";
import InvestmentLogin from "./InvestmentLogin";

const Investment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const handleLoginClick = () => {
    setIsModalVisible(true);
    // const today = new Date();
    // const septemberFirst = new Date(today.getFullYear(), 8, 1); // Month is 0-indexed (8 = September)

    // if (today >= septemberFirst) {
    //   setIsLoading(true);
    //   setProgress(0);

    //   // Simulate progress
    //   const interval = setInterval(() => {
    //     setProgress((prev) => {
    //       if (prev >= 100) {
    //         clearInterval(interval);
    //         setIsLoading(false);
    //         setIsModalVisible(true);
    //         return 100;
    //       }
    //       return prev + 10;
    //     });
    //   }, 200);
    // } else {
    //   setShowLoginMessage(true);
    // }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-lime-100 px-4 md:px-10 py-12"
      style={{ fontFamily: "'Noto Sans Bengali', 'Hind Siliguri', sans-serif" }}
    >
      {/* Animated Vector + Title */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-12 relative"
      >
        {/* GIF Animation */}
        <div className="relative w-[200px] h-[150px] mx-auto mb-6">
          <img
            src={investmentLogo} // Make sure this path matches your GIF location
            alt="Investment Animation"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-emerald-700 drop-shadow-sm">
          ডিএমএফ ইনভেস্টমেন্ট লগইন পোর্টাল
        </h1>
        <p className="mt-4 text-gray-800 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          দারুল মুত্তাক্বীন ফাউন্ডেশন-এর শরীয়তসম্মত, লাভজনক ও অংশীদারিত্বভিত্তিক
          ইনভেস্টমেন্ট কার্যক্রমে আপনাকে স্বাগতম।
        </p>
      </motion.div>

      {/* Login Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 mb-12"
      >
        <Button
          type="primary"
          size="large"
          icon={<UserOutlined />}
          onClick={handleLoginClick}
          className="bg-green-600 hover:bg-green-700 border-0 text-white font-bold py-4 px-8 rounded-full shadow-lg"
        >
          লগইন করুন
        </Button>

        {isLoading && (
          <div className="mt-6 max-w-md mx-auto">
            <Progress
              percent={progress}
              status="active"
              strokeColor="#16a34a"
            />
            <p className="mt-2 text-gray-600">লগইন পোর্টাল লোড হচ্ছে...</p>
          </div>
        )}

        {showLoginMessage && (
          <div className="mt-6 max-w-md mx-auto">
            <Alert
              message="লগইন সেবা"
              description={`বর্তমানে লগইন পোর্টাল বন্ধ রয়েছে। ${new Date().getFullYear()} সালের ১লা সেপ্টেম্বর থেকে এটি পুনরায় চালু হবে।`}
              type="info"
              showIcon
              closable
              onClose={() => setShowLoginMessage(false)}
            />
          </div>
        )}
      </motion.div>

      <div className="relative w-[220px] h-[220px] mx-auto mb-6">
        <img
          src={investmentGif} // Make sure this path matches your GIF location
          alt="Investment Animation"
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </div>

      {/* Directional Instruction Card */}
      {/* <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card
          title="🔐 লগইন নির্দেশনা"
          className="border-2 border-green-300 shadow-xl rounded-xl bg-white"
          headStyle={{
            background: "linear-gradient(to right, #166534, #22c55e)",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
          bodyStyle={{ backgroundColor: "#f0fdf4", padding: "1.5rem" }}
        >
          <ul className="space-y-3 text-gray-800 text-base leading-relaxed">
            <li>
              ✅ লগইন করার পূর্বে আপনার ইনভেস্টমেন্ট আইডি এবং পাসওয়ার্ড সংগ্রহ
              করুন।
            </li>
            <li>
              📌 আইডি ও পাসওয়ার্ড সরবরাহ করা হবে{" "}
              <strong>ফাউন্ডেশনের এডমিন</strong> এর মাধ্যমে।
            </li>
            <li>🔐 সংগ্রহকৃত তথ্য ব্যবহার করে লগইন পেইজে প্রবেশ করুন।</li>
            <li>
              ℹ️ আইডি/পাসওয়ার্ড সংক্রান্ত কোন জটিলতায় ফাউন্ডেশন অফিসে যোগাযোগ
              করুন।
            </li>
            <li>
              🕓 লগইন করার সময় আপনার তথ্য গোপনীয় রাখুন এবং অন্যের সাথে শেয়ার
              করবেন না।
            </li>
          </ul>
        </Card>
      </motion.div> */}

      {/* Login Modal */}
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width={400}
      >
        <InvestmentLogin />
      </Modal>

      {/* Footer */}
      <div className="text-center mt-12 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} দারুল মুত্তাক্বীন ফাউন্ডেশন | সমস্ত
        অধিকার সংরক্ষিত
      </div>
    </div>
  );
};

export default Investment;
