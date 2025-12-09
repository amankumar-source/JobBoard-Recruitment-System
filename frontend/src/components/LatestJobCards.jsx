
import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Briefcase, IndianRupee } from "lucide-react";

const LatestJobCards = ({ job }) => {
  // Make sure this receives { job }
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/job/${job._id}`)} // Uses correct job._id
      className="group relative p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden transition-all duration-400"
    >
      {/* Rest of your beautiful design */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 blur-xl scale-110"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg bg-white">
            {job?.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-black text-2xl">
                  {job?.company?.name?.[0]}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900 group-hover:text-purple-700 transition-colors">
              {job?.company?.name}
            </h1>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>India</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
          {job?.title}
        </h2>

        <p className="text-gray-600 line-clamp-2 mb-5">{job?.description}</p>

        <div className="flex flex-wrap gap-3">
          <Badge className="bg-purple-100 text-purple-700 font-bold">
            <Briefcase className="w-3.5 h-3.5 mr-1" />
            {job?.position} Openings
          </Badge>
          <Badge className="bg-pink-100 text-pink-700 font-bold">
            {job?.jobType}
          </Badge>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold">
            <IndianRupee className="w-4 h-4" />
            {job?.salary} LPA
          </Badge>
        </div>
      </div>
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 pointer-events-none"></div>
    </motion.div>
  );
};

export default LatestJobCards;

