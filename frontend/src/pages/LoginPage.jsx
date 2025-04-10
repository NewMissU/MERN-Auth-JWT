import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();

  //? ดึงค่าจาก context
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [isLoginOrSignUp, setIsLoginOrSignUp] = useState("Login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleFormChange = (event) => {
    setForm((previousForm) => ({
      ...previousForm,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      // การส่ง cookie ไปยัง backend ต้องทำ credentials true
      axios.defaults.withCredentials = true;

      if (isLoginOrSignUp === "Sign Up") {
        // ?Register
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        console.log("RESPONSE DATA:", data);
        if (data.success) {
          toast.success("Sign Up success!");
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          //ใช้ toast แทน alert
          // alert(data.message);
          toast.error(data.message);
        }
      } else {
        // ?Login
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email: form.email,
          password: form.password,
        });

        console.log("RESPONSE DATA:", data);

        if (data.success) {
          toast.success("Login success!");
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          //ใช้ toast แทน alert
          // alert(data.message);
          toast.error(data.message);
        }
      }

      //clear form after submit
      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   console.log("form updated:", form);
  // }, [form]);

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {isLoginOrSignUp === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {isLoginOrSignUp === "Sign Up"
            ? "Create an account"
            : "Login to your account"}
        </p>

        <form onSubmit={onSubmitHandler} className="text-gray-300">
          {isLoginOrSignUp === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={handleFormChange}
                name="name"
                value={form.name}
                className="bg-transparent w-full outline-none"
                type="text"
                placeholder="Full name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={handleFormChange}
              name="email"
              value={form.email}
              className="bg-transparent w-full outline-none"
              type="email"
              placeholder="Email id"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={handleFormChange}
              name="password"
              value={form.password}
              className="bg-transparent w-full outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          {isLoginOrSignUp === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-indigo-500 cursor-pointer"
            >
              Forgot password?
            </p>
          )}

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium cursor-pointer">
            {isLoginOrSignUp}
          </button>
        </form>

        {isLoginOrSignUp === "Sign Up" ? (
          <p className="text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setIsLoginOrSignUp("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => setIsLoginOrSignUp("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
