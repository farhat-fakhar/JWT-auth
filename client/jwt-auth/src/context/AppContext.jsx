import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();
export const ContextProvider = ({ children }) => {
 
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  const getAuth = async () => {
    try {
      let { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        withCredentials: true,
      });
      if (data.success) {
        setIsLoggedIn(true);
        getUser();
      } else {
        console.log(data.message);
      }
      console.log("Auth:", data);
    } catch (error) {
      setIsLoggedIn(false);
      console.log(error.response?.data?.message || error.message);
    }
  };

  const getUser = async () => {
    try {
      let { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
       console.log("User not found");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAuth();
  }, []);

  const value = {
    getUser,
    getAuth,
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
