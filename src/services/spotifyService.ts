import axios, { AxiosInstance } from 'axios';
import config from '../config/config';
import https from 'https';
import { Song } from '../models';

let spotifyService: AxiosInstance | null = null;

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export function getSpotifyService(): AxiosInstance {
  if (!spotifyService) {
    if (!config.spotifyServiceUrl) {
      throw new Error('spotifyServiceUrl is not defined in config.');
    }

    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    spotifyService = axios.create({
      baseURL: config.spotifyServiceUrl,
      headers: {
        'Content-type': 'application/json',
      },
      withCredentials: true,
      httpsAgent,
    });
  }

  return spotifyService;
}

export const refreshSpotifyAccessToken = async (
  refreshToken: string
): Promise<string> => {
  try {
    const response = await getSpotifyService().post(
      '/spotifyAPI/resfreshToken',
      {
        refreshToken,
      }
    );

    if (response.status === 200) {
      return response.data?.accessToken;
    } else {
      throw new Error('Failed to refresh Spotify access token');
    }
  } catch (error) {
    console.error('Error refreshing Spotify access token:', error);
    throw error;
  }
};

export const getSpotifyTokensByCode = async (
  code: string
): Promise<AuthTokens> => {
  try {
    const response = await getSpotifyService().post('/spotifyAPI/getTokens', {
      code,
    });

    if (response.status === 200 && response.data) {
      const { accessToken, refreshToken } = response.data;

      if (!accessToken || !refreshToken) {
        throw new Error('Missing tokens in Spotify service response');
      }

      return { accessToken, refreshToken };
    } else {
      throw new Error('Failed to get Spotify token');
    }
  } catch (error) {
    console.error('Error fetching Spotify tokens:', error);
    throw error;
  }
};

export const validateSongsList = async (
  songsList: Song[],
  accessToken: string
): Promise<Song[]> => {
  try {
    const response = await getSpotifyService().post(
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
