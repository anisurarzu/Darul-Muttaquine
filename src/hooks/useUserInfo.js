// useUserInfo.js

import { useState, useEffect } from "react";

const useUserInfo = () => {
  // State to store user info
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get user info from local storage
    const storedUserInfo = localStorage.getItem("userInfo");

    // Parse JSON data if it exists
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []); // Only run once on component mount

  return userInfo;
};

export default useUserInfo;
