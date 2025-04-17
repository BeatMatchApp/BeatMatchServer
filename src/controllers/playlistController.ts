import { Request, Response } from 'express';
import * as geminiService from '../services/gemini-service';
import { ApiError } from '../common/errors';

// TODO: if you have an idea to not write interface GeminiParams both on client and server tell me
export interface GeminiParams {
    favoriteArtist?: string;
    mood?: string;
  }

export const suggestPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        const { geminiParams } = req.query;

        if (!geminiParams ){
        throw new Error("error while saving")
        }

        const { favoriteArtist, mood } = geminiParams as GeminiParams;

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