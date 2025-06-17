import React, { useEffect, useRef, useState } from "react";
import { Card, Input, Button, Form, message, Skeleton, Switch } from "antd";
import { Html5Qrcode } from "html5-qrcode";
import { SyncOutlined } from "@ant-design/icons";

const ScholarshipPayment = () => {
  const [scholarshipID, setScholarshipID] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [cameraError, setCameraError] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const scannerRef = useRef(null);
  const scannerId = "qr-reader";

  // Function to detect mobile devices
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Function to get all available cameras
  const getAvailableCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        setCameras(devices);
        return devices;
      }
      return null;
    } catch (err) {
      console.error("Error getting cameras:", err);
      return null;
    }
  };

  // Function to start scanner with specific camera
  const startScanner = async (cameraIndex = 0) => {
    if (!scanning) return;

    const html5QrCode = new Html5Qrcode(scannerId);
    scannerRef.current = html5QrCode;

    try {
      const availableCameras = await getAvailableCameras();
      if (!availableCameras || availableCameras.length === 0) {
        setCameraError(true);
        message.error("No camera found. Please check your device.");
        return;
      }

      // Ensure the index is within bounds
      const index = Math.min(cameraIndex, availableCameras.length - 1);
      const camera = availableCameras[index];

      await html5QrCode.start(
        camera.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          facingMode:
            isMobileDevice() && !isFrontCamera ? "environment" : "user",
        },
        (decodedText) => {
          handleScanSuccess(html5QrCode, decodedText);
        },
        (errorMessage) => {
          // Ignore scan errors
        }
      );

      setCurrentCameraIndex(index);
      setIsFrontCamera(
        camera.label.toLowerCase().includes("front") ||
          camera.label.toLowerCase().includes("user") ||
          camera.label.toLowerCase().includes("1")
      );
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

  const switchCamera = () => {
    if (cameras.length < 2) {
      message.warning("Only one camera available");
      return;
    }

    const newIndex = (currentCameraIndex + 1) % cameras.length;
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        startScanner(newIndex);
      });
    }
  };

  useEffect(() => {
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
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-green-700">
                Scan Scholarship QR Code
              </p>
              {cameras.length > 1 && (
                <Button
                  icon={<SyncOutlined />}
                  onClick={switchCamera}
                  type="text"
                  size="small"
                >
                  Switch Camera
                </Button>
              )}
            </div>
            {cameraError ? (
              <div className="text-center p-4 border rounded bg-gray-50">
                <p className="text-red-500 mb-2">Camera access failed</p>
                <p className="text-sm text-gray-600 mb-3">
                  Please ensure you've granted camera permissions and try again.
                </p>
                <Button
                  type="primary"
                  onClick={() => {
                    setCameraError(false);
                    startScanner();
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
