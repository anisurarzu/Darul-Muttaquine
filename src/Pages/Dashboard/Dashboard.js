import React, { useEffect, useState } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Scholarship from "../scholarship/Scholarship";
import DashboardHome from "./DashboardHome/DashboardHome";
import DepositInfo from "./DepositInfo/DepositInfo";
import ResultPage from "./Result/ResultPage";
import AddResult from "./AddResult/AddResult";
import Profile from "./Profile/Profile";
import UserDashboard from "./UserList/UserDashboard";
import ProjectDashboard from "./Project/ProjectDashboard";
import { coreAxios } from "../../utilities/axios";
import HistoryDashboard from "./HistoryUpload/HistoryDashboard/HistoryDashboard";
import SuggestionBox from "./SuggestionBox/SuggestionBox";
import Withdraw from "./Withdraw/Withdraw";

export default function Dashboard() {
  let { path, url } = useRouteMatch();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const res = await coreAxios.get(`userinfo`);
      if (res?.status === 200) {
        setLoading(false);
        setUserData(res?.data);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const linkList =
    userData?.userRole === "Super-Admin"
      ? [
          { route: "dashboard", label: "Dashboard" },
          { route: "profile", label: "Profile" },
          { route: "scholarship", label: "Scholarship" },
          { route: "depositInfo", label: "Deposit" },
          { route: "historyDashboard", label: "History" },
          { route: "addResult", label: "Add Result" },
          { route: "result", label: "Result" },
          { route: "users", label: "Users" },
          { route: "project", label: "Projects" },
          { route: "suggestionBox", label: "SuggestionBox" },
          { route: "withdraw", label: "Withdraw" },
        ]
      : userData?.userRole === "Admin"
      ? [
          { route: "dashboard", label: "Dashboard" },
          { route: "profile", label: "Profile" },
          { route: "scholarship", label: "Scholarship" },
          { route: "depositInfo", label: "Deposit" },
          { route: "historyDashboard", label: "History" },
          { route: "addResult", label: "Add Result" },
          { route: "result", label: "Result" },
          { route: "project", label: "Projects" },
          { route: "suggestionBox", label: "SuggestionBox" },
          { route: "withdraw", label: "Withdraw" },
        ]
      : userData?.userRole === "Co-Admin"
      ? [
          { route: "dashboard", label: "Dashboard" },
          { route: "profile", label: "Profile" },
          { route: "depositInfo", label: "Deposit" },
          { route: "addResult", label: "Add Result" },
          { route: "result", label: "Result" },
          { route: "historyDashboard", label: "History" },
          { route: "suggestionBox", label: "SuggestionBox" },
          { route: "withdraw", label: "Withdraw" },
        ]
      : userData?.userRole === "Senior-Member"
      ? [
          { route: "dashboard", label: "Dashboard" },
          { route: "profile", label: "Profile" },
          { route: "depositInfo", label: "Deposit" },
          { route: "withdraw", label: "Withdraw" },
          { route: "result", label: "Result" },
        ]
      : userData?.userRole === "Member"
      ? [
          { route: "dashboard", label: "Dashboard" },
          { route: "profile", label: "Profile" },
          { route: "depositInfo", label: "Deposit" },
          { route: "suggestionBox", label: "SuggestionBox" },
          { route: "withdraw", label: "Withdraw" },
          { route: "result", label: "Result" },
        ]
      : [
          { route: "dashboard", label: "Dashboard" },
          { route: "profile", label: "Profile" },
        ];

  return (
    <div className="flex">
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-1/6 bg-white border-r-2 p-4 z-50`}>
        <div className="bg-green-400">
          <h3 className="text-center pt-2 text-xl font-bold text-white border border-green-300 rounded p-2">
            {userData?.userRole}
          </h3>
        </div>

        <div className="py-6">
          <div className="grid gap-1">
            <ul className="flex flex-col">
              {linkList?.map((data, index) => (
                <li className="my-px pt-2" key={index}>
                  <Link
                    to={`${url}/${data?.route}`}
                    className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => setSidebarOpen(false)}>
                    <span className="flex items-center justify-center text-lg text-gray-400 menu1">
                      <svg
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-8 w-8">
                        <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                      </svg>
                    </span>
                    <span className="ml-3 text-[17px]">{data?.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex-1 lg:ml-1/6">
        <button
          className="lg:hidden p-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-8 h-8">
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div className="container mx-auto p-4">
          <Switch>
            <Route path={`${path}/scholarship`}>
              <Scholarship />
            </Route>
            <Route path={`${path}/dashboard`}>
              <DashboardHome />
            </Route>
            <Route path={`${path}/depositInfo`}>
              <DepositInfo />
            </Route>
            <Route path={`${path}/historyDashboard`}>
              <HistoryDashboard />
            </Route>
            <Route path={`${path}/addResult`}>
              <AddResult />
            </Route>
            <Route path={`${path}/result`}>
              <ResultPage />
            </Route>
            <Route path={`${path}/profile`}>
              <Profile />
            </Route>
            <Route path={`${path}/users`}>
              <UserDashboard />
            </Route>
            <Route path={`${path}/project`}>
              <ProjectDashboard />
            </Route>
            <Route path={`${path}/suggestionBox`}>
              <SuggestionBox />
            </Route>
            <Route path={`${path}/withdraw`}>
              <Withdraw />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}
