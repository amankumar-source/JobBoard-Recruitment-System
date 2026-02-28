import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// ✅ Validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });
  const [errors, setErrors] = useState({});

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] || null });
  };

  const validateSignup = () => {
    const newErrors = {};

    if (!input.fullname.trim() || input.fullname.length < 3) {
      newErrors.fullname = "Full name must be at least 3 characters";
    }

    if (!emailRegex.test(input.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phoneRegex.test(input.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit Indian phone number";
    }

    if (!input.password || input.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!input.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateSignup()) return;

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
    >
      <Navbar />

      {/* Full height center - no scroll needed */}
      <div className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Clean white card - matches your screenshot */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-center text-gray-600 text-sm mb-8">
              One step away from your dream career
            </p>

            <form onSubmit={submitHandler} className="space-y-5">
              {/* Full Name */}
              <div>
                <Label className="text-gray-700 text-sm">Full Name</Label>
                <Input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  placeholder="John Doe"
                  className="h-11 rounded-xl text-sm border-gray-300 focus:border-purple-400"
                />
                {errors.fullname && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullname}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="text-gray-700 text-sm">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="you@example.com"
                  className="h-11 rounded-xl text-sm border-gray-300 focus:border-purple-400"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <Label className="text-gray-700 text-sm">Phone Number</Label>
                <Input
                  type="text"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  placeholder="+91 9876543210"
                  className="h-11 rounded-xl text-sm border-gray-300 focus:border-purple-400"
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label className="text-gray-700 text-sm">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="••••••••"
                  className="h-11 rounded-xl text-sm border-gray-300 focus:border-purple-400"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Role + File Upload - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role */}
                <div>
                  <Label className="text-gray-700 text-sm">Login as</Label>
                  <RadioGroup className="flex gap-6 mt-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="radio"
                        name="role"
                        value="student"
                        checked={input.role === "student"}
                        onChange={changeEventHandler}
                        className="w-4 h-4 text-purple-600"
                      />

                      <Label className="cursor-pointer text-base">
                        Student
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="radio"
                        name="role"
                        value="recruiter"
                        checked={input.role === "recruiter"}
                        onChange={changeEventHandler}
                        className="w-4 h-4 text-purple-600"
                      />
                      <Label className="cursor-pointer text-base">
                        Recruiter
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.role && (
                    <p className="text-xs text-red-500 mt-2">{errors.role}</p>
                  )}
                </div>

                {/* Beautiful File Upload Button */}
                <div>
                  <Label className="text-gray-700 text-sm">Profile Photo</Label>
                  <div className="mt-3">
                    <Input
                      accept="image/*"
                      type="file"
                      onChange={changeFileHandler}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block w-full cursor-pointer text-center py-2.5 px-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:from-purple-700 hover:to-pink-700 transition shadow-md"
                    >
                      {input.file ? "Change Photo" : "Choose File"}
                    </label>
                    {input.file && (
                      <p className="text-xs text-green-600 mt-2 text-center truncate">
                        {input.file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Signup Button */}
              {loading ? (
                <Button
                  disabled
                  className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Please wait...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium text-lg shadow-lg transition hover:scale-105"
                >
                  Signup →
                </Button>
              )}

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;
