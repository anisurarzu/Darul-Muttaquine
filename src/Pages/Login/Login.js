import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Input, Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { Link, useHistory, useLocation } from "react-router-dom";
import { coreAxios } from "../../utilities/axios";
import Loader from "../../components/Loader/Loader";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import logo from "../../images/New-Main-2.png";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const handleLogin = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const response = await coreAxios.post("/login", values);

      if (response?.status === 200) {
        setLoading(false);
        toast.success("লগইন সফল হয়েছে");

        const { token } = response.data;

        // Store the token in local storage
        localStorage.setItem("token", token);
        try {
          // Call the API to fetch user information
          const userInfoResponse = await coreAxios.get("/userinfo");
          // Store user information locally
          localStorage.setItem(
            "userInfo",
            JSON.stringify(userInfoResponse?.data)
          );

          // Redirect to the intended destination or dashboard if no destination is set
          history.replace(location.state?.from || "/dashboard");
          // Reload the page to reflect the login state
          window.location.reload();
        } catch (error) {
          console.error("ব্যবহারকারীর তথ্য আনতে ত্রুটি:", error);
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
    resetForm();
  };

  const handleFingerprintLogin = async () => {
    try {
      setLoading(true);
      const publicKey = {
        challenge: new Uint8Array(32),
        rp: { name: "Example Corp" },
        user: {
          id: new Uint8Array(16),
          name: "user@example.com",
          displayName: "User",
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: { authenticatorAttachment: "platform" },
        timeout: 60000,
        attestation: "none",
      };

      const credential = await navigator.credentials.create({ publicKey });

      if (credential) {
        setLoading(false);
        toast.success("Fingerprint authentication successful!");

        // In a real-world application, you'd verify the credential on the server
        history.replace(location.state?.from || "/dashboard");
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      toast.error("Fingerprint authentication failed. Please try again.");
      console.error("Fingerprint authentication failed:", error);
    }
  };

  return (
    <div>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#DDEFC5" }}>
        <div className="!w-[330px] w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-30 h-20" />
          </div>
          <h1 className="text-3xl font-semibold text-center text-gray-500 mt-8 mb-6">
            লগ ইন
          </h1>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleLogin}>
            {({ isSubmitting }) => (
              <Form>
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-xl text-gray-600">
                      ই-মেইল
                    </label>
                    <Field name="email">
                      {({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          id="email"
                          className="w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      )}
                    </Field>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-xl text-gray-600">
                      পাসওয়ার্ড
                    </label>
                    <Field name="password">
                      {({ field }) => (
                        <Input.Password
                          {...field}
                          id="password"
                          className="w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      )}
                    </Field>
                  </div>
                </div>
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    <button
                      loading={isSubmitting}
                      type="submit"
                      className="w-36 bg-[#73A63B] text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-4 text-[16px] pt-3">
                      লগ ইন
                    </button>
                    <Button
                      onClick={handleFingerprintLogin}
                      type="button"
                      className="w-36 bg-[#73A63B] text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-4 text-[16px]">
                      Fingerprint Login
                    </Button>
                  </>
                )}
              </Form>
            )}
          </Formik>
          <div className="text-center">
            <p className="text-2xl">
              কোনো একাউন্ট নেই?
              <Link to="/registration" className="text-green-600 ml-1">
                নিবন্ধন
              </Link>
            </p>
          </div>
          <p className="text-xs text-gray-600 text-center mt-8">
            &copy; ২০২৪ দারুল মুততাক্বীন ফাউন্ডেশন & ইসলামিক সেন্টার
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
