import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { message } from "antd";
import { Link, useHistory, useLocation } from "react-router-dom";
import { coreAxios } from "../../utilities/axios";
import logo from "../../images/New-Main-2.png";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loginError, setLoginError] = useState("");
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "ই-মেইল প্রয়োজন";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "অবৈধ ই-মেইল ঠিকানা";
    }
    if (!values.password) {
      errors.password = "পাসওয়ার্ড প্রয়োজন";
    } else if (values.password.length < 4) {
      errors.password = "পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে";
    }
    return errors;
  };

  const handleLogin = async (values, { resetForm }) => {
    setLoginError("");
    setLoading(true);

    try {
      const response = await coreAxios.post("/login", values);

      if (response?.data?.success) {
        const { token, isVerified } = response.data;

        localStorage.setItem("token", token);

        try {
          const userInfoResponse = await coreAxios.get("/userinfo");
          localStorage.setItem(
            "userInfo",
            JSON.stringify({ ...userInfoResponse?.data, isVerified })
          );

          // Bigger success message (10s duration)
          message.success({
            content: response.data.message || "সফলভাবে লগইন হয়েছে!",
            style: { fontSize: "16px", fontWeight: "bold" },
            duration: 10,
          });

          setTimeout(() => {
            history.replace(location.state?.from || "/dashboard");
          }, 1000);
        } catch (error) {
          console.error("ব্যবহারকারীর তথ্য আনতে ত্রুটি:", error);
          message.error({
            content: "ব্যবহারকারীর তথ্য লোড করতে সমস্যা হয়েছে",
            style: { fontSize: "16px", fontWeight: "bold" },
            duration: 10,
          });
          setLoading(false);
        }
      } else {
        if (response.data.field === "email") {
          setLoginError("ভুল ইমেইল");
        } else if (response.data.field === "password") {
          setLoginError("ভুল পাসওয়ার্ড");
        } else {
          message.warning({
            content:
              response.data.message ||
              "আপনার অ্যাকাউন্ট ভেরিফাই করা হয়নি। দয়া করে অ্যাডমিনের সাথে যোগাযোগ করুন।",
            style: { fontSize: "16px", fontWeight: "bold" },
            duration: 10,
          });
        }
        setLoading(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        if (error.response.data.field === "email") {
          setLoginError("ভুল ইমেইল");
        } else {
          setLoginError("ভুল পাসওয়ার্ড");
        }
      } else if (error.response?.status === 403) {
        message.warning({
          content:
            error.response.data.message ||
            "আপনার অ্যাকাউন্ট ভেরিফাই করা হয়নি। দয়া করে অ্যাডমিনিস্ট্রেটর সাদ্দাম হোসেন এর সাথে যোগাযোগ করুন। (০১৭৫৭৮২৪৫৩১)",
          style: { fontSize: "16px", fontWeight: "bold" },
          duration: 10,
        });
      } else {
        setLoginError("লগইন করতে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন");
      }
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#DDEFC5]">
        <div className="w-[500px] p-10 bg-white rounded-xl shadow-lg">
          <div className="flex justify-center mb-8">
            <div className="w-40 h-40 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>

          <div className="h-10 bg-gray-200 animate-pulse rounded mb-6"></div>

          <div className="space-y-6">
            <div>
              <div className="h-16 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>

            <div>
              <div className="h-16 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          <div className="h-16 bg-gray-200 animate-pulse rounded mt-8"></div>

          <div className="h-4 bg-gray-200 animate-pulse rounded mt-8"></div>

          <div className="h-4 bg-gray-200 animate-pulse rounded mt-10 pt-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DDEFC5]">
      <div className="w-[500px] p-10 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className="w-40 h-auto transition-all hover:scale-105"
          />
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-700 mb-3">
          লগ ইন করুন
        </h1>
        <p className="text-center text-gray-500 mb-8 text-xl">
          আপনার অ্যাকাউন্টে অ্যাক্সেস পেতে
        </p>

        {loginError && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-lg">{loginError}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setLoginError("")}
                  className="text-red-500 hover:text-red-700">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validate={validateForm}
          onSubmit={handleLogin}
          validateOnChange={false}
          validateOnBlur={false}>
          {({ errors, touched }) => (
            <Form>
              <div className="space-y-6">
                <div>
                  <label className="block mb-3 text-xl font-medium text-gray-600">
                    ই-মেইল
                  </label>
                  <Field name="email">
                    {({ field }) => (
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-6 w-6 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <input
                            {...field}
                            type="email"
                            placeholder="আপনার ই-মেইল লিখুন"
                            className={`w-full pl-12 pr-4 py-4 text-xl border rounded-lg focus:outline-none focus:ring-2 ${
                              errors.email && touched.email
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:ring-green-200"
                            }`}
                          />
                        </div>
                        {errors.email && touched.email && (
                          <div className="text-red-500 text-lg mt-2">
                            {errors.email}
                          </div>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div>
                  <label className="block mb-3 text-xl font-medium text-gray-600">
                    পাসওয়ার্ড
                  </label>
                  <Field name="password">
                    {({ field }) => (
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                              className="h-6 w-6 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <input
                            {...field}
                            type="password"
                            placeholder="আপনার পাসওয়ার্ড লিখুন"
                            className={`w-full pl-12 pr-4 py-4 text-xl border rounded-lg focus:outline-none focus:ring-2 ${
                              errors.password && touched.password
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:ring-green-200"
                            }`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => {
                              const input = document.querySelector(
                                'input[name="password"]'
                              );
                              if (input.type === "password") {
                                input.type = "text";
                              } else {
                                input.type = "password";
                              }
                            }}>
                            <svg
                              className="h-6 w-6 text-gray-400 hover:text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </div>
                        {errors.password && touched.password && (
                          <div className="text-red-500 text-lg mt-2">
                            {errors.password}
                          </div>
                        )}
                      </div>
                    )}
                  </Field>
                  <div className="text-right mt-3">
                    <Link
                      to="/forgot-password"
                      className="text-lg text-green-600 hover:underline">
                      পাসওয়ার্ড ভুলে গেছেন?
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className={`w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-medium text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      লগ ইন হচ্ছে...
                    </div>
                  ) : (
                    "লগ ইন করুন"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-xl">
            নতুন ব্যবহারকারী?{" "}
            <Link
              to="/registration"
              className="text-green-600 font-medium hover:underline">
              নিবন্ধন করুন
            </Link>
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-lg text-gray-500 text-center">
            © {new Date().getFullYear()} দারুল মুততাক্বীন ফাউন্ডেশন
          </p>
        </div>
      </div>
    </div>
  );
}
