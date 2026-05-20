import React, { useMemo } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import Spinner from "./shared/Spinner";

const Jobs = () => {
  const { loading } = useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  const filterJobs = useMemo(() => {
    if (!searchedQuery) return allJobs;
    
    // Salary Filters logic
    if (searchedQuery === "0-40k") {
        return allJobs.filter(job => job.salary >= 0 && job.salary <= 0.4);
    } else if (searchedQuery === "42k-1 Lakh") {
        return allJobs.filter(job => job.salary > 0.4 && job.salary <= 1);
    } else if (searchedQuery === "1-5 Lakh") {
        return allJobs.filter(job => job.salary > 1 && job.salary <= 5);
    } else if (searchedQuery === "5-15 Lakh") {
        return allJobs.filter(job => job.salary > 5 && job.salary <= 15);
    } else if (searchedQuery === "15+ Lakh") {
        return allJobs.filter(job => job.salary > 15);
    }

    const q = searchedQuery.toLowerCase();
    return allJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
    );
  }, [allJobs, searchedQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-50 pb-10"
    >
      <Navbar />
      <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-1/4">
            <FilterCard />
          </div>

          {/* Jobs Section */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner />
              </div>
            ) : filterJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
                <span className="text-xl font-medium text-gray-600">No jobs found</span>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filterJobs.map((job, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      key={job?._id || index}
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Jobs;
