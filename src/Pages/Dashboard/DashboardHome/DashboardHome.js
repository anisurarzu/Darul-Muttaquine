import React, { useState } from "react";
import useUserInfo from "../../../hooks/useUserInfo";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { coreAxios } from "../../../utilities/axios";
import { Alert } from "antd";
import { Spin } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom";

export default function DashboardHome() {
  const userInfo = useUserInfo();
  const [users, setUsers] = useState([]);
  const [scholarShipInfo, setScholarShipInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const getAllUserList = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/users`);
      if (response?.status === 200) {
        setLoading(false);
        setUsers(response?.data);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data?.message);
    }
  };
  const getScholarShipInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get(`/scholarship-info`);
      if (response?.status === 200) {
        setLoading(false);
        setScholarShipInfo(response?.data);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data?.message);
    }
  };
  const percentage = ((Number(scholarShipInfo?.length) / 249) * 100).toFixed(2);

  useEffect(() => {
    getAllUserList();
    getScholarShipInfo();
  }, []);

  return (
    <div>
      {loading ? (
        <Spin tip="Loading...">
          <Alert
            message="Alert message title"
            description="Further details about the context of this alert."
            type="info"
          />
        </Spin>
      ) : (
        <div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div class="flex justify-between mb-6">
                <div>
                  <div class="flex items-center mb-1">
                    <div class="text-2xl font-semibold">{users?.length}</div>
                  </div>
                  <div class="text-sm font-medium text-gray-400">Users</div>
                </div>
                <div class="dropdown">
                  <button
                    type="button"
                    class="dropdown-toggle text-gray-400 hover:text-gray-600">
                    <i class="ri-more-fill"></i>
                  </button>
                  <ul class="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                    <li>
                      <a
                        href="#"
                        class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <a
                href="/gebruikers"
                class="text-[#f84525] font-medium text-sm hover:text-red-800">
                View
              </a>
            </div>
            <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div class="flex justify-between mb-4">
                <div>
                  <div class="flex items-center mb-1">
                    <div class="text-2xl font-semibold">
                      {scholarShipInfo?.length}
                    </div>
                    <div class="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[12px] font-semibold leading-none ml-2">
                      +{percentage}%
                    </div>
                  </div>
                  <div class="text-sm font-medium text-gray-400">
                    Applications
                  </div>
                </div>
                <div class="dropdown">
                  <button
                    type="button"
                    class="dropdown-toggle text-gray-400 hover:text-gray-600">
                    <i class="ri-more-fill"></i>
                  </button>
                </div>
              </div>
              <Link
                to="/dashboard/scholarship"
                class="text-[#f84525] font-medium text-sm hover:text-red-800">
                View
              </Link>
            </div>
            <div class="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div class="flex justify-between mb-6">
                <div>
                  <div class="text-2xl font-semibold mb-1">100</div>
                  <div class="text-sm font-medium text-gray-400">Blogs</div>
                </div>
                <div class="dropdown">
                  <button
                    type="button"
                    class="dropdown-toggle text-gray-400 hover:text-gray-600">
                    <i class="ri-more-fill"></i>
                  </button>
                  <ul class="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                    <li>
                      <a
                        href="#"
                        class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <a
                href=""
                class="text-[#f84525] font-medium text-sm hover:text-red-800">
                View
              </a>
            </div>
          </div>
          {/* <Chart type="bar" data={chartData} options={chartOptions} /> */}
        </div>
      )}
    </div>
  );
}
