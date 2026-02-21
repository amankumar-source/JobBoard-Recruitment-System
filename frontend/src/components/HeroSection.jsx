
import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = useCallback(() => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }, [query, dispatch, navigate]);

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden flex items-center justify-center">
      {/* Floating Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 -left-20 w-80 h-80 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-10 w-96 h-96 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full opacity-20 blur-3xl animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-bl from-pink-400 to-orange-500 rounded-lg rotate-45 opacity-10 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center px-6 md:px-12 lg:px-8 max-w-7xl mx-auto py-20">
        <div className="flex flex-col gap-8">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-sm md:text-base shadow-2xl animate-bounce-subtle">
            <Sparkles className="w-5 h-5" />
            Welcome to JobvistaPro — India’s Fastest Growing Job Platform
            <Sparkles className="w-5 h-5" />
          </div>

          {/* Hero Title - Bold & Modern */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
              Dream Career
            </span>
            <br />
            Starts at <span className="text-purple-700">JobvistaPro</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
            Discover 50,000+ verified jobs from top startups & MNCs. One search.
            Infinite opportunities.
          </p>

          {/* Elegant Card-Style Search Bar */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-6 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <input
                    type="text"
                    placeholder="Search for jobs, companies, skills..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}

                    className="w-full pl-14 pr-6 py-5 text-lg font-medium text-gray-800 placeholder-gray-400 bg-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all"
                  />
                </div>

                <Button
                  onClick={searchJobHandler}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-12 py-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                >
                  Search Jobs
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </div>

              {/* Popular Searches */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
                <span className="text-gray-500">Popular:</span>
                {[
                  "Backend Developer",
                  "FullStack Developer",
                  "Frontend Developer",
                  "Data Scientist",
                  "React Developer",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      dispatch(setSearchedQuery(tag));
                      navigate("/browse");
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full font-medium transition-all hover:shadow-md"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Metrics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { num: "50K+", label: "Active Jobs" },
              { num: "15K+", label: "Companies Hiring" },
              { num: "4.9", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {stat.num}
                </h3>
                <p className="text-gray-600 font-semibold mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>



    </div>
  );
};

export default HeroSection;
