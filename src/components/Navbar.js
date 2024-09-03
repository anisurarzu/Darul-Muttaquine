import React, { useState } from "react";
import {
  MenuOutlined,
  LoginOutlined,
  ContactsOutlined,
  ProductOutlined,
  FileImageOutlined,
  DashboardOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { NavLink, Link, useHistory } from "react-router-dom";

import logo from "../images/dmf-logo-2.png";
import useUserInfo from "../hooks/useUserInfo";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom";

const Navbar = () => {
  let { path, url } = useRouteMatch();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const history = useHistory();
  const userInfo = useUserInfo();
  console.log("userInfo", userInfo);

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage?.getItem("token");

  // Handle logout
  const handleLogout = () => {
    // Clear all data from local storage
    localStorage?.clear();

    // Redirect to the login page
    history?.push("/login");

    // Reload the page to reflect the logout state
    window?.location?.reload();
  };

  return (
    <>
      <nav className="border-b sticky top-0 z-50 bg-white pr-8 lg:pr-12 xl:pr-12">
        <div className="flex justify-between items-center px-4 py-2 md:px-8">
          {/* Logo */}
          <div className=" cursor-pointer  w-[150px]  pt-[4px]">
            <Link to="/">
              <img className="" src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Menu Links */}
          <div className="hidden md:flex space-x-6  lg:text-[1.5rem] xl:text-[1.6rem] gap-2 ">
            <NavLink to="/about" className="hover:text-green-500 pt-2">
              আমাদের সম্পর্কে
            </NavLink>
            <NavLink to="/history" className="hover:text-green-500 pt-2">
              গ্যালারী
            </NavLink>
            <NavLink to="/result" className="hover:text-green-500 pt-2">
              ফলাফল
            </NavLink>
            <NavLink to={`/dashboard`} className="hover:text-green-500 pt-2">
              ড্যাশবোর্ড
            </NavLink>
            <NavLink to="/quizeMain" className="hover:text-green-500 pt-2">
              কুইজ
            </NavLink>
            <NavLink
              to="/scholarship-public"
              className="hover:text-green-500 pt-2">
              শিহ্মাবৃত্তি
            </NavLink>
            <NavLink to="/product" className="hover:text-green-500 pt-2">
              আমাদের পণ্য
            </NavLink>
            <NavLink to="/contact" className="hover:text-green-500  pt-2">
              যোগাযোগ
            </NavLink>
            {isAuthenticated ? (
              <>
                <div
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-green-500 pt-2">
                  লগ আউট
                </div>
                <div>
                  <img
                    className="w-12 h-12 rounded-full"
                    src={
                      userInfo?.image ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw_JmAXuH2Myq0ah2g_5ioG6Ku7aR02-mcvimzwFXuD25p2bjx7zhaL34oJ7H9khuFx50&usqp=CAU"
                    }
                    alt=""
                  />
                </div>
              </>
            ) : (
              <NavLink to="/login" className="hover:text-green-500 pt-2">
                লগ ইন
              </NavLink>
            )}
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <MenuOutlined style={{ fontSize: "20px" }} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white">
            <ul className="grid grid-cols-3 gap-y-2 gap-x-4 items-center space-y-2 py-2 text-[1.4rem] ml-8 my-2">
              <li
                style={{ background: "#408F49" }}
                className="mt-2 p-2 text-white rounded-lg text-center">
                <NavLink to="/about" onClick={() => setShowMobileMenu(false)}>
                  আমাদের সম্পর্কে
                </NavLink>
              </li>
              <li
                style={{ background: "#408F49" }}
                className="p-2 text-white rounded-lg text-center">
                <NavLink to="/history" onClick={() => setShowMobileMenu(false)}>
                  <FileImageOutlined /> <span className="pl-1"> গ্যালারী</span>
                </NavLink>
              </li>
              <li
                style={{ background: "#408F49" }}
                className="   p-2 text-white rounded-lg text-center">
                <NavLink to="/result" onClick={() => setShowMobileMenu(false)}>
                  ফলাফল
                </NavLink>
              </li>
              <li
                style={{ background: "#408F49" }}
                className="   p-2 text-white rounded-lg text-center">
                <NavLink
                  to="/dashboard"
                  onClick={() => setShowMobileMenu(false)}>
                  <DashboardOutlined />{" "}
                  <span className="pl-1"> ড্যাশবোর্ড</span>
                </NavLink>
              </li>
              <li
                style={{ background: "#408F49" }}
                className="   p-2 text-white rounded-lg text-center">
                <NavLink
                  to="/quizeMain"
                  onClick={() => setShowMobileMenu(false)}>
                  <QuestionCircleOutlined /> <span className="pl-1"> কুইজ</span>
                </NavLink>
              </li>
              <li
                style={{ background: "#408F49" }}
                className="   p-2 text-white rounded-lg text-center">
                <NavLink
                  to="/scholarship-public"
                  className="hover:text-green-500 pt-2">
                  শিহ্মাবৃত্তি
                </NavLink>
              </li>
              <li
                style={{ background: "#408F49" }}
                className="   p-2 text-white rounded-lg text-center">
                <NavLink to="/product" onClick={() => setShowMobileMenu(false)}>
                  <ProductOutlined /> <span className="pl-1"> আমাদের পণ্য</span>
                </NavLink>
              </li>
              <li
                style={{ background: "#408F49" }}
                className="   p-2 text-white rounded-lg text-center">
                <NavLink to="/contact" onClick={() => setShowMobileMenu(false)}>
                  <ContactsOutlined /> <span className="pl-1"> যোগাযোগ</span>
                </NavLink>
              </li>
              {isAuthenticated ? (
                <li
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  style={{ background: "#408F49" }}
                  className="   p-2 text-white rounded-lg text-center">
                  <LoginOutlined />
                  <span className="pl-1"> লগ আউট</span>
                </li>
              ) : (
                <li
                  style={{ background: "#408F49" }}
                  className="   p-2 text-white rounded-lg text-center">
                  <NavLink to="/login" onClick={() => setShowMobileMenu(false)}>
                    <LoginOutlined /> <span className="pl-1"> লগ ইন</span>
                  </NavLink>
                </li>
              )}
              <li className="col-span-2 flex gap-2 justify-end">
                <p
                  style={{ color: "#408F49" }}
                  className="text-center pt-2 bangla-text">
                  {userInfo?.firstName} {userInfo?.lastName}
                </p>
                <div>
                  <img
                    className="w-12 h-12 rounded-full border border-green-50"
                    src={userInfo?.image}
                    alt=""
                  />
                </div>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
