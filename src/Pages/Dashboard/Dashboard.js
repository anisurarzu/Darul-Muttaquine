import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom/cjs/react-router-dom";
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
import Quize from "../Quize/Quize";
import CreateQuize from "../Quize/CreateQuize";

export default function Dashboard() {
  let { path, url } = useRouteMatch();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
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
          { route: "quize", label: "Quize" },
          { route: "createQuize", label: "Create Quize" },
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
          { route: "depositInfo", label: "Deposit" },
        ];
  return (
    <div className="grid xl:grid-cols-6 lg:grid-cols-3 grid-cols-1  pt-8 ">
      <div className="col-span-1  border lg:h-[600px] rounded xl:mx-8 lg:mx-4 pb-8 ">
        <div className="bg-green-400">
          <h3 className="text-center pt-2 text-xl font-bold text-white border border-green-300 rounded p-2">
            {userData?.userRole}
          </h3>
        </div>

        <div>
          <div class="   py-6">
            <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-1 phone-menu-bar">
              <ul class=" md:flex-col bangla-text w-full phone-menu-bar-text   menu-box">
                <div className="grid grid-cols-2 lg:grid-cols1 xl:grid-cols-1">
                  {linkList?.map((data, index) => (
                    <li class="my-px pt-2" key={index}>
                      <Link
                        to={`${url}/${data?.route}`}
                        class="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100">
                        <span class="flex items-center justify-center text-lg text-gray-400  md:ml-0 menu1">
                          <svg
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            class="h-8 w-8">
                            <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                          </svg>
                        </span>
                        <span class="ml-3  text-[17px]">{data?.label}</span>
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-second col-span-5  container rounded">
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
          <Route path={`${path}/quize`}>
            <Quize />
          </Route>
          <Route path={`${path}/createQuize`}>
            <CreateQuize />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
