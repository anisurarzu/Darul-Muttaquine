import React, { useState } from "react";
import { Steps, Divider, Typography, Badge, Button, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { coreAxios } from "../../utilities/axios";

const { Title, Text } = Typography;
const { Step } = Steps;

const OrderTrack = ({ orderData, setOrderData }) => {
  const [orderNo, setOrderNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const response = await coreAxios.get(`/order-info/${orderNo}`);
      setOrderData(response.data);
      setError(null);
      setOrderNo("");
    } catch (err) {
      setError(
        "অর্ডার তথ্য পাওয়া যায়নি। দয়া করে নিশ্চিত করুন যে আপনার অর্ডার নম্বর সঠিক।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Alert
        className="pt-2"
        message="অর্ডার ট্র্যাকিং"
        description="আপনি অর্ডার নম্বর দ্বারা আপনার অর্ডার ট্র্যাক করতে পারেন। অনুগ্রহ করে নিচের দিকে আপনার অর্ডার নম্বর লিখুন।"
        type="info"
        showIcon
      />
      <div className="my-4">
        <input
          type="text"
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          placeholder="অর্ডার নম্বর"
          className="px-8 py-2 border border-gray-300 rounded"
        />
        <Button
          type="primary"
          onClick={fetchOrderData}
          loading={loading}
          className="ml-2">
          ট্র্যাক করুন
        </Button>
      </div>

      {error && <Alert message={error} type="error" showIcon />}
      {orderData && (
        <div>
          <Divider orientation="left">অর্ডার ট্র্যাকিং</Divider>
          <Steps
            current={
              orderData.orderStatus === "Pending"
                ? 0
                : orderData.orderStatus === "Processing"
                ? 1
                : orderData.orderStatus === "Delivered"
                ? 2
                : 3
            }
            style={{ width: "80%", margin: "0 auto" }}>
            <Step title="অর্ডার গ্রহণ" />
            <Step title="প্রসেসিং" />
            <Step title="ডেলিভারি" />
            <Step title="ডেলিভারড" />
          </Steps>
          <div className="mt-4">
            <Title level={4}>অর্ডার বিস্তারিত</Title>
            <Text>অর্ডার নম্বর: {orderData.orderNo}</Text>
            <br />
            <Text>স্ট্যাটাস: {orderData.orderStatus}</Text>
            <br />
            <Text>
              অর্ডার তারিখ: {new Date(orderData.orderDate).toLocaleDateString()}
            </Text>
            <br />
            <Text>সর্বমোট মূল্য: ৳{orderData.totalAmount.toFixed(2)}</Text>
            <br />
            <Title level={5}>গ্রাহক তথ্য</Title>
            <Text>নাম: {orderData.fullName}</Text>
            <br />
            <Text>ফোন নম্বর: {orderData.phoneNumber}</Text>
            <br />
            <Text>
              ঠিকানা: {orderData.address}, {orderData.city}
            </Text>
            <br />
            <Text>ইমেইল: {orderData.email}</Text>
            <br />
            <Text>ট্রানজেকশন আইডি: {orderData.trxId}</Text>
            <br />
            <Title level={5}>কার্টের বিস্তারিত</Title>
            {Object.values(orderData.cartDetails).map((item) => (
              <div key={item.id} className="mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover mb-2"
                />
                <Text className="font-semibold">
                  {item.name} ({item.version})
                </Text>
                <br />
                {/* <Text>মূল্য: ৳{item.price.toFixed(2)}</Text> */}
                <br />
                <Text>পরিমাণ: {item.quantity}</Text>{" "}
                <Text>Size: {orderData.size}</Text>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrack;
