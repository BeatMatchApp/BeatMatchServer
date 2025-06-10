import { UserSong } from "./Song";

export interface PlaylistDetails {
  mood: string;
  event: string;
  songs: UserSong[];
  requestChangesText?: string;
}
