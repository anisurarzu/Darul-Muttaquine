import React, { useState } from "react";
import "./navbar.css";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink, Link, useHistory } from "react-router-dom";

import logo from "../images/dmf-logo.png";

import "../Pages/scholarship/scholarshipButton.css";
import Scholarship from "../Pages/scholarship/Scholarship";

const Navbar = () => {
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  const history = useHistory();

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
      <nav className="main-nav border-b sticky top-0 z-50 bg-white bangla-text">
        {/* 1st logo part  */}
        <div className=" cursor-pointer  w-[100px] pl-[30px] pt-[4px]">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
        </div>

        {/* 2nd menu part  */}
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }>
          <ul>
            <li>
              <NavLink to="/about">আমাদের সম্পর্কে</NavLink>
            </li>
            <li>
              <NavLink to="/history">গ্যালারী</NavLink>
            </li>
            <li>
              <NavLink to="/result">ফলাফল</NavLink>
            </li>

            <li>
              <NavLink to="/dashboard">ড্যাশবোর্ড</NavLink>
            </li>
            <li>
              <NavLink to="/contact">যোগাযোগ</NavLink>
            </li>
            <li></li>

            {isAuthenticated && (
              <li
                onClick={handleLogout}
                className="cursor-pointer hover:border hover:border-green-500 hover:rounded-lg hover:p-3">
                Log Out
              </li>
            )}

            <li>
              <NavLink to="/scholarship">
                <scholarshipButton className="flex justify-center items-center font-semibold border border-[#62AB00] hover:no-underline">
                  <span>Scholarship</span>
                </scholarshipButton>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* 3rd social media links */}
        <div className="social-media">
          {/* hamburget menu start  */}
          <div className="hamburger-menu">
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <GiHamburgerMenu />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
