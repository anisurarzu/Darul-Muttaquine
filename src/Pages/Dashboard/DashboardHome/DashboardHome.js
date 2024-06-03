import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { coreAxios } from "../../../utilities/axios";
import { Alert } from "antd";
import { Spin } from "antd";

import ProfileCard from "../Profile/ProfileCard";
import ProjectCard from "../Project/ProjectCard";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [users, setUsers] = useState([]);
  const [scholarShipInfo, setScholarShipInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState([]);
  const [depositData, setDepositData] = useState([]);
  const [singleDepositData, setSingleDepositData] = useState([]);

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
  const getProjectInfo = async () => {
    try {
      setLoading(true);
      const response = await coreAxios.get("project-info");
      if (response?.status === 200) {
        const sortedData = response?.data?.sort((a, b) => {
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
        const approvedProjects = sortedData?.filter(
          (project) => project.approvalStatus === "Approve"
        );
        setProjectInfo(approvedProjects);
      }
    } catch (err) {
      toast.error(err.response.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchDepositInfo = async () => {
    try {
      setLoading(true);
      const uri = "deposit-info";
      const response = await coreAxios.get(uri);
      if (response?.status === 200) {
        const approvedDeposits = response?.data.filter(
          (deposit) => deposit.status === "Approved"
        );
        setDepositData(approvedDeposits);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };
  const getSingleDeposit = async () => {
    try {
      setLoading(true);

      const response = await coreAxios.get(`deposit-info/${userInfo?._id}`);
      if (response?.status === 200) {
        setSingleDepositData(response?.data);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching rolls:", error);
    }
  };
  // Calculate the total amount
  const totalDepositAmount = depositData?.reduce(
    (total, deposit) => total + deposit?.amount,
    0
  );

  const data = singleDepositData?.deposits?.filter(
    (deposit) => deposit.status === "Approved"
  );
  const depositAmount = data?.reduce(
    (total, deposit) => total + deposit?.amount,
    0
  );
  const percentage = ((Number(scholarShipInfo?.length) / 249) * 100).toFixed(2);

  useEffect(() => {
    fetchDepositInfo();
    getProjectInfo();
    getAllUserList();
    getScholarShipInfo();
    getSingleDeposit();
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
        <div className="">
          <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6 p-2">
            <div class="bg-green-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div class="flex justify-between mb-6">
                <div>
                  <div class="flex items-center mb-1">
                    <div class="text-3xl font-semibold">{users?.length}</div>
                  </div>
                  <div class="text-[14px] font-medium text-green-800">
                    Users
                  </div>
                </div>
              </div>

              <a
                href="/gebruikers"
                class="text-[#f84525] font-medium text-sm hover:text-red-800">
                View
              </a>
            </div>
            <div class="bg-blue-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div class="flex justify-between mb-4">
                <div>
                  <div class="flex items-center mb-1">
                    <div class="text-3xl font-semibold">
                      {scholarShipInfo?.length}
                    </div>
                    <div class="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[14px] font-semibold leading-none ml-2">
                      +{percentage}%
                    </div>
                  </div>
                  <div class="text-[14px] font-medium text-blue-800">
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
            <div class="bg-purple-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div class="flex justify-between mb-6">
                <div>
                  <div class="text-3xl font-semibold mb-1">
                    ৳{depositAmount}
                  </div>
                  <div class="text-[14px] font-medium text-purple-800">
                    My Deposit
                  </div>
                </div>
              </div>
              <Link
                to="/dashboard/depositInfo"
                class="text-[#f84525] font-medium text-sm hover:text-red-800">
                View
              </Link>
            </div>
            <div class="bg-yellow-100 rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div class="flex justify-between mb-6">
                <div>
                  <div class="text-3xl font-semibold mb-1">
                    ৳{totalDepositAmount}
                  </div>
                  <div class="text-[14px] font-medium text-yellow-800">
                    DMF Fund
                  </div>
                </div>
              </div>
              <Link
                to="/dashboard/depositInfo"
                class="text-[#f84525] font-medium text-sm hover:text-red-800">
                View
              </Link>
            </div>
          </div>
          <h2 className="py-2 text-[17px] font-semibold text-center">
            Running DMF Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {projectInfo?.map((project, index) => (
              <div key={index}>
                <ProjectCard rowData={project} depositData={depositData} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
