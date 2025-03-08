import { Request, Response } from 'express';
import * as geminiService from '../services/gemini-service';
import { ApiError } from '../common/errors';

export const suggestPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { favoriteSong, mood } = req.query;

        if (!favoriteSong && !mood) {
            throw new ApiError(400, 'Please provide either a favorite song or mood.');
        }

        let prompt: string;
        if (favoriteSong) {
            prompt = `Suggest a playlist based on the song "${favoriteSong}".`;
        } else {
            prompt = `Suggest a playlist for the mood "${mood}".`;
        }

        const suggestion = await geminiService.generatePlaylistSuggestion(prompt);
        res.json({ suggestion });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error('Error suggesting playlist:', error);
            res.status(500).json({ error: 'An error occurred while suggesting a playlist.' });
        }
    }
};