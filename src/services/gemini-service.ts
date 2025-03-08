import { GoogleGenerativeAI } from "@google/generative-ai";
import config from '../config/config';
import { ApiError } from '../common/errors';

// @ts-ignore
const genAI = new GoogleGenerativeAI(config.geminiApiKey);

export const generatePlaylistSuggestion = async (prompt: string): Promise<string> => {
    try {
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new ApiError(500, 'No suggestion generated');
        }

        return text.trim();
    } catch (error) {
        console.error('Error generating playlist suggestion:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, 'Failed to generate playlist suggestion');
    }
};