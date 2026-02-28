import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "assistant", "system"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { _id: false, timestamps: true }
);

const aiChatSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Optional: Guests can also chat
        },
        title: {
            type: String,
            default: "New Chat",
        },
        messages: [messageSchema],
    },
    { timestamps: true }
);

export const AIChatSession = mongoose.model("AIChatSession", aiChatSessionSchema);
