import React, { useState } from "react";
import {
  Link,
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { coreAxios } from "../../utilities/axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, Input } from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Loader from "../../components/Loader/Loader";
import logo from "../../images/dmf-logo.png";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("অবৈধ ইমেইল").required("ইমেইল প্রয়োজন"),
  password: Yup.string().required("পাসওয়ার্ড প্রয়োজন"),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const handleLogin = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const response = await coreAxios.post("/login", {
        email: values.email,
        password: values.password,
      });

      if (response?.status === 200) {
        setLoading(false);
        toast.success("লগইন সফল হয়েছে");

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
          console.error("ব্যবহারকারীর তথ্য আনতে সমস্যা:", error);
        }
      }

      // Reset the form
      resetForm();
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      // Handle login error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="!w-[330px] w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-30 h-20" />
        </div>
        <h1 className="text-3xl font-semibold text-center text-gray-500 mt-8 mb-6">
          লগইন করুন
        </h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}>
          {({ errors, touched }) => (
            <Form>
              {loading ? (
                <Loader />
              ) : (
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-xl text-gray-600">
                      ইমেইল
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.email && touched.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && touched.email ? (
                      <div className="text-red-500">{errors.email}</div>
                    ) : null}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-xl text-gray-600">
                      পাসওয়ার্ড
                    </label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className={`w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {errors.password && touched.password ? (
                      <div className="text-red-500">{errors.password}</div>
                    ) : null}
                  </div>
                </div>
              )}
              <Button
                type="primary"
                htmlType="submit"
                className="w-full text-white py-2 rounded-lg mx-auto block mb-4 text-[16px]"
                style={{
                  background: "linear-gradient(to right, #38a169, #2f855a)",
                  borderColor: "#2f855a",
                }}>
                লগইন
              </Button>
            </Form>
          )}
        </Formik>
        <div className="text-center">
          <p className="text-2xl">
            কোনো একাউন্ট নেই?{" "}
            <Link to="/registration" className="text-green-600">
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </div>
        <p className="text-xs text-gray-600 text-center mt-8">
          &copy; ২০২৪ দারুল মুতাক্কিন ফাউন্ডেশন & ইসলামিক সেন্টার
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
