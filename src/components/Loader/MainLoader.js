// src/components/Loading.js
import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import logo from "../../images/dmf-logo-removebg.png"; // Adjust the path to your logo
// Adjust the path to your logo
import demo from "../../images/GIF/animation-1.gif";
const MainLoader = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <div>
      <div className="flex justify-center items-center h-screen flex-col bg-gray-100">
        <img src={logo} alt="Logo" className="w-32 mb-4" />
        {/* <Spin indicator={antIcon} /> */}
        <img src={demo} alt="Logo" className="w-40 lg:w-44 xl:w-44 mb-4" />
      </div>
    </div>
  );
};

export default MainLoader;
