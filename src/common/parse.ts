import { Song } from "../models";
import { aiParsingError } from "./errors";

const NUMERIC_REGEX: RegExp = /^\d+\.\s(.+)\s-\s(.+)$/;
const SONG_FORMAT_REGEX: RegExp = /^\d+\.\s.+\s-\s.+$/;

export const parseSongs = (text: string): Song[] => {
  try {
    const seperatedLines: string[] = text
      .split("\n")
      .filter((song: string) => SONG_FORMAT_REGEX.test(song.trim()));

    const songsList: Song[] = seperatedLines
      .map((line: string) => {
        const match = line.match(NUMERIC_REGEX);

        if (!match) {
          return null;
        }

        const [_, title, artist] = match;
        const song: Song = { name: title.trim(), artist: artist.trim() };

        return song;
      })
      .filter((song): song is Song => song !== null);

    return songsList;
  } catch (err) {
    throw new aiParsingError(500);
  }
};
