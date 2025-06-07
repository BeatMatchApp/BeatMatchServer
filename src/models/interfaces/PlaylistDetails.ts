import { UserSong } from "./Song";

export interface PlaylistDetails {
  vibe: string;
  activity: string;
  songs: UserSong[];
  requestChangesText?: string;
}
