import {Playlist, Song, UserCredentials} from '../models';
import { getSpotifyService } from '../services/spotifyService';
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
  userCreds: UserCredentials,
  aiMessage: string
): Promise<SpotifySong[]> => {
  const generatedPlaylist = await openAiService.getAIResponse(aiMessage);
  const songsList: Song[] = parseSongs(generatedPlaylist);
  const uniqueSongsList: Song[] = removeDuplicatedSongs(songsList);

  const validatedSongs: SpotifySong[] = await validateSongsList(
    uniqueSongsList,
    userCreds
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

const validateSongsList = async (
  songsList: Song[],
  userCreds: UserCredentials
): Promise<Song[]> => {
  try {
    const response = await getSpotifyService().post(
      '/spotifyAPI/playlists/validatePlaylist',
        {
          songsList,
        },
        {headers:{
            'x-user-credentials': JSON.stringify(userCreds)
        }}
    );

    return response.data;
  } catch (error) {
    console.error('Error validating playlist', error);
    throw error;
  }
};


export const convertSpotifyResponseToPlaylist = (spotifyData, basePlaylist: Partial<Playlist>): Partial<Playlist> => {
  const updatedPlaylist = { ...basePlaylist };

  // Map tracks if they exist
  if (spotifyData && Array.isArray(spotifyData.tracks)) {
    updatedPlaylist.songs = spotifyData.tracks.map((track: Song) => ({
      name: track.name,
      artist: track.artist,
    }));
  }

  // Map other Spotify fields
  if (spotifyData) {
    updatedPlaylist.url = spotifyData.url || updatedPlaylist.url || '';
    updatedPlaylist.imageUrl = spotifyData.imageUrl || updatedPlaylist.imageUrl || '';
  }

  return updatedPlaylist;
};