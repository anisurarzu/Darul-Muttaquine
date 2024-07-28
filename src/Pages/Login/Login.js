import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  Link,
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { coreAxios } from "../../utilities/axios";
import Loader from "../../components/Loader/Loader";

import logo from "../../images/dmf-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await coreAxios.post("/login", {
        email,
        password,
      });

      if (response?.status === 200) {
        setLoading(false);
        toast.success("Login successful");

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
          console.error("Error fetching user information:", error);
        }
      }

      // Handle successful login
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      // Handle login error
    }
  };

  return (
    <div>
      {/* <Navbar /> */}

      <div class="min-h-screen flex items-center justify-center bg-blue-50">
        <div class="!w-[330px] w-full p-6 bg-white rounded-lg shadow-lg">
          <div class="flex justify-center mb-8">
            <img src={logo} alt="Logo" class="w-30 h-20" />
          </div>
          <h1 class="text-3xl font-semibold text-center text-gray-500 mt-8 mb-6">
            Log In
          </h1>
          <form onSubmit={handleLogin}>
            {loading ? (
              <Loader />
            ) : (
              <div>
                <div class="mb-4">
                  <label for="email" class="block mb-2 text-xl text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    class="w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div class="mb-4">
                  <label
                    for="password"
                    class="block mb-2 text-xl text-gray-600">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    class="w-full px-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              class="w-36 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-4 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mb-2 text-[16px]">
              Log In
            </button>
          </form>
          <div class="text-center">
            <p class="text-2xl">
              Don't have any account?
              <Link to="/registration" class="text-cyan-600">
                Registration
              </Link>
            </p>
          </div>
          <p class="text-xs text-gray-600 text-center mt-8">
            &copy; 2024 Darul Muttaquine Foundation & Islamic Center
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
