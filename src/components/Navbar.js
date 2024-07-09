import React, { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { NavLink, Link, useHistory } from "react-router-dom";

import logo from "../images/dmf-logo.png";
import useUserInfo from "../hooks/useUserInfo";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const history = useHistory();
  const userInfo = useUserInfo();
  console.log("userInfo", userInfo);

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem("token");

  // Handle logout
  const handleLogout = () => {
    // Clear authentication token from local storage
    localStorage.removeItem("token");

    // Redirect to the login page
    history.push("/login");

    // Reload the page to reflect the logout state
    window.location.reload();
  };

  return (
    <>
      <nav className="border-b sticky top-0 z-50 bg-white pr-8 lg:pr-12 xl:pr-12">
        <div className="flex justify-between items-center px-4 py-2 md:px-8">
          {/* Logo */}
          <div className=" cursor-pointer  w-[100px] pl-[30px] pt-[4px]">
            <Link to="/">
              <img src={logo} alt="Logo" />
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
            <NavLink to="/dashboard" className="hover:text-green-500 pt-2">
              ড্যাশবোর্ড
            </NavLink>
            <NavLink to="/product" className="hover:text-green-500 pt-2">
              আমাদের পণ্য
            </NavLink>
            <NavLink to="/contact" className="hover:text-green-500  pt-2">
              যোগাযোগ
            </NavLink>
            {isAuthenticated && (
              <div
                onClick={handleLogout}
                className="cursor-pointer hover:text-green-500 pt-2">
                লগ আউট
              </div>
            )}
            {isAuthenticated && (
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
            <ul className="flex flex-col items-center space-y-2 py-2 text-[1.4rem]">
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-green-500"
                  onClick={() => setShowMobileMenu(false)}>
                  আমাদের সম্পর্কে
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/history"
                  className="hover:text-green-500"
                  onClick={() => setShowMobileMenu(false)}>
                  গ্যালারী
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/result"
                  className="hover:text-green-500"
                  onClick={() => setShowMobileMenu(false)}>
                  ফলাফল
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className="hover:text-green-500"
                  onClick={() => setShowMobileMenu(false)}>
                  ড্যাশবোর্ড
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product"
                  className="hover:text-green-500"
                  onClick={() => setShowMobileMenu(false)}>
                  আমাদের পণ্য
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="hover:text-green-500"
                  onClick={() => setShowMobileMenu(false)}>
                  যোগাযোগ
                </NavLink>
              </li>
              {isAuthenticated && (
                <li
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="cursor-pointer hover:text-green-500">
                  লগ আউট
                </li>
              )}
              <li>
                <img
                  className="w-12 h-12 rounded-full"
                  src={userInfo?.image}
                  alt=""
                />
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
