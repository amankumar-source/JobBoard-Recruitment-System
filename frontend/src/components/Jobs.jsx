import React, { useMemo } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  // Replace useState+useEffect with useMemo — derived state from Redux
  // This eliminates the extra render cycle caused by setState inside useEffect
  const filterJobs = useMemo(() => {
    if (!searchedQuery) return allJobs;
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Filter Sidebar */}
          <div className="w-full md:w-1/4">
            <FilterCard />
          </div>

          {/* Jobs Section */}
          {filterJobs.length === 0 ? (
            <span className="text-center w-full">Job not found</span>
          ) : (
            <div className="flex-1 md:h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    key={job?._id}
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Jobs;
