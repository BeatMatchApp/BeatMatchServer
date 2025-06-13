import {Playlist, Song, UserCredentials} from "../models";
import {PlaylistsDAL} from '../dal/playlists';
import {v4 as uuidv4} from 'uuid';
import {ApiError} from "../common/errors";
import {convertSpotifyResponseToPlaylist} from "../common/playlistUtils";
import {getSpotifyHeaders} from "../common/spotifyUtils";
import {getSpotifyService} from '../services/spotifyService';

export const createPlaylist = async (
  playlist: Partial<Playlist>,
  userCredentials: UserCredentials
): Promise<Playlist> => {
  try {
    const spotifyService = getSpotifyService();
    const spotifyResponse = await spotifyService.post(
      `/spotifyAPI/playlists/createPlaylist`,
      {
        playlistName: playlist.name,
        songs: playlist.songs
      },
      {
        headers: getSpotifyHeaders(userCredentials)
      }
    );

    if (!spotifyResponse.data?.id) {
      throw new Error('Failed to create playlist in Spotify');
    }

    const playlistWithId = {
      ...playlist,
      id: uuidv4(),
      spotifyPlaylistId: spotifyResponse.data.id,
      mood: playlist.mood,
      event: playlist.event,
    };

    const createdPlaylist = await PlaylistsDAL.createPlaylist(playlistWithId);
    const completePlaylist = convertSpotifyResponseToPlaylist(spotifyResponse.data, createdPlaylist);
    
    return completePlaylist as Playlist;
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
      const response = await  getSpotifyService().get(
          `/spotifyAPI/playlists/${playlist.spotifyPlaylistId}`,
          {
            headers: getSpotifyHeaders(userCredentials)
          }
      );
      return convertSpotifyResponseToPlaylist(response.data, playlist) as Playlist;

    } catch (spotifyError) {
      console.warn(`Playlist ${playlistId} exists in DB but not in Spotify. Deleting from DB.`);

      try {
        await PlaylistsDAL.deletePlaylist(playlistId);
        console.log(`Successfully deleted playlist ${playlistId} from database`);
      } catch (deleteError) {
        console.error(`Failed to delete playlist ${playlistId} from database:`, deleteError);
      }
      return null;
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
    const dbPlaylists = await PlaylistsDAL.getPlaylistsByUser(userId);
    if (dbPlaylists.length === 0) return [];
    let spotifyPlaylistsMap = new Map();

    try {
      const spotifyResponse = await getSpotifyService().get('/spotifyAPI/playlists/', {
        headers: getSpotifyHeaders(userCredentials)
      });
      if (spotifyResponse.data) {
        spotifyPlaylistsMap = new Map(
            spotifyResponse.data
                .filter(playlist => playlist && playlist.id)
                .map(playlist => [playlist.id, playlist])
        );
      }
    } catch (spotifyError) {
      console.error('Error fetching Spotify playlists:', spotifyError);
      return [];
    }

    const playlistDeletionPromises: Promise<any>[] = [];
    const validatedPlaylists = dbPlaylists.reduce((valid, dbPlaylist) => {
      if (!dbPlaylist.spotifyPlaylistId || !spotifyPlaylistsMap.has(dbPlaylist.spotifyPlaylistId)) {
        if (dbPlaylist.spotifyPlaylistId) {
          playlistDeletionPromises.push(
              PlaylistsDAL.deletePlaylist(dbPlaylist.id)
                  .catch(error => console.error(`Failed to delete playlist ${dbPlaylist.id}:`, error))
          );
        }
        return valid;
      }
      const spotifyPlaylist = spotifyPlaylistsMap.get(dbPlaylist.spotifyPlaylistId);
      valid.push(convertSpotifyResponseToPlaylist(spotifyPlaylist, dbPlaylist) as Playlist);
      return valid;
    }, [] as Playlist[]);

    if (playlistDeletionPromises.length > 0) {
      Promise.all(playlistDeletionPromises).then(() => {
        console.log(`Completed DB deletion of ${playlistDeletionPromises.length} invalid playlists`);
      });
    }

    return validatedPlaylists;
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

    const spotifyService = getSpotifyService();
    const response = await spotifyService.post(
      `/spotifyAPI/playlists/addSongs`,
      {
        playlistId: playlist.spotifyPlaylistId,
        songs: songs,
      },
      {
        headers: getSpotifyHeaders(userCredentials)
      }
    );
    
    const updatedPlaylist = convertSpotifyResponseToPlaylist(response.data, playlist);
    return updatedPlaylist as Playlist;
    
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    throw error;
  }
};

export const getPlaylistSongs = async (
  playlistId: string,
  userCredentials: UserCredentials
): Promise<Song[]> => {
  try {
    const playlist = await PlaylistsDAL.getPlaylistById(playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const spotifyService = getSpotifyService();
    const response = await spotifyService.get(
      `/spotifyAPI/playlists/${playlist.spotifyPlaylistId}`,
      {
        headers: getSpotifyHeaders(userCredentials)
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

export const updatePlaylist = async (
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

    const spotifyService = getSpotifyService();
    await spotifyService.post(
      `/spotifyAPI/playlists/updatePlaylist`,
      {
        playlistId: playlist.spotifyPlaylistId,
        songs: songs,
      },
      {
        headers: getSpotifyHeaders(userCredentials)
      }
    );

    const updatedPlaylist = await PlaylistsDAL.updatePlaylist(playlistId, {
      lastUpdatedDate: new Date()
    });
    
    return {
        ...updatedPlaylist,
        songs: songs
    }
  } catch (error) {
    console.error('Error updating playlist:', error);
    throw error;
  }
};
