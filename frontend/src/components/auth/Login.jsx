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
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
              Welcome Back!
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Log in to continue your dream career journey
            </p>

            <form onSubmit={submitHandler} className="space-y-6">
              {/* Email */}
              <div>
                <Label className="text-gray-700">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="you@example.com"
                  className="mt-2 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Password */}
              <div>
                <Label className="text-gray-700">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="••••••••"
                  className="mt-2 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Role Selection */}
              <div>
                <Label className="text-gray-700">Login as</Label>
                <RadioGroup className="flex gap-8 mt-4">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="radio"
                      name="role"
                      value="student"
                      checked={input.role === "student"}
                      onChange={changeEventHandler}
                      className="cursor-pointer w-5 h-5 text-purple-600"
                    />
                    <Label className="cursor-pointer text-lg font-medium">
                      Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="radio"
                      name="role"
                      value="recruiter"
                      checked={input.role === "recruiter"}
                      onChange={changeEventHandler}
                      className="cursor-pointer w-5 h-5 text-purple-600"
                    />
                    <Label className="cursor-pointer text-lg font-medium">
                      Recruiter
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              {loading ? (
                <Button
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl"
                  disabled
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please
                  wait...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg transform transition hover:scale-105"
                >
                  Login →
                </Button>
              )}

              {/* Signup Link */}
              <p className="text-center text-gray-600 mt-6">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Create one now
                </Link>
              </p>
            </form>
          </div>

          {/* Bottom Stats (Optional - matches homepage) */}
          <div className="grid grid-cols-3 gap-4 mt-10 text-center">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                50K+
              </h3>
              <p className="text-sm text-gray-600">Jobs Listed</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                15K+
              </h3>
              <p className="text-sm text-gray-600">Companies</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                4.9
              </h3>
              <p className="text-sm text-gray-600">User Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
