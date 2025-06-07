import {Playlist, Song, UserCredentials} from "../models";
import axios from 'axios';
import config from '../config/config';
import {PlaylistsDAL} from '../dal/playlists';
import {v4 as uuidv4} from 'uuid';
import {ApiError} from "../common/errors";

export const createPlaylist = async (
  playlist: Partial<Playlist>,
  userCredentials: UserCredentials
): Promise<Playlist> => {
  try {
    const spotifyResponse = await axios.post(
      `${config.spotifyServiceUrl}/spotifyAPI/playlists/createPlaylist`,
      {
        playlistName: playlist.name,
        songs: playlist.songs
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'x-user-credentials': JSON.stringify(userCredentials)
        }
      }
    );

    if (!spotifyResponse.data || !spotifyResponse.data.id) {
      throw new Error('Failed to create playlist in Spotify');
    }

    const playlistWithId = {
      ...playlist,
      id: uuidv4(),
      spotifyPlaylistId: spotifyResponse.data.id,
      vibe: playlist.vibe,
      activity: playlist.activity,
    };

    return await PlaylistsDAL.createPlaylist(playlistWithId);
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

export const getPlaylistById = async (
  playlistId: string,
  userCredentials: UserCredentials
): Promise<Playlist | null> => {
  try {
    const playlist = await PlaylistsDAL.getPlaylistById(playlistId);

    if (!playlist) {
      return null;
    }
    try {
      const response = await axios.get(
        `${config.spotifyServiceUrl}/spotifyAPI/playlists/${playlist.spotifyPlaylistId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'x-user-credentials': JSON.stringify(userCredentials)
          }
        }
      );

      if (response.data && Array.isArray(response.data.tracks)) {
        playlist.songs = response.data.tracks.map((track: any) => ({
          name: track.songName,
          artist: track.artist,
        }));
      } else {
        playlist.songs = [];
      }

      return playlist;
    } catch (spotifyError) {
      console.warn(`Playlist ${playlistId} exists in DB but not in Spotify`);
      playlist.songs = [];
      return playlist;
    }
  } catch (error) {
    console.error('Error getting playlist:', error);
    throw error;
  }
};

export const getPlaylistsByUserId = async (
  userId: string,
  userCredentials: UserCredentials
): Promise<Playlist[]> => {
  try {
    const playlists = await PlaylistsDAL.getPlaylistsByUser(userId);
    const validatedPlaylists = await Promise.all(
      playlists.map(async (playlist) => {
        try {
          if (!playlist.spotifyPlaylistId) {
            playlist.songs = [];
            return playlist;
          }

          const response = await axios.get(
            `${config.spotifyServiceUrl}/spotifyAPI/playlists/${playlist.spotifyPlaylistId}`,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'x-user-credentials': JSON.stringify(userCredentials)
              }
            }
          );

          if (response.data && Array.isArray(response.data.tracks)) {
            playlist.songs = response.data.tracks.map((track: any) => ({
              name: track.songName,
              artist: track.artist,
            }));
          } else {
            playlist.songs = [];
          }

          return playlist;
        } catch (error) {
          console.error(`Playlist ${playlist.id} no longer exists in Spotify:`, error);
          return null;
        }
      })
    );

    return validatedPlaylists.filter(playlist => playlist !== null) as Playlist[];
  } catch (error) {
    console.error('Error getting playlists for user:', error);
    throw error;
  }
};

export const addSongToPlaylist = async (
  playlistId: string,
  songs: Song[],
  userCredentials: UserCredentials
): Promise<Playlist> => {
  try {
    const playlist = await PlaylistsDAL.getPlaylistById(playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    if (playlist.userId !== userCredentials.id) {
      throw new ApiError(403, 'You do not have permission to modify this playlist');
    }

    await axios.post(
      `${config.spotifyServiceUrl}/spotifyAPI/playlists/addSongs`,
      {
        playlistId: playlist.spotifyPlaylistId,
        songs: songs,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'x-user-credentials': JSON.stringify(userCredentials)
        }
      }
    );

    return playlist;
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    throw error;
  }
};

export const getPlaylistSongs = async (
  playlistId: string,
  userCredentials: UserCredentials
): Promise<any[]> => {
  try {
    const playlist = await PlaylistsDAL.getPlaylistById(playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const response = await axios.get(
      `${config.spotifyServiceUrl}/spotifyAPI/playlists/${playlist.spotifyPlaylistId}`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'x-user-credentials': JSON.stringify(userCredentials)
        }
      }
    );

    if (!response.data || !Array.isArray(response.data.tracks)) {
      return [];
    }

    return response.data.tracks;
  } catch (error) {
    console.error('Error getting playlist songs:', error);
    throw error;
  }
};
