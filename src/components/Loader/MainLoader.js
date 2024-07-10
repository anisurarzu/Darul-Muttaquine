// src/components/Loading.js
import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import logo from "../../images/dmf-logo-removebg.png"; // Adjust the path to your logo

const MainLoader = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <div className="flex justify-center items-center h-screen flex-col bg-gray-100">
      <img src={logo} alt="Logo" className="w-32 mb-4" />
      <Spin indicator={antIcon} />
    </div>
  );
};

export default MainLoader;
