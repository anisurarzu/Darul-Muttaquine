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
      <nav className="main-nav border-b sticky top-0 z-50 bg-white">
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
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/history">History</NavLink>
            </li>
            <li>
              <NavLink to="/result">Result</NavLink>
            </li>

            <li>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            {/* Conditionally render login or logout button based on authentication state */}
            {/*  {!isAuthenticated && (
              <li>
                <NavLink to="/login ">
                  <span> Log In</span>
                </NavLink>
              </li>
            )} */}

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
          <ul className="social-media-desktop">
            <li>
              <a
                href="https://www.youtube.com/channel/UCwfaAHy4zQUb2APNOGXUCCA"
                target="_thapa">
                <FaFacebookSquare className="facebook" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/thapatechnical/"
                target="_thapa">
                <FaInstagramSquare className="instagram" />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/channel/UCwfaAHy4zQUb2APNOGXUCCA"
                target="_thapa">
                <FaYoutubeSquare className="youtube" />
              </a>
            </li>
          </ul>

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
