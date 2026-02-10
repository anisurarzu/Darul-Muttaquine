import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { message } from "antd";
import { Link, useHistory, useLocation } from "react-router-dom";
import { coreAxios } from "../../utilities/axios";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-700 via-green-600 to-green-500 px-4 py-8">
        <div className="w-full max-w-2xl md:max-w-3xl p-8 md:p-12 bg-white rounded-3xl shadow-2xl border-2 border-gray-100">
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl"></div>
          </div>

          <div className="h-8 md:h-10 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-xl mb-6"></div>

          <div className="space-y-6">
            <div>
              <div className="h-14 md:h-16 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-xl mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-3/4"></div>
            </div>

            <div>
              <div className="h-14 md:h-16 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-xl mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-3/4"></div>
            </div>
          </div>

          <div className="h-14 md:h-16 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-xl mt-8"></div>

          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-2/3 mx-auto mt-8"></div>

          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-1/2 mx-auto mt-10 pt-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-b from-green-700 via-green-600 to-green-500 px-4 py-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-[95%] xl:max-w-[90%] 2xl:max-w-7xl px-2 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center min-h-[calc(100vh-4rem)] py-6">
          {/* Left Side - Islamic Messages (Desktop) */}
          <div className="hidden lg:flex flex-col justify-center items-center space-y-6 p-4 xl:p-5 bg-white/95 rounded-3xl border-2 border-white/30 backdrop-blur-sm shadow-2xl lg:col-span-4">
            {/* Islamic Pattern/Icon */}
            <div className="w-32 h-32 xl:w-36 xl:h-36 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <svg className="w-20 h-20 xl:w-24 xl:h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
        </div>

            {/* Foundation Mission Statement */}
            <div className="text-center space-y-3">
              <div className="text-4xl xl:text-5xl text-green-600 mb-1">❝</div>
              <p className="text-base xl:text-lg font-bold text-gray-800 leading-relaxed">
                "শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে নিজেদের নিয়োজিত রাখা"
              </p>
              <div className="text-4xl xl:text-5xl text-green-600 mt-1">❞</div>
              <p className="text-xs xl:text-sm text-gray-600 mt-1">- দারুল মুত্তাক্বীন ফাউন্ডেশন</p>
            </div>

            {/* Hadith with Reference */}
            <div className="bg-green-50 p-4 xl:p-5 rounded-2xl shadow-lg border-l-4 border-green-600">
              <p className="text-sm xl:text-base text-gray-700 font-semibold text-center leading-relaxed mb-3">
                "যে ব্যক্তি জ্ঞান অন্বেষণ করে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন"
              </p>
              <div className="text-center space-y-1">
                <p className="text-xs xl:text-sm text-green-700 font-medium">- হাদীস শরীফ</p>
                <p className="text-xs text-gray-500">সহীহ মুসলিম, হাদীস নং: ২৬৯৯</p>
              </div>
            </div>

            {/* Decorative Islamic Pattern */}
            <div className="flex items-center justify-center space-x-3 mt-2">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent to-green-600"></div>
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <div className="w-16 h-1 bg-gradient-to-l from-transparent to-green-600"></div>
            </div>
          </div>

          {/* Mobile Islamic Message Banner */}
          <div className="lg:hidden mb-6 sm:mb-8 p-5 sm:p-6 bg-white/95 text-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white/30">
            <div className="text-center space-y-4">
              <div className="text-4xl sm:text-5xl mb-2 text-green-600">☪</div>
              <p className="text-base sm:text-lg font-bold leading-relaxed">
                "শুধুমাত্র আল্লাহর সন্তুষ্টির জন্য দ্বীন শিক্ষা, প্রচার-প্রসার ও কল্যাণকর কাজের মধ্যে নিজেদের নিয়োজিত রাখা"
              </p>
              <p className="text-sm sm:text-base text-gray-600">- দারুল মুত্তাক্বীন ফাউন্ডেশন</p>
            </div>
          </div>

          {/* Center - Login Form */}
          <div className="w-full p-6 sm:p-8 md:p-10 lg:p-10 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white/30 relative z-10 lg:col-span-4">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 text-green-800">
          লগ ইন করুন
        </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-2 font-medium">
          আপনার অ্যাকাউন্টে অ্যাক্সেস পেতে
        </p>
          <p className="text-sm md:text-base text-gray-600">
            দারুল মুত্তাক্বীন ফাউন্ডেশনের সদস্য হলে লগ ইন করুন
          </p>
        </div>

        {/* Enhanced Error Message */}
        {loginError && (
          <div className="mb-6 p-4 md:p-5 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-red-100 p-2 rounded-lg">
                <svg
                    className="h-5 w-5 md:h-6 md:w-6 text-red-600"
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
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base md:text-lg font-semibold text-red-800">{loginError}</p>
                <p className="text-sm md:text-base text-red-600 mt-1">
                  দয়া করে আবার চেষ্টা করুন বা পাসওয়ার্ড রিসেট করুন
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setLoginError("")}
                  className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-100 transition-colors">
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
              <div className="space-y-4 md:space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block mb-2 md:mb-3 text-base md:text-lg font-semibold text-gray-700">
                    <span className="flex items-center gap-2">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      ই-মেইল ঠিকানা
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 font-normal block mt-1">
                      আপনার নিবন্ধিত ই-মেইল ঠিকানা লিখুন
                    </span>
                  </label>
                  <Field name="email">
                    {({ field }) => (
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <svg
                              className="h-6 w-6 md:h-7 md:w-7 text-gray-400"
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
                            placeholder="উদাহরণ: example@email.com"
                            className={`w-full pl-14 md:pl-16 pr-5 py-4 md:py-5 text-lg md:text-xl border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                              errors.email && touched.email
                                ? "border-red-500 focus:ring-red-200 focus:border-red-600 bg-red-50"
                                : "border-gray-300 focus:ring-green-200 focus:border-green-600 bg-gray-50 focus:bg-white"
                            }`}
                          />
                        </div>
                        {errors.email && touched.email && (
                          <div className="flex items-center gap-2 text-red-600 text-sm md:text-base mt-2 bg-red-50 p-2 rounded-lg">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{errors.email}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block mb-2 md:mb-3 text-lg md:text-xl font-semibold text-gray-700">
                    <span className="flex items-center gap-2">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    পাসওয়ার্ড
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 font-normal block mt-1">
                      কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড লিখুন
                    </span>
                  </label>
                  <Field name="password">
                    {({ field }) => (
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <svg
                              className="h-6 w-6 md:h-7 md:w-7 text-gray-400"
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
                            type={showPassword ? "text" : "password"}
                            placeholder="আপনার পাসওয়ার্ড লিখুন"
                            className={`w-full pl-14 md:pl-16 pr-14 md:pr-16 py-4 md:py-5 text-lg md:text-xl border-2 rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                              errors.password && touched.password
                                ? "border-red-500 focus:ring-red-200 focus:border-red-600 bg-red-50"
                                : "border-gray-300 focus:ring-green-200 focus:border-green-600 bg-gray-50 focus:bg-white"
                            }`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}>
                            {showPassword ? (
                              <svg
                                className="h-5 w-5 md:h-6 md:w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                              </svg>
                            ) : (
                            <svg
                                className="h-5 w-5 md:h-6 md:w-6"
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
                            )}
                          </button>
                        </div>
                        {errors.password && touched.password && (
                          <div className="flex items-center gap-2 text-red-600 text-sm md:text-base mt-2 bg-red-50 p-2 rounded-lg">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{errors.password}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </Field>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs md:text-sm text-gray-500">
                      পাসওয়ার্ড ভুলে গেছেন?
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-base md:text-lg font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors">
                      পাসওয়ার্ড রিসেট করুন
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-8">
                <button
                  type="submit"
                  className={`w-full py-4 md:py-5 px-8 bg-green-600 hover:bg-green-700 text-white font-bold text-base md:text-lg lg:text-xl rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}>
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <svg
                        className="animate-spin h-5 w-5 md:h-6 md:w-6 text-white"
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
                      <span>লগ ইন হচ্ছে...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      লগ ইন করুন
                    </span>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Registration Link */}
        <div className="mt-6 md:mt-8 text-center">
          <div className="bg-green-50 p-4 md:p-5 rounded-2xl border-2 border-green-200 shadow-lg">
            <p className="text-gray-700 text-base md:text-lg mb-2 font-medium">
              নতুন ব্যবহারকারী?
            </p>
            <Link
              to="/registration"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-bold text-lg md:text-xl hover:underline transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              এখনই নিবন্ধন করুন
            </Link>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              নিবন্ধন করে আমাদের সেবা গ্রহণ করুন
          </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 md:mt-8 pt-4 border-t-2 border-gray-200">
          <p className="text-xs md:text-sm text-gray-500 text-center mb-1">
            © {new Date().getFullYear()} দারুল মুত্তাক্বীন ফাউন্ডেশন
          </p>
          <p className="text-xs text-gray-400 text-center">
            সকল অধিকার সংরক্ষিত
          </p>
        </div>
          </div>

          {/* Right Side - Islamic Icons & Messages (Desktop) */}
          <div className="hidden lg:flex flex-col justify-center items-center space-y-6 p-4 xl:p-5 bg-white/95 rounded-3xl border-2 border-white/30 backdrop-blur-sm shadow-2xl lg:col-span-4">
            {/* Islamic Star Pattern */}
            <div className="relative w-28 h-28 xl:w-32 xl:h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 xl:w-28 xl:h-28 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                  <svg className="w-16 h-16 xl:w-20 xl:h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Hadith with Reference */}
            <div className="text-center space-y-3">
              <div className="bg-green-50 p-4 xl:p-5 rounded-2xl shadow-lg border-l-4 border-green-600">
                <p className="text-sm xl:text-base text-gray-700 font-semibold mb-3 leading-relaxed">
                  "শিক্ষা গ্রহণ করা প্রত্যেক মুসলমান নর-নারীর উপর ফরজ"
                </p>
                <div className="text-center space-y-1">
                  <p className="text-xs xl:text-sm text-green-700 font-medium">- হাদীস শরীফ</p>
                  <p className="text-xs text-gray-500">সহীহ বুখারী, হাদীস নং: ১</p>
                  <p className="text-xs text-gray-500">সহীহ মুসলিম, হাদীস নং: ২২৪৬</p>
                </div>
              </div>
            </div>

            {/* Foundation Mission */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 xl:p-5 rounded-2xl shadow-xl w-full">
              <h3 className="text-lg xl:text-xl font-bold mb-3 text-center">আমাদের লক্ষ্য</h3>
              <ul className="space-y-2 text-xs xl:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-200 mt-0.5">✓</span>
                  <span>শিক্ষা প্রসার</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-200 mt-0.5">✓</span>
                  <span>দাওয়াহ কার্যক্রম</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-200 mt-0.5">✓</span>
                  <span>মানবকল্যাণ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-200 mt-0.5">✓</span>
                  <span>সমাজ উন্নয়ন</span>
                </li>
              </ul>
            </div>

            {/* Decorative Elements */}
            <div className="flex flex-col items-center space-y-3 mt-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <div className="w-12 h-1 bg-gradient-to-r from-green-600 to-green-500"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-4xl xl:text-5xl text-green-600">☪</div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="w-12 h-1 bg-gradient-to-l from-green-600 to-green-500"></div>
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
