import React, { useEffect, useState } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import {
  Menu,
  Drawer,
  Button,
  Layout,
  Typography,
  Avatar,
  Badge,
  Spin,
  theme,
} from "antd";
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
  LogoutOutlined,
} from "@ant-design/icons";

// Import all components
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
import Notice from "../Notice/Notice";
import OldScholarshipData from "../scholarship/OldScholarshipData";
import SeatPlan from "../scholarship/SeatPlan";
import TourEntry from "../TourManagement/TourEntry";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function Dashboard() {
  let { path, url } = useRouteMatch();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const res = await coreAxios.get(`userinfo`);
      if (res?.status === 200) {
        setUserData(res?.data);
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    } finally {
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
    { route: "scholarship", label: "Scholarship 2025", icon: <BookOutlined /> },
    {
      route: "oldScholarshipData",
      label: "Scholarship 2024",
      icon: <BookOutlined />,
    },
    { route: "admission", label: "Admission", icon: <BookOutlined /> },
    { route: "seatPlan", label: "Seat Plan", icon: <BookOutlined /> },
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
      label: "Suggestion Box",
      icon: <CommentOutlined />,
    },
    { route: "withdraw", label: "Withdraw", icon: <WalletOutlined /> },
    { route: "quize", label: "Quiz", icon: <QuestionCircleOutlined /> },
    {
      route: "allQuize",
      label: "All Quizzes",
      icon: <QuestionCircleOutlined />,
    },
    {
      route: "quizMoney",
      label: "Quiz Money",
      icon: <QuestionCircleOutlined />,
    },
    {
      route: "courseDashboard",
      label: "Course Dashboard",
      icon: <BookOutlined />,
    },
    { route: "notice", label: "Notice", icon: <FileOutlined /> },
    {
      route: "createQuize",
      label: "Create Quiz",
      icon: <PlusCircleOutlined />,
    },
    {
      route: "tourEntry",
      label: "Tour Entry",
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
              "oldScholarshipData",
              "seatPlan",
            ].includes(item.route)
        );
      case "System-Admin":
        return menuItems.filter(
          (item) =>
            ![
              "quize",
              "quizMoney",
              "allQuize",
              "notice",
              "orderDetails",
            ].includes(item.route)
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
              "notice",
              "orderDetails",
              "resultDetails",
            ].includes(item.route)
        );
      case "Accountant":
        return menuItems.filter(
          (item) =>
            !["users", "project", "quize", "notice", "allQuize"].includes(
              item.route
            )
        );
      case "Second-Accountant":
        return menuItems.filter(
          (item) =>
            !["users", "project", "notice", "orderDetails"].includes(item.route)
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
  const toggleCollapse = () => setCollapsed(!collapsed);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  const renderMenuItems = () => (
    <>
      {roleMenuItems.map((item) => (
        <Menu.Item key={item.route} icon={item.icon}>
          <Link to={`${url}/${item.route}`}>{item.label}</Link>
        </Menu.Item>
      ))}
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </>
  );

  return (
    <Layout className="min-h-screen">
      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <Avatar
              src={userData?.photoURL}
              icon={<UserOutlined />}
              className="mr-2"
            />
            <Text strong>{userData?.userRole}</Text>
          </div>
        }
        placement="left"
        closable
        onClose={handleDrawerClose}
        open={drawerVisible}
        width={250}
        bodyStyle={{ padding: 0 }}>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          onClick={handleDrawerClose}>
          {renderMenuItems()}
        </Menu>
      </Drawer>

      {/* Desktop Sider */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapse}
        width={250}
        theme="light"
        className="hidden lg:block shadow-md"
        breakpoint="lg">
        <div className="flex items-center justify-center h-16 p-4 bg-green-600">
          <Text strong className="text-white">
            {collapsed ? "APP" : "DMF Dashboard"}
          </Text>
        </div>
        <div className="flex items-center p-4 border-b">
          <Badge dot status="success">
            <Avatar src={userData?.image} icon={<UserOutlined />} />
          </Badge>
          {!collapsed && (
            <div className="ml-3">
              <Text type="block" className="text-lg">
                {userData?.userRole}
              </Text>
            </div>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          className="mt-2">
          {renderMenuItems()}
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{ background: colorBgContainer }}
          className="p-0 shadow-sm flex items-center">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={handleDrawerOpen}
            className="lg:hidden h-16 w-16"
          />
          <div className="flex-1 flex justify-between items-center px-4">
            <Text strong className="text-2xl">
              {userData?.firstName} {userData?.lastName}
            </Text>
            <div className="flex items-center">
              <Button type="text" icon={<UserOutlined />} />
            </div>
          </div>
        </Header>

        <Content
          style={{
            margin: "16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
          <Switch>
            <Route path={`${path}/scholarship`}>
              <Scholarship />
            </Route>
            <Route path={`${path}/oldScholarshipData`}>
              <OldScholarshipData />
            </Route>
            <Route path={`${path}/admission`}>
              <EducationCentre />
            </Route>
            <Route path={`${path}/seatPlan`}>
              <SeatPlan />
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
            <Route path={`${path}/notice`}>
              <Notice />
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
            <Route path={`${path}/createQuize`}>
              <CreateQuize />
            </Route>
            <Route path={`${path}/tourEntry`}>
              <TourEntry />
            </Route>
            <Route path={`${path}`}>
              <DashboardHome />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
}
