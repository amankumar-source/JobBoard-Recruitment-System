import { Job } from "../models/job.model.js";

// Admin creates a job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", success: false });
  }
};

// Student: get all jobs with optional keyword search
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = keyword
      ? {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      }
      : {};

    // Select only required company fields to reduce payload size
    const jobs = await Job.find(query)
      .populate({
        path: "company",
        select: "name logo location",
      })
      .sort({ createdAt: -1 })
      .lean(); // Return plain JS objects — faster than Mongoose documents

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", success: false });
  }
};

// Student: get single job by ID
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate({ path: "applications" })
      .populate({ path: "company", select: "name logo location description website" })
      .lean();

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", success: false });
  }
};

// Admin: get all jobs created by this admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    // Fixed: removed invalid `createdAt` option from populate (it's not a valid option)
    const jobs = await Job.find({ created_by: adminId })
      .populate({ path: "company", select: "name logo" })
      .sort({ createdAt: -1 })
      .lean();

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error.", success: false });
  }
};
