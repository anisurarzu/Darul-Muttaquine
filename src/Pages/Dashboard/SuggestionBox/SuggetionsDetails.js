import React from "react";

export default function SuggetionsDetails({ rowData }) {
  return (
    <div>
      <h3 className="text-[17px] font-bold text-center underline py-4 text-green-700">
        {rowData?.title}
      </h3>
      <p>" {rowData?.description} "</p>
    </div>
  );
}
