import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

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
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: "Status is required", success: false });
        }

        // Use findByIdAndUpdate for a single DB round-trip instead of find + save
        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status: status.toLowerCase() },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found.", success: false });
        }

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", success: false });
    }
};