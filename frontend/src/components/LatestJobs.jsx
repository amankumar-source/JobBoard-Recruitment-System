import React from "react";
import LatestJobCards from "./LatestJobCards";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            Latest & Top{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
              Job Openings
            </span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Fresh opportunities from top companies – updated daily
          </p>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allJobs.length <= 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-2xl text-gray-500 font-medium">
                No jobs available right now
              </p>
              <p className="text-gray-400 mt-2">
                Check back soon for exciting opportunities!
              </p>
            </div>
          ) : (
            allJobs?.slice(0, 6).map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <LatestJobCards job={job} />
              </motion.div>
            ))
          )}
        </div>

        {/* View All Button */}
        {allJobs.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <button
              onClick={() => (window.location.href = "/jobs")}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              View All Jobs →
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestJobs;
