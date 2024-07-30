import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { FaUserPlus, FaQuestionCircle } from "react-icons/fa"; // Import icons

export default function QuizeMainPage() {
  return (
    <div className="min-h-screen bg-gray-100 ">
      <div style={{ background: "#BDDE98" }}>
        <h2
          className="text-white font-semibold text-2xl md:text-[33px] py-4 lg:py-12 xl:py-12 text-center bangla-text"
          style={{ color: "#2F5811" }}>
          ইসলামিক কুইজ
        </h2>
      </div>

      <div className="flex flex-col items-center py-8 px-8 sm:px-8 lg:px-12 ">
        <div className="text-center mb-6">
          <FaQuestionCircle className="text-[70px] text-green-600 mb-4 mx-auto py-4" />
          <p className="text-2xl md:text-3xl mb-4">
            কুইজ শুরু করার আগে আপনাকে একটি অ্যাকাউন্ট তৈরি করতে হবে। যদি আপনার
            কোনো অ্যাকাউন্ট না থাকে, তাহলে এই লিঙ্কে
            <Link
              to="/login"
              className="underline ml-2 bangla-text"
              style={{ color: "#4A7C1D" }}>
              অ্যাকাউন্ট তৈরি করুন
            </Link>
            ।
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Link to="/quize">
            <Button
              type="primary"
              style={{ backgroundColor: "#73A63B", borderColor: "#73A63B" }}
              className="text-white text-xl flex items-center">
              <FaQuestionCircle className="mr-2" />
              কুইজে প্রবেশ করুন
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
