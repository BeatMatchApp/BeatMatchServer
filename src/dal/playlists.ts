import { dataAccess } from "./dataAccess";
import { Playlist } from "../models";

const PLAYLISTS_TABLE = "playlists";

const PlaylistsDAL = {
  async getPlaylistsByUser(userId: string) {
    return dataAccess(PLAYLISTS_TABLE)
        .where({userId: userId})
        .orderBy("lastUpdatedDate", "desc");
  },

  async getPlaylistById(id: string) {
    return dataAccess(PLAYLISTS_TABLE).where({id}).first();
  },

  async createPlaylist(playlist: Partial<Playlist>) {
    return await dataAccess(PLAYLISTS_TABLE)
      .insert({
        id: playlist.id,
        userId: playlist.userId,
        spotifyPlaylistId: playlist.spotifyPlaylistId,
        name: playlist.name,
        description: playlist.description,
        vibe: playlist.vibe,
        activity: playlist.activity
      })
      .returning("*")
      .then(rows => rows[0]);
  },

  async updatePlaylist(id: string, updateData: Partial<Playlist>) {
    return await dataAccess(PLAYLISTS_TABLE)
      .where({ id })
      .update({
        ...updateData,
        lastUpdatedDate: new Date()
      })
      .returning("*")
      .then(rows => rows[0]);
  },

  async deletePlaylist(id: string) {
    return await dataAccess(PLAYLISTS_TABLE).where({ id }).del();
  },
};

export { PlaylistsDAL };
