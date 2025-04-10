import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const EmailVerifyPage = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      // ใส่ค่าไปแล้ว ใน input
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const valueFromClipboard = e.clipboardData.getData("text");
    //split แยกเป็น 6 ค่า
    const pasteArray = valueFromClipboard.split("");
    pasteArray.forEach((eachNumber, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = eachNumber;
      }
    });
  };

  const handleSubmit = async (e) => {
    try {
      //ไม่ให้ reload หน้าเว็บ
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      //join array
      const otp = otpArray.join("");
      // call api backend
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //หากผู้ใช้ล็อกอินอยู่แล้ว และมีการยืนยันอีเมลแล้ว ให้ redirect ไปหน้า home หากมาที่หน้า email-verify
  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email.
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer">
          Verify email
        </button>
      </form>
    </div>
  );
};

export default EmailVerifyPage;
