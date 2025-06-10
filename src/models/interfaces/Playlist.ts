export interface Song {
  name: string;
  artist: string;
  uri?: string;
}

export interface Playlist {
  // DB Fields
  id: string;
  userId: string;
  spotifyPlaylistId: string;
  name: string;
  description: string;
  creationDate: Date;
  lastUpdatedDate: Date;
  mood: string;
  event: string;

  // External Fields
  songs?: Song[];
  url?: string;
  imageUrl?: string;
}
