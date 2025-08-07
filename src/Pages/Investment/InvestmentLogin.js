import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Button, Form, Input, Alert, Progress, Skeleton } from "antd";
import { LockOutlined, IdcardOutlined } from "@ant-design/icons";
import investmentLogo from "../../images/GIF/i-logo.gif";

const InvestmentLogin = () => {
  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  const userID = [{ ID: "DMI-001", PINCode: "12345" }];

  useEffect(() => {
    const sessionData = JSON.parse(sessionStorage.getItem("investmentAuth"));
    if (sessionData && sessionData.loggedIn && sessionData.investmentID) {
      setAlreadyLoggedIn(true);
    }
  }, []);

  const simulateProgress = () => {
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);
      if (value >= 100) clearInterval(interval);
    }, 100);
  };

  const onFinish = (values) => {
    setError("");
    setLoading(true);
    setProgress(0);
    simulateProgress();

    setTimeout(() => {
      const user = userID.find(
        (u) => u.ID === values.investmentID && u.PINCode === values.pinCode
      );

      if (user) {
        sessionStorage.setItem(
          "investmentAuth",
          JSON.stringify({
            investmentID: values.investmentID,
            loggedIn: true,
            timestamp: new Date().getTime(),
          })
        );
        history.push("/investment-profile");
      } else {
        setError("ইনভেস্টমেন্ট আইডি বা পিন সঠিক নয়!");
      }
      setLoading(false);
    }, 1000);
  };

  const handleRedirect = () => {
    history.push("/investment-profile");
  };

  return (
    <Card className="border-0 shadow-md" bodyStyle={{ padding: "1.5rem" }}>
      <div className="flex flex-col items-center mb-4">
        <img
          src={investmentLogo}
          alt="Investment Logo"
          className="w-20 h-20 mb-2"
        />
        <h2 className="text-lg font-semibold text-emerald-700">
          ইনভেস্টমেন্ট লগইন
        </h2>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError("")}
          className="mb-4"
        />
      )}

      {alreadyLoggedIn ? (
        <Button
          onClick={handleRedirect}
          type="primary"
          block
          size="large"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-14"
        >
          প্রোফাইলে যান
        </Button>
      ) : loading ? (
        <>
          <Skeleton active paragraph={{ rows: 4 }} className="mb-4" />
          <Progress
            percent={progress}
            strokeColor={{
              "0%": "#108ee9",
              "50%": "#87d068",
              "100%": "#52c41a",
            }}
            status={progress === 100 ? "success" : "active"}
            className="mb-2"
          />
        </>
      ) : (
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="ইনভেস্টমেন্ট আইডি"
            name="investmentID"
            rules={[{ required: true, message: "আইডি দিন" }]}
          >
            <Input
              size="large"
              prefix={<IdcardOutlined className="text-gray-400" />}
              placeholder="DMI-001"
            />
          </Form.Item>

          <Form.Item
            label="পিন কোড"
            name="pinCode"
            rules={[
              { required: true, message: "পিন কোড দিন" },
              { min: 5, message: "পিন কমপক্ষে ৫ ডিজিট হতে হবে" },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="*****"
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              block
              size="large"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-14"
            >
              লগইন করুন
            </Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default InvestmentLogin;
