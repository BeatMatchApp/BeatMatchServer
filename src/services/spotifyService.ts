import axios, { AxiosInstance } from 'axios';
import config from '../config/config';

let spotifyService: AxiosInstance | null = null;

function getSpotifyService(): AxiosInstance {
  if (!spotifyService) {
    if (!config.spotifyServiceUrl) {
      throw new Error('spotifyServiceUrl is not defined in config.');
    }

    spotifyService = axios.create({
      baseURL: config.spotifyServiceUrl,
      headers: {
        'Content-type': 'application/json',
      },
      withCredentials: true,
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
