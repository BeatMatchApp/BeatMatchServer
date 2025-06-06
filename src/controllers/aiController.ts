import { Request, Response } from 'express';
import { PlaylistDetails, Song, UserSong, UserPreferences } from '../models';
import * as UserPreferencesBL from '../bls/userPreferences';
import * as openAiService from '../services/openAiService';
import { parseSongs } from '../common/parse';
import { validateSongsList } from '../common/playlistUtils';

export const createPlaylist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { vibe, activity } = req.body;

    if (!vibe || !activity) {
      res.status(400).json({ message: "missing user's required information" });
    } else {
      const preferencesDetails: UserPreferences | undefined =
        await UserPreferencesBL.getUserPreferences(
          '0cdf286f-04b9-508b-bcb1-17818a48cc43'
        );

      if (preferencesDetails) {
        const aiMessage = `תכין בבקשה רשימה של 25 שירים שמתאימים לקריטריונים הבאים: 
        אמנים אהובים: ${preferencesDetails.artists.join(', ')}
        ז'אנרים אהובים: ${preferencesDetails.genres.join(', ')}
        שיר אהוב: ${preferencesDetails.song}
        מצב רוח / תחושה של הפלייליסט: ${vibe}
        אירוע מיוחד שבשבילו הפלייליסט: ${activity}.
        הרשימה חייבת להופיע בסדר הקפדני הבא: 
        שם שיר - שם אמן
        הפורמט חייב להיות תקף לכל השירים, השיר והאמן חייבים להישאר בשפת המקור שלהם. 
        אם אי אפשר למצוא את השיר אצל הזמר בספוטיפיי אל תחזיר אותו`;
        const generatedPlaylist = await openAiService.getAIResponse(aiMessage);

        const songsList: Song[] = parseSongs(generatedPlaylist);

        console.log('before validate', req.cookies.spotify_access_token);
        const validatedSongs: Song[] = await validateSongsList(
          songsList,
          req.cookies.spotify_access_token
        );

        res.json({ playlist: validatedSongs });
      }
    }
  } catch (error) {
    console.error('Error generating playlist:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while generating playlist.' });
  }
};

export const refreshPlaylist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const playlistDetails: PlaylistDetails = req.body;

    if (
      !playlistDetails.vibe ||
      !playlistDetails.activity ||
      !playlistDetails.songs ||
      !req.user
    ) {
      res.status(400).json({ message: 'missing required information' });
    } else {
      const preferencesDetails: UserPreferences | undefined =
        await UserPreferencesBL.getUserPreferences(req.user.id);

      const allSongNames: string[] = playlistDetails.songs.map(
        (song: UserSong) => song.name
      );
      const songsToReplace: string[] = playlistDetails.songs
        .filter((song: UserSong) => !song.isReplace)
        .map((song: UserSong) => song.name);

      if (preferencesDetails) {
        const aiMessage = `Please replace the songs below with songs that fit to my following critiria: 
          favorite artists: ${preferencesDetails.artists.join(', ')}
          favorite genres: ${preferencesDetails.genres.join(', ')}
          plalist's vibe: ${playlistDetails.vibe}
          playlist's occasion: ${playlistDetails.activity}
          current songs list: ${allSongNames.join(', ')}
          songs to replace: ${songsToReplace.join(', ')}.
          the new songs list should appear as 'song name - artist' pairs`;

        const generatedPlaylist = await openAiService.getAIResponse(aiMessage);
        const songsList: Song[] = parseSongs(generatedPlaylist);

        res.json({ updatedPlaylist: songsList });
      }
    }
  } catch (error) {
    console.error('Error getting new songs:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while getting new songs.' });
  }
};

export const suggestSongByPlaylist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const playlistDetails: PlaylistDetails = req.body;

    if (
      !playlistDetails.vibe ||
      !playlistDetails.activity ||
      !playlistDetails.songs ||
      !req.user
    ) {
      res.status(400).json({ message: 'missing required information' });
    } else {
      const aiMessage = `Please suggest a song based on this songs list and playlist details:
         songs list: ${playlistDetails.songs.join(', ')}
         plalist's vibe: ${playlistDetails.vibe}
         playlist's occasion: ${playlistDetails.activity}.
         the song should appear as 'song name - artist'`;

      const suggestedSong = await openAiService.getAIResponse(aiMessage);
      const parsedSuggestedSong: Song = parseSongs(suggestedSong)[0];

      res.json({ song: parsedSuggestedSong });
    }
  } catch (error) {
    console.error('Error finding a new song:', error);
    res.status(500).json({ error: 'An error occurred while finding a song.' });
  }
};
