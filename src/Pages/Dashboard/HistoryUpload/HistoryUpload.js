import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Upload } from "antd";

const HistoryUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [historyName, setHistoryName] = useState("");
  const [historyDate, setHistoryDate] = useState("");
  const [historyDetails, setHistoryDetails] = useState("");

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const imgWindow = window.open(src);
    imgWindow?.document.write(`<img src="${src}" alt="Preview" />`);
  };

  const uploadFile = async () => {
    try {
      if (!fileList.length) {
        toast.error("Please select a file");
        return;
      }

      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("image", file.originFileObj);
      });
      formData.append("name", historyName);
      formData.append("date", historyDate);
      formData.append("details", historyDetails);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=YOUR_API_KEY",
        formData
      );

      // Assuming imgbb returns the image URL in response.data.data.url
      toast.success("Upload successful!");
      console.log("Uploaded image URL:", response.data.data.url);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="History Name"
        value={historyName}
        onChange={(e) => setHistoryName(e.target.value)}
      />
      <input
        type="text"
        placeholder="History Date"
        value={historyDate}
        onChange={(e) => setHistoryDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="History Details"
        value={historyDetails}
        onChange={(e) => setHistoryDetails(e.target.value)}
      />
      <button onClick={uploadFile}>Upload</button>

      <div>
        <Upload
          action=""
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          beforeUpload={() => false}>
          {fileList.length < 5 && "+ Upload"}
        </Upload>
      </div>
    </div>
  );
};

export default HistoryUpload;
