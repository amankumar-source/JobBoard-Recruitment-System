import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogOut, User2, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const navLinks =
    user && user.role === "recruiter"
      ? [
          { to: "/admin/companies", label: "Companies" },
          { to: "/admin/jobs", label: "Jobs" },
        ]
      : [
          { to: "/", label: "Home" },
          { to: "/jobs", label: "Jobs" },
          { to: "/browse", label: "Browse" },
        ];

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo - Jobvista Pro */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">J</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Jobvista <span className="text-purple-700">Pro</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <ul className="flex font-semibold items-center gap-8 text-gray-700">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hover:text-purple-600 transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Buttons or Profile */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="font-semibold border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer ring-4 ring-purple-100 hover:ring-purple-200 transition-all">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt={user?.fullname}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                    {user?.fullname?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 mr-4 mt-2 border border-gray-200 shadow-2xl rounded-2xl">
                <div className="p-4">
                  <div className="flex gap-4 items-start">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.profile?.profilePhoto} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-bold">
                        {user?.fullname?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {user?.fullname}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {user?.profile?.bio || "No bio added yet"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {user.role === "student" && (
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors"
                      >
                        <User2 className="w-5 h-5" />
                        <span className="font-medium">View Profile</span>
                      </Link>
                    )}
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-lg font-medium text-gray-700 hover:text-purple-600"
              >
                {link.label}
              </Link>
            ))}

            {!user ? (
              <div className="pt-4 space-y-3">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="pt-4 space-y-4 border-t">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user?.profile?.profilePhoto} />
                    <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user?.fullname}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                {user.role === "student" && (
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User2 className="mr-2" /> View Profile
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={logoutHandler}
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                >
                  <LogOut className="mr-2" /> Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
