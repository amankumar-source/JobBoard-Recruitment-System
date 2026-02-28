import { AIChatSession } from "../models/aiChat.model.js";
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { SkillGapAnalysis } from "../models/skillGap.model.js";
import { aiService } from "../services/aiService.js";

/**
 * Gather dynamic context about the user for the AI Prompt.
 */
async function buildUserContext(userId) {
    if (!userId) {
        return "You are speaking to an anonymous guest user who is not logged in. Encourage them to create an account for personalized job matching and skill tracking.";
    }

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) return "You are speaking to an unknown user.";

        let context = `Name: ${user.fullname}\nRole: ${user.role}\n`;

        // Fetch latest Skill Gap Analysis
        const latestGap = await SkillGapAnalysis.findOne({ userId })
            .sort({ createdAt: -1 })
            .lean();

        if (latestGap) {
            context += `\n[Skill Gap Status for ${latestGap.targetRoleName}]
Match Percentage: ${latestGap.matchData?.percentage || 0}%
Matched Skills: ${latestGap.matchData?.matchedSkills?.join(", ") || "None"}
Missing Skills: ${latestGap.matchData?.missingSkills?.join(", ") || "None"}
`;
        }

        // Fetch recent applications
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate("job")
            .lean();

        if (applications.length > 0) {
            context += `\n[Recent Job Applications]
`;
            applications.forEach((app) => {
                if (app.job) {
                    context += `- Applied for ${app.job.title} (Status: ${app.status})\n`;
                }
            });
        }

        return context;
    } catch (error) {
        console.error("Context Builder Error:", error);
        return ""; // Soft fail on context retrieval
    }
}

export const sendMessage = async (req, res) => {
    try {
        const userId = req.id;
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required", success: false });
        }

        let session;
        if (sessionId) {
            session = await AIChatSession.findOne({ _id: sessionId, userId });
        }

        // If no session provided or found, create a new one
        if (!session) {
            session = new AIChatSession({
                userId,
                title: message.substring(0, 30) + "...",
                messages: [],
            });
        }

        // Append User Message
        session.messages.push({ role: "user", content: message });

        // Ensure we don't send infinite tokens to Groq -> take the last 15 messages for context
        const recentMessages = session.messages.slice(-15).map(m => ({
            role: m.role,
            content: m.content
        }));

        // Build Context
        const systemPromptContext = await buildUserContext(userId);

        // Call AI Service
        const aiReplyText = await aiService.generateChatReply(recentMessages, systemPromptContext);

        // Append AI Response
        session.messages.push({ role: "assistant", content: aiReplyText });

        // Save Session
        await session.save();

        return res.status(200).json({
            success: true,
            message: "Reply generated successfully",
            sessionId: session._id,
            reply: aiReplyText,
            chatHistory: session.messages,
        });
    } catch (error) {
        console.error("AI Chat Error:", error);
        return res.status(500).json({
            message: "Internal server error during chat generation.",
            success: false,
        });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const userId = req.id;
        // Get all sessions for user, sorted by newest
        const sessions = await AIChatSession.find({ userId })
            .sort({ updatedAt: -1 })
            .limit(20)
            .select("-messages") // don't load full messages in the list view
            .lean();

        return res.status(200).json({
            success: true,
            sessions,
        });
    } catch (error) {
        console.error("AI Chat History Error:", error);
        return res.status(500).json({
            message: "Internal server error fetching chat history.",
            success: false,
        });
    }
};

export const getSessionMessages = async (req, res) => {
    try {
        const userId = req.id;
        const { id } = req.params;

        const session = await AIChatSession.findOne({ _id: id, userId }).lean();
        if (!session) {
            return res.status(404).json({ message: "Session not found", success: false });
        }

        return res.status(200).json({
            success: true,
            session,
        });
    } catch (error) {
        console.error("AI Chat Session Error:", error);
        return res.status(500).json({
            message: "Internal server error fetching chat session.",
            success: false,
        });
    }
};
