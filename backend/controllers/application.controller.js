import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";
import { sendEmailNotification } from "../utils/email.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({ message: "Job id is required.", success: false });
        }

        // Run duplicate check and job existence check in parallel for speed
        const [existingApplication, job] = await Promise.all([
            Application.findOne({ job: jobId, applicant: userId }).lean(),
            Job.findById(jobId),
        ]);

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false,
            });
        }

        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Error in applyJob:", error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                populate: { path: "company", select: "name logo" },
            })
            .lean();

        if (!application) {
            return res.status(404).json({ message: "No Applications", success: false });
        }

        return res.status(200).json({ application, success: true });
    } catch (error) {
        console.error("Error in getAppliedJobs:", error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

// Admin: see all applicants for a job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({
                path: "applications",
                options: { sort: { createdAt: -1 } },
                populate: { path: "applicant", select: "fullname email phoneNumber profile" },
            })
            .lean();

        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        // Fixed typo: was `succees` — now `success`
        return res.status(200).json({ job, success: true });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid job ID.", success: false });
    }
    console.error("Error in getApplicants:", error);
    return res.status(500).json({ message: "Server error.", success: false });
  }
};

export const updateStatus = async (req, res) => {
    try {
        const { status, interviewDate, interviewTime } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: "Status is required", success: false });
        }

        const application = await Application.findById(applicationId)
            .populate("applicant", "email fullname")
            .populate({
                path: "job",
                populate: { path: "company", select: "name" }
            });

        if (!application) {
            return res.status(404).json({ message: "Application not found.", success: false });
        }

        application.status = status.toLowerCase();
        if (status.toLowerCase() === 'interview') {
            if (interviewDate) application.interviewDate = interviewDate;
            if (interviewTime) application.interviewTime = interviewTime;
        }
        await application.save();

        const statusType = status.toLowerCase();
        let message = "";
        let subject = "";

        const candidateName = application.applicant?.fullname || "Candidate";
        const jobRole = application.job?.title || "Job";
        const companyName = application.job?.company?.name || "Company";

        if (statusType === "accepted") {
            message = `Congratulations! You have been shortlisted for the position of ${jobRole} at ${companyName}.`;
            subject = "Application Shortlisted - " + companyName;
        } else if (statusType === "rejected") {
            message = `Thank you for applying for ${jobRole} at ${companyName}. We regret to inform you that we are moving forward with other candidates.`;
            subject = "Application Update - " + companyName;
        } else if (statusType === "interview") {
            const dateStr = interviewDate ? new Date(interviewDate).toLocaleDateString() : "[Date]";
            const timeStr = interviewTime || "[Time]";
            message = `Your interview for ${jobRole} at ${companyName} has been scheduled on ${dateStr} at ${timeStr}.`;
            subject = "Interview Scheduled - " + companyName;
        }

        if (message) {
            // Create in-app notification
            await Notification.create({
                userId: application.applicant._id,
                message,
                type: statusType
            });

            // Send email asynchronously
            sendEmailNotification(
                application.applicant.email,
                subject,
                message,
                `<p>Dear ${candidateName},</p><p>${message}</p>`
            );
        }

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true,
        });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid application ID.", success: false });
    }
    console.error("Error in updateStatus:", error);
    return res.status(500).json({ message: "Server error.", success: false });
  }
};