import React, { useMemo } from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

// Pure utility — defined outside component so it's not recreated on every render
const getDaysAgo = (mongodbTime) => {
  const createdAt = new Date(mongodbTime);
  const timeDifference = Date.now() - createdAt.getTime();
  return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
};

const Job = ({ job }) => {
  const navigate = useNavigate();

  // Only recompute when job.createdAt actually changes
  const daysAgo = useMemo(() => getDaysAgo(job?.createdAt), [job?.createdAt]);

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/job/${job?._id}`);
  };

  return (
    <div
      onClick={() => navigate(`/job/${job?._id}`)}
      className="
        bg-white
        rounded-2xl
        border border-gray-200
        p-6
        shadow-sm
        transition-all duration-300
        hover:shadow-md
        hover:bg-purple-50/40
        cursor-pointer
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
        </p>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-gray-500 hover:text-purple-600"
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>

      {/* Company */}
      <div className="flex items-center gap-4 mt-4">
        <div
          className="w-14 h-14 rounded-xl border bg-white flex items-center justify-center shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={job?.company?.logo} loading="lazy" decoding="async" />
          </Avatar>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <h2 className="font-semibold text-gray-900 capitalize">
            {job?.company?.name}
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            📍 India
          </p>
        </div>
      </div>

      {/* Job Title & Desc */}
      <div className="mt-4">
        <h1 className="text-xl font-bold text-gray-900">{job?.title}</h1>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {job?.description}
        </p>
      </div>

      {/* Tags / Badges */}
      <div
        className="flex flex-wrap gap-2 mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Badge className="bg-purple-100 text-purple-700 font-medium hover:bg-purple-100 hover:text-purple-700">
          {job?.position} Openings
        </Badge>

        <Badge className="bg-pink-100 text-pink-700 font-medium hover:bg-pink-100 hover:text-pink-700">
          {job?.jobType}
        </Badge>

        <Badge className="bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-100 hover:text-indigo-700">
          ₹ {job?.salary} LPA
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <Button
          onClick={handleViewDetails}
          variant="outline"
          className="w-full"
          style={{ backgroundColor: "#C4B5FD" }}
        >
          View Details
        </Button>

        <Button
          onClick={(e) => e.stopPropagation()}
          className="w-full text-white"
          style={{ backgroundColor: "#F472B6" }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default React.memo(Job);