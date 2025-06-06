import { Song } from '../models';
import { spotifyService } from '../services/spotifyService';

export const validateSongsList = async (
  songsList: Song[],
  accessToken: string
): Promise<Song[]> => {
  try {
    const response = await spotifyService.post(
      '/spotifyAPI/playlists/validatePlaylist',
      {
        songsList,
        accessToken,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error validating playlist', error);
    throw error;
  }
};
