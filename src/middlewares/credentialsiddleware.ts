// import { Response, NextFunction, Request } from "express";
// import { parseCredentialsCookie } from "../common/cookieParser";
// import { SPOTIFY_UNAUTHORIZED } from "../consts/general";

// export const spotifyServiceMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const spotifyAccessToken = req.cookies.spotify_access_token;
//   const spotifyRefreshToken = req.cookies.spotify_access_token;

//   if (!spotifyAccessToken && !spotifyRefreshToken) {
//     return res
//       .status(SPOTIFY_UNAUTHORIZED)
//       .json({ message: "Spotify tokens missing or expired" });
//   }

//   try {
//     const userCredentials = parseCredentialsCookie(credentialsCookie);

//     if (!userCredentials?.id) {
//       return res
//         .status(SPOTIFY_UNAUTHORIZED)
//         .json({ message: "Spotify credentials are invalid" });
//     }

//     req.userCredentials = userCredentials;

//     next();
//   } catch (error) {
//     return res.status(400).json({ message: "Invalid credentials format" });
//   }
// };
