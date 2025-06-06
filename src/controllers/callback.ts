import { Request, Response } from 'express';
import { createTokenCookies } from '../services/refreshToken';
import config from '../config/config';
import {
  getSpotifyTokensByCode,
  refreshSpotifyAccessToken,
} from '../services/spotifyService';

export const callbackHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const code = req.query?.code as string;

  try {
    const tokens = await getSpotifyTokensByCode(code);

    const refreshToken = tokens.refreshToken;
    const accessToken = tokens.accessToken;

    if (refreshToken && accessToken) {
      createTokenCookies(res, accessToken, refreshToken);
      res.redirect(`${config.beatMatchClientURL}/loginPage`);

      return;
    } else {
      res.status(400).json({ message: 'Missing tokens in request body.' });
      return;
    }
  } catch (error) {
    console.error('Error in callback handler:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while processing the callback.' });
  }
};
