import React from "react";

export default function Footer() {
  return (
    <div className="py-16 text-15px lg:text-[17px] xl:text-[17px]  text-center mx-4">
      <p>
        স্বত্ব © 2024{" "}
        <span className="text-green-600">দারুল মুত্তাক্বীন ফাউন্ডেশন</span> -
        সর্ব স্বত্ব সংরক্ষিত। কারিগরি সহায়তায় ,
        <a
          className="text-green-600"
          href="https://anisur-rahman-me.netlify.app/"
          target="_blank"
          rel="noopener noreferrer">
          আনিছুর রহমান (Senior Software Engineer, BBL)
        </a>
      </p>
    </div>
  );
}
