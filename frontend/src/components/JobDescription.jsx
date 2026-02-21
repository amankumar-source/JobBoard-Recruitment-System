import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  // Memoise the initial applied check so it doesn't recompute on every render
  const isInitiallyApplied = useMemo(
    () =>
      singleJob?.applications?.some(
        (application) => application.applicant === user?._id
      ) || false,
    [singleJob?.applications, user?._id]
  );

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  // Stable handler reference — won't cause unnecessary child re-renders
  const applyJobHandler = useCallback(async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...singleJob.applications,
              { applicant: user?._id },
            ],
          })
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }, [jobId, singleJob, user?._id, dispatch]);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        void error;
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  // Memoised to avoid date math on every render
  const daysAgo = useMemo(() => {
    if (!singleJob?.createdAt) return null;
    return Math.floor(
      (new Date() - new Date(singleJob.createdAt)) / (1000 * 60 * 60 * 24)
    );
  }, [singleJob?.createdAt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Company + Job Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8">
          <div className="flex flex-col gap-6">

            {/* Company Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border bg-white flex items-center justify-center shadow-sm">
                {singleJob?.company?.logo ? (
                  <img
                    src={singleJob.company.logo}
                    alt={singleJob.company.name}
                    className="w-12 h-12 object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Logo</span>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {singleJob?.company?.name || "Company Name"}
                </h2>
                <p className="text-sm text-gray-500">
                  📍 {singleJob?.location || "Location"}{" "}
                  {daysAgo !== null && `• Posted ${daysAgo} days ago`}
                </p>
              </div>
            </div>

            {/* Job Title + Apply */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {singleJob?.title}
                </h1>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-purple-100 text-purple-700">
                    {singleJob?.position} Positions
                  </Badge>
                  <Badge className="bg-pink-100 text-pink-700">
                    {singleJob?.jobType}
                  </Badge>
                  <Badge className="bg-indigo-100 text-indigo-700">
                    ₹ {singleJob?.salary} LPA
                  </Badge>
                </div>
              </div>

              <Button
                onClick={isApplied ? undefined : applyJobHandler}
                disabled={isApplied}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl text-white ${isApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                  }`}
              >
                {isApplied ? "Already Applied" : "Apply Now"}
              </Button>
            </div>
          </div>
        </div>

        {/* Job Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Job Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Info label="Role" value={singleJob?.title} />
            <Info label="Location" value={singleJob?.location} />
            <Info label="Experience" value={`${singleJob?.experienceLevel} yrs`} />
            <Info label="Salary" value={`${singleJob?.salary} LPA`} />
            <Info
              label="Total Applicants"
              value={singleJob?.applications?.length}
            />
            <Info
              label="Posted On"
              value={singleJob?.createdAt?.split("T")[0]}
            />
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Job Description
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {singleJob?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Extracted as stable component — no unnecessary re-renders when parent updates
const Info = React.memo(({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 font-medium text-gray-900">{value}</p>
  </div>
));
Info.displayName = "Info";

export default JobDescription;