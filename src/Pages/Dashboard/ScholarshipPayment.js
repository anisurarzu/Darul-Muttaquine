import React, { useState } from "react";
import { Card, Input, Button, Form, message, Skeleton } from "antd";
import QrScanner from "react-qr-scanner";

const ScholarshipPayment = () => {
  const [scholarshipID, setScholarshipID] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(true);

  const handleScan = (data) => {
    if (data && data.text && scanning) {
      setScholarshipID(data.text);
      setScanning(false);
      message.success("Scholarship ID scanned!");
    }
  };

  const handleError = (err) => {
    console.error(err);
    message.error("QR scan error.");
  };

  const handleWithdraw = async () => {
    if (!scholarshipID || !amount) {
      return message.warning("Please scan QR and enter amount.");
    }

    setLoading(true);
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      message.success("Withdraw request submitted successfully!");
      setScholarshipID(null);
      setAmount("");
      setScanning(true);
    } catch (error) {
      message.error("Withdraw request failed.");
    } finally {
      setLoading(false);
    }
  };

  // Camera constraints for back camera
  const videoConstraints = {
    facingMode: { exact: "environment" },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card
        title="Scholarship Withdraw Request"
        className="w-full max-w-xl shadow-lg"
        headStyle={{ fontSize: "1.25rem", textAlign: "center" }}
      >
        {scanning && (
          <div className="mb-4">
            <p className="text-center font-semibold text-green-700">
              Scan Scholarship QR Code
            </p>
            <div className="w-full h-[250px] border rounded overflow-hidden">
              <QrScanner
                delay={300}
                style={{ width: "100%" }}
                onError={handleError}
                onScan={handleScan}
                constraints={{ video: videoConstraints }}
              />
            </div>
          </div>
        )}

        {!scanning && (
          <>
            {loading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <Form layout="vertical" onFinish={handleWithdraw}>
                <Form.Item label="Scholarship ID">
                  <Input value={scholarshipID} disabled />
                </Form.Item>
                <Form.Item
                  label="Withdraw Amount"
                  rules={[
                    { required: true, message: "Please enter an amount" },
                  ]}
                >
                  <Input
                    placeholder="Enter amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-green-600 hover:bg-green-700 w-full"
                    loading={loading}
                  >
                    Submit Withdraw Request
                  </Button>
                </Form.Item>
              </Form>
            )}

            <div className="text-center mt-2">
              <Button type="link" onClick={() => setScanning(true)}>
                Scan Another QR
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ScholarshipPayment;
