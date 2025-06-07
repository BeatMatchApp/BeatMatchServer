export interface Song {
  name: string;
  artist: string;
  uri?: string;
}

export interface Playlist {
  id: string;
  userId: string;
  spotifyPlaylistId: string;
  name: string;
  description: string;
  creationDate: Date;
  lastUpdatedDate: Date;
  vibe: string;
  activity: string;
  songs?: Song[];
}
