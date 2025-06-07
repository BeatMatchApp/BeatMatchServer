import { Request, Response } from 'express';
import { createTokenCookies } from '../services/refreshToken';
import config from '../config/config';
import { getSpotifyTokensByCode } from '../services/spotifyService';

export const callbackHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const code = req.query?.code as string;

  try {
    const { refreshToken, accessToken } = await getSpotifyTokensByCode(code);

    createTokenCookies(res, accessToken, refreshToken);
    res.redirect(`${config.beatMatchClientURL}/loginPage`);

    return;
  } catch (error) {
    console.error('Error in callback handler:', error);

    res
      .status(500)
      .json({ message: 'An error occurred while processing the callback.' });
  }
};
