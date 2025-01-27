import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom/cjs/react-router-dom";
import { Menu, Drawer, Button } from "antd";
import {
  DashboardOutlined,
  ProfileOutlined,
  BookOutlined,
  DollarOutlined,
  HistoryOutlined,
  FileAddOutlined,
  FileOutlined,
  UserOutlined,
  ProjectOutlined,
  CommentOutlined,
  WalletOutlined,
  QuestionCircleOutlined,
  PlusCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";

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
import AllQuize from "../Quize/AllQuize";
import QuizMoney from "../Quize/QuizMoney";
import OrderDashboard from "./Order/OrderDashboard";
import Order from "./Order/Order";
import ResultDetails from "./ResultDetails/ResultDetails";

import EducationCentre from "../EducationCentre/EducationCentre";
import CreateCourse from "../Course/CreateCourse";
import CourseDashboard from "../Course/CourseDashboard";

export default function Dashboard() {
  let { path, url } = useRouteMatch();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

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

  const menuItems = [
    { route: "dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    {
      route: "orderDashboard",
      label: "Order Dashboard",
      icon: <DashboardOutlined />,
    },
    { route: "profile", label: "Profile", icon: <ProfileOutlined /> },
    { route: "scholarship", label: "Scholarship", icon: <BookOutlined /> },
    {
      route: "admission",
      label: "Admission",
      icon: <BookOutlined />,
    },
    { route: "resultDetails", label: "Result Details", icon: <FileOutlined /> },
    { route: "depositInfo", label: "Deposit", icon: <DollarOutlined /> },
    { route: "historyDashboard", label: "History", icon: <HistoryOutlined /> },
    { route: "addResult", label: "Add Result", icon: <FileAddOutlined /> },
    { route: "result", label: "Result", icon: <FileOutlined /> },

    { route: "users", label: "Users", icon: <UserOutlined /> },
    { route: "project", label: "Projects", icon: <ProjectOutlined /> },
    {
      route: "orderDetails",
      label: "Order Details",
      icon: <PlusCircleOutlined />,
    },
    {
      route: "suggestionBox",
      label: "SuggestionBox",
      icon: <CommentOutlined />,
    },
    { route: "withdraw", label: "Withdraw", icon: <WalletOutlined /> },
    { route: "quize", label: "Quize", icon: <QuestionCircleOutlined /> },
    { route: "allQuize", label: "All Quiz", icon: <QuestionCircleOutlined /> },
    {
      route: "quizMoney",
      label: "Quiz Money",
      icon: <QuestionCircleOutlined />,
    },
    {
      route: "courseDashboard",
      label: "Course Dashboard",
      icon: <PlusCircleOutlined />,
    },
  ];

  const getMenuItemsByRole = (role) => {
    switch (role) {
      case "Super-Admin":
        return menuItems;
      case "Admin":
        return menuItems.filter(
          (item) =>
            ![
              "users",
              "quize",
              "quizMoney",
              "allQuize",
              "orderDetails",
            ].includes(item.route)
        );
      case "Student":
        return menuItems.filter(
          (item) =>
            ![
              "users",
              "quize",
              "quizMoney",
              "allQuize",
              "orderDetails",
              "admission",
            ].includes(item.route)
        );
      case "System-Admin":
        return menuItems.filter(
          (item) =>
            !["quize", "quizMoney", "allQuize", "orderDetails"].includes(
              item.route
            )
        );
      case "Co-Admin":
        return menuItems.filter(
          (item) =>
            ![
              "users",
              "project",
              "allQuize",
              "quize",
              "quizMoney",
              "orderDetails",
              "resultDetails",
            ].includes(item.route)
        );
      case "Accountant":
        return menuItems.filter(
          (item) =>
            !["users", "project", "quize", "allQuize"].includes(item.route)
        );
      case "Second-Accountant":
        return menuItems.filter(
          (item) => !["users", "project", "orderDetails"].includes(item.route)
        );
      case "Senior-Member":
        return menuItems.filter((item) =>
          [
            "dashboard",
            "profile",
            "depositInfo",
            "withdraw",
            "result",
            "suggestionBox",
          ].includes(item.route)
        );
      case "Member":
        return menuItems.filter((item) =>
          [
            "dashboard",
            "profile",
            "depositInfo",
            "suggestionBox",
            "withdraw",
            "result",
          ].includes(item.route)
        );
      case "Junior-Member":
        return menuItems.filter((item) =>
          [
            "dashboard",
            "profile",
            "depositInfo",
            "suggestionBox",
            "withdraw",
          ].includes(item.route)
        );
      default:
        return menuItems.filter((item) =>
          [
            "dashboard",
            "profile",
            "depositInfo",
            "withdraw",
            "suggestionBox",
          ].includes(item.route)
        );
    }
  };

  const roleMenuItems = getMenuItemsByRole(userData?.userRole);

  const handleDrawerOpen = () => setDrawerVisible(true);
  const handleDrawerClose = () => setDrawerVisible(false);

  const handleMenuClick = () => {
    handleDrawerClose();
  };

  return (
    <div className="flex flex-col lg:flex-row pt-8">
      {/* Mobile menu button */}
      <Button
        className="lg:hidden"
        type="primary"
        icon={<MenuOutlined />}
        onClick={handleDrawerOpen}>
        Menu
      </Button>

      {/* Drawer for mobile view */}
      <Drawer
        title={userData?.userRole}
        placement="left"
        onClose={handleDrawerClose}
        visible={drawerVisible}
        bodyStyle={{ padding: 0 }}
        width="75%">
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          style={{ height: "100%" }}
          onClick={handleMenuClick}>
          {roleMenuItems.map((data) => (
            <Menu.Item key={data.route} icon={data.icon}>
              <Link to={`${url}/${data.route}`}>{data.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>

      {/* Sidebar for desktop view */}
      <div className="hidden lg:block lg:w-1/6 xl:w-1/6 border-r">
        <div className="p-4 bg-green-400 text-white font-bold text-center">
          {userData?.userRole}
        </div>
        <Menu
          mode="vertical"
          defaultSelectedKeys={["dashboard"]}
          style={{ height: "100%" }}>
          {roleMenuItems.map((data) => (
            <Menu.Item key={data.route} icon={data.icon}>
              <Link to={`${url}/${data.route}`}>{data.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </div>

      {/* Main content */}
      <div className="flex-1 container rounded p-4">
        <Switch>
          <Route path={`${path}/scholarship`}>
            <Scholarship />
          </Route>
          <Route path={`${path}/admission`}>
            <EducationCentre />
          </Route>
          <Route path={`${path}/resultDetails`}>
            <ResultDetails />
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
          <Route path={`${path}/allQuize`}>
            <AllQuize />
          </Route>
          <Route path={`${path}/quizMoney`}>
            <QuizMoney />
          </Route>
          <Route path={`${path}/orderDashboard`}>
            <Order />
          </Route>
          <Route path={`${path}/orderDetails`}>
            <OrderDashboard />
          </Route>
          <Route path={`${path}/courseDashboard`}>
            <CourseDashboard />
          </Route>

          {/*   <Route path={`${path}/createQuize`}>
            <CreateQuize />
          </Route> ----*/}
          <Route path={`${path}`}>
            <DashboardHome />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
