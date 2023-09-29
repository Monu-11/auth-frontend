import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config/config";
import {
  AiOutlineLoading,
  AiFillEye,
  AiFillEyeInvisible,
} from "react-icons/ai";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVisiblePassword = () => {
    setIsVisible(!isVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await axios.post(`${config.apiUrl}/api/login`, formData, {
        withCredentials: true,
      });
      toast.success("Login Successfully");
      setFormData({
        email: "",
        password: "",
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-700 items-center h-screen">
      <div className="max-w-md mx-auto bg-orange-300 mt-10 p-6 border rounded-md shadow-md">
        <Toaster />
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-semibold mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={isVisible ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <span
              className="absolute mt-4 ml-[-25px]"
              onClick={handleVisiblePassword}
            >
              {isVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 relative"
            disabled={loading}
          >
            {loading && (
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <AiOutlineLoading className="animate-spin" />
              </span>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/" className="underline">
              Click here to register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
