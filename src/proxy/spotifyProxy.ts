import { RequestHandler } from 'express';
import { BaseProxy } from './proxyBase';
import config from '../config/config';

export class SpotifyProxy extends BaseProxy {
  private getBaseUrl(): string {
    return `https://localhost:5000/spotifyAPI`;
  }

  public createLoginProxy(): RequestHandler[] {
    console.log('Creating Spotify login proxy');
    return this.createProxy({
      target: `${this.getBaseUrl()}/login`,
      pathRewriteBase: '^/spotify/login',
    });
  }

  public createUsersProxy(): RequestHandler[] {
    return this.createProxy({
      target: `${this.getBaseUrl()}/users`,
      pathRewriteBase: '^/spotify/users',
      applyAuth: true,
    });
  }

  public createPlaylistsProxy(): RequestHandler[] {
    return this.createProxy({
      target: `${this.getBaseUrl()}/playlists`,
      pathRewriteBase: '^/spotify/playlists',
      applyAuth: true,
    });
  }

  public createGeneralProxy(): RequestHandler[] {
    return this.createProxy({
      target: `${this.getBaseUrl()}/general`,
      pathRewriteBase: '^/spotify/general',
      applyAuth: true,
    });
  }
}

export const spotifyProxy = new SpotifyProxy();
