import { dataAccess } from "./dataAccess";

const PLAYLISTS_TABLE = "playlists";

const PlaylistsDAL = {
  async getPlaylistsByUser(userId: string) {
    return await dataAccess(PLAYLISTS_TABLE)
      .where({ userId: userId })
      .orderBy("lastUpdatedTime", "desc");
  },

  async getPlaylistById(id: string) {
    return await dataAccess(PLAYLISTS_TABLE).where({ id }).first();
  },

  async createPlaylist(name: string, context: string) {
    return await dataAccess(PLAYLISTS_TABLE)
      .insert({ name, context })
      .returning("*");
  },

  async deletePlaylist(id: string) {
    return await dataAccess(PLAYLISTS_TABLE).where({ id }).del();
  },
};

export { PlaylistsDAL };
