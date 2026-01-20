import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption>A list of your recent applied user</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!applicants?.applications || applicants.applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                No applicants found
              </TableCell>
            </TableRow>
          ) : (
            applicants.applications.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item?.applicant?.fullname}</TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber}</TableCell>

               
                <TableCell>
  {item.applicant?.profile?.resume ? (
    <div className="flex flex-col gap-1">
      {/* View Resume */}
      <a
        className="text-blue-600 hover:underline"
        href={`https://docs.google.com/viewer?url=${encodeURIComponent(
          item.applicant.profile.resume
        )}&embedded=true`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Resume
      </a>

      <a
  className="text-green-600 hover:underline text-sm"
  href={item.applicant.profile.resume}
  target="_self"
>
  Download
</a>


    </div>
  ) : (
    <span>NA</span>
  )}
</TableCell>


                <TableCell>
                  {item?.applicant?.createdAt?.split("T")[0]}
                </TableCell>

                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100">
                      <MoreHorizontal />
                    </PopoverTrigger>

                    <PopoverContent className="w-32">
                      {shortlistingStatus.map((status, index) => (
                        <div
                          key={index}
                          onClick={() => statusHandler(status, item?._id)}
                          className="flex items-center cursor-pointer my-2"
                        >
                          <span>{status}</span>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
