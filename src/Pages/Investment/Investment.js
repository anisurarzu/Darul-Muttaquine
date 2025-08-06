import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, Button, Modal, Progress, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Investment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const handleLoginClick = () => {
    const today = new Date();
    const septemberFirst = new Date(today.getFullYear(), 8, 1); // Month is 0-indexed (8 = September)

    if (today >= septemberFirst) {
      setIsLoading(true);
      setProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsLoading(false);
            setIsModalVisible(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    } else {
      setShowLoginMessage(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Animation for money multiplication
  const MoneyAnimation = () => {
    const [coins, setCoins] = useState([]);

    useEffect(() => {
      const interval = setInterval(() => {
        setCoins((prev) => {
          const newCoin = {
            id: Date.now(),
            x: Math.random() * 100,
            y: 0,
            size: Math.random() * 10 + 5,
          };
          return [...prev.slice(-10), newCoin];
        });
      }, 300);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="relative h-20 w-full overflow-hidden">
        {coins.map((coin) => (
          <motion.div
            key={coin.id}
            initial={{ x: `${coin.x}%`, y: 0, opacity: 1 }}
            animate={{ y: 100, opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute"
            style={{
              width: `${coin.size}px`,
              height: `${coin.size}px`,
              backgroundColor: "#facc15",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
    );
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
        {/* Animated Investment Vector */}
        <motion.div
          className="relative w-60 h-60 mx-auto mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: [0.95, 1, 0.98, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2011/2011576.png"
            alt="Investment Animation"
            className="w-full h-full object-contain drop-shadow-xl"
          />
          {/* Money going in & out visual effect (simulated) */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex gap-2 animate-bounce">
            <div className="w-5 h-8 bg-green-500 rounded-sm shadow-md"></div>
            <div className="w-5 h-8 bg-green-400 rounded-sm shadow-md"></div>
          </div>
          <div className="absolute bottom-0 left-[-30px] flex flex-col items-center animate-pulse">
            <div className="w-6 h-10 bg-yellow-300 rounded shadow-md"></div>
            <span className="text-xs text-gray-700 mt-1">দুনিয়া</span>
          </div>
          <div className="absolute bottom-0 right-[-30px] flex flex-col items-center animate-pulse">
            <div className="w-6 h-10 bg-purple-300 rounded shadow-md"></div>
            <span className="text-xs text-gray-700 mt-1">আখিরাত</span>
          </div>
        </motion.div>

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
            <MoneyAnimation />
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

      {/* Directional Instruction Card */}
      <motion.div
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
      </motion.div>

      {/* Login Modal */}
      <Modal
        title={
          <span className="text-green-700">ইনভেস্টমেন্ট পোর্টাল লগইন</span>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width={400}
      >
        <div className="p-4">
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              ইনভেস্টমেন্ট আইডি
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 border border-green-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="আপনার আইডি লিখুন"
              />
              <UserOutlined className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type="password"
                className="w-full p-3 border border-green-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="আপনার পাসওয়ার্ড লিখুন"
              />
              <LockOutlined className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <Button
            type="primary"
            block
            size="large"
            className="bg-green-600 hover:bg-green-700 border-0 h-12 font-bold"
          >
            লগইন করুন
          </Button>

          <div className="mt-4 text-center text-sm text-gray-600">
            পাসওয়ার্ড ভুলে গেছেন?{" "}
            <a href="#" className="text-green-600 hover:underline">
              এখানে ক্লিক করুন
            </a>
          </div>
        </div>
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
