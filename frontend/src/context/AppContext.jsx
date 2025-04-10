import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true; // ส่ง cookie ไปด้วยทุกครั้งที่เรียกใช้ axios

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
        //send cookie ด้วยเพื่อให้ login อยู่ตลอดเวลา แม้ refresh หน้าเว็บ
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //? ฟังก์ชันที่ใช้ในการดึงข้อมูลผู้ใช้จาก backend
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // เมื่อ load หน้าเว็บ ให้เรียกใช้ฟังก์ชัน getAuthState เพื่อเช็คสถานะการเข้าสู่ระบบ
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
