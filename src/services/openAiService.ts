import OpenAI from "openai";
import config from "../config/config";
import { ApiError } from "../common/errors";

const openai = new OpenAI({
  apiKey: config.openAiApiKey,
});

export const getAIResponse = async (
  prompt: string,
  systemAssistantMessage: string = "You are a helpful assistant that generates music playlist suggestions based on user preferences",
  options: {
    model?: string;
    maxTokens?: number;
  } = {}
): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemAssistantMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: options.maxTokens,
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new ApiError(500, "No AI response generated");
    }

    return text.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to generate AI response");
  }
};
