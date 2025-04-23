export interface Playlist {
  id: string;
  userId: string;
  name: string;
  context: string;
  songs: string[];
  creationTime: Date;
  lastUpdatedTime: Date;
}
