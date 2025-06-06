import OpenAI from 'openai';
import config from '../config/config';
import { ApiError } from '../common/errors';

let openaiInstance: OpenAI | null = null;

const getOpenAI = (): OpenAI => {
  if (!openaiInstance) {
    const key = config.openAiApiKey;
    if (!key) {
      throw new Error('OPENAI_API_KEY is missing');
    }
    openaiInstance = new OpenAI({ apiKey: key });
  }
  return openaiInstance;
};

export const getAIResponse = async (
  prompt: string,
  systemAssistantMessage: string = 'You are a helpful assistant that generates music playlist suggestions based on user preferences',
  options: {
    model?: string;
    maxTokens?: number;
  } = {}
): Promise<string> => {
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: options.model || 'gpt-4o',
      messages: [
        { role: 'system', content: systemAssistantMessage },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: options.maxTokens,
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      throw new ApiError(500, 'No AI response generated');
    }

    return text.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to generate AI response');
  }
};
