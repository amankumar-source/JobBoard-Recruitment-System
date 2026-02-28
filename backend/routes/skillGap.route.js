import express from "express";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isOptionalAuthenticated from "../middlewares/isOptionalAuthenticated.js";
import {
    analyzeSkillGap,
    getAnalysisResult,
    getUserAnalyses,
} from "../controllers/skillGap.controller.js";

const router = express.Router();

router.post("/analyze", isOptionalAuthenticated, singleUpload, analyzeSkillGap);
router.get("/results/:id", isOptionalAuthenticated, getAnalysisResult);
router.get("/history", isAuthenticated, getUserAnalyses);

export default router;
