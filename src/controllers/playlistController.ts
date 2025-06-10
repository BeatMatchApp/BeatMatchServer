import { Request, Response } from 'express';
import { ApiError } from '../common/errors';
import * as playlistBl from '../bls/playlistBl';

export const createPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }

        const userId = req.user.id;
        const { name, description, songs, mood, event } = req.body;

        if (!name || !mood || !event) {
            throw new ApiError(400, 'Missing required fields');
        }

        const playlist = await playlistBl.createPlaylist(
            {
                userId,
                description: description || '',
                name,
                songs,
                mood,
                event
            },
            req.user
        );

        res.status(201).json(playlist);
    } catch (error) {
        console.error('Error creating playlist:', error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An error occurred while creating the playlist.' });
        }
    }
};

export const getPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }

        const { playlistId } = req.params;

        if (!playlistId) {
            throw new ApiError(400, 'Playlist ID is required');
        }

        const playlist = await playlistBl.getPlaylistById(playlistId, req.user);

        if (!playlist) {
            throw new ApiError(404, 'Playlist not found');
        }

        if (playlist.userId !== req.user.id) {
            throw new ApiError(403, 'You do not have permission to access this playlist');
        }

        res.json(playlist);
    } catch (error) {
        console.error('Error getting playlist:', error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An error occurred while retrieving the playlist.' });
        }
    }
};

export const getUserPlaylists = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }

        const userId = req.user.id;
        const playlists = await playlistBl.getPlaylistsByUserId(userId, req.user);

        res.json(playlists);
    } catch (error) {
        console.error('Error getting user playlists:', error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An error occurred while retrieving playlists.' });
        }
    }
};

export const addSongsToPlaylist = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }

        const { playlistId } = req.params;
        const { songs } = req.body;

        if (!playlistId || !songs) {
            throw new ApiError(400, 'Missing required fields');
        }

        const updatedPlaylist = await playlistBl.addSongToPlaylist(playlistId, songs, req.user);
        res.json(updatedPlaylist);
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An error occurred while adding the song to the playlist.' });
        }
    }
};

export const getPlaylistSongs = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new ApiError(401, 'Unauthorized');
        }

        const { playlistId } = req.params;

        if (!playlistId) {
            throw new ApiError(400, 'Playlist ID is required');
        }
        const playlist = await playlistBl.getPlaylistById(playlistId, req.user);

        if (!playlist) {
            throw new ApiError(404, 'Playlist not found');
        }
        if (playlist.userId !== req.user.id) {
            throw new ApiError(403, 'You do not have permission to access this playlist');
        }

        const songs = await playlistBl.getPlaylistSongs(playlistId, req.user);
        res.json(songs);
    } catch (error) {
        console.error('Error getting playlist songs:', error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An error occurred while retrieving the playlist songs.' });
        }
    }
};
