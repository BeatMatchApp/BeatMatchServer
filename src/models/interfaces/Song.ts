export interface Song {
  name: string;
  artist: string;
}

export interface UserSong extends Song {
  isReplace: boolean;
}
