import React, { useEffect, useRef, useState } from "react";
import { Card, Input, Button, Form, message, Skeleton } from "antd";
import { Html5Qrcode } from "html5-qrcode";

const ScholarshipPayment = () => {
  const [scholarshipID, setScholarshipID] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [cameraError, setCameraError] = useState(false);
  const scannerRef = useRef(null);
  const scannerId = "qr-reader";

  useEffect(() => {
    if (!scanning) return;

    const html5QrCode = new Html5Qrcode(scannerId);
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          const cameraId = cameras[0].id;

          await html5QrCode.start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              handleScanSuccess(html5QrCode, decodedText);
            },
            (errorMessage) => {
              // Ignore scan errors
            }
          );
        } else {
          setCameraError(true);
          message.error("No camera found. Please check your device.");
        }
      } catch (err) {
        console.error("Camera error:", err);
        setCameraError(true);
        message.error("Failed to access camera. Please check permissions.");
      }
    };

    const handleScanSuccess = (scanner, decodedText) => {
      scanner
        .stop()
        .then(() => {
          setScholarshipID(decodedText);
          setScanning(false);
          message.success("Scholarship ID scanned successfully!");
        })
        .catch((err) => {
          console.error("Failed to stop scanner:", err);
          message.error("Failed to stop scanner after scan.");
          setScanning(false);
          setScholarshipID(decodedText);
        });
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [scanning]);

  const handleWithdraw = async () => {
    if (!scholarshipID || !amount) {
      return message.warning("Please scan QR and enter amount.");
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 2000));
      message.success("Withdraw request sent successfully!");
      setAmount("");
      setScholarshipID(null);
      setScanning(true);
    } catch (error) {
      message.error("Withdraw request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card
        title="Scholarship Withdraw Request"
        className="w-full max-w-xl shadow-lg"
        headStyle={{ fontSize: "1.25rem", textAlign: "center" }}
      >
        {scanning ? (
          <div className="mb-4">
            <p className="text-center font-semibold text-green-700 mb-2">
              Scan Scholarship QR Code
            </p>
            {cameraError ? (
              <div className="text-center p-4 border rounded bg-gray-50">
                <p className="text-red-500 mb-2">Camera access failed</p>
                <Button
                  type="primary"
                  onClick={() => {
                    setCameraError(false);
                    setScanning(true);
                  }}
                >
                  Retry Camera Access
                </Button>
              </div>
            ) : (
              <div className="w-full h-[250px] border rounded bg-gray-50 flex items-center justify-center">
                <div id={scannerId} className="w-full h-full" />
              </div>
            )}
          </div>
        ) : (
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
              <Button
                type="link"
                onClick={() => {
                  setScholarshipID(null);
                  setScanning(true);
                }}
              >
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
