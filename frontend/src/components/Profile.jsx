import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, FileText } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { motion } from "framer-motion";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const profilePhoto =
    user?.profile?.profilePhoto ||
    "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50"
    >
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card - Same Style as Login/Signup */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-28 w-28 ring-4 ring-purple-200">
                <AvatarImage
                  src={profilePhoto}
                  alt={user?.fullname}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-3xl font-bold">
                  {user?.fullname?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {user?.fullname || "Your Name"}
                </h1>
                <p className="text-gray-600 mt-2 max-w-md">
                  {user?.profile?.bio ||
                    "Add a bio to let recruiters know about you"}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="rounded-full border-purple-300 hover:bg-purple-50 hover:border-purple-500 transition"
            >
              <Pen className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 text-gray-700">
              <div className="p-3 bg-purple-100 rounded-full">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <span className="font-medium">
                {user?.email || "email@example.com"}
              </span>
            </div>

            <div className="flex items-center gap-4 text-gray-700">
              <div className="p-3 bg-pink-100 rounded-full">
                <Contact className="h-5 w-5 text-pink-600" />
              </div>
              <span className="font-medium">
                {user?.phoneNumber || "+91 XXXXX XXXXX"}
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {user?.profile?.skills?.length > 0 ? (
                user.profile.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 italic">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Resume */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-600" />
              Resume
            </h2>
            {user?.profile?.resume ? (
              <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                  user.profile.resume,
                )}&embedded=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-purple-600 font-semibold hover:underline transition"
              >
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <span>
                  {user.profile.resumeOriginalName || "My_Resume.pdf"}
                </span>
              </a>
            ) : (
              <p className="text-gray-500 italic">No resume uploaded</p>
            )}
          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Applied Jobs
          </h2>
          <AppliedJobTable />
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </motion.div>
  );
};

export default Profile;
