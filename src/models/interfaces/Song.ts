export interface Song {
  name: string;
  artist: string;
}

export interface UserSong extends Song {
  isReplace: boolean;
}

export interface SpotifySong extends Song {
  name: string;
  artist: string;
}
