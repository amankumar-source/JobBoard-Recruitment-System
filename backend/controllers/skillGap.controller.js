import { SkillGapAnalysis, LearningRoadmap } from "../models/skillGap.model.js";
import { aiService } from "../services/aiService.js";
import { PDFParse } from "pdf-parse";

export const analyzeSkillGap = async (req, res) => {
    try {
        const userId = req.id || null;
        const { targetRoleName, targetJobId } = req.body;
        const file = req.file;

        if (!file || !targetRoleName) {
            return res.status(400).json({
                message: "Missing required fields: file or targetRoleName",
                success: false,
            });
        }

        // 1. Create a pending record to track status
        const analysisData = {
            targetRoleName,
            status: "PROCESSING",
        };
        if (userId) analysisData.userId = userId;
        if (targetJobId) analysisData.targetJobId = targetJobId;

        let analysis = await SkillGapAnalysis.create(analysisData);

        // 2. Parse PDF to Text
        // Note: multer in memory stores file in req.file.buffer
        let resumeText = "";
        try {
            const parser = new PDFParse({ data: file.buffer });
            const pdfData = await parser.getText();
            await parser.destroy();
            resumeText = pdfData.text;
        } catch (parseError) {
            console.warn("PDF Parsing failed or file is DOC/DOCX. Falling back to raw text extraction.", parseError.message);
            resumeText = file.buffer.toString("utf8");
        }

        // 3. Generate Analysis via the abstracted AI Service
        let parsedData;
        try {
            parsedData = await aiService.generateSkillGapAnalysis(resumeText, targetRoleName);
        } catch (aiError) {
            console.error("AI Gen Error:", aiError);
            analysis.status = "FAILED";
            await analysis.save();
            return res.status(500).json({
                message: "Failed to generate AI analysis. Please check your AI provider configuration.",
                success: false
            });
        }

        // 4. Save Data back to DB
        analysis.extractedProfile = parsedData.extractedProfile;
        analysis.matchData = parsedData.matchData;
        analysis.status = "COMPLETED";
        await analysis.save();

        const roadmap = await LearningRoadmap.create({
            analysisId: analysis._id,
            estimatedCompletionWeeks: parsedData.roadmap.estimatedCompletionWeeks,
            milestones: parsedData.roadmap.milestones,
        });

        return res.status(200).json({
            message: "Analysis complete",
            success: true,
            analysis,
            roadmap
        });

    } catch (error) {
        console.error("Skill Gap Analysis Error:", error);
        return res.status(500).json({
            message: "Internal server error during analysis",
            success: false
        });
    }
};

export const getAnalysisResult = async (req, res) => {
    try {
        const { id } = req.params;
        const analysis = await SkillGapAnalysis.findById(id);

        if (!analysis) {
            return res.status(404).json({ message: "Analysis not found", success: false });
        }

        // Ensure users can only see their own analyses, skip check if it's a guest analysis
        if (analysis.userId && analysis.userId.toString() !== req.id) {
            return res.status(403).json({ message: "Unauthorized route access", success: false });
        }

        const roadmap = await LearningRoadmap.findOne({ analysisId: id });

        return res.status(200).json({
            success: true,
            analysis,
            roadmap
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getUserAnalyses = async (req, res) => {
    try {
        const userId = req.id;
        // Sort by newest first
        const analyses = await SkillGapAnalysis.find({ userId }).sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            success: true,
            analyses
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
