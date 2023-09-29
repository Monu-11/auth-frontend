import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import config from "../config/config";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineLoading,
  AiFillEye,
  AiFillEyeInvisible,
} from "react-icons/ai";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
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
      const response = await axios.post(
        `${config.apiUrl}/api/register`,
        formData
      );
      console.log("response", response.message);
      toast.success("Registration Successfully");
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-700 items-center h-screen">
      <div className="max-w-md mx-auto mt-10 p-6 bg-orange-300 border rounded-md shadow-md">
        <Toaster />
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-semibold mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
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
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading && (
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <AiOutlineLoading className="animate-spin" />
              </span>
            )}
            {loading ? "Registering in..." : "Register"}
          </button>
          <p className="text-center text-sm mt-2">
            If you already registered?{" "}
            <Link to="/login" className="underline">
              Click here to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
