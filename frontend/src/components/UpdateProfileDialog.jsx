
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: Array.isArray(user?.profile?.skills) ? user.profile.skills.join(", ") : "",
    file: null, // null = no new file selected
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file: file || null });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Only send non-empty values — all fields are optional
    if (input.fullname?.trim()) formData.append("fullname", input.fullname.trim());
    if (input.email?.trim()) formData.append("email", input.email.trim());
    if (input.phoneNumber?.toString().trim()) formData.append("phoneNumber", input.phoneNumber.toString().trim());
    if (input.bio?.trim()) formData.append("bio", input.bio.trim());
    if (input.skills?.trim()) formData.append("skills", input.skills.trim());

    // Only send file if user selected a new one
    if (input.file instanceof File) {
      formData.append("file", input.file);
    }

    // If formData is empty (no changes), just close
    if (formData.entries().next().done && !input.file) {
      toast.info("No changes detected");
      setOpen(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-sm sm:max-w-md w-full mx-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-5"
        aria-describedby="dialog-description"
      >
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Update Profile
          </DialogTitle>

          {/* Fixes Radix UI accessibility warning */}
          <p id="dialog-description" className="sr-only">
            Update your profile information including name, email, phone, bio, skills, and resume.
          </p>

        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-5 mt-6">
          <div>
            <Label className="text-gray-700 font-medium">Full Name</Label>
            <Input
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="John Doe"
              className="mt-2 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Email</Label>
            <Input
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="john@example.com"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Phone Number</Label>
            <Input
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="+91 9876543210"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Bio</Label>
            <Input
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              placeholder="Passionate developer..."
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Skills (comma separated)</Label>
            <Input
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              placeholder="React, Node.js, MongoDB"
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          {/* Beautiful Optional Resume Upload */}
          <div>

            <div className="mt-3">
              <Input
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="inline-block w-full text-center py-3 px-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold cursor-pointer hover:from-purple-700 hover:to-pink-700 transition shadow-md"
              >
                {input.file ? "Change Resume" : "Choose New Resume (PDF)"}
              </label>
              {input.file && (
                <p className="text-sm text-green-600 mt-2 text-center">
                  Selected: {input.file.name}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            {loading ? (
              <Button disabled className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Updating...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-lg transition hover:scale-105"
              >
                Update Profile
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;

















