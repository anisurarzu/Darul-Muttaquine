import React from "react";

export default function Footer() {
  return (
    <footer>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
        <path
          fill="#F3F4F6"
          fill-opacity="1"
          d="M0,144L48,133.3C96,123,192,101,288,104C384,107,480,133,576,128C672,123,768,85,864,74.7C960,64,1056,80,1152,90.7C1248,101,1344,107,1392,109.3L1440,112L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
        ></path>
      </svg>
      <div className="bg-[#F3F4F6]  py-8 px-4 md:px-12 text-center">
        <div className="max-w-6xl mx-auto text-gray-700 text-sm sm:text-base leading-relaxed">
          <p>
            স্বত্ব © ২০২৪{" "}
            <span className="text-green-600 font-semibold">
              দারুল মুত্তাক্বীন ফাউন্ডেশন
            </span>{" "}
            - সর্ব স্বত্ব সংরক্ষিত।
          </p>
          <p className="mt-2">
            কারিগরি সহায়তায়{" "}
            <a
              href="https://anisur-rahman-me.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-medium hover:underline transition-all"
            >
              আনিছুর রহমান (Senior Software Engineer, DIG)
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
