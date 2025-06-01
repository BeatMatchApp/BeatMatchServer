import axios from "axios";
import config from "../config/config";

export const spotifyService = axios.create({
  baseURL: config.spotifyServiceUrl,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export const refreshSpotifyAccessToken = async (refreshToken: string) => {
  try {
    const response = await spotifyService.post("/spotifyAPI/refresh", {
      refreshToken,
    });

    if (response.status === 200) {
      return response.data?.accessToken;
    } else {
      throw new Error("Failed to refresh Spotify access token");
    }
  } catch (error) {
    console.error("Error refreshing Spotify access token:", error);
    throw error;
  }
};
