import React, { useMemo } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { motion } from "framer-motion";

const Browse = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);

  // Memoised so filter only runs when jobs data or query actually changes
  const filteredJobs = useMemo(() => {
    if (!searchedQuery) return allJobs;
    const q = searchedQuery.toLowerCase();
    return allJobs.filter((job) =>
      job?.title?.toLowerCase().includes(q)
    );
  }, [allJobs, searchedQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4">
        <h1 className="font-bold text-xl my-10">
          All Jobs ({filteredJobs.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Browse;
