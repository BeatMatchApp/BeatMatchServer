import { Song } from '../models';
import { validateSongsList } from '../services/spotifyService';
import * as openAiService from '../services/openAiService';
import { parseSongs } from './parse';
import { SpotifySong } from '../models/interfaces/Song';

export const strictOrders: string = `prefer vibe over genres if they don't match.
 The new list must appear in this strict format: 
 song name - artist
 Always song name first, then artist.
 the artist name should always appear in English. the song name should appear in its original language.
 This format must be used for *all songs*. Do **not** add extra information.
 Do not repeat on songs.
 Only return real, existing songs that are available on Spotify`;

export const createSongsList = async (
  spotifyToken: string,
  aiMessage: string
): Promise<SpotifySong[]> => {
  const generatedPlaylist = await openAiService.getAIResponse(aiMessage);

  const songsList: Song[] = parseSongs(generatedPlaylist);
  const uniqueSongsList: Song[] = removeDuplicatedSongs(songsList);

  const validatedSongs: SpotifySong[] = await validateSongsList(
    uniqueSongsList,
    spotifyToken
  );

  return validatedSongs;
};

const removeDuplicatedSongs = (songsList: Song[]): Song[] => {
  const uniqueSongs = new Set<string>();
  const noDuplicatedSongsList: Song[] = songsList.filter((song: Song) => {
    const key: string = `${song.name.toLowerCase()}|${song.artist.toLowerCase()}`;
    if (uniqueSongs.has(key)) {
      return false;
    } else {
      uniqueSongs.add(key);
      return true;
    }
  });

  return noDuplicatedSongsList;
};
