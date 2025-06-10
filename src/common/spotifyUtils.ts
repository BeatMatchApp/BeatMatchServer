import { UserCredentials } from '../models';


export const getSpotifyHeaders = (userCredentials: UserCredentials) => {
  return {
    'Content-Type': 'application/json',
    'x-user-credentials': JSON.stringify(userCredentials)
  };
};
