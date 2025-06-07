import { Request, Response } from 'express';
import { PlaylistDetails, Song, UserSong, UserPreferences } from '../models';
import * as UserPreferencesBL from '../bls/userPreferences';
import * as openAiService from '../services/openAiService';
import { parseSongs } from '../common/parse';
import { createSongsList, strictOrders } from '../common/playlistUtils';

export const createPlaylist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { vibe, activity } = req.body;

    if (!vibe || !activity || !req.user) {
      res.status(400).json({ message: "missing user's required information" });
    } else {
      const preferencesDetails: UserPreferences | undefined =
        await UserPreferencesBL.getUserPreferences(
          req.user.id
        );

      if (preferencesDetails) {
        const aiMessage = `Please create a list of 25 songs (a playlist) that fit to my following critiria: 
        favorite artists: ${preferencesDetails.artists.join(', ')}
        favorite genres: ${preferencesDetails.genres.join(', ')}
        favorite song: ${preferencesDetails.song}
        plalist's vibe: ${vibe}
        playlist's occasion: ${activity}.
        ${strictOrders}.`;

        const generatedPlaylist: Song[] = await createSongsList(
          req.user,
          aiMessage
        );

        res.json({ playlist: generatedPlaylist });
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
      !req.user ||
      !playlistDetails.songs
    ) {
      res.status(400).json({ message: 'missing required information' });
    } else {
      const preferencesDetails: UserPreferences | undefined =
          await UserPreferencesBL.getUserPreferences(req.user.id);

      const allSongNames: string[] = playlistDetails.songs.map(
          (song: UserSong) => song.name
      );
      const songsToReplace: string[] = playlistDetails.songs
        .filter((song: UserSong) => song.isReplace)
        .map((song: UserSong) => song.name);

      if (preferencesDetails) {
        let aiMessage = `Please replace the 'songs to replace' with songs that fit to my following critiria: 
          favorite artists: ${preferencesDetails.artists.join(', ')}
          favorite genres: ${preferencesDetails.genres.join(', ')}
          plalist's vibe: ${playlistDetails.vibe}
          playlist's occasion: ${playlistDetails.activity}
          current songs list: ${allSongNames.join(', ')}
          songs to replace: ${songsToReplace.join(', ')}.`;

        if (playlistDetails.requestChangesText && playlistDetails.requestChangesText.trim()) {
          aiMessage += `\nAdditional requests: ${playlistDetails.requestChangesText.trim()}`;
        }

        aiMessage += `\n${strictOrders}`;
        console.log(aiMessage)
        const generatedPlaylist: Song[] = await createSongsList(
          req.user,
          aiMessage
        );

        res.json({ updatedPlaylist: generatedPlaylist });
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
