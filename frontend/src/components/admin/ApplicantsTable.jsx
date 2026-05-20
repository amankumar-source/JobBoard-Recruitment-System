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
import { MoreHorizontal, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const shortlistingStatus = ["Accepted", "Rejected", "Interview"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const [interviewFormState, setInterviewFormState] = React.useState({
    applicationId: null,
    date: "",
    time: ""
  });

  const statusHandler = async (status, id, extraData = {}) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status, ...extraData },
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
      setInterviewFormState({ applicationId: null, date: "", time: "" });
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

                    <PopoverContent className="w-48">
                      {interviewFormState.applicationId === item?._id ? (
                        <div className="flex flex-col gap-3 p-1">
                          <p className="text-sm font-medium mb-1">Schedule Interview</p>
                          <input 
                            type="date" 
                            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={interviewFormState.date} 
                            onChange={e => setInterviewFormState({...interviewFormState, date: e.target.value})} 
                          />
                          <input 
                            type="time" 
                            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={interviewFormState.time} 
                            onChange={e => setInterviewFormState({...interviewFormState, time: e.target.value})} 
                          />
                          <div className="flex justify-between mt-2">
                            <button 
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors" 
                              onClick={() => setInterviewFormState({applicationId: null, date: "", time: ""})}
                            >
                              Cancel
                            </button>
                            <button 
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors disabled:opacity-50" 
                              disabled={!interviewFormState.date || !interviewFormState.time}
                              onClick={() => statusHandler('Interview', item?._id, { interviewDate: interviewFormState.date, interviewTime: interviewFormState.time })}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        shortlistingStatus.map((status, index) => {
                          const isCurrentStatus = item?.status?.toLowerCase() === status.toLowerCase();
                          return (
                            <div
                              key={index}
                              onClick={() => {
                                if (status === 'Interview') {
                                  setInterviewFormState({applicationId: item?._id, date: "", time: ""});
                                } else {
                                  statusHandler(status, item?._id);
                                }
                              }}
                              className={`flex items-center justify-between cursor-pointer my-1 p-2 rounded-md transition-colors ${isCurrentStatus ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-100 text-gray-700"}`}
                            >
                              <span>{status}</span>
                              {isCurrentStatus && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                          );
                        })
                      )}
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
