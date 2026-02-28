import mongoose from "mongoose";

const SkillGapAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetJobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, // Optional soft link
    targetRoleName: { type: String, required: true },
    extractedProfile: {
      skills: [{ type: String }],
      experienceYears: { type: Number },
      educationLevel: { type: String },
    },
    matchData: {
      percentage: { type: Number },
      matchedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      aiExplanation: { type: String },
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const LearningRoadmapSchema = new mongoose.Schema(
  {
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillGapAnalysis",
      required: true,
    },
    estimatedCompletionWeeks: { type: Number },
    milestones: [
      {
        stepOrder: { type: Number },
        focusArea: { type: String },
        description: { type: String },
        recommendedResources: [
          {
            title: { type: String },
            url: { type: String },
            type: { type: String },
          },
        ],
        skillsAddressed: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

export const SkillGapAnalysis = mongoose.model("SkillGapAnalysis", SkillGapAnalysisSchema);
export const LearningRoadmap = mongoose.model("LearningRoadmap", LearningRoadmapSchema);
