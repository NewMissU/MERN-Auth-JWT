import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/email-verify" element={<EmailVerifyPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
};

export default App;
