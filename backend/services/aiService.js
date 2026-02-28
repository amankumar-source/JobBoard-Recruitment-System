import Groq from "groq-sdk";

// Service Abstraction Layer
class AIService {
  constructor(provider = "groq") {
    this.provider = provider;
    this.client = null;
  }

  /**
   * Generates structured skill gap analysis using the configured LLM provider.
   */
  async generateSkillGapAnalysis(resumeText, targetRoleName) {
    const prompt = `
      You are an expert tech recruiter and AI career coach.
      I will provide a candidate's resume text and their target role.
      
      Resume text:
      "${resumeText.substring(0, 5000)}"
      
      Target Role: "${targetRoleName}"
      
      Task:
      1. Extract the candidate's skills, years of experience, and highest education level from the resume.
      2. Identify the required skills for the Target Role.
      3. Compare the candidate's skills against the required skills to calculate a match percentage (0-100).
      4. List the exact matches and missing skills.
      5. Provide a brief explanation of why this percentage was given.
      6. Draft a 4-milestone learning roadmap to help them acquire the missing skills.
      
      Output ONLY a valid JSON object with the exact following schema:
      {
        "extractedProfile": {
          "skills": ["string"],
          "experienceYears": number,
          "educationLevel": "string"
        },
        "matchData": {
          "percentage": number,
          "matchedSkills": ["string"],
          "missingSkills": ["string"],
          "aiExplanation": "string"
        },
        "roadmap": {
          "estimatedCompletionWeeks": number,
          "milestones": [
            {
              "stepOrder": number,
              "focusArea": "string",
              "description": "string",
              "recommendedResources": [
                { "title": "string", "url": "string", "type": "article/video/course" }
              ],
              "skillsAddressed": ["string"]
            }
          ]
        }
      }
    `;

    if (this.provider === "groq") {
      return this._generateWithGroq(prompt);
    } else {
      throw new Error(`Provider ${this.provider} is not supported yet.`);
    }
  }

  /**
   * Generates a conversational response using the configured LLM provider.
   * Maintains message history natively.
   */
  async generateChatReply(messages, systemPromptContext = "") {
    if (this.provider === "groq") {
      return this._generateChatWithGroq(messages, systemPromptContext);
    } else {
      throw new Error(`Provider ${this.provider} is not supported yet.`);
    }
  }

  async _generateWithGroq(prompt) {
    try {
      if (!this.client) {
        if (!process.env.GROQ_API_KEY) {
          throw new Error("GROQ_API_KEY is missing from environment variables.");
        }
        this.client = new Groq({
          apiKey: process.env.GROQ_API_KEY,
        });
      }

      const response = await this.client.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile", // Using Llama 3 70B for fast & accurate JSON reasoning on Groq
        temperature: 0.1, // Low temperature for deterministic output
        response_format: { type: "json_object" }, // Enforce JSON output natively
      });

      const responseText = response.choices[0]?.message?.content || "{}";

      return JSON.parse(responseText);
    } catch (error) {
      console.error("Groq AI Error:", error);
      throw new Error("Failed to generate AI analysis using Groq provider.");
    }
  }

  async _generateChatWithGroq(messages, systemPromptContext) {
    try {
      if (!this.client) {
        if (!process.env.GROQ_API_KEY) {
          throw new Error("GROQ_API_KEY is missing from environment variables.");
        }
        this.client = new Groq({
          apiKey: process.env.GROQ_API_KEY,
        });
      }

      // Build system message for guardrails and dynamic context
      const systemMessage = {
        role: "system",
        content: `You are Jobvista Pro AI, a strict, expert career copilot and recruitment assistant.
        Your sole purpose is to help users navigate their careers, build skills, parse resumes, and prepare for interviews.
        CRITICAL INSTRUCTION 1: Your answers MUST be EXTRAORDINARILY SHORT and concise. Use simple, direct language. Never write more than 2 or 3 short sentences.
        CRITICAL INSTRUCTION 2: If a user asks ANYTHING outside of careers, tech, recruiting, parsing resumes, or jobs (for example: coding scripts unrelated to an interview, asking for recipes, general knowledge, math, chatting about sports, politics, etc.), you MUST decline politely by saying EXACTLY: "I am an AI Career Assistant. I can only answer questions related to jobs and careers."

        ${systemPromptContext ? `\nUSER CONTEXT:\n${systemPromptContext}` : ""}
        `,
      };

      // We prefix the system message to the history
      const fullMessagesPayload = [systemMessage, ...messages];

      const response = await this.client.chat.completions.create({
        messages: fullMessagesPayload,
        model: "llama-3.3-70b-versatile",
        temperature: 0.5, // Slightly higher for natural conversation
        max_tokens: 1024,
      });

      return response.choices[0]?.message?.content || "I am unable to process that at this time.";
    } catch (error) {
      console.error("Groq AI Chat Error:", error);
      throw new Error("Failed to generate Chat response using Groq provider.");
    }
  }
}

// Export a singleton instance, defaulting to Groq
export const aiService = new AIService("groq");
