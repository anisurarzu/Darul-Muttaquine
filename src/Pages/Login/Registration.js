import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Input, Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { coreAxios } from "../../utilities/axios";
import Loader from "../../components/Loader/Loader";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import logo from "../../images/New-Main-2.png";

export default function Registration() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleRegister = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const response = await coreAxios.post("/register", values);
      if (response?.status === 201) {
        toast.success(
          "সফলভাবে নিবন্ধিত! অনুগ্রহ করে লগইনের জন্য অপেক্ষা করুন!"
        );

        // After successful registration, perform automatic login
        const loginResponse = await coreAxios.post("/login", {
          email: values.email,
          password: values.password,
        });

        if (loginResponse?.status === 200) {
          setLoading(false);
          toast.success("লগইন সফল");

          const { token } = loginResponse.data;

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

            // Redirect to the intended destination or dashboard
            history.replace("/dashboard");
          } catch (error) {
            console.error("ব্যবহারকারীর তথ্য আনতে ত্রুটি:", error);
          }
        }
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data?.message);
      console.log("err", error?.data?.message);
    }
    resetForm();
  };

  return (
    <div>
      <div
        className="min-h-screen flex items-center justify-center "
        style={{ background: "#DDEFC5" }}>
        <div className="!w-[330px] w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-30 h-20" />
          </div>
          <h1 className="text-3xl font-semibold text-center text-gray-500 mt-8 mb-6">
            নিবন্ধন
          </h1>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              username: "",
              email: "",
              password: "",
            }}
            onSubmit={handleRegister}>
            {({ isSubmitting }) => (
              <Form>
                {loading ? (
                  <Loader />
                ) : (
                  <div>
                    <div className="mb-4">
                      <label
                        htmlFor="firstName"
                        className="block mb-2 text-xl text-gray-600">
                        প্রথম নাম
                      </label>
                      <Field name="firstName">
                        {({ field }) => (
                          <Input
                            {...field}
                            id="firstName"
                            className="w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        )}
                      </Field>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="lastName"
                        className="block mb-2 text-xl text-gray-600">
                        শেষ নাম
                      </label>
                      <Field name="lastName">
                        {({ field }) => (
                          <Input
                            {...field}
                            id="lastName"
                            className="w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        )}
                      </Field>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="username"
                        className="block mb-2 text-xl text-gray-600">
                        ব্যবহারকারীর নাম
                      </label>
                      <Field name="username">
                        {({ field }) => (
                          <Input
                            {...field}
                            id="username"
                            className="w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        )}
                      </Field>
                    </div>
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
                              visible ? (
                                <EyeTwoTone />
                              ) : (
                                <EyeInvisibleOutlined />
                              )
                            }
                          />
                        )}
                      </Field>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-36 bg-[#73A63B] text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-4 text-[16px]">
                  নিবন্ধন
                </button>
              </Form>
            )}
          </Formik>
          <div className="text-center">
            <p className="text-2xl">
              ইতিমধ্যে একটি অ্যাকাউন্ট আছে?
              <Link to="/login" className="text-green-600 ml-1">
                লগ ইন
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
