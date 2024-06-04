import { Alert, Spin } from "antd";
import React from "react";

export default function Loader({ message, description }) {
  return (
    <Spin tip="Loading...">
      <Alert message={message} description={description} type="info" />
    </Spin>
  );
}
