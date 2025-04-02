import { Request, Response } from 'express';
import * as geminiService from '../services/gemini-service';
import { ApiError } from '../common/errors';

export const suggestPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { favoriteArtist, mood } = req.query;

        if (!favoriteArtist && !mood) {
            throw new ApiError(400, 'Please provide either a favorite song or mood.');
        }

        let prompt: string;
        if (favoriteArtist && mood){
            prompt = `Suggest a song based on the artist "${favoriteArtist}" and for the mood "${mood}". only artist - song name`;
        }
        else if (favoriteArtist) {
            prompt = `Suggest a song based on the artist "${favoriteArtist}". only artist - song name`;
        } else {
            prompt = `Suggest a song for the mood "${mood}". only artist - song name`;
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