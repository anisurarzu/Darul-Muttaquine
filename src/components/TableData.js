import { Tag } from "antd";
import React from "react";

export default function TableData({ status, data }) {
  return (
    <div>
      <Tag
        color={`${
          status === "Approved"
            ? "success"
            : status === "Rejected"
            ? "error"
            : status === "Hold"
            ? "warning"
            : "processing"
        }`}>
        {data}
      </Tag>
    </div>
  );
}
